import { getCurrentUser } from "@/lib/auth.utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CrimeCaptionOutput } from "@/types/generate";

function fileToGenerativePart(path: string, mimeType: string) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
}

function parseOutput(output: string): CrimeCaptionOutput {
    const firstBracket = output.indexOf('{');
    const lastBracket = output.lastIndexOf('}');
    const json = output.slice(firstBracket, lastBracket + 1);
    return JSON.parse(json);
}


export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { imageId } = await req.json();
        if (!imageId) {
            return NextResponse.json({ error: 'No image ID provided' }, { status: 400 });
        }

        // Find the image file in uploads directory
        const uploadDir = path.join(process.cwd(), 'uploads');
        const files = fs.readdirSync(uploadDir);
        const imageFile = files.find(file => file.startsWith(imageId));

        if (!imageFile) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        const imagePath = path.join(uploadDir, imageFile);
        const mimeType = `image/${path.extname(imageFile).slice(1)}`;

        const imageParts = [
            fileToGenerativePart(imagePath, mimeType),
        ];

        const prompt = `Genarate title and description for the crime scence photo. Say it in first person POV. Output in this JSON schema
        {
            "title": string,
            "description": string
        }`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash", generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const generatedContent = await model.generateContent([prompt, ...imageParts]);
        const text = generatedContent.response.text()
        const json = text[0] !== '{' ? parseOutput(text) : JSON.parse(text);
        if (!json) {
            return NextResponse.json({ error: 'Failed to parse generated content' }, { status: 500 });
        }

        return NextResponse.json(json);

    } catch (error) {
        console.error('Generation error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
