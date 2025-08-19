"use client";

import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  ArrowLeft,
  ArrowRight,
  Type,
  AlignLeft,
  List,
  ChevronRight,
} from "lucide-react";
import type { ParsedField } from "@/components/locale-stepper";
import { ScrollArea } from "../ui/scroll-area";

interface FieldConfigStepProps {
  fields: ParsedField[];
  initialConfigs: Record<string, "input" | "textarea">;
  onComplete: (configs: Record<string, "input" | "textarea">) => void;
  onBack: () => void;
}

export function FieldConfigStep({
  fields,
  initialConfigs,
  onComplete,
  onBack,
}: FieldConfigStepProps) {
  const [configs, setConfigs] = useState(initialConfigs);

  const handleConfigChange = (path: string, type: "input" | "textarea") => {
    setConfigs((prev) => ({ ...prev, [path]: type }));
  };

  const renderField = (field: ParsedField, depth = 0): JSX.Element[] => {
    const items: JSX.Element[] = [];

    if (field.type === "string") {
      items.push(
        <div
          key={field.path}
          className={`border-l-2 border-gray-200 ${
            depth > 0 ? "lg:ml-4 ml-2 pl-2 lg:pl-4" : ""
          }`}
        >
          <div className='flex items-center max-lg:flex-col max-lg:items-start  justify-between px-2 py-4 lg:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-2'>
                <code className='text-sm font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded'>
                  {field.key}
                </code>
                <Badge variant='outline' className='text-xs'>
                  {field.type}
                </Badge>
              </div>
            </div>

            <div className='flex flex-wrap gap-4'>
              <div className='flex  items-center space-x-2'>
                <input
                  type='radio'
                  id={`${field.path}-input`}
                  name={field.path}
                  checked={configs[field.path] === "input"}
                  onChange={() => handleConfigChange(field.path, "input")}
                />
                <Label
                  htmlFor={`${field.path}-input`}
                  className='flex items-center gap-1 cursor-pointer'
                >
                  <Type className='h-3 w-3' />
                  Input
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <input
                  type='radio'
                  id={`${field.path}-textarea`}
                  name={field.path}
                  checked={configs[field.path] === "textarea"}
                  onChange={() => handleConfigChange(field.path, "textarea")}
                />
                <Label
                  htmlFor={`${field.path}-textarea`}
                  className='flex items-center gap-1 cursor-pointer'
                >
                  <AlignLeft className='h-3 w-3' />
                  Textarea
                </Label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (field.type === "array") {
      items.push(
        <div
          key={field.path}
          className={`border-l-2 border-blue-200 ${
            depth > 0 ? "ml-2 lg:ml-4 pl-2 lg:pl-4" : ""
          }`}
        >
          <div className='lg:p-4 py-4 px-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <div className='flex items-center gap-2 mb-2'>
              <code className='text-sm font-mono bg-blue-200 dark:bg-blue-700 px-2 py-1 rounded'>
                {field.key}
              </code>
              <Badge
                variant='outline'
                className='text-xs bg-blue-100 dark:bg-blue-800'
              >
                <List className='h-3 w-3 mr-1' />
                array[{Array.isArray(field.value) ? field.value.length : 0}]
              </Badge>
            </div>

            {field.arrayItemStructure &&
              field.arrayItemStructure.length > 0 && (
                <div className='mt-3 py-3 px-2 lg:p-3 bg-white dark:bg-gray-800 rounded border'>
                  <div className='flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                    <ChevronRight className='h-4 w-4' />
                    Array Item Structure:
                  </div>
                  <div className='space-y-2'>
                    {field.arrayItemStructure.map((f) =>
                      renderField(f, depth + 1)
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      );
    }

    if (field.children) {
      field.children.forEach((child) =>
        items.push(...renderField(child, depth + 1))
      );
    }

    return items;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Settings className='h-5 w-5' />
          Configure Field Types
        </CardTitle>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Review your JSON structure and configure input types for string fields
        </p>
      </CardHeader>
      <CardContent className='space-y-6 max-lg:p-0'>
        <ScrollArea className='h-[calc(100dvh-640px)] lg:h-[calc(100dvh-570px)]'>
          <div className='space-y-4'>{fields.flatMap(renderField)}</div>
        </ScrollArea>
        <div className='flex justify-between pt-4 border-t max-lg:px-3'>
          <Button
            variant='outline'
            onClick={onBack}
            className='flex items-center gap-2 bg-transparent'
          >
            <ArrowLeft className='h-4 w-4' />
            Back
          </Button>
          <Button
            onClick={() => onComplete(configs)}
            className='flex items-center gap-2'
          >
            Next
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
