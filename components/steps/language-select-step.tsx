"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Globe, ArrowLeft, Check } from "lucide-react"

interface LanguageSelectStepProps {
  onComplete: (language: string) => void
  onBack: () => void
}

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "no", name: "Norwegian" },
  { code: "fi", name: "Finnish" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
  { code: "th", name: "Thai" },
]

const languageSelectSchema = z.object({
  language: z.string().min(1, "Please select a language"),
})

type LanguageSelectFormValues = z.infer<typeof languageSelectSchema>

export function LanguageSelectStep({ onComplete, onBack }: LanguageSelectStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LanguageSelectFormValues>({
    resolver: zodResolver(languageSelectSchema),
    defaultValues: {
      language: "",
    },
  })

  const selectedLanguage = form.watch("language")

  const onSubmit = async (values: LanguageSelectFormValues) => {
    setIsSubmitting(true)
    await onComplete(values.language)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Select Target Language
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">Choose the language for this locale file</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {language.code}
                            </span>
                            {language.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedLanguage && (
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">
                    Ready to create {languages.find((l) => l.code === selectedLanguage)?.name} locale
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  File will be saved as: <code className="font-mono">{selectedLanguage}.json</code>
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? "Creating..." : "Create Locale"}
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
