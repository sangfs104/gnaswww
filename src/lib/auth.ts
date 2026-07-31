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

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
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

export const setAuth = (token: string, user: StoredUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // Không xóa guestId để giữ giỏ guest nếu cần
};

/** Kiểm tra token còn hợp lệ với server. Nếu không → clearAuth */
export const validateAuth = async (): Promise<StoredUser | null> => {
  const token = getToken();
  if (!token) {
    clearAuth();
    return null;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check`,
      {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!res.ok) {
      clearAuth();
      return null;
    }

    const data = await res.json();
    // Đồng bộ lại user từ server (tránh data cũ)
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user as StoredUser;
    }
    return getUser();
  } catch {
    clearAuth();
    return null;
  }
};

/** Helper fetch có tự xử lý 401 */
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
    // Redirect về login kèm redirect hiện tại
    if (typeof window !== "undefined") {
      const current = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(current)}`;
    }
  }

  return res;
};