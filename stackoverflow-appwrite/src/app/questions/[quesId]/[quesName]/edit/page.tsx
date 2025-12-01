import { db, questionCollection } from "@/src/models/name";
import { databases } from "@/src/models/server/config";
import React from "react";
import EditQues from "./EditQues";

const Page = async ({ params }: { params: Promise<{ quesId: string; quesName: string }> }) => {
    const { quesId } = await params;
    const question = await databases.getDocument(db, questionCollection, quesId);

    return <EditQues question={question} />;
};

export default Page;
