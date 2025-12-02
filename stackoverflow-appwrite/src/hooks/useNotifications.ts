import { useCallback } from 'react';
import { useNotificationStore } from '@/src/store/Notification';

export const useNotifications = () => {
    const { createNotification } = useNotificationStore();

    // Extract mentions from text (@username or @email)
    const extractMentions = useCallback((text: string): string[] => {
        const mentionRegex = /@(\w+(?:\.\w+)*@?\w*\.?\w*)/g;
        const mentions: string[] = [];
        let match;
        
        while ((match = mentionRegex.exec(text)) !== null) {
            mentions.push(match[1]);
        }
        
        return mentions;
    }, []);

    // Create upvote notification
    const notifyUpvote = useCallback(async (
        fromUserId: string,
        fromUserName: string,
        toUserId: string,
        relatedId: string,
        contentType: 'question' | 'answer' | 'comment'
    ) => {
        if (fromUserId === toUserId) return; // Don't notify self
        
        await createNotification({
            type: 'upvote',
            message: `upvoted your ${contentType}`,
            fromUserId,
            fromUserName,
            toUserId,
            relatedId
        });
    }, [createNotification]);

    // Create answer notification
    const notifyAnswer = useCallback(async (
        fromUserId: string,
        fromUserName: string,
        toUserId: string,
        questionId: string
    ) => {
        if (fromUserId === toUserId) return; // Don't notify self
        
        await createNotification({
            type: 'answer',
            message: 'answered your question',
            fromUserId,
            fromUserName,
            toUserId,
            relatedId: questionId
        });
    }, [createNotification]);

    // Create comment notification
    const notifyComment = useCallback(async (
        fromUserId: string,
        fromUserName: string,
        toUserId: string,
        relatedId: string,
        contentType: 'question' | 'answer'
    ) => {
        if (fromUserId === toUserId) return; // Don't notify self
        
        await createNotification({
            type: 'comment',
            message: `commented on your ${contentType}`,
            fromUserId,
            fromUserName,
            toUserId,
            relatedId
        });
    }, [createNotification]);

    // Create tag notification
    const notifyTag = useCallback(async (
        fromUserId: string,
        fromUserName: string,
        toUserId: string,
        relatedId: string,
        contentType: 'question' | 'answer' | 'comment'
    ) => {
        if (fromUserId === toUserId) return; // Don't notify self
        
        await createNotification({
            type: 'tag',
            message: `tagged you in a ${contentType}`,
            fromUserId,
            fromUserName,
            toUserId,
            relatedId
        });
    }, [createNotification]);

    return {
        extractMentions,
        notifyUpvote,
        notifyAnswer,
        notifyComment,
        notifyTag
    };
};