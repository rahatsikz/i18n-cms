"use client";

import { useState, useEffect, JSX } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, Save, Loader2, Trash2, Plus, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";

interface LocaleData {
  id: string;
  language: string;
  languageCode: string;
  data: Record<string, any>;
  keyCount: number;
  lastUpdated: string;
  status: "complete" | "partial" | "empty";
}

interface LocaleEditorProps {
  projectId: string;
  localeId: string;
}

// --- Utility to set deep values by path ---
function setDeepValue(obj: any, path: string, value: any) {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  const last = keys.pop()!;
  let curr = obj;
  for (const k of keys) {
    if (!(k in curr)) curr[k] = {};
    curr = curr[k];
  }
  curr[last] = value;
}

export function LocaleEditor({ projectId, localeId }: LocaleEditorProps) {
  const [locale, setLocale] = useState<LocaleData | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const isLargerDevice = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    fetchLocale();
  }, [projectId, localeId]);

  const fetchLocale = async () => {
    try {
      // mock data fetch
      setTimeout(() => {
        const mockLocale: LocaleData = {
          id: localeId,
          language: "Spanish",
          languageCode: "es",
          data: {
            metadata: {
              title: "Ai Startup Website",
              description: "created by rahat",
            },
            navoptions: [
              {
                trigger: "Features",
                children: [
                  {
                    title: "Analytics",
                    description: "Powerful real-time metrics and insights.",
                    href: "",
                  },
                  {
                    title: "Automation",
                    description: "Automate repetitive workflows easily.",
                    href: "",
                  },
                  {
                    title: "Collaboration",
                    description:
                      "Multi-user team features to improve teamwork.",
                    href: "",
                  },
                  {
                    title: "Security",
                    description:
                      "Enterprise-grade security and privacy features.",
                    href: "",
                  },
                ],
              },
              {
                trigger: "Developers",
                children: [
                  {
                    title: "API Docs",
                    description: "Complete API documentation and examples.",
                    href: "",
                  },
                  {
                    title: "SDKs",
                    description: "Download client SDKs for popular languages.",
                    href: "",
                  },
                  {
                    title: "Community",
                    description: "Join the developer community forums.",
                    href: "",
                  },
                  {
                    title: "Changelog",
                    description: "See the latest updates and version history.",
                    href: "",
                  },
                ],
              },
              {
                trigger: "Company",
                children: [
                  {
                    title: "About Us",
                    description: "Our story, team, and values.",
                    href: "",
                  },
                  {
                    title: "Careers",
                    description: "Join us — explore our job openings.",
                    href: "",
                  },
                  {
                    title: "Contact",
                    description: "Get in touch with us.",
                    href: "",
                  },
                ],
              },
              {
                trigger: "Blog",
                href: "",
              },
              {
                trigger: "Changelog",
                href: "",
              },
            ],
            navActionText: "Join waitlist",
            "hero-section": {
              bannerBadgeText: "New",
              bannerTitle: " Latest integration just arrived",
              title1: "Boost your",
              title2: "rankings with AI",
              description:
                "Elevate your site's visibility effortlessly with AI, where smart technology meets user-friendly SEO tools.",
            },
            "company-section-header":
              "Trusted by the world's most innovative teams",
            "feature-section-header":
              " Harness the power of AI, making search engine optimization intuitive and effective for all skill levels",
            "feature-row-texts": [
              {
                title: "SEO goal setting",
                description:
                  "Helps you set and achieve SEO goals with our most dedicated guided assistance",
              },
              {
                title: "User friendly dashboard",
                description:
                  "Perform complex SEO audits and optimizations with a single click",
              },
              {
                title: "Visual reports with charts",
                description:
                  "Visual insights into your site's performance with various charts and graphs",
              },
              {
                title: "Smart Keyword Generator",
                description:
                  "Automatic suggestions and the best keywords to target for better results",
              },
            ],
            "seo-section-header": "Elevate your SEO efforts with us",
            "seo-row-texts": [
              {
                title: "User-friendly dashboard",
                description:
                  "Perform complex SEO audits and optimizations with a single click.",
              },
              {
                title: "Visual reports",
                description:
                  "Visual insights into your site's performance and health.",
              },
              {
                title: "Smart Keyword Generator",
                description:
                  "Automatic suggestions and the best keywords to target.",
              },
              {
                title: "Content evaluation",
                description:
                  "Simple corrections for immediate improvements in content.",
              },
              {
                title: "SEO goal setting",
                description:
                  "Helps you set and achieve SEO goals with guided assistance.",
              },
              {
                title: "Automated alerts",
                description:
                  "Automatic notifications about your SEO health, including quick fixes.",
              },
              {
                title: "Link Optimization Wizard",
                description:
                  "Guides you through the process of creating and managing links.",
              },
              {
                title: "One-click optimization",
                description:
                  "Perform complex SEO audits and optimizations with a single click.",
              },
              {
                title: "Competitor reports",
                description:
                  "Provides insights into competitors' keyword strategies and ranking.",
              },
            ],
            "client-reviews-header": "Our clients",
            "client-reviews-subheader":
              "Hear firsthand how our solutions have boosted online success for users like you.",
            "client-reviews": [
              {
                name: "Talia Taylor",
                role: "Digital Marketing Director @ Quantum",
                review:
                  "This product has completely transformed how I manage my projects and deadlines",
              },
            ],
            pricings: [
              {
                name: "Starter",
                price: "$29/mo",
                features: [
                  "Keyword optimization",
                  "Automated meta tags",
                  "SEO monitoring",
                  "Monthly reports",
                ],
                highlighted: "false",
              },
              {
                name: "Pro",
                price: "$79/mo",
                features: [
                  "Keyword optimization",
                  "Automated meta tags",
                  "SEO monitoring",
                  "Monthly reports",
                  "Content suggestions",
                  "Link optimization",
                ],
                highlighted: "true",
              },
              {
                name: "Business",
                price: "$149/mo",
                features: [
                  "Keyword optimization",
                  "Automated meta tags",
                  "SEO monitoring",
                  "Monthly reports",
                  "Content suggestions",
                  "Link optimization",
                  "Multi-user access",
                  "API integration",
                ],
                highlighted: "false",
              },
            ],
            "pricing-header": "Pricing",
            "pricing-subheader":
              "Choose the right plan to meet your SEO needs and start optimizing today.",
            "pricing-action": "Join waitlist",
            "call-to-action-header": "AI-driven SEO optimization for everyone",
            "call-to-action-input": {
              placeholder: "Your email",
              buttonText: "Join waitlist",
            },
            "call-to-action-footer":
              "No credit card required · 7-days free trial",
            "footer-options": [
              {
                title: "Product",
                "sub-pages": [
                  {
                    title: "Features",
                    href: "#",
                  },
                  {
                    title: "Integrations",
                    href: "#",
                  },
                  {
                    title: "Updates",
                    href: "#",
                  },
                  {
                    title: "FAQ",
                    href: "#",
                  },
                  {
                    title: "Pricing",
                    href: "#",
                  },
                ],
              },
              {
                title: "Company",
                "sub-pages": [
                  {
                    title: "About",
                    href: "#",
                  },
                  {
                    title: "Blog",
                    href: "#",
                  },
                  {
                    title: "Careers",
                    href: "#",
                  },
                  {
                    title: "Manifesto",
                    href: "#",
                  },
                  {
                    title: "Press",
                    href: "#",
                  },
                  {
                    title: "Contact",
                    href: "#",
                  },
                ],
              },
              {
                title: "Resources",
                "short-title": "Tools",
                "sub-pages": [
                  {
                    title: "Examples",
                    "short-title": "Leads",
                    href: "#",
                  },
                  {
                    title: "Guides",
                    href: "#",
                  },
                  {
                    title: "Docs",
                    href: "#",
                  },
                  {
                    title: "Press",
                    href: "#",
                  },
                ],
              },
              {
                title: "Legal",
                "sub-pages": [
                  {
                    title: "Privacy",
                    href: "#",
                  },
                  {
                    title: "Terms",
                    href: "#",
                  },
                  {
                    title: "Security",
                    href: "#",
                  },
                ],
              },
            ],
          },
          keyCount: 6,
          lastUpdated: "2024-01-15",
          status: "complete",
        };

        setLocale(mockLocale);
        setValues(mockLocale.data);
        setIsLoading(false);
      }, 800);
    } catch (err) {
      setError("Failed to load locale data");
      setIsLoading(false);
    }
  };

  const handleValueChange = (path: string, value: any) => {
    setValues((prev) => {
      const copy = structuredClone(prev);
      setDeepValue(copy, path, value);
      return copy;
    });
  };

  const determineInputType = (value: any): "input" | "textarea" => {
    if (typeof value === "string") {
      return value.length > 50 ? "textarea" : "input";
    }
    return "input";
  };

  const getLabel = (fieldKey: string) => {
    // if inside array of objects, just show the last key name
    const segments = fieldKey.split(".");
    const lastSegment = segments[segments.length - 1];
    return lastSegment.replace(/\[\d+\]/g, ""); // remove [0], [1] etc.
  };

  // --- Recursive field renderer ---
  const renderField = (
    key: string,
    value: any,
    parentKey = ""
  ): JSX.Element => {
    const fieldKey = parentKey ? `${parentKey}.${key}` : key;

    // Array of objects
    if (
      Array.isArray(value) &&
      value.every((v) => typeof v === "object" && v !== null)
    ) {
      return (
        <div
          key={fieldKey}
          className='space-y-4 p-4 bg-purple-50 dark:bg-purple-950'
        >
          <div className='flex items-center justify-between'>
            <Label className='font-medium'>{getLabel(fieldKey)}</Label>
            <Badge variant='outline' className='text-xs'>
              array of objects
            </Badge>
            <Button
              type='button'
              size='sm'
              onClick={() => handleValueChange(fieldKey, [...value, {}])}
            >
              {isLargerDevice ? (
                <>
                  <Plus className='h-4 w-4' />
                  Add Object
                </>
              ) : (
                <Plus className='h-4 w-4' />
              )}
            </Button>
          </div>
          {value.map((obj, idx) => (
            <div key={idx} className='p-3 border rounded-md space-y-2'>
              {Object.entries(obj).map(([childKey, childVal]) =>
                renderField(childKey, childVal, `${fieldKey}[${idx}]`)
              )}
              <Button
                type='button'
                size='sm'
                variant='outline'
                className='text-red-600'
                onClick={() => {
                  const newArr = value.filter((_: any, i: number) => i !== idx);
                  handleValueChange(fieldKey, newArr);
                }}
              >
                Remove Object
              </Button>
            </div>
          ))}
        </div>
      );
    }

    // Array of strings
    if (Array.isArray(value)) {
      return (
        <div
          key={fieldKey}
          className='space-y-4 p-4 bg-blue-50 dark:bg-blue-950'
        >
          <div className='flex items-center justify-between'>
            <Label className='font-medium'>{getLabel(fieldKey)}</Label>
            <Badge variant='outline' className='text-xs'>
              array
            </Badge>
            <Button
              type='button'
              size='sm'
              onClick={() => handleValueChange(fieldKey, [...value, ""])}
            >
              {isLargerDevice ? (
                <>
                  <Plus className='h-4 w-4' />
                  Add Item
                </>
              ) : (
                <Plus className='h-4 w-4' />
              )}
            </Button>
          </div>
          {value.map((item, idx) => (
            <div key={idx} className='flex items-center gap-2'>
              <Input
                value={item}
                onChange={(e) => {
                  const newArr = [...value];
                  newArr[idx] = e.target.value;
                  handleValueChange(fieldKey, newArr);
                }}
              />
              <Button
                type='button'
                size='sm'
                variant='outline'
                className='text-red-600'
                onClick={() => {
                  const newArr = value.filter((_: any, i: number) => i !== idx);
                  handleValueChange(fieldKey, newArr);
                }}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      );
    }

    // Nested object
    if (typeof value === "object" && value !== null) {
      return (
        <div
          key={fieldKey}
          className='space-y-3 p-4 bg-green-50 dark:bg-yellow-950'
        >
          <div className='flex items-center gap-2'>
            <Label className='font-medium'>{getLabel(fieldKey)}</Label>
            <Badge variant='outline' className='text-xs'>
              object
            </Badge>
          </div>
          <div className='space-y-2 pl-4 border-l'>
            {Object.entries(value).map(([childKey, childVal]) =>
              renderField(childKey, childVal, fieldKey)
            )}
          </div>
        </div>
      );
    }

    // String / number
    const inputType = determineInputType(value);
    return (
      <div key={fieldKey} className='space-y-2 p-4 bg-gray-50 dark:bg-gray-800'>
        <Label htmlFor={fieldKey} className='font-medium'>
          {getLabel(fieldKey)}
        </Label>
        {inputType === "textarea" ? (
          <Textarea
            id={fieldKey}
            value={value || ""}
            onChange={(e) => handleValueChange(fieldKey, e.target.value)}
          />
        ) : (
          <Input
            id={fieldKey}
            value={value || ""}
            onChange={(e) => handleValueChange(fieldKey, e.target.value)}
          />
        )}
      </div>
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/locales/${localeId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: values }),
        }
      );

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save changes");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className='animate-pulse'>
            <div className='h-6 bg-gray-200 rounded w-48 mb-2'></div>
            <div className='h-4 bg-gray-200 rounded w-32'></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='animate-pulse'>
                <div className='h-4 bg-gray-200 rounded w-24 mb-2'></div>
                <div className='h-10 bg-gray-200 rounded'></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!locale) {
    return (
      <Card>
        <CardContent className='text-center py-8'>
          <p className='text-red-600'>Locale not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header Info */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Globe className='h-6 w-6 text-blue-600' />
              <div>
                <CardTitle className='flex items-center gap-2'>
                  {locale.language}
                  <Badge variant='secondary' className='font-mono text-xs'>
                    {locale.languageCode}.json
                  </Badge>
                </CardTitle>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                  {locale.keyCount} translation keys
                </p>
              </div>
            </div>
            <Badge
              className={
                locale.status === "complete"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }
            >
              {locale.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Success/Error Messages */}
      {success && (
        <Alert className='border-green-200 bg-green-50 text-green-800'>
          <AlertDescription>Changes saved successfully!</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Edit className='h-5 w-5' />
            Edit Translation Values
          </CardTitle>
        </CardHeader>
        <CardContent className='max-lg:p-0'>
          <ScrollArea className='space-y-4 w-full lg:h-[calc(100dvh-450px)] h-[calc(100dvh-420px)] rounded-md'>
            {Object.entries(values).map(([key, value]) =>
              renderField(key, value)
            )}
            {/* <ScrollBar orientation='horizontal' /> */}
          </ScrollArea>

          <div className='flex justify-end gap-2 pt-4 border-t mt-4'>
            <Button
              variant='outline'
              onClick={() => router.push(`/project/${projectId}`)}
              className='bg-transparent'
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className='flex items-center gap-2'
            >
              {isSaving ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Save className='h-4 w-4' />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
