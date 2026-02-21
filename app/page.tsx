"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SAMPLE_EVENTS = [
  { id: 1, title: "Fintech Meetup", date: "2026-03-01", location: "Delhi" },
  { id: 2, title: "Startup Pitch Night", date: "2026-03-10", location: "Bangalore" },
  { id: 3, title: "Tech Conference", date: "2026-04-05", location: "Mumbai" },
];

ffunction formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { 
    day: "numeric", 
    month: "short", 
    year: "numeric" 
  });
}

function EventCard({ event, onDelete }) {
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
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {event.location}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            {formatDate(event.date)}
          </div>
        </div>
        <button
          onClick={() => onDelete(event.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

function AddEventForm({ onAdd }) {
  const [fields, setFields] = useState({ title: "", date: "", location: "" });
  const [error, setError] = useState("");

  const handleChange = (key, val) => {
    setFields((prev) => ({ ...prev, [key]: val }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fields.title.trim() || !fields.date || !fields.location.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    onAdd({ ...fields, title: fields.title.trim(), location: fields.location.trim() });
    setFields({ title: "", date: "", location: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Add New Event</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Event title"
          value={fields.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder:text-gray-400 transition"
        />
        <input
          type="date"
          value={fields.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-gray-700 transition"
        />
        <input
          type="text"
          placeholder="Location"
          value={fields.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder:text-gray-400 transition"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        className="bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-150"
      >
        Add Event
      </button>
    </form>
  );
}

export default function EventManager() {
  const [eventList, setEventList] = useState(SAMPLE_EVENTS);
  const [searchText, setSearchText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  const nextId = useRef(SAMPLE_EVENTS.length + 1);

  const addEvent = (data) => {
    setEventList((prev) => [...prev, { id: nextId.current++, ...data }]);
  };

  const deleteEvent = (id) => {
    setEventList((prev) => prev.filter((ev) => ev.id !== id));
  };

  const searchResults = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return [];
    return eventList.filter(
      (ev) =>
        ev.title.toLowerCase().includes(q) || ev.location.toLowerCase().includes(q)
    );
  }, [searchText, eventList]);

  const displayedEvents = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return eventList;
    return eventList.filter(
      (ev) =>
        ev.title.toLowerCase().includes(q) || ev.location.toLowerCase().includes(q)
    );
  }, [searchText, eventList]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-base">EventManager</span>
        </div>
        <span className="text-xs text-gray-400">{eventList.length} events</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-7">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or city..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder:text-gray-400 transition"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <AnimatePresence>
            {dropdownOpen && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute w-full mt-1.5 z-30 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
              >
                {searchResults.map((ev) => (
                  <button
                    key={ev.id}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center justify-between gap-4"
                    onMouseDown={() => {
                      setSearchText(ev.title);
                      setDropdownOpen(false);
                    }}
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-800">{ev.title}</div>
                      <div className="text-xs text-gray-400">{ev.location}</div>
                    </div>
                    <div className="text-xs text-gray-300 shrink-0">{formatDate(ev.date)}</div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Event Form */}
        <AddEventForm onAdd={addEvent} />

        {/* Event Grid */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            {searchText ? `Results for "${searchText}"` : "All Events"}
          </h2>

          {displayedEvents.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              No events found.
            </div>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 gap-4">
              <AnimatePresence>
                {displayedEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} onDelete={deleteEvent} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}