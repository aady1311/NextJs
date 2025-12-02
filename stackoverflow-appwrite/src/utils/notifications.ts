import { useNotificationStore } from "@/src/store/Notification";

export const createTagNotification = async (
    fromUserId: string,
    fromUserName: string,
    toUserId: string,
    relatedId: string,
    contentType: 'question' | 'answer' | 'comment'
) => {
    const { createNotification } = useNotificationStore.getState();
    
    await createNotification({
        type: 'tag',
        message: `tagged you in a ${contentType}`,
        fromUserId,
        fromUserName,
        toUserId,
        relatedId
    });
};

export const createUpvoteNotification = async (
    fromUserId: string,
    fromUserName: string,
    toUserId: string,
    relatedId: string,
    contentType: 'question' | 'answer' | 'comment'
) => {
    const { createNotification } = useNotificationStore.getState();
    
    await createNotification({
        type: 'upvote',
        message: `upvoted your ${contentType}`,
        fromUserId,
        fromUserName,
        toUserId,
        relatedId
    });
};

export const createAnswerNotification = async (
    fromUserId: string,
    fromUserName: string,
    toUserId: string,
    questionId: string
) => {
    const { createNotification } = useNotificationStore.getState();
    
    await createNotification({
        type: 'answer',
        message: 'answered your question',
        fromUserId,
        fromUserName,
        toUserId,
        relatedId: questionId
    });
};

export const createCommentNotification = async (
    fromUserId: string,
    fromUserName: string,
    toUserId: string,
    relatedId: string,
    contentType: 'question' | 'answer'
) => {
    const { createNotification } = useNotificationStore.getState();
    
    await createNotification({
        type: 'comment',
        message: `commented on your ${contentType}`,
        fromUserId,
        fromUserName,
        toUserId,
        relatedId
    });
};

// Function to extract user mentions from text (e.g., @username or @email)
export const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+(?:\.\w+)*@?\w*\.?\w*)/g;
    const mentions: string[] = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
        mentions.push(match[1]);
    }
    
    return mentions;
};

// Function to find users by username or email for tagging
export const findUsersByMention = async (mentions: string[]) => {
    // This would need to be implemented based on your user search functionality
    // For now, returning empty array - you'll need to implement user search
    return [];
};