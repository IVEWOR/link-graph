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

  // Cloudinary settings from env
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

      // 1) If user selected an image, upload it to Cloudinary
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", UPLOAD_PRESET);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const cloudData = await cloudRes.json();
        if (!cloudRes.ok) {
          throw new Error("Cloudinary upload failed");
        }
        imageUrl = cloudData.secure_url;
      }

      // 2) Call our API to create the item
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
      if (!apiRes.ok) {
        throw new Error(apiData.error || "Failed to create item");
      }

      // 3) Notify the parent that the item was created
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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4">Create New Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              placeholder="e.g. Elixir"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
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
            <label className="block text-sm font-medium mb-1" htmlFor="linkUrl">
              Official Link (optional)
            </label>
            <input
              id="linkUrl"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              type="url"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              placeholder="https://example.com"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="imageFile"
            >
              Icon Image (optional)
            </label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm"
            />
            {imageFile && (
              <p className="mt-1 text-xs text-gray-500">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Item"}
            </button>
          </div>
        </form>

        {/* Close “×” button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
