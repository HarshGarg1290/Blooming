
export function transformCloudinary(url, { width = 600, height = 750, crop = "fill", gravity = "auto", quality = "auto", format = "auto" } = {}) {
  if (typeof url !== "string" || url.length === 0) return url;
  try {
    const isCloudinary = url.includes("res.cloudinary.com") && url.includes("/image/upload/");
    if (!isCloudinary) return url;

  
    const parts = url.split("/upload/");
    if (parts.length < 2) return url;

    const existing = parts[1];
    const hasTransform = existing && !existing.startsWith("v") && existing.includes("/");
    if (hasTransform) return url;

    const transform = [`f_${format}`, `q_${quality}`, `c_${crop}`, `g_${gravity}`, `w_${width}`, `h_${height}`].join(",");
    return `${parts[0]}/upload/${transform}/${parts[1]}`;
  } catch {
    return url;
  }
}
