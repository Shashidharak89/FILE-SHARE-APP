import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const { path } = await request.json();
        if (!path) {
            return NextResponse.json(
                { error: 'Path is required' },
                { status: 400 }
            );
        }

        // Check if directory exists
        try {
            await fs.access(path);
        } catch {
            return NextResponse.json(
                { error: 'Directory not found' },
                { status: 404 }
            );
        }

        // Read the directory
        const files = await fs.readdir(path);
        
        // Get file stats for each file
        const fileDetails = await Promise.all(
            files.map(async (filename) => {
                const filePath = path.join(path, filename);
                const stats = await fs.stat(filePath);
                return {
                    name: filename,
                    size: stats.size,
                    modified: stats.mtime
                };
            })
        );

        return NextResponse.json(fileDetails);
    } catch (error) {
        console.error('Error reading system files:', error);
        return NextResponse.json(
            { error: 'Failed to read system files' },
            { status: 500 }
        );
    }
}