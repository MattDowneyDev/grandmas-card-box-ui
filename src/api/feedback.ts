const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export interface FeedbackPayload {
  type: "comment" | "bug" | "feature";
  message: string;
  email?: string;
  company?: string;
}

export async function sendFeedback(
  payload: FeedbackPayload,
  token?: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}) as { error?: string });
  if (!response.ok) {
    throw new Error(data.error || `Failed to send feedback (${response.status})`);
  }
}
