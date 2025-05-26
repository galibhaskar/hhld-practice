"use client";
import axios from "axios";
import { Auth } from "./auth";
import { AUTH_DOMAIN } from "../app/config.js";
import { useAuthStore } from "../app/zustand/useAuthStore.js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  
  const { updateAuthName } = useAuthStore();

  const getCurrentUserInfo = async () => {
    try {
      const response = await axios.get(`${AUTH_DOMAIN}/users/currentUser`, {
        withCredentials: true,
      });

      if (response.status == 200) {
        // console.log(response.data);

        updateAuthName(response.data[0].username);

        router.replace("/chat");
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.log("error occurred in get current user info", error.message);
    }
  };

  useEffect(() => {
    getCurrentUserInfo();
  }, []);

  return <Auth />;
}
