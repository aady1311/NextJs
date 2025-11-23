import { NextResponse } from "next/server";
import getOrCreateDB from "@/src/models/server/dbSetup";
import getOrCreateStorage from "@/src/models/server/storageSetup";

export async function GET() {
  try {
    await Promise.all([
      getOrCreateDB(),
      getOrCreateStorage()
    ]);
    
    return NextResponse.json({ 
      message: "Database and storage setup completed successfully" 
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to setup database and storage" },
      { status: 500 }
    );
  }
}