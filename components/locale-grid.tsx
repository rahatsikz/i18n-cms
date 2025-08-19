"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Edit, Trash2, Calendar } from "lucide-react"
import Link from "next/link"

interface Locale {
  id: string
  language: string
  languageCode: string
  keyCount: number
  lastUpdated: string
  status: "complete" | "partial" | "empty"
}

interface LocaleGridProps {
  projectId: string
}

export function LocaleGrid({ projectId }: LocaleGridProps) {
  const [locales, setLocales] = useState<Locale[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data fetch - replace with actual API call
    setTimeout(() => {
      const mockLocales: Locale[] = [
        {
          id: "1",
          language: "English",
          languageCode: "en",
          keyCount: 156,
          lastUpdated: "2024-01-15",
          status: "complete",
        },
        {
          id: "2",
          language: "Spanish",
          languageCode: "es",
          keyCount: 142,
          lastUpdated: "2024-01-14",
          status: "partial",
        },
        {
          id: "3",
          language: "French",
          languageCode: "fr",
          keyCount: 98,
          lastUpdated: "2024-01-12",
          status: "partial",
        },
      ]
      setLocales(mockLocales)
      setIsLoading(false)
    }, 800)
  }, [projectId])

  const getStatusColor = (status: Locale["status"]) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "empty":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (locales.length === 0) {
    return (
      <div className="text-center py-12">
        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No locales yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Get started by adding your first locale file to this project.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locales.map((locale) => (
        <Card
          key={locale.id}
          className="hover:shadow-lg transition-shadow border-2 hover:border-blue-200 dark:hover:border-blue-800"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-lg">{locale.language}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{locale.languageCode}.json</p>
                </div>
              </div>
              <Badge className={getStatusColor(locale.status)} variant="secondary">
                {locale.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Keys:</span>
                <span className="font-medium">{locale.keyCount}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                Updated {locale.lastUpdated}
              </div>

              <div className="flex gap-2 pt-2">
                <Link href={`/project/${projectId}/locale/${locale.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full flex items-center gap-2 bg-transparent">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
