import fs from 'fs';
import path from 'path';

export function getStoragePath() {
    try {
        // Get the absolute path to the project root directory (where package.json is)
        const projectRoot = process.cwd();
        
        // Go one directory up and create a 'share' folder
        const sharePath = path.join(projectRoot, '..', 'share');
        
        // Ensure the share directory exists
        if (!fs.existsSync(sharePath)) {
            fs.mkdirSync(sharePath, { recursive: true });
        }
        
        // Log the path for debugging
        console.log('Using storage path:', sharePath);
        
        return sharePath;
    } catch (error) {
        console.error('Error accessing/creating share folder:', error);
        throw new Error('Could not access or create share folder');
    }
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