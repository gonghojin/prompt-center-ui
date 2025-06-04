import { useState } from "react";
import { login, register } from "@/app/api/authApi";

interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  handleLogin: (email: string, password: string) => Promise<any>;
  handleRegister: (name: string, email: string, password: string) => Promise<any>;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decodeJWT = (token: string): Record<string, any> => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return {};
    }
  };

  const handleLogin = async (email: string, password: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const data = await login({ email, password });
      // 응답 구조: { accessToken, refreshToken, expiresIn }
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("expiresIn", String(data.expiresIn));
      // accessToken에서 name 추출
      const payload = decodeJWT(data.accessToken);
      const name = payload.name || '';
      localStorage.setItem("user", JSON.stringify({ email, name }));
      // 헤더 즉시 갱신
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('storage'));
      return data;
    } catch (e: any) {
      setError(e.message || "로그인 실패");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const data = await register({ name, email, password });
      // 헤더 즉시 갱신 (회원가입 후 자동 로그인 등 확장 대비)
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('storage'));
      return data;
    } catch (e: any) {
      setError(e.message || "회원가입 실패");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleLogin,
    handleRegister,
  };
}; 