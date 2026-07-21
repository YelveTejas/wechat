import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAccessToken } from "../config/axios";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [authChecked, setAuthChecked] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [notification,setNotification] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    api.post("/user/refresh")
      .then(({ data }) => {
        setAccessToken(data.token);
        setUser(data);
      })
      .catch(() => navigate("/"))
      .finally(() => setAuthChecked(true));
  }, [navigate]);

  useEffect(() => {
    const handleLogout = () => {
      setAccessToken(null);
      setUser(undefined);
      navigate("/");
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, authChecked, selectedChat, setSelectedChat, chats, setChats ,notification,setNotification}}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export { ChatProvider };
