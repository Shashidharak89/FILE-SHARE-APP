import fs from "fs";
import path from "path";

// Try to use C:/share, fallback to project root if not accessible
const PRIMARY_UPLOAD_DIR = "C:/share";
const FALLBACK_UPLOAD_DIR = path.join(process.cwd(), 'share');

// Check if we can access C:/share
let UPLOAD_DIR = PRIMARY_UPLOAD_DIR;
try {
    // Try to access or create C:/share
    if (!fs.existsSync(PRIMARY_UPLOAD_DIR)) {
        fs.mkdirSync(PRIMARY_UPLOAD_DIR, { recursive: true });
    }
    // Test write access
    fs.accessSync(PRIMARY_UPLOAD_DIR, fs.constants.W_OK);
} catch (error) {
    console.log('Cannot access C:/share, using fallback location:', FALLBACK_UPLOAD_DIR);
    UPLOAD_DIR = FALLBACK_UPLOAD_DIR;
    if (!fs.existsSync(FALLBACK_UPLOAD_DIR)) {
        fs.mkdirSync(FALLBACK_UPLOAD_DIR, { recursive: true });
    }
}

export async function GET(request, { params }) {
  try {
    console.log('Download request received for:', params?.filename);
    
    if (!params?.filename) {
      console.error('Missing filename parameter');
      return new Response("Missing filename parameter", { status: 400 });
    }

    // Decode and sanitize the filename
    const filename = decodeURIComponent(params.filename);
    const safeName = path.basename(filename);
    const filePath = path.join(UPLOAD_DIR, safeName);

    console.log('Attempting to download file:', filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      return new Response("File not found", { status: 404 });
    }

    // Read file stats and content
    const stat = fs.statSync(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    console.log('File stats:', {
      size: stat.size,
      path: filePath,
      exists: fs.existsSync(filePath)
    });

    // Simple MIME type detection
    const ext = path.extname(safeName).toLowerCase();
    const mimeTypes = {
      '.txt': 'text/plain',
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Create response with file content
    const response = new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Content-Length": stat.size.toString(),
        "Content-Type": contentType,
        "Cache-Control": "no-store"
      },
    });

    console.log('Sending file response:', {
      filename: safeName,
      contentType,
      size: stat.size
    });

    return response;
  } catch (err) {
    console.error("Download error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
