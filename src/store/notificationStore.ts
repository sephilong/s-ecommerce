
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'order' | 'marketing' | 'system' | 'payout' | 'alert';
export type NotificationStatus = 'unread' | 'read';

export interface Notification {
  id: string;
  userId: string; // 'admin', 'system', or user email
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  link?: string;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'status' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  clearNotifications: (userId: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [
        {
          id: 'initial-1',
          userId: 'admin',
          title: 'Chào mừng Admin',
          message: 'Hệ thống thông báo đa kênh S-Com Hub đã sẵn sàng vận hành.',
          type: 'system',
          status: 'unread',
          createdAt: new Date().toISOString()
        }
      ],
      addNotification: (n) => set((state) => ({
        notifications: [
          {
            ...n,
            id: `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            status: 'unread',
            createdAt: new Date().toISOString()
          },
          ...state.notifications
        ].slice(0, 100) // Keep last 100
      })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, status: 'read' } : n)
      })),
      markAllAsRead: (userId) => set((state) => ({
        notifications: state.notifications.map(n => n.userId === userId ? { ...n, status: 'read' } : n)
      })),
      clearNotifications: (userId) => set((state) => ({
        notifications: state.notifications.filter(n => n.userId !== userId)
      }))
    }),
    { name: 'scomhub-notifications-v1' }
  )
);
