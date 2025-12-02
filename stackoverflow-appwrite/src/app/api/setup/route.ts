import { NextResponse } from "next/server";
import getOrCreateDB from "@/src/models/server/dbSetup";
import getOrCreateStorage from "@/src/models/server/storageSetup";

export async function GET() {
  try {
    console.log("Starting database and storage setup...");
    
    const [dbResult, storageResult] = await Promise.all([
      getOrCreateDB(),
      getOrCreateStorage()
    ]);
    
    console.log("Setup completed");
    
    return NextResponse.json({ 
      success: true,
      message: storageResult.success 
        ? "Database and storage setup completed successfully" 
        : "Database setup completed (storage disabled due to plan limits)",
      details: {
        database: "Ready",
        storage: storageResult.success ? "Ready" : "Disabled (plan limit)",
        collections: ["questions", "answers", "comments", "votes"],
        note: storageResult.success ? undefined : "File uploads unavailable - upgrade plan to enable"
      }
    });
  } catch (error) {
    console.error("Setup error:", error);
    
    let errorMessage = "Failed to setup database and storage";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: "Please check your Appwrite configuration and try again"
      },
      { status: 500 }
    );
  }
}