import { type NextRequest, NextResponse } from "next/server"

// Mock storage - replace with actual database
const locales: Record<string, any[]> = {}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { language, data, originalJson } = await request.json()
    const projectId = params.id

    // Initialize project locales if not exists
    if (!locales[projectId]) {
      locales[projectId] = []
    }

    // Create new locale
    const newLocale = {
      id: Date.now().toString(),
      projectId,
      language,
      languageCode: language,
      data,
      originalJson,
      keyCount: Object.keys(data).length,
      lastUpdated: new Date().toISOString().split("T")[0],
      status: "complete",
      createdAt: new Date().toISOString(),
    }

    locales[projectId].push(newLocale)

    return NextResponse.json({ success: true, locale: newLocale })
  } catch (error) {
    console.error("Error creating locale:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    const projectLocales = locales[projectId] || []

    return NextResponse.json({ locales: projectLocales })
  } catch (error) {
    console.error("Error fetching locales:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
