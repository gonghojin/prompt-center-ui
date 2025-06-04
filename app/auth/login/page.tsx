import AuthForm from '@components/auth/AuthForm';

const LoginPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-100 via-purple-100 to-cyan-200 dark:from-cyan-950 dark:via-purple-950 dark:to-cyan-900 transition-colors duration-500">
      <div className="w-full max-w-md p-10 rounded-3xl shadow-2xl bg-white/90 dark:bg-black/70 border border-gray-100 dark:border-gray-800 backdrop-blur-xl">
        <AuthForm type="login" />
      </div>
    </main>
  );
};

export default LoginPage; 