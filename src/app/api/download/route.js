import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getStoragePath } from '@/app/lib/storage';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');
        
        if (!filename) {
            return NextResponse.json(
                { error: 'Filename is required' }, 
                { status: 400 }
            );
        }

        const storagePath = await getStoragePath();
        const filePath = path.join(storagePath, filename);

        let stat;
        try {
            stat = await fs.stat(filePath);
        } catch {
            return NextResponse.json(
                { error: 'File not found' }, 
                { status: 404 }
            );
        }

        const fileBuffer = await fs.readFile(filePath);

        const headers = new Headers();
        headers.set('Content-Type', 'application/octet-stream');
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        headers.set('Content-Length', stat.size.toString());

        return new NextResponse(fileBuffer, {
            status: 200,
            headers
        });
        
    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json(
            { error: 'Failed to download file' }, 
            { status: 500 }
        );
    }
}
