import { getCurrentUser } from "@/lib/auth.utils";
import { NextResponse } from "next/server";
import { writeFile, mkdir, readdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('image') as File;
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const id = uuidv4();
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'uploads');

        // Ensure uploads directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            console.error('Error creating uploads directory:', err);
            return NextResponse.json({ error: 'Failed to create uploads directory' }, { status: 500 });
        }

        const filePath = path.join(uploadDir, `${id}${path.extname(file.name)}`);

        try {
            await writeFile(filePath, buffer);
        } catch (err) {
            console.error('Error writing file:', err);
            return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
        }

        return NextResponse.json({ id });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}




