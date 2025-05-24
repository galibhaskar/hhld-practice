"use client";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuthStore } from "../zustand/useAuthStore";
import { useUsersStore } from "../zustand/useUsersStore";
import { useChatReceiverStore } from "../zustand/useChatReceiverStore";
import { useChatMessagesStore } from "../zustand/useChatMessagesStore";
import axios from "axios";
import ChatUsers from "../_components/chatUsers/page.jsx";
import { AUTH_DOMAIN, BACKEND_DOMAIN } from "../config.js";

const Chat = () => {
  // const [messages, setMessages] = useState([]);

  const [msg, setMsg] = useState("");

  const [socket, setSocket] = useState(null);

  const { authName } = useAuthStore();

  const { updateUsers } = useUsersStore();

  const { receiver, updateChatReceiver } = useChatReceiverStore();

  const { chatMsgs, updateChatMsgs } = useChatMessagesStore();

  const createSocket = () => {
    console.log("create socket function");

    const newSocket = io(BACKEND_DOMAIN, {
      query: {
        username: authName,
      },
    });

    newSocket.on("chat msg", (msg) => {
      console.log(msg);

      updateChatMsgs([...chatMsgs, msg]);
    });

    setSocket((prevSocket) => {
      if (prevSocket) {
        prevSocket.disconnect();
      }

      return newSocket;
    });
  };

  useEffect(() => {
    // Establish WebSocket connection
    createSocket();

    getUserData();

    return () => {
      console.log("clean up");

      if (socket) {
        socket.disconnect();

        setSocket(null);
      }
    };
  }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get(`${AUTH_DOMAIN}/users`, {
        withCredentials: true,
      });

      if (response.status == 200) {
        const users = response.data;

        console.log(users);

        updateUsers(users);

        if (users.length !== 0) {
          updateChatReceiver(users[0].username);
        }
      }
    } catch (error) {
      console.log("error in chat:" + error.message);
    }
  };

  const sendMsg = (e) => {
    e.preventDefault();

    if (socket) {
      const msgToBeSent = {
        text: msg,
        sender: authName,
        receiver: receiver,
      };

      // send message with event 'chat msg' and receive response for ack.
      socket.emit("chat msg", msgToBeSent, (res) => {
        console.log("response from server:" + res);
      });

      updateChatMsgs([...chatMsgs, msgToBeSent]);

      setMsg("");
    }
  };

  const handleChange = (event) => {
    setMsg(event.target.value);
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();

      setSocket(null);

      console.log("disconnected");
    }
  };

  console.log("chatMsgs:", chatMsgs);

  return (
    <div className="h-screen flex divide-x-4">
      <div className="w-1/5">
        <ChatUsers />
      </div>
      <div className="h-screen flex flex-col w-4/5">
        <div className="mx-auto h-1/5">
          {authName} is chatting with {receiver}
        </div>
        <div className="msgs-container h-3/5 overflow-scroll">
          {chatMsgs?.map((msg, index) => (
            <div
              key={index}
              className={`m-5 ${
                msg.sender == authName ? `text-right` : `text-left`
              }`}
            >
              <span
                className={`rounded-xl p-2 m-2 text-white border ${
                  msg.sender == authName ? "bg-blue-400" : "bg-green-400"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div>
          <form onSubmit={sendMsg} className="max-w-md mx-auto my-10">
            <div className="relative">
              <input
                type="text"
                value={msg}
                onChange={handleChange}
                placeholder="Type your text here"
                required
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg
bg-gray-50 focus:ring-blue-500 focus:border-blue-500
dark:bg-gray-700 dark:border-gray-600
dark:placeholder-gray-400 dark:text-white
dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />

              {socket == null ? (
                <button
                  type="button"
                  onClick={() => {
                    createSocket();
                  }}
                  className="text-white absolute end-2.5
bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4
focus:outline-none focus:ring-green-300 font-medium
rounded-lg text-sm px-4 py-2 dark:bg-green-600
dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  Connect
                </button>
              ) : (
                <div>
                  <button
                    type="submit"
                    className="text-white absolute end-30
bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4
focus:outline-none focus:ring-blue-300 font-medium
rounded-lg text-sm px-4 py-2 dark:bg-blue-600
dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Send
                  </button>

                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="text-white absolute end-2.5
bottom-2.5 bg-red-700 hover:bg-red-800 focus:ring-4
focus:outline-none focus:ring-red-300 font-medium
rounded-lg text-sm px-4 py-2 dark:bg-red-600
dark:hover:bg-red-700 dark:focus:ring-red-800"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
