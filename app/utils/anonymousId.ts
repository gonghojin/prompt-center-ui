/**
 * 익명 사용자 ID 관리 유틸리티
 */

const ANONYMOUS_ID_KEY = 'prompt_center_anonymous_id';

/**
 * 익명 사용자 ID 생성
 */
export const generateAnonymousId = (): string => {
  return `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 익명 사용자 ID 조회 (없으면 생성)
 */
export const getAnonymousId = (): string => {
  if (typeof window === 'undefined') return generateAnonymousId();

  let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);

  if (!anonymousId) {
    anonymousId = generateAnonymousId();
    localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
  }

  return anonymousId;
};

/**
 * 현재 사용자가 로그인 상태인지 확인
 */
export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;

  // 토큰 존재 여부로 로그인 상태 확인 (기존 인증 로직 활용)
  const token = localStorage.getItem('accessToken');
  return !!token;
}; 