// components/AddItemModal.js
'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Plus, ArrowLeft, Upload, Loader } from 'lucide-react';

export default function AddItemModal({ isOpen, onClose, onAddItem, userId, showNotification }) {
    const [view, setView] = useState('search');
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // State for the new item form
    const [newItemTitle, setNewItemTitle] = useState('');
    const [newItemLink, setNewItemLink] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('Tool');
    const [newItemImage, setNewItemImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setView('search');
                setSearchTerm('');
                setResults([]);
                setNewItemTitle('');
                setNewItemLink('');
                setNewItemCategory('Tool');
                setNewItemImage(null);
                setImagePreview('');
            }, 300);
        }
    }, [isOpen]);

    useEffect(() => {
        if (view !== 'search') return;
        const handler = setTimeout(async () => {
            if (searchTerm.trim() === '') return setResults([]);
            setLoading(true);
            try {
                const response = await fetch(`/api/items/search?term=${searchTerm}`);
                const data = await response.json();
                setResults(data.success ? data.items : []);
            } catch (error) { console.error("Search failed:", error); }
            setLoading(false);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm, view]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewItemImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleShowCreateForm = () => {
        setNewItemTitle(searchTerm);
        setView('create');
    };

    const handleFinalizeCreate = async (e) => {
        e.preventDefault();

        if (typeof showNotification !== 'function') {
            console.error("showNotification prop is not a function!");
            alert("A critical error occurred. Please try again.");
            return;
        }

        setLoading(true);
        showNotification('Creating item...', 'loading');

        let imageUrl = '';
        if (newItemImage) {
            imageUrl = imagePreview;
        }

        try {
            const createResponse = await fetch('/api/items/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newItemTitle,
                    linkUrl: newItemLink,
                    category: newItemCategory,
                    imageUrl: imageUrl,
                }),
            });
            const result = await createResponse.json();

            if (result.success) {
                await handleAddItem(result.item);
            } else {
                showNotification(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            showNotification('An error occurred.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (item) => {
        try {
            const response = await fetch('/api/stack/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, itemId: item.id }),
            });
            const result = await response.json();
            if (result.success) {
                onAddItem(item); // This updates the UI on the profile page
                onClose(); // This closes the modal
            } else {
                if (typeof showNotification === 'function') {
                    showNotification(`Error: ${result.error}`, 'error');
                }
            }
        } catch (error) {
            if (typeof showNotification === 'function') {
                showNotification('An error occurred while adding the item.', 'error');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start pt-20 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg m-4 relative transition-all duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X /></button>

                {view === 'search' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Add Item to Your Stack</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for a tool..." className="w-full pl-10 pr-4 py-2 rounded-lg" />
                        </div>
                        <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
                            {loading && <p>Searching...</p>}
                            {!loading && results.length === 0 && searchTerm && (
                                <div className="p-3 flex justify-between items-center">
                                    <p>Create new item: "{searchTerm}"</p>
                                    <button onClick={handleShowCreateForm} className="p-2 bg-blue-500 text-white rounded-full"><Plus /></button>
                                </div>
                            )}
                            {results.map(item => (
                                <div key={item.id} className="p-3 flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <img src={item.imageUrl} alt={item.title} className="w-8 h-8 rounded-md" />
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleAddItem(item)} className="p-2 bg-green-500 text-white rounded-full"><Plus /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'create' && (
                    <div>
                        <button onClick={() => setView('search')} className="flex items-center text-sm mb-4"><ArrowLeft className="mr-2 h-4 w-4" />Back to Search</button>
                        <h2 className="text-2xl font-bold mb-4">Create New Item</h2>
                        <form onSubmit={handleFinalizeCreate} className="space-y-4">
                            <div>
                                <label>Title</label>
                                <input type="text" value={newItemTitle} onChange={(e) => setNewItemTitle(e.target.value)} required className="w-full p-2 rounded-lg" />
                            </div>
                            <div>
                                <label>Website URL</label>
                                <input type="url" value={newItemLink} onChange={(e) => setNewItemLink(e.target.value)} placeholder="https://example.com" className="w-full p-2 rounded-lg" />
                            </div>
                            <div>
                                <label>Category</label>
                                <select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)} className="w-full p-2 rounded-lg">
                                    <option>Tool</option>
                                    <option>Language</option>
                                    <option>Framework</option>
                                    <option>Database</option>
                                    <option>Hosting</option>
                                    <option>Editor</option>
                                </select>
                            </div>
                            <div>
                                <label>Custom Image</label>
                                <div className="mt-1 flex items-center space-x-4">
                                    {imagePreview ? <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" /> : <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>}
                                    <label htmlFor="file-upload" className="cursor-pointer bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
                                        <Upload className="inline-block mr-2" />
                                        <span>Upload</span>
                                    </label>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center disabled:bg-green-800">
                                {loading && <Loader className="animate-spin mr-2" />}
                                {loading ? 'Creating...' : 'Create and Add Item'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
