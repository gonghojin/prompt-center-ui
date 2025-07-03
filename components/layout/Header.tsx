"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Button} from "@components/ui/button";
import {logout} from "@/app/api/authApi";
import {useToast} from "@components/ui/useToast";
import {Menu, X} from "lucide-react";

const Header = () => {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const {showToast} = useToast();

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
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const handleSettingsClick = () => {
    showToast({
      type: "info",
      message: "설정 화면은 현재 개발 중입니다.\n더 나은 서비스를 위해 준비 중이니 조금만 기다려 주세요! 🚧",
      duration: 4000
    });
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
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

            {/* 데스크톱 네비게이션 - 로그인된 사용자에게만 표시 */}
            {user && (
                <nav className="hidden md:flex items-center gap-6" aria-label="메인 네비게이션">
                  <Link href="/dashboard"
                        className="text-white/70 hover:text-purple-400 transition-colors"
                        tabIndex={0} aria-label="대시보드 이동">
                    대시보드
                  </Link>
                  <Link href="/prompts" className="text-white/70 hover:text-white transition-colors"
                        tabIndex={0} aria-label="프롬프트 이동">
                    프롬프트
                  </Link>
                  <Link href="/my-prompts"
                        className="text-white/70 hover:text-white transition-colors" tabIndex={0}
                        aria-label="내 프롬프트 이동">
                    내 프롬프트
                  </Link>
                  <div
                      onClick={handleSettingsClick}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleSettingsClick();
                        }
                      }}
                      className="text-white/70 hover:text-white transition-colors cursor-pointer"
                      tabIndex={0}
                      aria-label="설정 - 개발 중"
                      role="button"
                  >
                    설정
                  </div>
                </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* 데스크톱 사용자 메뉴 */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                  <>
                    <span className="text-white/80 text-sm" aria-label="유저 이메일">{user.email}</span>
                    <Button
                        variant="secondary-action"
                        className="text-sm px-4 py-2"
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
                      <Button
                          variant="primary"
                          className="text-sm px-4 py-2">
                        로그인
                      </Button>
                    </Link>
                    <Link href="/auth/register" tabIndex={0} aria-label="회원가입 이동">
                      <Button variant="secondary-action"
                              className="text-sm px-4 py-2">
                        회원가입
                      </Button>
                    </Link>
                  </>
              )}
            </div>

            {/* 모바일 햄버거 메뉴 */}
            <button
                onClick={handleMobileMenuToggle}
                className="md:hidden text-white hover:text-purple-400 transition-colors p-2"
                aria-label="모바일 메뉴 토글"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20">
              <nav className="flex flex-col gap-4 mt-4" aria-label="모바일 네비게이션">
                {user ? (
                    // 인증된 사용자용 모바일 메뉴
                    <>
                      <Link href="/dashboard"
                            className="text-white/70 hover:text-purple-400 transition-colors py-2"
                            onClick={handleMobileLinkClick}>
                        대시보드
                      </Link>
                      <Link href="/prompts"
                            className="text-white/70 hover:text-white transition-colors py-2"
                            onClick={handleMobileLinkClick}>
                        프롬프트
                      </Link>
                      <Link href="/my-prompts"
                            className="text-white/70 hover:text-white transition-colors py-2"
                            onClick={handleMobileLinkClick}>
                        내 프롬프트
                      </Link>
                      <div
                          onClick={handleSettingsClick}
                          className="text-white/70 hover:text-white transition-colors cursor-pointer py-2"
                      >
                        설정
                      </div>
                      <div className="border-t border-white/20 pt-4 mt-2">
                        <div className="text-white/60 text-sm mb-2">{user.email}</div>
                        <Button
                            variant="secondary-action"
                            className="w-full text-sm"
                            onClick={handleLogout}
                            disabled={logoutLoading}
                        >
                          {logoutLoading ? "로그아웃 중..." : "로그아웃"}
                        </Button>
                      </div>
                    </>
                ) : (
                    // 인증되지 않은 사용자용 모바일 메뉴 - 로그인/회원가입만 표시
                    <div className="space-y-3">
                      <Link href="/auth/login" onClick={handleMobileLinkClick}>
                        <Button
                            variant="primary"
                            className="w-full">
                          로그인
                        </Button>
                      </Link>
                      <Link href="/auth/register" onClick={handleMobileLinkClick}>
                        <Button variant="secondary-action"
                                className="w-full">
                          회원가입
                        </Button>
                      </Link>
                    </div>
                )}
              </nav>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header; 