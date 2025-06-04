"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { logout } from "@/app/api/authApi";

const Header = () => {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const handleUpdateUser = () => {
      if (typeof window === "undefined") return;
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    handleUpdateUser();
    window.addEventListener("storage", handleUpdateUser);
    return () => {
      window.removeEventListener("storage", handleUpdateUser);
    };
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout();
    } catch {
      // 무시: 토큰 만료 등
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("user");
    setUser(null);
    setLogoutLoading(false);
    router.push("/");
  };

  return (
    <header className="border-b border-white/20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900/90 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-white" tabIndex={0} aria-label="홈으로 이동">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                PromptHub
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6" aria-label="메인 네비게이션">
              <Link href="/dashboard" className="text-white/70 hover:text-purple-400 transition-colors" tabIndex={0} aria-label="대시보드 이동">
                대시보드
              </Link>
              <Link href="/prompts" className="text-white/70 hover:text-white transition-colors" tabIndex={0} aria-label="프롬프트 이동">
                프롬프트
              </Link>
              <Link href="/my-prompts" className="text-white/70 hover:text-white transition-colors" tabIndex={0} aria-label="내 프롬프트 이동">
                내 프롬프트
              </Link>
              <Link href="/settings" className="text-white/70 hover:text-white transition-colors" tabIndex={0} aria-label="설정 이동">
                설정
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-white/80 text-sm" aria-label="유저 이메일">{user.email}</span>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-sm px-4 py-2"
                  onClick={handleLogout}
                  aria-label="로그아웃"
                  disabled={logoutLoading}
                >
                  {logoutLoading ? "로그아웃 중..." : "로그아웃"}
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" tabIndex={0} aria-label="로그인 이동">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm px-4 py-2">
                    로그인
                  </Button>
                </Link>
                <Link href="/auth/register" tabIndex={0} aria-label="회원가입 이동">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-sm px-4 py-2">
                    회원가입
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 