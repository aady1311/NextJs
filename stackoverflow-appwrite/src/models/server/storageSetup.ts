import { Permission } from "node-appwrite";
import { questionAttachmentBucket } from "../name";
import { storage } from "./config";

export default async function getOrCreateStorage() {
    try {
        await storage.getBucket(questionAttachmentBucket);
        console.log("Storage Connected");
        return { success: true, message: "Storage connected" };
    } catch (error) {
        try {
            await storage.createBucket(
                questionAttachmentBucket,
                questionAttachmentBucket,
                [
                    Permission.create("users"),
                    Permission.read("any"),
                    Permission.read("users"),
                    Permission.update("users"),
                    Permission.delete("users"),
                ],
                false,
                undefined,
                undefined,
                ["jpg", "png", "gif", "jpeg", "webp", "heic"]
            );

            console.log("Storage Created");
            return { success: true, message: "Storage created" };
        } catch (createError: any) {
            if (createError.code === 403 && createError.type === 'additional_resource_not_allowed') {
                console.log("Storage bucket limit reached - continuing without file uploads");
                return { success: false, message: "Storage limit reached - file uploads disabled" };
            }
            console.error("Error creating storage:", createError);
            return { success: false, message: "Storage setup failed" };
        }
    }
}
