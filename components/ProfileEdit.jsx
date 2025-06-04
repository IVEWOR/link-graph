// src/components/ProfileEdit.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
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
import { createBrowserSupabase } from "@/utils/supabase/client";
import CreateItemModal from "@/components/CreateItemModal";

export default function ProfileEdit({ userStacks, allItems }) {
  const supabase = createBrowserSupabase();

  // 0) Prevent SSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1) Initialize stacks
  const initialStacks = userStacks.map((us) => ({
    itemId: us.item.id,
    title: us.item.title,
    imageUrl: us.item.imageUrl,
    category: us.item.category,
    position: us.position,
  }));
  const [stacks, setStacks] = useState(initialStacks);

  // 2) Sidebar search + modal state
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialTitle, setModalInitialTitle] = useState("");

  // 3) DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 4) Handle drag end (reorder)
  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = stacks.findIndex((s) => s.itemId === active.id);
      const newIndex = stacks.findIndex((s) => s.itemId === over.id);
      const newStacks = arrayMove(stacks, oldIndex, newIndex);

      setStacks(newStacks);

      // Persist new positions
      try {
        for (let i = 0; i < newStacks.length; i++) {
          const { itemId } = newStacks[i];
          await fetch("/api/user-stack", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId, position: i }),
          });
        }
      } catch (error) {
        console.error("Error updating positions:", error);
      }
    },
    [stacks]
  );

  // 5) Remove item
  const handleRemove = async (itemId) => {
    try {
      await fetch(`/api/user-stack?itemId=${itemId}`, { method: "DELETE" });
      setStacks((prev) => prev.filter((s) => s.itemId !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // 6) Standard add (existing items)
  const handleAdd = async (itemId) => {
    const newPosition = stacks.length;
    try {
      await fetch("/api/user-stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, position: newPosition }),
      });
      const item = allItems.find((it) => it.id === itemId);
      setStacks((prev) => [
        ...prev,
        {
          itemId: item.id,
          title: item.title,
          imageUrl: item.imageUrl,
          category: item.category,
          position: newPosition,
        },
      ]);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // 7) Filter out existing stacks, apply search
  const existingIds = new Set(stacks.map((s) => s.itemId));
  const filteredSidebar = allItems.filter(
    (it) =>
      !existingIds.has(it.id) &&
      it.title.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  // 8) Group stacks by category
  const groupedStacks = stacks.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  // 9) Open the modal when “Create new” is clicked
  const openCreateModal = () => {
    setModalInitialTitle(sidebarSearch.trim());
    setModalOpen(true);
  };

  // 10) Handle “item created” callback from modal
  const handleItemCreated = (newItem) => {
    // add to allItems so sidebar is aware (optional; if you reload allItems, not strictly needed)
    allItems.push(newItem);
    // now link it to user stack
    handleAdd(newItem.id);
  };

  return (
    <div className="flex space-x-6">
      {/* Sidebar */}
      <div className="w-64 border-r pr-4">
        <h2 className="text-lg font-medium mb-2">Add an Item</h2>
        <input
          type="text"
          placeholder="Search items..."
          value={sidebarSearch}
          onChange={(e) => setSidebarSearch(e.target.value)}
          className="w-full px-2 py-1 mb-4 border rounded text-sm"
        />

        {/* If no existing matches AND user typed something, show “Create new” */}
        {sidebarSearch.trim() !== "" && filteredSidebar.length === 0 && (
          <div className="mb-4">
            <button
              onClick={openCreateModal}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
            >
              Create new item: "{sidebarSearch.trim()}"
            </button>
          </div>
        )}

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredSidebar.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-6 h-6"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-200" />
                )}
                <span className="text-sm">{item.title}</span>
              </div>
              <button
                onClick={() => handleAdd(item.id)}
                className="px-2 py-1 bg-green-500 text-white text-xs rounded"
              >
                Add
              </button>
            </div>
          ))}
          {filteredSidebar.length === 0 && sidebarSearch.trim() === "" && (
            <div className="text-sm text-gray-500">No items found</div>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1">
        <h2 className="text-lg font-medium mb-4">Your Stack</h2>

        {!mounted ? (
          <div className="text-gray-500 text-center py-10">
            Loading your stack editor…
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={stacks.map((s) => s.itemId)}
              strategy={rectSortingStrategy}
            >
              {Object.entries(groupedStacks).map(([category, items]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-md font-semibold mb-2">{category}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {items.map((s) => (
                      <SortableCard
                        key={s.itemId}
                        itemId={s.itemId}
                        title={s.title}
                        imageUrl={s.imageUrl}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* 11) Render CreateItemModal if open */}
      {modalOpen && (
        <CreateItemModal
          initialTitle={modalInitialTitle}
          onClose={() => setModalOpen(false)}
          onCreated={handleItemCreated}
        />
      )}
    </div>
  );
}

function SortableCard({ itemId, title, imageUrl, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative flex flex-col items-center p-3 border rounded bg-white shadow-sm"
    >
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-8 h-8 mb-2" />
      ) : (
        <div className="w-8 h-8 mb-2 bg-gray-200" />
      )}
      <span className="text-sm font-medium">{title}</span>
      <button
        onClick={() => onRemove(itemId)}
        className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-xs"
      >
        ×
      </button>
    </div>
  );
}
