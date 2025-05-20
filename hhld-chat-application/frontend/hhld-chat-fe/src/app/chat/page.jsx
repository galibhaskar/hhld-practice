"use client";
import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([]);

  const [msg, setMsg] = useState("");

  const [socket, setSocket] = useState(null);

  const createSocket = useCallback(() => {
    console.log("create socket function");

    const newSocket = io("http://localhost:8080", {
      query: {
        username: "bhask",
      },
    });

    newSocket.on("chat msg", (msg) => {
      setMessages((prevMsgs) => [
        ...prevMsgs,
        { text: msg, sentByCurrUser: false },
      ]);
    });

    setSocket((prevSocket) => {
      if (prevSocket) {
        prevSocket.disconnect();
      }

      return newSocket;
    });
  }, []);

  useEffect(() => {
    // Establish WebSocket connection
    createSocket();

    return () => {
      console.log("clean up");

      if (socket) {
        socket.disconnect();

        setSocket(null);
      }
    };
  }, []);

  const sendMsg = (e) => {
    e.preventDefault();

    if (socket) {
      const msgToBeSent = {
        text: msg,
        sender: "bhask",
        receiver: "keerthi",
      };

      // send message with event 'chat msg' and receive response for ack.
      socket.emit("chat msg", msgToBeSent, (res) => {
        console.log("response from server:" + res);
      });

      setMessages((prevMsgs) => [
        ...prevMsgs,
        { text: msgToBeSent, sentByCurrUser: true },
      ]);

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

  return (
    <div className="h-screen flex flex-col">
      <div className="msgs-container h-4/5 overflow-scroll">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`m-5 ${msg.sentByCurrUser ? `text-right` : `text-left`}`}
          >
            {msg.text.text}
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
  );
};

export default Chat;
