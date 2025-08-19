"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface AddLocaleButtonProps {
  projectId: string
}

export function AddLocaleButton({ projectId }: AddLocaleButtonProps) {
  return (
    <Link href={`/project/${projectId}/locale/new`}>
      <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
        <Plus className="h-4 w-4" />
        Add Locale
      </Button>
    </Link>
  )
}
