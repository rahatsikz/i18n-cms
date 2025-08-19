"use client";

import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft, ArrowRight, Trash2, Plus } from "lucide-react";
import type { ParsedField } from "@/components/locale-stepper";

interface ValueEntryStepProps {
  fields: ParsedField[];
  fieldConfigs: Record<string, "input" | "textarea">;
  initialValues: Record<string, any>;
  onComplete: (values: Record<string, any>) => void;
  onBack: () => void;
}

export function ValueEntryStep({
  fields,
  fieldConfigs,
  initialValues,
  onComplete,
  onBack,
}: ValueEntryStepProps) {
  const [values, setValues] = useState<Record<string, any>>(
    initialValues || {}
  );

  // ----- helpers for arrays and nested array item editing -----
  const handleArrayAdd = (path: string, field: ParsedField) => {
    const currentArray = values[path] ?? field.value ?? [];
    let newItem: any = "";

    // If there's an arrayItemStructure, build a template (non-destructive, optional)
    if (field.arrayItemStructure && field.arrayItemStructure.length > 0) {
      newItem = {};
      field.arrayItemStructure.forEach((sf) => {
        newItem[sf.key] = sf.value ?? "";
      });
    } else if (Array.isArray(currentArray) && currentArray.length > 0) {
      // fallback: clone shape of first item
      const first = currentArray[0];
      if (typeof first === "object" && first !== null) {
        newItem = {};
        Object.keys(first).forEach((k) => {
          const v = first[k];
          newItem[k] = typeof v === "string" ? "" : Array.isArray(v) ? [] : {};
        });
      } else {
        newItem = "";
      }
    }

    setValues((prev) => ({
      ...prev,
      [path]: [...(Array.isArray(currentArray) ? currentArray : []), newItem],
    }));
  };

  const handleArrayRemove = (path: string, index: number) => {
    const currentArray = values[path] ?? [];
    const newArray = (Array.isArray(currentArray) ? currentArray : []).filter(
      (_: any, i: number) => i !== index
    );
    setValues((prev) => ({ ...prev, [path]: newArray }));
  };

  const handleArrayItemChange = (
    path: string,
    index: number,
    key: string | null,
    value: any
  ) => {
    const currentArray =
      values[path] ?? (Array.isArray(path) ? (path as any) : []);
    const newArray = [...(Array.isArray(currentArray) ? currentArray : [])];

    if (key === null) {
      newArray[index] = value;
    } else {
      if (typeof newArray[index] !== "object" || newArray[index] === null)
        newArray[index] = {};
      newArray[index][key] = value;
    }

    setValues((prev) => ({ ...prev, [path]: newArray }));
  };

  // simple setter for fields whose path is the full path (e.g. "call-to-action-input.placeholder")
  const handleValueChange = (path: string, value: any) => {
    setValues((prev) => ({ ...prev, [path]: value }));
  };

  // parse paths like "navoptions[0].title" => { base: "navoptions", idx: 0, key: "title" }
  const parseArrayItemPath = (path: string) => {
    const m = path.match(/^(.*)\[(\d+)\]\.(.+)$/);
    if (!m) return null;
    return { base: m[1], index: Number(m[2]), key: m[3] };
  };

  // get a value to show in an input; prefer stored state, fallback to passed val
  const getValueForPath = (path: string, val: any) => {
    const arrInfo = parseArrayItemPath(path);
    if (arrInfo) {
      const arr = values[arrInfo.base] ?? [];
      return Array.isArray(arr) &&
        arr[arrInfo.index] &&
        arr[arrInfo.index][arrInfo.key] !== undefined
        ? arr[arrInfo.index][arrInfo.key]
        : val ?? "";
    }
    // non-array path
    return values[path] !== undefined ? values[path] : val ?? "";
  };

  // ---------- main recursive renderer ----------
  const renderValue = (
    key: string,
    val: any,
    path: string,
    depth = 0
  ): JSX.Element[] => {
    const items: JSX.Element[] = [];

    // 1) Primitive (string / number)
    if (typeof val === "string" || typeof val === "number") {
      const inputType = fieldConfigs[path] || "input";
      const displayValue = getValueForPath(path, val);

      // decide whether onChange should update an array item or a plain path
      const arrInfo = parseArrayItemPath(path);
      const onChange = (v: string) => {
        if (arrInfo) {
          handleArrayItemChange(arrInfo.base, arrInfo.index, arrInfo.key, v);
        } else {
          handleValueChange(path, v);
        }
      };

      items.push(
        <div
          key={path}
          className={`${
            depth > 0 ? "ml-4 pl-4 py-2  border-l-2 border-gray-200" : ""
          } space-y-2`}
        >
          <Label htmlFor={path} className='font-medium'>
            {key}
          </Label>
          {inputType === "textarea" ? (
            <Textarea
              id={path}
              value={displayValue}
              onChange={(e) => onChange(e.target.value)}
              placeholder={key}
              className='min-h-[60px]'
            />
          ) : (
            <Input
              id={path}
              value={displayValue}
              onChange={(e) => onChange(e.target.value)}
              placeholder={key}
            />
          )}
        </div>
      );
    }

    // 2) Array (keep your existing array UI/logic intact)
    else if (Array.isArray(val)) {
      const arr = Array.isArray(values[path])
        ? values[path]
        : Array.isArray(val)
        ? val
        : [];
      items.push(
        <div
          key={path}
          className={`${
            depth > 0 ? "ml-4 pl-4 border-l-2 border-gray-200" : ""
          }`}
        >
          <div className='space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Label className='font-medium'>{key}</Label>
                <Badge variant='outline' className='text-xs'>
                  array[{arr.length}]
                </Badge>
              </div>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() =>
                  handleArrayAdd(path, {
                    key,
                    path,
                    type: "array",
                  } as ParsedField)
                }
                className='flex items-center gap-1 bg-transparent'
              >
                <Plus className='h-3 w-3' /> Add Item
              </Button>
            </div>
            <p className='text-xs text-gray-500 font-mono'>{path}</p>

            <div className='space-y-3'>
              {arr.map((item: any, index: number) => (
                <div
                  key={index}
                  className='p-3 bg-white dark:bg-gray-800 rounded border'
                >
                  {typeof item === "object" && !Array.isArray(item) ? (
                    // render each key in the object as separate fields (no direct object rendering)
                    Object.entries(item).map(([childKey, childVal]) =>
                      renderValue(
                        childKey,
                        childVal,
                        `${path}[${index}].${childKey}`,
                        depth + 1
                      )
                    )
                  ) : (
                    <Input
                      value={getValueForPath(`${path}[${index}]`, item)}
                      onChange={(e) =>
                        handleArrayItemChange(path, index, null, e.target.value)
                      }
                      placeholder={`Field ${index + 1}`}
                      className='text-sm'
                    />
                  )}

                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => handleArrayRemove(path, index)}
                    className='text-red-600 hover:text-red-700 bg-transparent mt-2'
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </div>
              ))}
              {arr.length === 0 && (
                <p className='text-sm text-gray-500 italic'>
                  No items yet. Click "Add Item" to start.
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 3) Plain object (NOT an array item) — THIS IS THE FIX for call-to-action-input
    else if (typeof val === "object" && val !== null) {
      // For plain objects that are passed as values (rare because you usually have children),
      // we render their entries recursively.
      items.push(
        <div
          key={path}
          className={`${
            depth > 0 ? "ml-4 pl-4 border-l-2 border-gray-200" : ""
          } space-y-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg`}
        >
          <Label className='font-medium'>{key}</Label>
          {Object.entries(val).map(([childKey, childVal]) =>
            renderValue(childKey, childVal, `${path}.${childKey}`, depth + 1)
          )}
        </div>
      );
    }

    return items;
  };

  // NEW renderField: only special-case `ParsedField` objects that have children (plain object fields).
  // Otherwise delegate to renderValue which keeps array logic unchanged.
  const renderField = (field: ParsedField, depth = 0): JSX.Element[] => {
    if (
      field.type === "object" &&
      Array.isArray(field.children) &&
      field.children.length > 0
    ) {
      return [
        <div
          key={field.path}
          className={`${
            depth > 0 ? "ml-4 pl-4 border-l-2 border-gray-200" : ""
          } p-3 bg-green-50 dark:bg-green-950 rounded-lg`}
        >
          <div className='flex items-center gap-2'>
            <Label className='font-medium'>{field.key}</Label>
            <Badge variant='outline' className='text-xs'>
              object
            </Badge>
          </div>

          {/* each child is a ParsedField and will be rendered (string or nested) */}
          {field.children.map((child) => renderField(child, depth + 1))}
        </div>,
      ];
    }

    // fallback: existing value-based renderer (handles strings & arrays)
    return renderValue(
      field.key,
      values[field.path] ?? field.value ?? "",
      field.path,
      depth
    );
  };

  // render everything (flatten arrays of JSX)
  const rendered = fields.flatMap((f) => renderField(f));

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Edit className='h-5 w-5' />
          Enter Translation Values
        </CardTitle>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Fill in the translation values for each field
        </p>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4 max-h-96 overflow-y-auto'>{rendered}</div>

        <div className='flex justify-between pt-4 border-t'>
          <Button
            variant='outline'
            onClick={onBack}
            className='flex items-center gap-2 bg-transparent'
          >
            <ArrowLeft className='h-4 w-4' /> Back
          </Button>
          <Button
            onClick={() => onComplete(values)}
            className='flex items-center gap-2'
          >
            Next <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
