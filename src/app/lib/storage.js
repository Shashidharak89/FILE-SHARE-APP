import fs from 'fs';
import path from 'path';

// Get the configured storage path from headers or use default
export function getStoragePath(headers) {
  try {
    const configuredPath = headers?.get('x-storage-path');
    if (configuredPath) {
      // Ensure the path exists
      if (!fs.existsSync(configuredPath)) {
        fs.mkdirSync(configuredPath, { recursive: true });
      }
      return configuredPath;
    }
  } catch (error) {
    console.error('Error accessing configured path:', error);
  }

  // Fallback paths
  const paths = [
    process.env.STORAGE_PATH, // Allow env configuration
    'C:\\share',              // Windows default
    '/storage/emulated/0/Share', // Android internal storage
    path.join(process.cwd(), 'share') // Project directory fallback
  ];

  // Use the first accessible path
  for (const p of paths) {
    if (p) {
      try {
        if (!fs.existsSync(p)) {
          fs.mkdirSync(p, { recursive: true });
        }
        fs.accessSync(p, fs.constants.W_OK);
        return p;
      } catch (error) {
        console.warn(`Cannot access path ${p}:`, error);
      }
    }
  }

  // If no path is accessible, use project directory
  const fallbackPath = path.join(process.cwd(), 'share');
  if (!fs.existsSync(fallbackPath)) {
    fs.mkdirSync(fallbackPath, { recursive: true });
  }
  return fallbackPath;
}