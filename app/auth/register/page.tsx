import AuthForm from '@components/auth/AuthForm';

const RegisterPage = () => {
  return (
      <main
          className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div
            className="w-full max-w-md p-10 rounded-3xl shadow-2xl bg-slate-800/60 border border-white/10 backdrop-blur-xl">
        <AuthForm type="register" />
      </div>
    </main>
  );
};

export default RegisterPage; 