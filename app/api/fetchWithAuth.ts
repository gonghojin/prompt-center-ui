import {refreshToken as refreshTokenApi} from "@/app/api/authApi";

export const fetchWithAuth = async (
  input: RequestInfo,
  init: RequestInit = {},
  retry = false
): Promise<Response> => {
  let pathname = '';
  if (typeof input === 'string') {
    // 상대경로 또는 절대경로 모두 지원
    pathname = input.startsWith('http') ? new URL(input).pathname : input;
  } else {
    // Request 객체일 경우
    pathname = input.url.startsWith('http') ? new URL(input.url).pathname : input.url;
  }
  // 인증 필요 경로: /api/v1/로 시작
  const isAuthRequired = pathname.startsWith('/api/v1/');
  if (isAuthRequired) {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    let headers: Record<string, string> = {};
    if (init.headers instanceof Headers) {
      init.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(init.headers)) {
      init.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else if (typeof init.headers === 'object' && init.headers !== null) {
      headers = { ...init.headers as Record<string, string> };
    }
    headers['Authorization'] = accessToken ? `Bearer ${accessToken}` : '';
    init.headers = headers;
  }
  const res = await fetch(input, init);
  if (isAuthRequired && res.status === 401 && !retry) {
    // accessToken 만료, refresh 시도
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (!refreshToken) throw new Error('리프레시 토큰 없음');
      const data = await refreshTokenApi(refreshToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      // 원래 요청을 한 번만 재시도
      return fetchWithAuth(input, init, true);
    } catch (e) {
      // refresh 실패: 로그아웃 처리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('인증이 만료되었습니다. 다시 로그인 해주세요.');
    }
  }
  return res;
}; 