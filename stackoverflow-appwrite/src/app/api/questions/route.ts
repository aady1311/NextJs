import { databases, users } from "@/src/models/server/config";
import { db, questionCollection } from "@/src/models/name";
import { UserPrefs } from "@/src/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        const { title, content, tags, authorId, attachmentId } = await request.json();

        if (!title || !content || !tags || !authorId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Process tags - convert comma-separated string to array
        const tagsArray = tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);

        const response = await databases.createDocument(
            db,
            questionCollection,
            ID.unique(),
            {
                title,
                content,
                authorId,
                tags: tagsArray,
                attachmentId: attachmentId || null,
            }
        );

        // Increase author reputation
        const prefs = await users.getPrefs<UserPrefs>(authorId);
        await users.updatePrefs(authorId, {
            reputation: Number(prefs.reputation || 0) + 5
        });

        return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
        console.error("Error creating question:", error);
        return NextResponse.json(
            { error: error?.message || "Error creating question" },
            { status: error?.status || error?.code || 500 }
        );
    }
}