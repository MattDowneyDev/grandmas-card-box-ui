const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Keep in sync with MAX_UPLOAD_BYTES in the API's services/s3.ts — checking
// client-side just avoids a wasted round trip for an upload S3 will reject anyway.
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Requests a presigned S3 upload policy, posts the file directly to S3, then
// returns the public URL to store on the recipe.
export async function uploadRecipeImage(file: File, token?: string): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Photo is too large. Please choose one under 8 MB.");
  }

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

  const { uploadUrl, fields, publicUrl } = await presignResponse.json();

  const formData = new FormData();
  Object.entries(fields as Record<string, string>).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("file", file);

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload image (${uploadResponse.status})`);
  }

  return publicUrl;
}
