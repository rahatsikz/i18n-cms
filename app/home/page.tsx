import { ProjectsGrid } from "@/components/projects-grid";
import { CreateUserModal } from "@/components/create-user-modal";
import { CreateProjectModal } from "@/components/create-project-modal";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-20'>
            <div>
              <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
                i18n CMS
              </h1>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Manage your project locales
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <CreateUserModal />
              <Button variant='outline' size='sm'>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Your Projects
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Manage localization files for your projects
            </p>
          </div>
          <CreateProjectModal />
        </div>

        <ProjectsGrid />
      </main>
    </div>
  );
}
