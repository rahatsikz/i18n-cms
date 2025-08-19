import { type NextRequest, NextResponse } from "next/server"

// Mock storage - replace with actual database
const locales: Record<string, any[]> = {
  "1": [
    {
      id: "1",
      projectId: "1",
      language: "Spanish",
      languageCode: "es",
      data: {
        welcome: "Bienvenido a nuestra aplicación",
        "navigation.home": "Inicio",
        "navigation.about": "Acerca de",
        buttons: ["Guardar", "Cancelar", "Enviar"],
        "metadata.title": "Sitio web de startup de IA",
        "metadata.description": "creado por rahat",
      },
      originalJson: {
        welcome: "Welcome to our app",
        navigation: { home: "Home", about: "About" },
        buttons: ["Save", "Cancel", "Submit"],
        metadata: { title: "Ai Startup Website", description: "created by rahat" },
      },
      keyCount: 6,
      lastUpdated: "2024-01-15",
      status: "complete",
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { id: string; localeId: string } }) {
  try {
    const { id: projectId, localeId } = params
    const projectLocales = locales[projectId] || []
    const locale = projectLocales.find((l) => l.id === localeId)

    if (!locale) {
      return NextResponse.json({ error: "Locale not found" }, { status: 404 })
    }

    return NextResponse.json({ locale })
  } catch (error) {
    console.error("Error fetching locale:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string; localeId: string } }) {
  try {
    const { data } = await request.json()
    const { id: projectId, localeId } = params

    // Find and update locale
    const projectLocales = locales[projectId] || []
    const localeIndex = projectLocales.findIndex((l) => l.id === localeId)

    if (localeIndex === -1) {
      return NextResponse.json({ error: "Locale not found" }, { status: 404 })
    }

    // Update locale data
    projectLocales[localeIndex] = {
      ...projectLocales[localeIndex],
      data,
      keyCount: Object.keys(data).length,
      lastUpdated: new Date().toISOString().split("T")[0],
      status: "complete",
    }

    return NextResponse.json({
      success: true,
      locale: projectLocales[localeIndex],
    })
  } catch (error) {
    console.error("Error updating locale:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string; localeId: string } }) {
  try {
    const { id: projectId, localeId } = params

    // Find and remove locale
    const projectLocales = locales[projectId] || []
    const localeIndex = projectLocales.findIndex((l) => l.id === localeId)

    if (localeIndex === -1) {
      return NextResponse.json({ error: "Locale not found" }, { status: 404 })
    }

    projectLocales.splice(localeIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting locale:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
