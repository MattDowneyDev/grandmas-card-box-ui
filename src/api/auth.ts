const API_BASE_URL = "http://localhost:4000";

export interface AuthSession {
  token: string;
  displayName: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user?: {
    displayName: string;
    email: string;
  };
}

export async function getCurrentUser(
  token: string,
): Promise<{ email: string; displayName: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = (await response.json()) as {
    user?: { email: string; displayName: string };
    error?: string;
  };

  if (!response.ok || !payload.user) {
    throw new Error(payload.error || "Session is no longer valid");
  }

  return payload.user;
}

async function authenticate(
  endpoint: "login" | "signup",
  body: Record<string, string>,
): Promise<AuthSession> {
  const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as AuthResponse & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error || `Authentication failed (${response.status})`);
  }

  return {
    token: payload.token,
    email: payload.user?.email || body.email,
    displayName: payload.user?.displayName || body.displayName || body.email,
  };
}

export function login(email: string, password: string): Promise<AuthSession> {
  return authenticate("login", { email, password });
}

export function signup(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthSession> {
  return authenticate("signup", { email, password, displayName });
}

export async function requestPasswordReset(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const payload = (await response.json()) as { error?: string };
  if (!response.ok) {
    throw new Error(payload.error || `Password reset request failed (${response.status})`);
  }
}

export async function resetPassword(token: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  const payload = (await response.json()) as { error?: string };
  if (!response.ok) {
    throw new Error(payload.error || `Password reset failed (${response.status})`);
  }
}

export async function updateAccount(
  token: string,
  updates: {
    displayName?: string;
    currentPassword?: string;
    newPassword?: string;
  },
): Promise<{ email: string; displayName: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const payload = (await response.json()) as {
    user?: { email: string; displayName: string };
    error?: string;
  };
  if (!response.ok || !payload.user) {
    throw new Error(payload.error || `Account update failed (${response.status})`);
  }
  return payload.user;
}

export async function deleteAccount(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const responseText = await response.text();
  let payload: { error?: string } = {};

  try {
    payload = JSON.parse(responseText) as { error?: string };
  } catch {
    throw new Error(
      `Account deletion failed (${response.status}): ${response.statusText}`,
    );
  }

  if (!response.ok) {
    throw new Error(payload.error || `Account deletion failed (${response.status})`);
  }
}
