import { ProjectHeader } from "@/components/project-header";
import { LocaleGrid } from "@/components/locale-grid";
import { AddLocaleButton } from "@/components/add-locale-button";

interface ProjectPageProps {
  params:
    | {
        id: string;
      }
    | Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <ProjectHeader projectId={id} />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Project Locales
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Manage translation files for this project
            </p>
          </div>
          <AddLocaleButton projectId={id} />
        </div>

        <LocaleGrid projectId={id} />
      </main>
    </div>
  );
}
