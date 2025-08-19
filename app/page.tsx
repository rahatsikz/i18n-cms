import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='w-full max-w-md'>
        <div className='bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              i18n CMS
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-0'>
              Manage your project locales
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
