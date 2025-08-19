"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, Settings, Edit, Globe } from "lucide-react";
import { JsonUploadStep } from "@/components/steps/json-upload-step";
import { FieldConfigStep } from "@/components/steps/field-config-step";
import { ValueEntryStep } from "@/components/steps/value-entry-step";
import { LanguageSelectStep } from "@/components/steps/language-select-step";
import { parseJsonToFields } from "@/lib/json-parser";

interface LocaleStepperProps {
  projectId: string;
}

export interface ParsedField {
  key: string;
  path: string;
  type: "string" | "array" | "object";
  value?: any;
  inputType?: "input" | "textarea";
  arrayItemStructure?: ParsedField[];
  children?: ParsedField[];
}

const steps = [
  {
    id: 1,
    title: "Upload JSON",
    description: "Upload your JSON file",
    icon: Upload,
  },
  {
    id: 2,
    title: "Configure Fields",
    description: "Set input types for each field",
    icon: Settings,
  },
  {
    id: 3,
    title: "Enter Values",
    description: "Fill in translation values",
    icon: Edit,
  },
  {
    id: 4,
    title: "Select Language",
    description: "Choose target language",
    icon: Globe,
  },
];

export function LocaleStepper({ projectId }: LocaleStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [jsonData, setJsonData] = useState<any>(null);
  const [parsedFields, setParsedFields] = useState<ParsedField[]>([]);
  const [fieldConfigs, setFieldConfigs] = useState<
    Record<string, "input" | "textarea">
  >({});
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleJsonUpload = (data: any) => {
    setJsonData(data);
    const fields = parseJsonToFields(data);
    setParsedFields(fields);

    // Initialize field configs with default input types
    const configs: Record<string, "input" | "textarea"> = {};
    const initializeConfigs = (fields: ParsedField[]) => {
      fields.forEach((field) => {
        if (field.type === "string") {
          configs[field.path] = "input";
        }
        if (field.children) {
          initializeConfigs(field.children);
        }
      });
    };
    initializeConfigs(fields);
    setFieldConfigs(configs);

    setCurrentStep(2);
  };

  const handleFieldConfigComplete = (
    configs: Record<string, "input" | "textarea">
  ) => {
    setFieldConfigs(configs);
    setCurrentStep(3);
  };

  const handleValuesComplete = (values: Record<string, any>) => {
    setFieldValues(values);
    setCurrentStep(4);
  };

  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);

    // Submit to server
    try {
      const response = await fetch(`/api/projects/${projectId}/locales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          data: fieldValues,
          originalJson: jsonData,
        }),
      });

      if (response.ok) {
        // Redirect back to project page
        window.location.href = `/project/${projectId}`;
      } else {
        console.error("Failed to save locale");
      }
    } catch (error) {
      console.error("Error saving locale:", error);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className='space-y-8'>
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between mb-4'>
            <CardTitle>Create New Locale</CardTitle>
            <Badge variant='outline'>
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className='w-full' />
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className='flex items-center'>
                  <div className='flex flex-col items-center'>
                    <div
                      className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 
                      ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isCurrent
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <CheckCircle className='h-5 w-5' />
                      ) : (
                        <Icon className='h-5 w-5' />
                      )}
                    </div>
                    <div className='mt-2 text-center'>
                      <p
                        className={`text-sm font-medium ${
                          isCurrent ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                      flex-1 h-0.5 mx-4 
                      ${isCompleted ? "bg-green-500" : "bg-gray-200"}
                    `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className='min-h-[400px]'>
        {currentStep === 1 && <JsonUploadStep onComplete={handleJsonUpload} />}

        {currentStep === 2 && (
          <FieldConfigStep
            fields={parsedFields}
            initialConfigs={fieldConfigs}
            onComplete={handleFieldConfigComplete}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <ValueEntryStep
            fields={parsedFields}
            fieldConfigs={fieldConfigs}
            initialValues={fieldValues}
            onComplete={handleValuesComplete}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <LanguageSelectStep
            onComplete={handleLanguageSelect}
            onBack={() => setCurrentStep(3)}
          />
        )}
      </div>
    </div>
  );
}
