"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Folder, Globe, Calendar } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  description: string
  locales: string[]
  lastUpdated: string
}

export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - replace with actual API call
    setTimeout(() => {
      setProjects([
        {
          id: "1",
          name: "E-commerce Website",
          description: "Main website localization files",
          locales: ["en", "es", "fr"],
          lastUpdated: "2024-01-15",
        },
        {
          id: "2",
          name: "Mobile App",
          description: "React Native app translations",
          locales: ["en", "de"],
          lastUpdated: "2024-01-12",
        },
        {
          id: "3",
          name: "Admin Dashboard",
          description: "Internal admin panel locales",
          locales: ["en"],
          lastUpdated: "2024-01-10",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link key={project.id} href={`/project/${project.id}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <div className="flex gap-1">
                    {project.locales.map((locale) => (
                      <Badge key={locale} variant="secondary" className="text-xs">
                        {locale}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                Updated {project.lastUpdated}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
