/**
 * Auto WebP + resize for Supabase Storage images.
 * - Uses Supabase render endpoint for storage images (returns WebP + resized).
 * - Returns external URLs unchanged.
 */
export function optimizeImage(
  url: string | null | undefined,
  opts: { width?: number; quality?: number } = {}
): string {
  if (!url) return "";
  const { width = 800, quality = 75 } = opts;

  // Supabase storage public URL -> render/image transform endpoint (WebP, resized)
  // /storage/v1/object/public/<bucket>/<path>  ->  /storage/v1/render/image/public/<bucket>/<path>?width=&quality=&format=
  if (url.includes("/storage/v1/object/public/")) {
    const transformed = url.replace(
      "/storage/v1/object/public/",
      "/storage/v1/render/image/public/"
    );
    const sep = transformed.includes("?") ? "&" : "?";
    return `${transformed}${sep}width=${width}&quality=${quality}&format=origin`;
  }
  return url;
}
