import fs from "fs";
import path from "path";

// Set the exact upload directory path
const UPLOAD_DIR = "C:\\share";

export async function GET(request, { params }) {
  try {
    // Log the incoming request details
    console.log('Download request params:', params);
    
    // Check if filename exists in params
    if (!params || typeof params.filename === 'undefined') {
      console.error('Missing filename in params');
      return new Response("Missing filename in request parameters", { status: 400 });
    }

    // Get and validate filename
    const filename = params.filename;
    if (!filename || filename.trim() === '') {
      console.error('Empty filename provided');
      return new Response("Filename cannot be empty", { status: 400 });
    }

    // Decode and get the file path
    const decodedFilename = decodeURIComponent(filename);
    const filePath = path.join(UPLOAD_DIR, decodedFilename);
    
    console.log('Attempting to access file at:', filePath);

    // Check if file exists
    try {
      const fileExists = fs.existsSync(filePath);
      if (!fileExists) {
        console.error('File not found:', filePath);
        return new Response("File not found", { status: 404 });
      }

      // Additional check to verify file is readable
      fs.accessSync(filePath, fs.constants.R_OK);
    } catch (error) {
      console.error('Error accessing file:', error);
      return new Response("Error accessing file", { status: 500 });
    }

    console.log('Attempting to download file:', filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      return new Response("File not found", { status: 404 });
    }

    // Read file stats and content
    const stat = fs.statSync(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    console.log('File ready for download:', {
      name: decodedFilename,
      size: stat.size,
      path: filePath
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
