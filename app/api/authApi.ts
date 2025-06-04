export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { email: string; password: string; name: string };

export const login = async (payload: LoginPayload): Promise<any> => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let errorMsg = "로그인에 실패했습니다.";
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
};

export const register = async (payload: RegisterPayload): Promise<any> => {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 409) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }
  if (!res.ok) {
    let errorMsg = "회원가입에 실패했습니다.";
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

export const logout = async (): Promise<any> => {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Authorization": accessToken ? `Bearer ${accessToken}` : "",
    },
  });
  if (!res.ok) {
    let errorMsg = "로그아웃에 실패했습니다.";
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
};

export const refreshToken = async (refreshToken: string): Promise<any> => {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    let errorMsg = "토큰 갱신에 실패했습니다.";
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}; 