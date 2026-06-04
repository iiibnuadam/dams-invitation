import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFilenameFromUrl(url: string) {
  try {
    const decodedUrl = decodeURIComponent(url);
    const pathname = new URL(decodedUrl).pathname;
    const rawFilename = pathname.split('/').pop() || '';
    
    // Vercel Blob appends a hyphen followed by a random hash (e.g. -La2tiSgDBTMjPFc4hDkMiPPxRcT8Oz.jpg)
    // Clean it up if it matches vercel blob suffix format: -[a-zA-Z0-9]{20,}\.[a-zA-Z0-9]+$
    const cleanFilename = rawFilename.replace(/-[a-zA-Z0-9]{20,}\.([a-zA-Z0-9]+)$/i, '.$1');
    return {
      raw: rawFilename,
      clean: cleanFilename
    };
  } catch (error) {
    return {
      raw: url,
      clean: url
    };
  }
}
