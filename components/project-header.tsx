"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import { useGetProjectById } from "@/api/project.queries";

interface ProjectHeaderProps {
  projectId: string;
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const { data: project, isLoading } = useGetProjectById(projectId);

  if (isLoading) {
    return (
      <header className='bg-background shadow-sm border-b'>
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
      <header className='bg-background shadow-sm border-b'>
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
    <header className='bg-background shadow-sm border-b'>
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
              </Button>
            </Link>
            <div>
              <h1 className='lg:text-xl font-bold text-foreground'>
                {project.name}
              </h1>
              <p className='text-sm hidden md:block text-foreground/70 max-w-md truncate'>
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
