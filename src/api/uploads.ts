const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Requests a presigned S3 URL, uploads the file directly to S3, then
// returns the public URL to store on the recipe.
export async function uploadRecipeImage(file: File, token?: string): Promise<string> {
  const presignResponse = await fetch(`${API_BASE_URL}/uploads/presign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify({ contentType: file.type }),
  });

  if (!presignResponse.ok) {
    throw new Error(`Failed to get upload URL (${presignResponse.status})`);
  }

  const { uploadUrl, publicUrl } = await presignResponse.json();

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload image (${uploadResponse.status})`);
  }

  return publicUrl;
}
