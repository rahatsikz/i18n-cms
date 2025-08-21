"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Folder, Globe, Calendar } from "lucide-react";
import Link from "next/link";
import { useGetAllProjects } from "@/api/project.queries";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function ProjectsGrid() {
  const { data: projects, isLoading } = useGetAllProjects();

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {[...Array(6)].map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardHeader>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2'></div>
            </CardHeader>
            <CardContent>
              <div className='h-3 bg-gray-200 rounded w-full mb-2'></div>
              <div className='h-3 bg-gray-200 rounded w-2/3'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5'>
      {projects?.map((project) => (
        <Link key={project.id} href={`/project/${project.id}`}>
          <Card className='hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800'>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-2'>
                  <Folder className='h-5 w-5 text-blue-600' />
                  <CardTitle className='text-lg'>{project.name}</CardTitle>
                </div>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {project.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div
                  className={cn(
                    "flex items-center gap-2",
                    project.locales?.length === 0 && "hidden"
                  )}
                >
                  <Globe className='h-4 w-4 text-gray-500' />
                  <div className='flex gap-1'>
                    {project.locales &&
                      project.locales.length > 0 &&
                      project?.locales?.map((locale) => (
                        <Badge
                          key={locale.id}
                          variant='secondary'
                          className='text-xs'
                        >
                          {locale.lang}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2 mt-2 text-xs text-gray-500'>
                <Calendar className='h-3 w-3' />
                Updated {format(project.updatedAt, "PPP")}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
