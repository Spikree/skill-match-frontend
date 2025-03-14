import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Send, MoreVertical, Copy, Check } from "lucide-react";
import { socket } from "../../utils/socket";
import { motion } from "framer-motion";

// Type definition for messages
type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  chatId?: string;
};

const ChatRoom = () => {
  const { id: chatId } = useParams<{ id: string }>();
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isUserActive, setIsUserActive] = useState<boolean>(false);
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});

  const currentUser = localStorage.getItem("userId");
  const userId = currentUser;
  const actualChatId = userId && chatId ? [userId, chatId].sort().join("_") : "";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!chatId) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/message/getMessages/${chatId}`
      );
      setMessages(response.data.messages);
      setError(null);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = () => {
    if (!isTyping && actualChatId) {
      socket.emit("typing", {
        senderId: userId,
        receiverId: chatId,
        chatId: actualChatId
      });
      setIsTyping(true);
    }

    // Clear any existing timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    // Set a new timer to stop typing after 2 seconds of inactivity
    typingTimerRef.current = setTimeout(() => {
      if (actualChatId) {
        socket.emit("stopTyping", {
          senderId: userId,
          receiverId: chatId,
          chatId: actualChatId
        });
        setIsTyping(false);
      }
    }, 200);
  };

  // Setup socket connection
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (userId) {
      // Store the userId in socket's auth object for reconnection
      socket.auth = { userId };
      
      // Join personal room and chat room
      socket.emit("join", userId);
      
      if (actualChatId) {
        socket.emit("joinChat", actualChatId);
      }
      
      // Set active status
      socket.emit("setActiveStatus", { userId });
    }

    // Fetch initial messages
    fetchMessages();

    // Clear existing listeners to prevent duplicates
    socket.off("newMessage");
    socket.off("userActiveStatus");
    socket.off("userTyping");

    // Listen for new messages
    socket.on("newMessage", (newMsg) => {
      // Only add message if it belongs to the current chat
      if (
        (newMsg.senderId === userId && newMsg.receiverId === chatId) ||
        (newMsg.senderId === chatId && newMsg.receiverId === userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMsg]);
      }
    });

    // Listen for active status
    socket.on("userActiveStatus", (data) => {
      if (data.userId === chatId) {
        setIsUserActive(data.isActive);
      }
    });

    // Listen for typing indicators
    socket.on("userTyping", (data) => {
      if (data.chatId === actualChatId && data.senderId !== userId) {
        setTypingUser(data.isTyping ? data.senderId : null);
      }
    });

    // Cleanup function
    return () => {
      socket.off("newMessage");
      socket.off("userActiveStatus");
      socket.off("userTyping");
      
      // Clear any pending timers
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [chatId, userId, actualChatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() || !chatId) return;

    try {
      const response = await axiosInstance.post(
        `/message/sendMessage/${chatId}`,
        { text }
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        response.data.newMessage,
      ]);

      setText(""); // Clear input
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // Function to detect URLs in text
  const detectUrls = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  // Function to handle copying a link
  const copyToClipboard = (link: string, msgId: string) => {
    navigator.clipboard.writeText(link).then(() => {
      // Set copied state for this specific link
      setCopiedLinks({ ...copiedLinks, [`${msgId}-${link}`]: true });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedLinks({ ...copiedLinks, [`${msgId}-${link}`]: false });
      }, 2000);
    });
  };
  
  // Function to render message text with URL detection
  const renderMessageText = (message: Message) => {
    const urls = detectUrls(message.text);
    
    if (urls.length === 0) {
      return <p className="break-words text-base leading-relaxed">{message.text}</p>;
    }
    
    // Replace URLs with placeholders for splitting
    let textWithPlaceholders = message.text;
    const urlMap: Record<string, string> = {};
    
    urls.forEach((url, index) => {
      const placeholder = `__URL_${index}__`;
      textWithPlaceholders = textWithPlaceholders.replace(url, placeholder);
      urlMap[placeholder] = url;
    });
    
    // Split by placeholders
    const parts = textWithPlaceholders.split(/(__URL_\d+__)/);
    
    return (
      <div className="space-y-2">
        <p className="break-words text-base leading-relaxed">
          {parts.map((part, index) => {
            if (urlMap[part]) {
              return (
                <span key={index} className="text-blue-400 hover:underline">
                  <a href={urlMap[part]} target="_blank" rel="noopener noreferrer">
                    {urlMap[part]}
                  </a>
                </span>
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </p>
        
        {urls.map((url, index) => (
          <div 
            key={index} 
            className="mt-2 bg-gray-100 dark:bg-gray-800 rounded-md p-2 flex justify-between items-center"
          >
            <div className="truncate flex-1 text-sm text-gray-700 dark:text-gray-300">
              {url}
            </div>
            <button
              onClick={() => copyToClipboard(url, message._id)}
              className="ml-2 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Copy link"
            >
              {copiedLinks[`${message._id}-${url}`] ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} className="text-gray-500" />
              )}
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex items-center justify-center w-full bg-gradient-to-b from-blue-50 to-gray-100 p-4 overflow-y-auto">
      <div className="flex flex-col w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl bg-white overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-800">Chat Room</h2>
              <p className="text-xs text-gray-500">
                {isUserActive ? (
                  <div className="text-green-500">Online</div>
                ) : (
                  <div className="text-gray-500">Offline</div>
                )}
              </p>
            </div>
          </div>
          <button className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
          {loading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading messages...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="font-medium">{error}</p>
              <button
                onClick={fetchMessages}
                className="mt-2 text-sm text-blue-500 hover:text-blue-700"
              >
                Try again
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center max-w-sm">
                <p className="text-gray-500 mb-2">No messages yet.</p>
                <p className="text-gray-400 text-sm">
                  Start the conversation by sending a message below.
                </p>
              </div>
            </div>
          ) : (
            Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date} className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                    {formatDate(msgs[0].createdAt)}
                  </div>
                </div>

                {msgs.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.senderId === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-sm p-4 rounded-2xl ${
                        msg.senderId === userId
                          ? "bg-blue-500 text-white rounded-br-none shadow-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
                      }`}
                    >
                      {renderMessageText(msg)}
                      <p
                        className={`text-xs mt-2 ${
                          msg.senderId === userId
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {typingUser && (
          <div className="flex items-center space-x-1 p-2 mx-6 my-2 bg-gray-200 rounded-2xl w-fit">
            <motion.div
              className="w-2.5 h-2.5 bg-gray-500 rounded-full"
              animate={{ y: [0, -3, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="w-2.5 h-2.5 bg-gray-500 rounded-full"
              animate={{ y: [0, -3, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-2.5 h-2.5 bg-gray-500 rounded-full"
              animate={{ y: [0, -3, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />
          </div>
        )}

        {/* Input Field */}
        <form onSubmit={sendMessage} className="p-4 border-t bg-white">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                handleTyping(); // Trigger typing indicator when user types
              }}
              className="flex-1 border border-gray-300 p-3 rounded-full outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-base shadow-sm"
              placeholder="Type a message..."
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors disabled:bg-blue-300 shadow-md"
              disabled={!text.trim() || loading}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;