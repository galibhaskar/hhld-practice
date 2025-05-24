import React, { useEffect } from "react";
import { useUsersStore } from "../../zustand/useUsersStore";
import { useChatReceiverStore } from "../../zustand/useChatReceiverStore";
import { useAuthStore } from "../../zustand/useAuthStore";
import { useChatMessagesStore } from "../../zustand/useChatMessagesStore";
import axios from "axios";
import { BACKEND_DOMAIN } from "../../config.js";

const ChatUsers = () => {
  const { users } = useUsersStore();

  const { authName } = useAuthStore();

  const { receiver, updateChatReceiver } = useChatReceiverStore();

  const { updateChatMsgs, clearMsgs } = useChatMessagesStore();

  useEffect(() => {
    clearMsgs();
    
    getChatMessages();
  }, [receiver]);

  const getChatMessages = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_DOMAIN}/msgs?sender=${authName}&receiver=${receiver}`
      );

      updateChatMsgs(response.data);

      console.log("messages:", response.data);
    } catch (error) {
      console.log("error in fetching the messages:", error.message);
    }
  };

  return (
    <div>
      {users.map((user, index) => (
        <div
          key={index}
          className={`rounded-xl m-3 p-5 ${
            user.username == receiver ? "bg-slate-800 text-white" : "bg-slate-400"
          }`}
          onClick={() => updateChatReceiver(user.username)}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default ChatUsers;
