// components/AuthModal.js
"use client";
import React, { useState } from "react";
import { X, Twitter, Mail } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const AuthModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMessage(error.message);
    else setMessage("Check your email for the login link!");
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Check your email for the verification link!");
    setLoading(false);
  };

  const handleTwitterSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "twitter",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md m-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Join DevStacks
        </h2>

        <div className="space-y-4">
          <button
            onClick={handleTwitterSignIn}
            className="w-full flex items-center justify-center py-3 px-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            <Twitter className="h-5 w-5 mr-2" />
            Continue with Twitter
          </button>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </div>
          </form>
          {message && (
            <p className="text-center text-sm text-red-500 mt-4">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
