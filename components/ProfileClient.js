// components/ProfileClient.js

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Edit, Save, Plus, Twitter, Github, Linkedin, Trash2, GripVertical, Edit2 } from 'lucide-react';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import ToastNotification from './ToastNotification';
import Avatar from './Avatar'; // Import the new Avatar component

const SocialLinksDisplay = ({ socialLinks }) => {
    const links = socialLinks || {};
    return (
        <div className="flex justify-center space-x-4 mt-4">
            {links.twitter && <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Twitter /></a>}
            {links.github && <a href={links.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Github /></a>}
            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Linkedin /></a>}
        </div>
    );
};

export default function ProfileClient({ user: initialUser }) {
    const [user, setUser] = useState(initialUser);
    const [session, setSession] = useState(null);
    const [isLoadingSession, setIsLoadingSession] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
    const [currentItemToEdit, setCurrentItemToEdit] = useState(null);

    const [name, setName] = useState(initialUser.name || '');
    const [description, setDescription] = useState(initialUser.description || '');
    const [socialLinks, setSocialLinks] = useState(initialUser.socialLinks || {});

    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoadingSession(false);
        });
    }, []);

    const isOwner = session && session.user.id === user.id;

    const showNotification = (message, type = 'success', duration = 3000) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: 'success' });
        }, duration);
    };

    const handleSave = async () => {
        if (!isOwner) return;
        showNotification('Saving changes...', 'loading');

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return showNotification('Authentication error', 'error');

        const updateProfilePromise = fetch('/api/profile/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ name, description, socialLinks }),
        }).then(res => res.json());

        const reorderStackPromise = fetch('/api/stack/reorder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ userId: user.id, orderedIds: user.stacks.map(s => s.item.id) }),
        }).then(res => res.json());

        try {
            const [profileResult, stackResult] = await Promise.all([updateProfilePromise, reorderStackPromise]);

            if (profileResult.success && stackResult.success) {
                setUser(prevUser => ({ ...prevUser, ...profileResult.user }));
                setIsEditing(false);
                showNotification('Profile saved successfully!');
            } else {
                showNotification(`Error saving: ${profileResult.error || stackResult.error}`, 'error');
            }
        } catch (error) {
            showNotification('An error occurred while saving.', 'error');
        }
    };

    const handleAvatarUploadSuccess = (newAvatarUrl) => {
        setUser(prevUser => ({ ...prevUser, avatarUrl: newAvatarUrl }));
    };

    const handleSocialLinkChange = (platform, value) => {
        setSocialLinks(prev => ({ ...prev, [platform]: value }));
    };

    const handleAddItem = (newItem) => {
        const newStackItem = {
            item: newItem,
            userId: user.id,
            itemId: newItem.id,
            position: user.stacks.length,
            createdAt: new Date().toISOString(),
        };
        setUser(prevUser => ({
            ...prevUser,
            stacks: [...prevUser.stacks, newStackItem]
        }));
        showNotification(`${newItem.title} added to your stack!`);
    };

    const handleUpdateItem = (updatedItem) => {
        setUser(prevUser => ({
            ...prevUser,
            stacks: prevUser.stacks.map(stackItem =>
                stackItem.item.id === updatedItem.id
                    ? { ...stackItem, item: updatedItem }
                    : stackItem
            )
        }));
        showNotification(`${updatedItem.title} updated successfully!`);
    };

    const handleEditItemClick = (item) => {
        setCurrentItemToEdit(item);
        setIsEditItemModalOpen(true);
    };

    const handleDeleteItem = async (itemIdToDelete) => {
        if (!isOwner) return;
        const originalStacks = user.stacks;
        setUser(prevUser => ({
            ...prevUser,
            stacks: prevUser.stacks.filter(s => s.item.id !== itemIdToDelete)
        }));

        try {
            const response = await fetch('/api/stack/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, itemId: itemIdToDelete }),
            });
            const result = await response.json();
            if (!result.success) {
                setUser(prevUser => ({ ...prevUser, stacks: originalStacks }));
                showNotification(`Error: ${result.error}`, 'error');
            } else {
                showNotification('Item removed from stack.', 'success');
            }
        } catch (error) {
            setUser(prevUser => ({ ...prevUser, stacks: originalStacks }));
            showNotification('An error occurred while deleting.', 'error');
        }
    };

    const handleDragSort = () => {
        let _stackItems = [...user.stacks];
        const draggedItemContent = _stackItems.splice(dragItem.current, 1)[0];
        _stackItems.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setUser(prevUser => ({ ...prevUser, stacks: _stackItems }));
    };

    return (
        <>
            <ToastNotification {...notification} />
            <div className="min-h-screen relative z-10 pt-24">
                <main className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center relative">
                        <div className="absolute top-0 right-0 h-9 w-9">
                            {!isLoadingSession && isOwner && (
                                <>
                                    {isEditing ? (
                                        <button onClick={handleSave} className="p-2 bg-green-500 text-white rounded-full"><Save /></button>
                                    ) : (
                                        <button onClick={() => setIsEditing(true)} className="p-2 bg-gray-700 text-white rounded-full"><Edit /></button>
                                    )}
                                </>
                            )}
                        </div>

                        <Avatar
                            user={user}
                            isOwner={isOwner}
                            onUploadSuccess={handleAvatarUploadSuccess}
                            showNotification={showNotification}
                        />

                        {isEditing ? (
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="text-4xl font-bold text-center bg-transparent" />
                        ) : (
                            <h1 className="text-4xl font-bold">{user.name || user.username}</h1>
                        )}
                        {isEditing ? (
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="text-lg w-full max-w-2xl mx-auto mt-2 text-center bg-transparent" placeholder="Your bio..."></textarea>
                        ) : (
                            <p className="text-lg mt-2">{user.description || 'No bio yet.'}</p>
                        )}

                        {isEditing ? (
                            <div className="mt-4 space-y-2 max-w-sm mx-auto">
                                <div className="flex items-center space-x-2">
                                    <Twitter className="text-gray-400" />
                                    <input type="url" placeholder="https://twitter.com/username" value={socialLinks.twitter || ''} onChange={(e) => handleSocialLinkChange('twitter', e.target.value)} className="w-full bg-transparent" />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Github className="text-gray-400" />
                                    <input type="url" placeholder="https://github.com/username" value={socialLinks.github || ''} onChange={(e) => handleSocialLinkChange('github', e.target.value)} className="w-full bg-transparent" />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Linkedin className="text-gray-400" />
                                    <input type="url" placeholder="https://linkedin.com/in/username" value={socialLinks.linkedin || ''} onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)} className="w-full bg-transparent" />
                                </div>
                            </div>
                        ) : (
                            <SocialLinksDisplay socialLinks={user.socialLinks} />
                        )}
                    </div>

                    <div className="mt-16 max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Stack</h2>
                            {!isLoadingSession && isOwner && !isEditing && <button onClick={() => setIsAddItemModalOpen(true)} className="p-2 bg-green-500 text-white rounded-full"><Plus /></button>}
                        </div>
                        <div className="space-y-4">
                            {user.stacks.map(({ item }, index) => {
                                const canEditItem = !item.createdById || item.createdById === session?.user?.id;
                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 bg-white/60 dark:bg-gray-800/50 backdrop-blur-md rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-between group"
                                        draggable={isEditing}
                                        onDragStart={() => dragItem.current = index}
                                        onDragEnter={() => dragOverItem.current = index}
                                        onDragEnd={handleDragSort}
                                        onDragOver={(e) => e.preventDefault()}
                                    >
                                        <div className="flex items-center space-x-4">
                                            {isEditing && <GripVertical className="cursor-grab text-gray-400" />}
                                            <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded-md" />
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{item.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                                            </div>
                                        </div>
                                        {isEditing && (
                                            <div className="flex items-center space-x-2">
                                                {canEditItem && (
                                                    <button onClick={() => handleEditItemClick(item)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-full">
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
            {isOwner && (
                <>
                    <AddItemModal
                        isOpen={isAddItemModalOpen}
                        onClose={() => setIsAddItemModalOpen(false)}
                        onAddItem={handleAddItem}
                        userId={user.id}
                        showNotification={showNotification}
                    />
                    <EditItemModal
                        isOpen={isEditItemModalOpen}
                        onClose={() => setIsEditItemModalOpen(false)}
                        onUpdateItem={handleUpdateItem}
                        item={currentItemToEdit}
                        showNotification={showNotification}
                    />
                </>
            )}
        </>
    );
}