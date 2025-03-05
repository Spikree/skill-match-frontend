import { useEffect, useState, useRef } from "react";
import {  useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Send, MoreVertical } from "lucide-react";
import { socket } from "../../utils/socket.ts";

// Type definition for messages
type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const ChatRoom = () => {
  const { id: chatId } = useParams<{ id: string }>();
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current user ID from localStorage
  const currentUser = localStorage.getItem("userId");

  // Fallback to hardcoded ID if localStorage is empty
  const userId = currentUser;

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

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  
    fetchMessages();
  
    socket.on("newMessage", (data) => {
      console.log("Received message:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  
    return () => {
      socket.off("newMessage");
    };
  }, [chatId]);
  
  useEffect(() => {
    if (userId) {
      socket.emit("join", userId);
    }
    scrollToBottom();
  }, [messages, userId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() || !chatId) return;

    try {
      const response = await axiosInstance.post(
        `/message/sendMessage/${chatId}`,
        { text }
      );
      setMessages((prevMessages) => [...prevMessages, response.data.newMessage]);

      // socket.emit("message", { user: userId, text: text });
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
    <div className="flex items-center justify-center w-full  bg-gradient-to-b from-blue-50 to-gray-100 p-4 overflow-y-auto">
      <div className="flex flex-col w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl bg-white overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-800">Chat Room</h2>
              <p className="text-xs text-gray-500">
                {loading ? "Connecting..." : "Active now"}
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
                      <p className="break-words text-base leading-relaxed">
                        {msg.text}
                      </p>
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

        {/* Input Field */}
        <form onSubmit={sendMessage} className="p-4 border-t bg-white">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
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
