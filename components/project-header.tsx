"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string;
  locales: string[];
  lastUpdated: string;
}

interface ProjectHeaderProps {
  projectId: string;
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data fetch - replace with actual API call
    setTimeout(() => {
      const mockProjects: Project[] = [
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
      ];

      const foundProject = mockProjects.find((p) => p.id === projectId);
      setProject(foundProject || null);
      setIsLoading(false);
    }, 500);
  }, [projectId]);

  if (isLoading) {
    return (
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='animate-pulse'>
              <div className='h-6 bg-gray-200 rounded w-48'></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (!project) {
    return (
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center gap-4'>
              <Link href='/home'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center gap-2'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Back
                </Button>
              </Link>
              <span className='text-red-600'>Project not found</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className='bg-white dark:bg-gray-800 shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center gap-4'>
            <Link href='/home'>
              <Button
                variant='ghost'
                size='sm'
                className='flex items-center gap-2'
              >
                <ArrowLeft className='h-4 w-4' />
                Back
              </Button>
            </Link>
            <div>
              <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
                {project.name}
              </h1>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {project.description}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-2 bg-transparent'
            >
              <Settings className='h-4 w-4' />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
