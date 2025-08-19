import { type NextRequest, NextResponse } from "next/server"

// Mock database - replace with actual database
const projects = [
  {
    id: "1",
    name: "E-commerce Website",
    description: "Main website localization files",
    locales: ["en", "es", "fr"],
    lastUpdated: "2024-01-15",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Mobile App",
    description: "React Native app translations",
    locales: ["en", "de"],
    lastUpdated: "2024-01-12",
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    name: "Admin Dashboard",
    description: "Internal admin panel locales",
    locales: ["en"],
    lastUpdated: "2024-01-10",
    createdAt: "2024-01-03",
  },
]

export async function GET() {
  return NextResponse.json({ projects })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    // Check if project name already exists
    const existingProject = projects.find((project) => project.name.toLowerCase() === name.toLowerCase())

    if (existingProject) {
      return NextResponse.json({ error: "Project name already exists" }, { status: 409 })
    }

    const newProject = {
      id: (projects.length + 1).toString(),
      name: name.trim(),
      description: description?.trim() || "",
      locales: [],
      lastUpdated: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
    }

    projects.push(newProject)

    return NextResponse.json({
      message: "Project created successfully",
      project: newProject,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
