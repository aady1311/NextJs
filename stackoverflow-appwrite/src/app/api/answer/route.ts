import { answerCollection, db } from "@/src/models/name";
import { databases, users } from "@/src/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/src/store/Auth";


export async function POST(resquest: NextRequest) {
    try {

        const { questionId, answer, authorId } = await resquest.json();
        const response = await databases.createDocument(db, answerCollection, ID.unique(), {
            content: answer,
            authorId: authorId,
            questionId: questionId
        })

        //Increase author reputation 
        const perfs = await users.getPrefs<UserPrefs>(authorId);
        await users.updatePrefs(authorId, {
            reputation: Number(perfs.reputation) + 1
        })
        return NextResponse.json(response, {
            status: 201
        })
    } catch (error: any) {

        return NextResponse.json(
            {
                error: error?.message || 'Error created answer'
            },
            {
                status: error?.status || error?.code || 500
            }
        )
    }
}



export async function DELETE(request: NextRequest) {
    try {
        const { answerId } = await request.json();
        const answer = await databases.getDocument(db, answerCollection, answerId);
        const response = await databases.deleteDocument(db, answerCollection, answerId);

        //decress author reputation
        const perfs = await users.getPrefs<UserPrefs>(answer.authorId);
        await users.updatePrefs(answer.authorId, {
            reputation: Number(perfs.reputation) - 1
        })
        return NextResponse.json(
            { data: response },
            {
                status: 200
            })

    } catch (error: any) {
        return NextResponse.json(
            {
                message: error?.message || 'Error deleting answer'
            },
            {
                status: error?.status || error?.code || 500
            }
        )
    }
}