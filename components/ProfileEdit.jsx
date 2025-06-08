// src/components/ProfileEdit.jsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CreateItemModal from "@/components/CreateItemModal";
import { createBrowserSupabase } from "@/utils/supabase/client";

export default function ProfileEdit({ userStacks, allItems }) {
  // supabase client for profile info
  const supabase = createBrowserSupabase();

  // SSR guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // --- PROFILE INFO STATE ---
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    socialLinks: [], // [{ platform:"", url:"" }, ...]
  });

  // load existing profile info on mount
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // assume your user metadata contains these
        setProfile({
          name: user.user_metadata.name || "",
          username: user.user_metadata.username || "",
          socialLinks: user.user_metadata.socialLinks || [],
        });
      }
    })();
  }, [supabase]);

  // handle profile form changes
  const updateField = (field, value) =>
    setProfile((p) => ({ ...p, [field]: value }));

  const updateLink = (idx, key, value) => {
    setProfile((p) => {
      const links = [...p.socialLinks];
      links[idx] = { ...links[idx], [key]: value };
      return { ...p, socialLinks: links };
    });
  };

  const addLink = () =>
    setProfile((p) => ({
      ...p,
      socialLinks: [...p.socialLinks, { platform: "", url: "" }],
    }));

  const removeLink = (idx) =>
    setProfile((p) => {
      const links = p.socialLinks.filter((_, i) => i !== idx);
      return { ...p, socialLinks: links };
    });

  const saveProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      user_metadata: profile,
    });
    if (error) console.error(error);
    else alert("Profile updated!");
  };

  // --- DND/STACK EDITOR STATE (unchanged) ---
  const initialStacks = useMemo(
    () =>
      userStacks.map((us) => ({
        itemId: us.item.id,
        title: us.item.title,
        imageUrl: us.item.imageUrl,
        category: us.item.category,
        position: us.position,
      })),
    [userStacks]
  );
  const [stacks, setStacks] = useState(initialStacks);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialTitle, setModalInitialTitle] = useState("");
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = ({ active }) => setActiveId(active.id);
  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = stacks.findIndex((s) => s.itemId === active.id);
        const newIndex = stacks.findIndex((s) => s.itemId === over.id);
        const newStacks = arrayMove(stacks, oldIndex, newIndex);
        setStacks(newStacks);
        for (let i = 0; i < newStacks.length; i++) {
          await fetch("/api/user-stack", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId: newStacks[i].itemId, position: i }),
          });
        }
      }
      setActiveId(null);
    },
    [stacks]
  );
  const handleDragCancel = () => setActiveId(null);

  const handleRemove = async (itemId) => {
    await fetch(`/api/user-stack?itemId=${itemId}`, { method: "DELETE" });
    setStacks((prev) => prev.filter((s) => s.itemId !== itemId));
  };
  const handleAdd = async (itemId) => {
    const position = stacks.length;
    await fetch("/api/user-stack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, position }),
    });
    const item = allItems.find((it) => it.id === itemId);
    setStacks((prev) => [...prev, { ...item, position }]);
  };

  const existingIds = new Set(stacks.map((s) => s.itemId));
  const filteredSidebar = allItems.filter(
    (it) =>
      !existingIds.has(it.id) &&
      it.title.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  const groupedStacks = useMemo(
    () =>
      stacks.reduce((acc, s) => {
        if (!acc[s.category]) acc[s.category] = [];
        acc[s.category].push(s);
        return acc;
      }, {}),
    [stacks]
  );

  const openCreateModal = () => {
    setModalInitialTitle(sidebarSearch.trim());
    setModalOpen(true);
  };
  const handleItemCreated = (newItem) => {
    allItems.push(newItem);
    handleAdd(newItem.id);
  };

  // ── RENDER ──
  return (
    <div className="min-h-screen relative bg-black pixel-grid scanlines text-green-400 overflow-hidden">
      {/* Floating neon pixels */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-12 left-12 w-3 h-3 bg-green-400 retro-bounce" />
        <div className="absolute top-20 right-20 w-2 h-2 bg-cyan-400 retro-bounce" />
        <div className="absolute bottom-24 left-1/3 w-2 h-2 bg-green-400 retro-bounce" />
        <div className="absolute bottom-16 right-24 w-3 h-3 bg-cyan-400 retro-bounce" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 px-4 py-12">
        {/* ── LEFT: Profile Info ── */}
        <div className="md:w-1/4 space-y-4">
          <h2 className="text-xl font-bold pixel-text">PROFILE INFO</h2>
          <div>
            <label className="block mb-1 pixel-text">NAME</label>
            <input
              value={profile.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full px-3 py-2 border-2 border-green-400 bg-black text-green-400 pixel-text"
            />
          </div>
          <div>
            <label className="block mb-1 pixel-text">USERNAME</label>
            <input
              value={profile.username}
              onChange={(e) => updateField("username", e.target.value)}
              className="w-full px-3 py-2 border-2 border-green-400 bg-black text-green-400 pixel-text"
            />
          </div>

          <h3 className="mt-4 text-lg font-bold pixel-text">SOCIAL LINKS</h3>
          {profile.socialLinks.map((link, i) => (
            <div key={i} className="flex space-x-2">
              <input
                placeholder="Platform"
                value={link.platform}
                onChange={(e) => updateLink(i, "platform", e.target.value)}
                className="flex-1 px-2 py-1 border-2 border-green-400 bg-black text-green-400 pixel-text"
              />
              <input
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                className="flex-1 px-2 py-1 border-2 border-green-400 bg-black text-green-400 pixel-text"
              />
              <button
                onClick={() => removeLink(i)}
                className="px-2 text-red-500 pixel-text"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={addLink}
            className="mt-2 px-3 py-2 border-2 border-cyan-400 text-cyan-400 pixel-text hover:bg-cyan-400 hover:text-black transition"
            style={{ borderRadius: 0 }}
          >
            + ADD LINK
          </button>

          <button
            onClick={saveProfile}
            className="mt-4 w-full px-4 py-2 border-2 border-green-400 text-black bg-green-400 pixel-text hover:bg-green-300 transition"
            style={{ borderRadius: 0 }}
          >
            SAVE PROFILE
          </button>
        </div>

        {/* ── CENTER: Stack Editor ── */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4 pixel-text">YOUR STACK</h2>
          {!mounted ? (
            <p className="text-gray-500 pixel-text">Loading editor…</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext
                items={stacks.map((s) => s.itemId)}
                strategy={rectSortingStrategy}
              >
                {Object.entries(groupedStacks).map(([category, items]) => (
                  <div key={category} className="mb-8">
                    <h3 className="text-lg font-semibold mb-2 pixel-text">
                      {category.toUpperCase()}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {items.map((s) => (
                        <SortableCard
                          key={s.itemId}
                          itemId={s.itemId}
                          title={s.title}
                          imageUrl={s.imageUrl}
                          onRemove={handleRemove}
                          isActive={activeId === s.itemId}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </SortableContext>
              <DragOverlay>
                {activeId && (
                  <OverlayCard
                    item={stacks.find((s) => s.itemId === activeId)}
                  />
                )}
              </DragOverlay>
            </DndContext>
          )}
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div className="md:w-1/4 space-y-4">
          <h2 className="text-xl font-bold pixel-text">ADD AN ITEM</h2>
          <input
            type="text"
            placeholder="Search..."
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            className="w-full px-3 py-2 border-2 border-green-400 bg-black text-green-400 pixel-text focus:outline-none"
          />

          {sidebarSearch.trim() && filteredSidebar.length === 0 && (
            <button
              onClick={openCreateModal}
              className="w-full mt-2 px-3 py-2 border-2 border-cyan-400 text-cyan-400 pixel-text hover:bg-cyan-400 hover:text-black transition"
              style={{ borderRadius: 0 }}
            >
              CREATE NEW: “{sidebarSearch.trim()}”
            </button>
          )}

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {filteredSidebar.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 border-2 border-green-400 retro-pulse"
              >
                <div className="flex items-center space-x-2">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-6 h-6"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-800" />
                  )}
                  <span className="text-sm pixel-text">{item.title}</span>
                </div>
                <button
                  onClick={() => handleAdd(item.id)}
                  className="px-2 py-1 border-2 border-green-400 text-green-400 pixel-text hover:bg-green-400 hover:text-black transition"
                  style={{ borderRadius: 0 }}
                >
                  ADD
                </button>
              </div>
            ))}
            {filteredSidebar.length === 0 && !sidebarSearch.trim() && (
              <p className="text-gray-500 pixel-text">No items</p>
            )}
          </div>

          {modalOpen && (
            <CreateItemModal
              initialTitle={modalInitialTitle}
              onClose={() => setModalOpen(false)}
              onCreated={handleItemCreated}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ...SortableCard and OverlayCard unchanged...

function SortableCard({ itemId, title, imageUrl, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1, // keep space but hide original
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative flex flex-col items-center p-4 border-2 border-green-400 retro-pulse bg-black pixel-text transition hover:scale-105"
      style={{ borderRadius: 0 }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-8 h-8 mb-2" />
      ) : (
        <div className="w-8 h-8 mb-2 bg-gray-800" />
      )}
      <span className="text-sm">{title}</span>
      <button
        onClick={() => onRemove(itemId)}
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
      >
        ×
      </button>
    </div>
  );
}

function OverlayCard({ item }) {
  if (!item) return null;
  return (
    <div className="flex flex-col items-center p-4 border-2 border-green-400 retro-pulse bg-black pixel-text">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.title} className="w-8 h-8 mb-2" />
      ) : (
        <div className="w-8 h-8 mb-2 bg-gray-800" />
      )}
      <span className="text-sm">{item.title}</span>
    </div>
  );
}
