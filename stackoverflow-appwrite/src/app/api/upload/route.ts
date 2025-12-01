import { storage } from "@/src/models/server/config";
import { questionAttachmentBucket } from "@/src/models/name";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const authorId = formData.get('authorId') as string;

        if (!file || !authorId) {
            return NextResponse.json(
                { error: "File and authorId are required" },
                { status: 400 }
            );
        }

        // Create file using InputFile for Appwrite
        const response = await storage.createFile(
            questionAttachmentBucket,
            ID.unique(),
            file,
            [
                // Add permissions if needed
            ]
        );

        return NextResponse.json({ 
            fileId: response.$id,
            fileName: file.name,
            fileSize: file.size
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: error?.message || "Upload failed" },
            { status: 500 }
        );
    }
}