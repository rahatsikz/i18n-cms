"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload, FileText } from "lucide-react";

export type ParsedField = {
  key: string;
  path: string;
  type: "string" | "array";
  value?: any;
  inputType?: "input" | "textarea";
  arrayItemStructure?: ParsedField[];
  children?: ParsedField[];
};

// ----------------- JSON UPLOAD STEP -----------------
const jsonUploadSchema = z.object({
  jsonText: z
    .string()
    .min(1, "JSON content is required")
    .refine((val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    }, "Invalid JSON format"),
});

type JsonUploadFormValues = z.infer<typeof jsonUploadSchema>;

interface JsonUploadStepProps {
  onComplete: (data: any) => void;
}

export function JsonUploadStep({ onComplete }: JsonUploadStepProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<JsonUploadFormValues>({
    resolver: zodResolver(jsonUploadSchema),
    defaultValues: { jsonText: "" },
  });

  const onSubmit = async (values: JsonUploadFormValues) => {
    setIsLoading(true);
    try {
      const parsed = JSON.parse(values.jsonText);
      onComplete(parsed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        form.setValue("jsonText", content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Upload className='h-5 w-5' />
          Upload JSON File
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='file-upload'
              className='block text-sm font-medium mb-2'
            >
              Upload from file
            </label>
            <input
              id='file-upload'
              type='file'
              accept='.json'
              onChange={handleFileUpload}
              className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
            />
          </div>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                Or paste JSON
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='jsonText'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paste JSON content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`{ "welcome": "Welcome", "buttons": ["Save","Cancel"] }`}
                        className='min-h-[200px] font-mono text-sm'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end'>
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? "Processing..." : "Parse JSON"}
                </Button>
              </div>
            </form>
          </Form>

          <div className='bg-blue-50 dark:bg-blue-950 p-4 rounded-lg flex items-start gap-3'>
            <FileText className='h-5 w-5 text-blue-600 mt-0.5' />
            <div>
              <h4 className='font-medium text-blue-900 dark:text-blue-100'>
                JSON Format Example
              </h4>
              <p className='text-sm text-blue-700 dark:text-blue-300 mt-1'>
                Nested objects, arrays, and string values are supported. Strings
                become editable fields.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
