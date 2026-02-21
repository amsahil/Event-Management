// @ts-nocheck
"use client";

import { useState, useMemo, useRef, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= TYPES ================= */

type EventType = {
  id: number;
  title: string;
  date: string;
  location: string;
};

type AddEventData = {
  title: string;
  date: string;
  location: string;
};

type EventCardProps = {
  event: EventType;
  onDelete: (id: number) => void;
};

type AddEventFormProps = {
  onAdd: (data: AddEventData) => void;
};

/* ================= SAMPLE DATA ================= */

const SAMPLE_EVENTS: EventType[] = [
  { id: 1, title: "Fintech Meetup", date: "2026-03-01", location: "Delhi" },
  { id: 2, title: "Startup Pitch Night", date: "2026-03-10", location: "Bangalore" },
  { id: 3, title: "Tech Conference", date: "2026-04-05", location: "Mumbai" },
];

/* ================= HELPERS ================= */

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ================= EVENT CARD ================= */

function EventCard({ event, onDelete }: EventCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-base leading-tight">
            {event.title}
          </h3>

          <div className="text-sm text-gray-500">{event.location}</div>
          <div className="text-sm text-gray-400">{formatDate(event.date)}</div>
        </div>

        <button
          onClick={() => onDelete(event.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}

/* ================= ADD EVENT FORM ================= */

function AddEventForm({ onAdd }: AddEventFormProps) {
  const [fields, setFields] = useState<AddEventData>({
    title: "",
    date: "",
    location: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (key: keyof AddEventData, val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
    if (error) setError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fields.title.trim() || !fields.date || !fields.location.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    onAdd({
      title: fields.title.trim(),
      date: fields.date,
      location: fields.location.trim(),
    });

    setFields({ title: "", date: "", location: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
        Add New Event
      </h2>

      <div className="grid sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Event title"
          value={fields.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange("title", e.target.value)
          }
          className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200"
        />

        <input
          type="date"
          value={fields.date}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange("date", e.target.value)
          }
          className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200"
        />

        <input
          type="text"
          placeholder="Location"
          value={fields.location}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange("location", e.target.value)
          }
          className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-5 py-2.5 rounded-xl">
        Add Event
      </button>
    </form>
  );
}

/* ================= MAIN ================= */

export default function EventManager() {
  const [eventList, setEventList] = useState<EventType[]>(SAMPLE_EVENTS);
  const [searchText, setSearchText] = useState<string>("");

  const nextId = useRef<number>(SAMPLE_EVENTS.length + 1);

  const addEvent = (data: AddEventData) => {
    setEventList((prev) => [...prev, { id: nextId.current++, ...data }]);
  };

  const deleteEvent = (id: number) => {
    setEventList((prev) => prev.filter((ev) => ev.id !== id));
  };

  const displayedEvents = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return eventList;

    return eventList.filter(
      (ev) =>
        ev.title.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q)
    );
  }, [searchText, eventList]);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-7">

        <input
          type="text"
          placeholder="Search by name or city..."
          value={searchText}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchText(e.target.value)
          }
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200"
        />

        <AddEventForm onAdd={addEvent} />

        <motion.div layout className="grid sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {displayedEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} onDelete={deleteEvent} />
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}