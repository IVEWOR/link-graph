// src/components/CreateItemModal.jsx
"use client";

import { useState } from "react";

export default function CreateItemModal({
  initialTitle = "",
  onClose,
  onCreated,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState("Other");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleImageChange = (e) => {
    setImageFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      let imageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", UPLOAD_PRESET);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
          { method: "POST", body: formData }
        );
        const cloudData = await cloudRes.json();
        if (!cloudRes.ok) throw new Error("Cloudinary upload failed");
        imageUrl = cloudData.secure_url;
      }

      const apiRes = await fetch("/api/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          linkUrl: linkUrl.trim() || null,
          imageUrl,
        }),
      });
      const apiData = await apiRes.json();
      if (!apiRes.ok) throw new Error(apiData.error || "Failed to create item");

      onCreated(apiData.item);
      onClose();
    } catch (err) {
      console.error("Error creating item:", err);
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-black border-4 border-cyan-400 p-6 rounded-lg pixel-text text-green-400 retro-pulse max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 pixel-text">
          CREATE_NEW_ITEM
        </h2>

        {errorMsg && <p className="text-red-500 mb-2 pixel-text">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-1 pixel-text">
              TITLE <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Elixir"
              required
              className="w-full px-3 py-2 border-2 border-green-400 bg-black text-green-400 pixel-text focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block mb-1 pixel-text">
              CATEGORY
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border-2 border-green-400 bg-black text-green-400 pixel-text focus:outline-none"
            >
              <option>Other</option>
              <option>Language</option>
              <option>Framework</option>
              <option>Library</option>
              <option>Tool</option>
              <option>Editor</option>
              <option>Runtime</option>
            </select>
          </div>

          {/* Link URL */}
          <div>
            <label htmlFor="linkUrl" className="block mb-1 pixel-text">
              OFFICIAL_LINK (optional)
            </label>
            <input
              id="linkUrl"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border-2 border-green-400 bg-black text-green-400 pixel-text focus:outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="imageFile" className="block mb-1 pixel-text">
              ICON_IMAGE (optional)
            </label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm pixel-text"
            />
            {imageFile && (
              <p className="mt-1 text-xs text-gray-500 pixel-text">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border-2 border-cyan-400 text-cyan-400 pixel-text hover:bg-cyan-400 hover:text-black transition"
              style={{ borderRadius: 0 }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border-2 border-green-400 text-green-400 pixel-text hover:bg-green-400 hover:text-black transition disabled:opacity-50"
              style={{ borderRadius: 0 }}
            >
              {isSubmitting ? "CREATING..." : "CREATE"}
            </button>
          </div>
        </form>

        {/* Close “×” */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-cyan-400 hover:text-white pixel-text"
        >
          ×
        </button>
      </div>
    </div>
  );
}
