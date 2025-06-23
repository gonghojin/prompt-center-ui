import {useEffect, useState} from "react";
import {login, register} from "@/app/api/authApi";

interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  handleLogin: (email: string, password: string) => Promise<any>;
  handleRegister: (name: string, email: string, password: string) => Promise<any>;
  accessToken: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() =>
      typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null
  );

  useEffect(() => {
    const syncToken = () => {
      setAccessToken(localStorage.getItem("accessToken"));
    };
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  const decodeJWT = (token: string): Record<string, any> => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      // 한글 등 유니코드 복원
      const unicodeDecoded = decodeURIComponent(escape(decoded));
      return JSON.parse(unicodeDecoded);
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
      // accessToken에서 name 추출
      const payload = decodeJWT(data.accessToken);
      const name = payload.name || '';
      localStorage.setItem("user", JSON.stringify({ email, name }));
      // 헤더 즉시 갱신
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('storage'));
      setAccessToken(data.accessToken);
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
    accessToken,
  };
}; 