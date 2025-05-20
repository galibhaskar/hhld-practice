"use client";
import axios, { HttpStatusCode } from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const Auth = () => {
  const router = useRouter();

  const [userName, setUserName] = useState("");

  const [password, setPassword] = useState("");

  const AUTH_DOMAIN = "http://localhost:4000/auth";

  const signup = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        username: userName,
        password: password,
      };

      const response = await axios.post(`${AUTH_DOMAIN}/signup`, payload, {
        withCredentials: true,
      });

      if (response.status == HttpStatusCode.Created) {
        alert("User Created");

        router.replace("/chat");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const login = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        username: userName,
        password: password,
      };

      const response = await axios.post(`${AUTH_DOMAIN}/login`, payload, {
        withCredentials: true,
      });

      if (response.status == HttpStatusCode.Created) {
        alert("login success");

        router.replace("/chat");
      }
    } catch (error) {
      alert("login failed");
    }
  };

  return (
    <>
      {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="flex">
              <button
                onClick={signup}
                type="submit"
                className="flex w-1/2 m-3 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
              <button
                type="submit"
                onClick={login}
                className="flex w-1/2 m-3 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
