// components/EditItemModal.js
'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../lib/supabaseClient'; // Import supabase client

export default function EditItemModal({ isOpen, onClose, onUpdateItem, item, showNotification }) {
    const [title, setTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [category, setCategory] = useState('Tool');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setTitle(item.title);
            setLinkUrl(item.linkUrl || '');
            setCategory(item.category);
        }
    }, [item]);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setLoading(true);
        showNotification('Updating item...', 'loading');

        try {
            // Get the current user session to access the auth token
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                showNotification('Error: You are not authenticated.', 'error');
                setLoading(false);
                return;
            }

            const response = await fetch('/api/items/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include the auth token in the request header
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    itemId: item.id,
                    title,
                    linkUrl,
                    category,
                }),
            });
            const result = await response.json();
            if (result.success) {
                onUpdateItem(result.item);
                onClose();
                showNotification('Item updated successfully!');
            } else {
                showNotification(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            showNotification('An error occurred.', 'error');
        }
        setLoading(false);
    };

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start pt-20 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg m-4 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X /></button>
                <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
                <form onSubmit={handleSaveChanges} className="space-y-4">
                    <div>
                        <label>Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 rounded-lg" />
                    </div>
                    <div>
                        <label>Website URL</label>
                        <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" className="w-full p-2 rounded-lg" />
                    </div>
                    <div>
                        <label>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 rounded-lg">
                            <option>Tool</option>
                            <option>Language</option>
                            <option>Framework</option>
                            <option>Database</option>
                            <option>Hosting</option>
                            <option>Editor</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
