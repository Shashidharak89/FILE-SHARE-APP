import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const data = await req.json();
    const pathToValidate = data.path;

    if (!pathToValidate) {
      return new Response(
        JSON.stringify({ valid: false, error: 'No path provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Try to create directory if it doesn't exist
      if (!fs.existsSync(pathToValidate)) {
        fs.mkdirSync(pathToValidate, { recursive: true });
      }

      // Test write permissions by creating and removing a test file
      const testFile = path.join(pathToValidate, '.test-write-access');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);

      return new Response(
        JSON.stringify({ valid: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: `Cannot access path: ${error.message}` 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, error: 'Invalid request' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}