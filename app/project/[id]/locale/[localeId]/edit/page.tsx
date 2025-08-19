import { LocaleEditor } from "@/components/locale-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditLocalePageProps {
  params:
    | { id: string; localeId: string }
    | Promise<{ id: string; localeId: string }>;
}

export default async function EditLocalePage({ params }: EditLocalePageProps) {
  const { id, localeId } = await params;
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center gap-4'>
              <Link href={`/project/${id}`}>
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
                  Edit Locale
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Update translation values
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <LocaleEditor projectId={id} localeId={localeId} />
      </main>
    </div>
  );
}
