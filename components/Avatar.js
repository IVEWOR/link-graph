// components/Avatar.js

'use client';

import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Upload, Loader } from 'lucide-react';

export default function Avatar({ user, isOwner, onUploadSuccess, showNotification }) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        if (isOwner) {
            fileInputRef.current.click();
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        showNotification('Uploading avatar...', 'loading');

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update the user's profile with the new URL
            const response = await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatarUrl: publicUrl }),
            });

            const result = await response.json();

            if (result.success) {
                onUploadSuccess(result.user.avatarUrl);
                showNotification('Avatar updated successfully!', 'success');
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error("Avatar upload error:", error);
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            setUploading(false);
        }
    };

    const FallbackAvatar = () => (
        <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gray-700 text-gray-400 text-5xl font-bold">
            {user.username?.charAt(0).toUpperCase()}
        </div>
    );

    return (
        <div className="relative w-32 h-32 mx-auto mb-4 group">
            {user.avatarUrl ? (
                <img
                    src={user.avatarUrl}
                    alt={user.name || user.username}
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-lg"
                />
            ) : (
                <div className="border-4 border-green-500 rounded-full shadow-lg">
                    <FallbackAvatar />
                </div>
            )}

            {isOwner && (
                <div
                    className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-300 cursor-pointer"
                    onClick={handleAvatarClick}
                >
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                        {uploading ? (
                            <Loader className="animate-spin h-8 w-8" />
                        ) : (
                            <>
                                <Upload className="h-8 w-8 mx-auto" />
                                <span className="text-sm">Change</span>
                            </>
                        )}
                    </div>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept="image/png, image/jpeg"
                disabled={uploading}
            />
        </div>
    );
}