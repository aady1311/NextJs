import { databases } from "@/src/models/server/config";
import { db, notificationCollection } from "@/src/models/name";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Create notification collection
        await databases.createCollection(
            db,
            notificationCollection,
            "Notifications"
        );

        // Add attributes
        await databases.createStringAttribute(db, notificationCollection, "type", 50, true);
        await databases.createStringAttribute(db, notificationCollection, "message", 500, true);
        await databases.createStringAttribute(db, notificationCollection, "fromUserId", 50, true);
        await databases.createStringAttribute(db, notificationCollection, "fromUserName", 100, true);
        await databases.createStringAttribute(db, notificationCollection, "toUserId", 50, true);
        await databases.createStringAttribute(db, notificationCollection, "relatedId", 50, false);
        await databases.createBooleanAttribute(db, notificationCollection, "isRead", true, false);

        // Create indexes
        await databases.createIndex(db, notificationCollection, "toUserId_index", "key", ["toUserId"]);
        await databases.createIndex(db, notificationCollection, "isRead_index", "key", ["isRead"]);

        return NextResponse.json({
            success: true,
            message: "Notification collection created successfully"
        });

    } catch (error: any) {
        if (error.code === 409) {
            return NextResponse.json({
                success: true,
                message: "Notification collection already exists"
            });
        }

        console.error("Error creating notification collection:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to create notification collection"
        }, { status: 500 });
    }
}