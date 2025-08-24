import React, { useState, useEffect } from "react";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.trim();

const Chat = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState({});
  const [chatMessages, setChatMessages] = useState({});
  const [currentChat, setCurrentChat] = useState(null);
  const [text, setText] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

  const token = localStorage.getItem("token"); // ✅ JWT token

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${VITE_BACKEND_URL}api/users/getAllUser`, axiosConfig);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch chats and messages
  useEffect(() => {
    const fetchChatsAndMessages = async () => {
      for (let user of users) {
        if (user._id === currentUser._id) continue;

        try {
          const chatRes = await axios.get(
            `${VITE_BACKEND_URL}api/chats/find/${currentUser._id}/${user._id}`,
            axiosConfig
          );
          const chat = chatRes.data;
          if (!chat) continue;

          setChats((prev) => ({ ...prev, [chat._id]: chat }));

          const msgRes = await axios.get(
            `${VITE_BACKEND_URL}api/messages/${chat._id}`,
            axiosConfig
          );
          const msgs = msgRes.data.reverse();
          setChatMessages((prev) => ({ ...prev, [chat._id]: msgs }));

          const unread = msgs.filter(
            (m) =>
              !m.readBy.includes(currentUser._id) &&
              m.senderId !== currentUser._id
          ).length;
          setUnreadCounts((prev) => ({ ...prev, [chat._id]: unread }));
        } catch (err) {
          console.error(err);
        }
      }
    };
    if (users.length) fetchChatsAndMessages();
  }, [users, currentUser]);

  // Select chat
  const selectChat = async (user) => {
    try {
      let chat = Object.values(chats).find(
        (c) => c.members.includes(user._id) && c.members.includes(currentUser._id)
      );

      if (!chat) {
        const res = await axios.post(
          `${VITE_BACKEND_URL}api/chats`,
          { members: [currentUser._id, user._id] },
          axiosConfig
        );
        chat = res.data;
        setChats((prev) => ({ ...prev, [chat._id]: chat }));
      }

      setCurrentChat(chat);

      const msgRes = await axios.get(
        `${VITE_BACKEND_URL}api/messages/${chat._id}`,
        axiosConfig
      );
      setChatMessages((prev) => ({ ...prev, [chat._id]: msgRes.data.reverse() }));

      await axios.post(
        `${VITE_BACKEND_URL}api/messages/markAsRead`,
        { chatId: chat._id, userId: currentUser._id },
        axiosConfig
      );

      setUnreadCounts((prev) => ({ ...prev, [chat._id]: 0 }));
    } catch (err) {
      console.error(err);
    }
  };

  // Send message
  const handleSend = async () => {
    if (!text.trim() || !currentChat) return;
    try {
      const res = await axios.post(
        `${VITE_BACKEND_URL}api/messages`,
        { chatId: currentChat._id, senderId: currentUser._id, text },
        axiosConfig
      );

      setChatMessages((prev) => ({
        ...prev,
        [currentChat._id]: [res.data, ...(prev[currentChat._id] || [])],
      }));
      setText("");
      setUnreadCounts((prev) => ({ ...prev, [currentChat._id]: 0 }));
    } catch (err) {
      console.error(err);
    }
  };

  // Sidebar users
  const sortedUsers = users
    .filter((u) => u._id !== currentUser._id)
    .map((u) => {
      const chat = Object.values(chats).find(
        (c) => c.members.includes(u._id) && c.members.includes(currentUser._id)
      );
      const chatId = chat?._id;
      const lastMessage =
        chatId && chatMessages[chatId] ? chatMessages[chatId][0] : null;
      return { user: u, chatId, lastMessage };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt) : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt) : 0;
      return timeB - timeA;
    });

  return (
    <div className="flex lg:ml-30 h-screen bg-white">
      {/* Sidebar */}
      <div className="w-1/3 md:w-1/4 border-r overflow-y-auto">
        <h2 className="p-4 font-bold border-b text-lg">Messages</h2>
        {sortedUsers.map(({ user: u, chatId }) => {
          const unread = chatId ? unreadCounts[chatId] || 0 : 0;
          return (
            <div
              key={u._id}
              onClick={() => selectChat(u)}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 border-b ${
                currentChat?._id === chatId ? "bg-gray-200" : ""
              }`}
            >
              <img
                src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}`}
                alt={u.username}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div className="flex-1">
                <p className="font-medium">{u.username}</p>
                <p className="text-xs text-gray-500 truncate">
                  {chatMessages[chatId]?.[0]?.text || "No messages yet"}
                </p>
              </div>
              {unread > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unread}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <div className="flex items-center p-3 border-b">
              <img
                src={
                  currentChat.avatar ||
                  `https://ui-avatars.com/api/?name=${
                    users.find((u) => currentChat.members.includes(u._id) && u._id !== currentUser._id)?.username
                  }`
                }
                alt="chat user"
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="font-semibold">
                  {
                    users.find((u) => currentChat.members.includes(u._id) && u._id !== currentUser._id)
                      ?.username
                  }
                </h3>
                <p className="text-sm text-gray-500">Chat</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse bg-gray-50">
              {(chatMessages[currentChat._id] || []).map((m) => (
                <div
                  key={m._id}
                  className={`mb-2 ${m.senderId === currentUser._id ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block px-3 py-2 rounded-2xl max-w-xs ${
                      m.senderId === currentUser._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {m.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 border-t flex">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 border p-2 rounded-full focus:outline-none"
                placeholder="Type a message..."
              />
              <button onClick={handleSend} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
