import { useState, useEffect } from "react";
import { notificationAPI } from "../services/api";
import { 
  Bell, 
  X, 
  Settings,
  Package,
  Trash2,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Notification {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  product?: any;
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox");

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationAPI.getAll();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getInitials = (title: string) => {
    return title.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-gradient-to-br from-red-400 to-red-600';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-400 to-orange-500';
      case 'success':
        return 'bg-gradient-to-br from-green-400 to-emerald-600';
      default:
        return 'bg-gradient-to-br from-blue-400 to-indigo-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getNotificationAction = (type: string) => {
    switch (type) {
      case 'error':
        return 'Out of stock';
      case 'warning':
        return 'Low stock alert';
      case 'success':
        return 'New product';
      default:
        return 'Update';
    }
  };

  if (!isOpen) return null;

  const inboxNotifications = notifications.filter(n => !n.read);
  const generalNotifications = notifications.filter(n => n.read);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/10 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div className="fixed right-4 top-20 w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-in slide-in-from-top-4 duration-300">
        <div className="flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Mark all as read
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-6 pt-3 border-b">
              <TabsList className="w-full bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value="inbox" 
                  className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-3 font-medium"
                >
                  Inbox
                  {inboxNotifications.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                      {inboxNotifications.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="general"
                  className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-3 font-medium"
                >
                  General
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1">
              <TabsContent value="inbox" className="m-0 mt-0">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full" />
                  </div>
                ) : inboxNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                    <Bell className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {inboxNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => {
                          setSelectedNotification(notification);
                          handleMarkAsRead(notification.id);
                        }}
                        className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className={`w-12 h-12 rounded-full ${getAvatarColor(notification.type)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                            <span className="text-white font-semibold text-sm">
                              {getInitials(notification.title)}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-1">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                              <span>{formatTimestamp(notification.timestamp)}</span>
                              <span>•</span>
                              <span className="text-blue-600">{getNotificationAction(notification.type)}</span>
                            </div>

                            {/* Product Preview */}
                            {notification.product && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 group-hover:border-gray-300 transition-colors">
                                <div className="flex items-center gap-3">
                                  {notification.product.image && (
                                    <img 
                                      src={notification.product.image}
                                      alt={notification.product.name}
                                      className="w-10 h-10 rounded-lg object-cover"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {notification.product.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {notification.product.sku} • Stock: {notification.product.stock}
                                    </p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="general" className="m-0 mt-0">
                {generalNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                    <Bell className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">No read notifications</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {generalNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => setSelectedNotification(notification)}
                        className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors opacity-60 hover:opacity-100"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-full ${getAvatarColor(notification.type)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                            <span className="text-white font-semibold text-sm">
                              {getInitials(notification.title)}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>

      {/* Detailed Modal */}
      {selectedNotification && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-[60] animate-in fade-in duration-200"
            onClick={() => setSelectedNotification(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[70] animate-in zoom-in-95 duration-200 m-4">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-full ${getAvatarColor(selectedNotification.type)} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-lg">
                    {getInitials(selectedNotification.title)}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedNotification.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formatTimestamp(selectedNotification.timestamp)} • {getNotificationAction(selectedNotification.type)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Message */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {selectedNotification.message}
              </p>

              {/* Product Details */}
              {selectedNotification.product && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    {selectedNotification.product.image && (
                      <img 
                        src={selectedNotification.product.image}
                        alt={selectedNotification.product.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {selectedNotification.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedNotification.product.category}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-500 text-xs mb-1">SKU</p>
                      <p className="font-semibold text-gray-900">
                        {selectedNotification.product.sku}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-500 text-xs mb-1">Stock</p>
                      <p className={`font-bold ${
                        selectedNotification.product.stock === 0 ? 'text-red-600' :
                        selectedNotification.product.stock < 15 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {selectedNotification.product.stock} units
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-500 text-xs mb-1">Price</p>
                      <p className="font-semibold text-gray-900">
                        ${selectedNotification.product.price}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-500 text-xs mb-1">Status</p>
                      <p className="font-semibold text-gray-900">
                        {selectedNotification.product.status}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedNotification(null)}
                  variant="outline"
                  className="flex-1 h-11"
                >
                  Close
                </Button>
                {selectedNotification.product && (
                  <Button
                    onClick={() => {
                      setSelectedNotification(null);
                      onClose();
                      // Navigate to product
                    }}
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Product
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NotificationPanel;