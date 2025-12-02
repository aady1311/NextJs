import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { databases } from "@/src/models/client/config";
import { db, notificationCollection } from "@/src/models/name";
import { ID, Query } from "appwrite";

export interface Notification {
    $id: string;
    type: 'tag' | 'upvote' | 'answer' | 'comment';
    message: string;
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    relatedId?: string; // question/answer/comment ID
    isRead: boolean;
    $createdAt: string;
}

interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;

    fetchNotifications(userId: string): Promise<void>;
    markAsRead(notificationId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
    createNotification(notification: Omit<Notification, '$id' | '$createdAt' | 'isRead'>): Promise<void>;
}

export const useNotificationStore = create<NotificationStore>()(
    immer((set, get) => ({
        notifications: [],
        unreadCount: 0,
        loading: false,

        async fetchNotifications(userId: string) {
            set({ loading: true });
            try {
                const response = await databases.listDocuments(
                    db,
                    notificationCollection,
                    [
                        Query.equal('toUserId', userId),
                        Query.orderDesc('$createdAt'),
                        Query.limit(50)
                    ]
                );
                
                const notifications = response.documents as Notification[];
                const unreadCount = notifications.filter(n => !n.isRead).length;
                
                set({ 
                    notifications,
                    unreadCount,
                    loading: false 
                });
            } catch (error) {
                console.error('Error fetching notifications:', error);
                // If collection doesn't exist, just set empty state
                set({ 
                    notifications: [],
                    unreadCount: 0,
                    loading: false 
                });
            }
        },

        async markAsRead(notificationId: string) {
            try {
                await databases.updateDocument(
                    db,
                    notificationCollection,
                    notificationId,
                    { isRead: true }
                );
                
                set((state) => {
                    const notification = state.notifications.find(n => n.$id === notificationId);
                    if (notification && !notification.isRead) {
                        notification.isRead = true;
                        state.unreadCount = Math.max(0, state.unreadCount - 1);
                    }
                });
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        },

        async markAllAsRead(userId: string) {
            try {
                const { notifications } = get();
                const unreadNotifications = notifications.filter(n => !n.isRead);
                
                await Promise.all(
                    unreadNotifications.map(notification =>
                        databases.updateDocument(
                            db,
                            notificationCollection,
                            notification.$id,
                            { isRead: true }
                        )
                    )
                );
                
                set((state) => {
                    state.notifications.forEach(n => n.isRead = true);
                    state.unreadCount = 0;
                });
            } catch (error) {
                console.error('Error marking all notifications as read:', error);
            }
        },

        async createNotification(notification: Omit<Notification, '$id' | '$createdAt' | 'isRead'>) {
            try {
                await databases.createDocument(
                    db,
                    notificationCollection,
                    ID.unique(),
                    {
                        ...notification,
                        isRead: false
                    }
                );
            } catch (error) {
                console.error('Error creating notification:', error);
                // Silently fail if collection doesn't exist yet
            }
        }
    }))
);