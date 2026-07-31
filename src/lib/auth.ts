// export interface StoredUser {
//   id?: string;
//   name?: string;
//   email?: string;
// }

// function decodeJwtExp(token: string): number | null {
//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return typeof payload.exp === "number" ? payload.exp * 1000 : null;
//   } catch {
//     return null;
//   }
// }

// export function getToken(): string | null {
//   if (typeof window === "undefined") return null;
//   const token = localStorage.getItem("token");
//   if (!token) return null;

//   const expMs = decodeJwtExp(token);
//   if (expMs && Date.now() >= expMs) {
//     clearAuth();
//     return null;
//   }
//   return token;
// }

// export function getUser(): StoredUser | null {
//   if (typeof window === "undefined") return null;
//   if (!getToken()) return null;
//   try {
//     return JSON.parse(localStorage.getItem("user") || "null");
//   } catch {
//     return null;
//   }
// }

// export function getGuestId(): string {
//   if (typeof window === "undefined") return "";
//   return localStorage.getItem("guestId") || "";
// }

// export function isLoggedIn(): boolean {
//   return !!getToken();
// }

// export function clearAuth() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
// }
// src/lib/auth.ts  (hoặc @/lib/auth)

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";
const GUEST_KEY = "guestId";

// ==================== GETTERS ====================

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as StoredUser & { _id?: string };
    // Chuẩn hoá id nếu backend từng trả _id
    if (!user.id && user._id) {
      user.id = user._id;
    }
    return user?.id ? user : null;
  } catch {
    return null;
  }
};

export const getGuestId = (): string => {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(GUEST_KEY);
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(GUEST_KEY, id);
  }
  return id;
};

/** Ưu tiên: user đã login → guest */
export const getUserId = (): string => {
  if (typeof window === "undefined") return "";
  const user = getUser();
  if (user?.id) return user.id;
  return getGuestId();
};

// ==================== SETTERS ====================

export const setAuth = (token: string, user: StoredUser) => {
  if (typeof window === "undefined") return;
  const normalized: StoredUser = {
    id: user.id || (user as any)._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(normalized));
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // Không xóa guestId — giữ giỏ guest nếu cần
};

// ==================== VALIDATE ====================

/**
 * Kiểm tra token với server.
 * - 401 → clearAuth, return null
 * - Lỗi mạng / 404 / 5xx → giữ local user (không đá login oan)
 * - OK → đồng bộ user từ server
 */
export const validateAuth = async (): Promise<StoredUser | null> => {
  const token = getToken();
  if (!token) return null;

  const localUser = getUser();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check`,
      {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      },
    );

    // Token hết hạn / không hợp lệ → mới clear
    if (res.status === 401) {
      clearAuth();
      return null;
    }

    // Endpoint chưa có hoặc lỗi server → giữ session local
    if (!res.ok) {
      return localUser;
    }

    const data = await res.json();
    if (data?.user) {
      const normalized: StoredUser = {
        id: data.user.id || data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(normalized));
      return normalized;
    }

    return localUser;
  } catch {
    // Lỗi mạng → vẫn giữ session
    return localUser;
  }
};

// ==================== AUTH FETCH ====================

/**
 * fetch có gắn Bearer token + tự xử lý 401.
 * Khi 401: clearAuth + redirect /login?redirect=...
 */
export const authFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    clearAuth();
    if (typeof window !== "undefined") {
      const current = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(current)}`;
    }
  }

  return res;
};

// ==================== HELPERS ====================

export const isLoggedIn = (): boolean => {
  return !!getToken() && !!getUser();
};