"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Loader2, Check, CheckCheck } from "lucide-react";
import { notificationApi, type NotificationResponse } from "~/lib/api-client";
import { useRouter } from "next/navigation";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const [notifs, count] = await Promise.all([
        notificationApi.getMyNotifications(),
        notificationApi.getUnreadCount()
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (err) {
      console.error("Lỗi khi tải thông báo", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Could poll every minute, but just load once for now
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) { }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) { }
  };

  const handleNotificationClick = (notif: NotificationResponse) => {
    if (!notif.isRead) {
      handleMarkAsRead(notif.id);
    }
    setIsOpen(false);
    // Navigate based on referenceType if applicable
    if (notif.referenceType === "CLASSROOM" && notif.referenceId) {
      router.push(`/classrooms/${notif.referenceId}`);
    } else if (notif.referenceType === "STUDY_SET" && notif.referenceId) {
      router.push(`/study-sets/${notif.referenceId}`);
    } else if (notif.referenceType === "ASSIGNMENT" && notif.referenceId) {
      router.push(`/assignment/${notif.referenceId}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
            <h3 className="font-semibold">Thông báo</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                <CheckCheck size={14} /> Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {loading && notifications.length === 0 ? (
               <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Bạn chưa có thông báo nào.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition flex gap-3 ${!notif.isRead ? 'bg-primary/5' : ''}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="mt-1 flex-shrink-0">
                       <div className={`w-2 h-2 rounded-full ${!notif.isRead ? 'bg-primary' : 'bg-transparent'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${!notif.isRead ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.content}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-2">
                        {new Date(notif.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
