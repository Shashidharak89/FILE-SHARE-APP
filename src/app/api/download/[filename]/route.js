import fs from "fs";
import path from "path";

const UPLOAD_DIR = "C:/share";

export async function GET(request, { params }) {
  try {
    if (!params || !params.filename) {
      return new Response("Missing file name", { status: 400 });
    }
    const filename = decodeURIComponent(params.filename);

    // prevent directory traversal
    const safeName = path.basename(filename);
    const filePath = path.join(UPLOAD_DIR, safeName);

    if (!fs.existsSync(filePath)) {
      return new Response("File not found", { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileStream = fs.createReadStream(filePath);

    return new Response(fileStream, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Content-Length": stat.size,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
