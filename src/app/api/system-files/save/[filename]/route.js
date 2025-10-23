import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getStoragePath } from '@/app/lib/storage';

export async function POST(request, { params }) {
    try {
        const { sourcePath } = await request.json();
        const filename = params.filename;
        
        if (!filename || !sourcePath) {
            return NextResponse.json(
                { error: 'Filename and source path are required' },
                { status: 400 }
            );
        }
        const targetPath = path.join(await getStoragePath(), filename);

        // Check if source file exists
        try {
            await fs.access(sourcePath);
        } catch {
            return NextResponse.json(
                { error: 'Source file not found' },
                { status: 404 }
            );
        }

        // Copy the file
        await fs.copyFile(sourcePath, targetPath);

        return NextResponse.json({ message: 'File saved successfully' });
    } catch (error) {
        console.error('Error saving file:', error);
        return NextResponse.json(
            { error: 'Failed to save file' },
            { status: 500 }
        );
    }
}