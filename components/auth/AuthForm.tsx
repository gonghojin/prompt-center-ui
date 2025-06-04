'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/app/hooks/useAuth';

type AuthFormType = 'login' | 'register';

interface AuthFormProps {
  type: AuthFormType;
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [localError, setLocalError] = useState('');
  const router = useRouter();
  const { loading, error, handleLogin, handleRegister } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');
    if (type === 'login') {
      try {
        await handleLogin(form.email, form.password);
        router.push('/dashboard');
      } catch {
        // error는 useAuth에서 관리
      }
      return;
    }
    if (form.password !== form.confirmPassword) {
      setLocalError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await handleRegister(form.name, form.email, form.password);
      router.push('/auth/login');
    } catch {
      // error는 useAuth에서 관리
    }
  };

  return (
    <form
      className="flex flex-col gap-6 text-lg"
      onSubmit={handleSubmit}
      aria-label={type === 'login' ? '로그인 폼' : '회원가입 폼'}
    >
      <h2 className="text-3xl font-extrabold text-center mb-2 select-none text-gray-900 dark:text-white tracking-tight">
        {type === 'login' ? '로그인' : '회원가입'}
      </h2>
      {type === 'register' && (
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="이름"
          className="w-full rounded-xl px-4 py-3 bg-white/90 dark:bg-black/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition"
          required
          aria-label="이름"
          autoComplete="name"
        />
      )}
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="이메일"
        className="w-full rounded-xl px-4 py-3 bg-white/90 dark:bg-black/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition"
        required
        aria-label="이메일"
        autoComplete="email"
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="비밀번호"
        className="w-full rounded-xl px-4 py-3 bg-white/90 dark:bg-black/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition"
        required
        aria-label="비밀번호"
        autoComplete={type === 'login' ? 'current-password' : 'new-password'}
      />
      {type === 'register' && (
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="비밀번호 확인"
          className="w-full rounded-xl px-4 py-3 bg-white/90 dark:bg-black/60 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition"
          required
          aria-label="비밀번호 확인"
          autoComplete="new-password"
        />
      )}
      {type === 'register' && (
        <label className="flex items-center gap-3 text-base select-none mt-1">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            required
            aria-label="약관 동의"
            className="accent-cyan-500 scale-125 focus:ring-2 focus:ring-cyan-400 rounded-md"
          />
          <span className="text-gray-700 dark:text-gray-200">이용약관에 동의합니다.</span>
        </label>
      )}
      {(localError || error) && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg px-3 py-2 text-base text-center justify-center shadow-sm" role="alert">
          <AlertTriangle className="w-4 h-4" />
          {localError || error}
        </div>
      )}
      <button
        type="submit"
        className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 shadow-lg text-white focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
        disabled={loading}
        aria-busy={loading}
      >
        {loading && <Loader2 className="animate-spin w-5 h-5" />}
        {type === 'login' ? '로그인' : '회원가입'}
      </button>
      <div className="flex justify-between text-base mt-2">
        {type === 'login' ? (
          <>
            <Link href="/auth/register" className="text-cyan-600 hover:underline focus:underline focus:outline-none" tabIndex={0} aria-label="회원가입 이동">회원가입</Link>
            <button type="button" className="text-gray-500 hover:underline focus:underline focus:outline-none" tabIndex={0} aria-label="비밀번호 찾기">비밀번호 찾기</button>
          </>
        ) : (
          <Link href="/auth/login" className="text-cyan-600 hover:underline focus:underline focus:outline-none" tabIndex={0} aria-label="로그인 이동">로그인</Link>
        )}
      </div>
    </form>
  );
};

export default AuthForm; 