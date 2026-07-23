import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Info } from "lucide-react";

interface CalendarEvent {
  id: string;
  hallName: string;
  customerName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 02:00 PM"
  eventType: string;
  status: "Pending" | "Approved" | "Cancelled";
}

interface VisualCalendarProps {
  events: CalendarEvent[];
  loading?: boolean;
  onAddBooking?: () => void;
  onSelectEvent?: (id: string) => void;
}

export default function VisualCalendar({ events, loading = false, onAddBooking, onSelectEvent }: VisualCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week");
  const [selectedHallFilter, setSelectedHallFilter] = useState("All");

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-navy-200 overflow-hidden font-sans animate-pulse" id="calendar-skeleton-widget">
        {/* Top Header Skeleton */}
        <div className="p-5 border-b border-navy-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-navy-100 rounded-xl border border-navy-200 w-10 h-10 flex-shrink-0" />
            <div className="space-y-2">
              <div className="w-44 h-4 bg-navy-200 rounded-md" />
              <div className="w-60 h-3 bg-navy-100 rounded-md" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-36 h-9 bg-navy-100 rounded-xl border border-navy-200/80" />
            <div className="w-28 h-9 bg-navy-100 rounded-xl border border-navy-200/80" />
            <div className="w-24 h-9 bg-navy-200 rounded-xl" />
          </div>
        </div>

        {/* Sub-header Navigation Skeleton */}
        <div className="bg-navy-50/80 border-b border-navy-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-32 h-5 bg-navy-200 rounded-md" />
            <div className="flex gap-1">
              <div className="w-6 h-6 bg-navy-200 rounded-lg" />
              <div className="w-12 h-6 bg-navy-200 rounded-lg" />
              <div className="w-6 h-6 bg-navy-200 rounded-lg" />
            </div>
          </div>

          <div className="hidden sm:flex gap-4">
            <div className="w-16 h-3 bg-navy-200 rounded-md" />
            <div className="w-16 h-3 bg-navy-200 rounded-md" />
            <div className="w-16 h-3 bg-navy-200 rounded-md" />
          </div>
        </div>

        {/* Calendar Grid Skeleton (Week View Simulation) */}
        <div className="p-5 overflow-x-auto">
          <div className="min-w-[650px] grid grid-cols-8 border border-navy-100 rounded-2xl overflow-hidden bg-navy-50/30 divide-x divide-navy-100">
            {/* Header / Time Column */}
            <div className="p-3 bg-navy-50/50 flex flex-col items-center justify-center">
              <div className="w-8 h-3 bg-navy-200 rounded-md" />
            </div>

            {/* 7 Day Columns */}
            {Array.from({ length: 7 }).map((_, colIdx) => (
              <div key={colIdx} className="flex flex-col min-h-[300px]">
                <div className="p-3 bg-navy-50/50 border-b border-navy-100 flex flex-col items-center justify-center gap-1.5">
                  <div className="w-7 h-2.5 bg-navy-200 rounded-md" />
                  <div className="w-7 h-7 bg-navy-200 rounded-full" />
                </div>

                <div className="flex-1 p-2 space-y-2 bg-white">
                  {colIdx % 3 === 0 ? (
                    <div className="p-2.5 rounded-xl border border-indigo-100 bg-indigo-50/60 h-24 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="w-3/4 h-2 bg-indigo-200 rounded-md" />
                        <div className="w-full h-3 bg-indigo-200/80 rounded-md" />
                        <div className="w-1/2 h-2 bg-indigo-200/60 rounded-md" />
                      </div>
                      <div className="w-12 h-2.5 bg-indigo-300/80 rounded-full" />
                    </div>
                  ) : colIdx === 2 || colIdx === 5 ? (
                    <div className="p-2.5 rounded-xl border border-amber-100 bg-amber-50/60 h-24 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="w-2/3 h-2 bg-amber-200 rounded-md" />
                        <div className="w-4/5 h-3 bg-amber-200/80 rounded-md" />
                        <div className="w-1/3 h-2 bg-amber-200/60 rounded-md" />
                      </div>
                      <div className="w-10 h-2.5 bg-amber-300/80 rounded-full" />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center opacity-30 py-12">
                      <div className="w-10 h-2.5 bg-navy-200 rounded-md" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Filter events based on selected hall filter
  const filteredEvents = events.filter(e => {
    if (selectedHallFilter === "All") return true;
    return e.hallName.toLowerCase().includes(selectedHallFilter.toLowerCase());
  });

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Helper to format date keys
  const formatDateKey = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const uniqueHalls = ["All", "Grace Hall", "Victory Hall", "Faith Conference Hall", "Hope Celebration Hall"];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-navy-200 overflow-hidden font-sans" id="visual-calendar-widget">
      {/* Top Header Controls */}
      <div className="p-5 border-b border-navy-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-navy-50 text-navy-900 rounded-xl border border-navy-200">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy-900 tracking-wide">Calendar Schedule</h2>
            <p className="text-xs text-navy-500 font-semibold">View and coordinate church hall reservations</p>
          </div>
        </div>

        {/* Filters and Nav buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Hall select */}
          <select
            value={selectedHallFilter}
            onChange={e => setSelectedHallFilter(e.target.value)}
            className="border border-navy-200 rounded-xl px-3 py-2 text-xs font-semibold text-navy-600 bg-navy-50 focus:outline-none"
            id="calendar-hall-filter"
          >
            {uniqueHalls.map(h => (
              <option key={h} value={h}>{h === "All" ? "Halls: All Halls" : h}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex border border-navy-200 rounded-xl p-1 bg-navy-50">
            {(["month", "week", "day"] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-bold capitalize rounded-lg transition-all ${
                  viewMode === mode
                    ? "bg-navy-900 text-white shadow-sm"
                    : "text-navy-500 hover:text-navy-800"
                }`}
                id={`calendar-view-${mode}`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Add block */}
          {onAddBooking && (
            <button
              onClick={onAddBooking}
              className="flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition"
              id="calendar-add-block-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Block Dates</span>
            </button>
          )}
        </div>
      </div>

      {/* Calendar Navigation header */}
      <div className="bg-navy-50 border-b border-navy-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-extrabold text-navy-800 uppercase tracking-wide">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-navy-200 rounded-lg text-navy-600 transition"
              id="calendar-btn-prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-2.5 py-1 text-xs font-bold text-navy-500 hover:text-navy-800 hover:bg-navy-200 rounded-lg transition"
              id="calendar-btn-today"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-navy-200 rounded-lg text-navy-600 transition"
              id="calendar-btn-next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-xs font-semibold text-navy-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block"></span>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block"></span>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-400 rounded-full inline-block"></span>
            <span>Maintenance</span>
          </div>
        </div>
      </div>

      {/* View Contents */}
      <div className="p-5">
        {viewMode === "month" && (
          <div className="grid grid-cols-7 gap-1 text-center" id="calendar-month-grid">
            {daysOfWeek.map(d => (
              <div key={d} className="text-xs font-extrabold text-navy-400 uppercase tracking-wider py-2">
                {d}
              </div>
            ))}
            {/* Empty boxes for initial padding offset */}
            {Array.from({ length: getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[85px] border border-navy-100 rounded-xl bg-navy-50/50 p-1 opacity-50" />
            ))}
            {/* Days in Month */}
            {Array.from({ length: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => {
              const day = i + 1;
              const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayEvents = filteredEvents.filter(e => e.date === dateKey);

              return (
                <div
                  key={`day-${day}`}
                  className="min-h-[85px] border border-navy-100 rounded-xl p-1.5 flex flex-col justify-between hover:bg-navy-50 cursor-pointer transition relative"
                >
                  <span className="text-xs font-bold text-navy-600 ml-1 mt-1">{day}</span>
                  <div className="space-y-1 mt-2">
                    {dayEvents.map(e => (
                      <div
                        key={e.id}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          if (onSelectEvent) onSelectEvent(e.id);
                        }}
                        className={`text-[9px] font-bold p-1 rounded-md text-white truncate shadow-sm transition hover:scale-[1.02] ${
                          e.status === "Approved"
                            ? "bg-indigo-600"
                            : e.status === "Pending"
                            ? "bg-amber-500 text-navy-900"
                            : "bg-red-500"
                        }`}
                        title={`${e.hallName} - ${e.customerName}`}
                      >
                        {e.hallName.replace(" Hall", "")}: {e.timeSlot.split(" - ")[0]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === "week" && (
          <div className="overflow-x-auto no-scrollbar" id="calendar-week-grid">
            <div className="min-w-[650px] grid grid-cols-8 border border-navy-100 rounded-2xl overflow-hidden bg-navy-50/30">
              {/* Header column (Time intervals) */}
              <div className="border-r border-navy-100 bg-navy-50/50 p-3 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">Time</span>
              </div>

              {/* Day Columns */}
              {Array.from({ length: 7 }).map((_, idx) => {
                // Determine actual date based on first day of week
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + idx);
                const dayLabel = daysOfWeek[idx];
                const dayNum = startOfWeek.getDate();
                const key = startOfWeek.toISOString().split("T")[0];
                const dayEvents = filteredEvents.filter(e => e.date === key);

                return (
                  <div key={idx} className="border-r border-navy-100 flex flex-col items-stretch min-h-[300px]">
                    <div className="bg-navy-50/50 p-3 border-b border-navy-100 text-center flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">{dayLabel}</span>
                      <span className={`text-base font-extrabold w-7 h-7 rounded-full flex items-center justify-center mt-1 transition ${
                        dayNum === 15 && currentDate.getMonth() === 4 ? "bg-navy-900 text-white shadow-sm" : "text-navy-800"
                      }`}>
                        {dayNum}
                      </span>
                    </div>

                    <div className="flex-1 p-2 space-y-2.5 bg-white relative">
                      {dayEvents.map(e => (
                        <div
                          key={e.id}
                          onClick={() => onSelectEvent && onSelectEvent(e.id)}
                          className={`p-2.5 rounded-xl border flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md transition text-left h-24 ${
                            e.status === "Approved"
                              ? "bg-indigo-50 border-indigo-200 text-indigo-900"
                              : e.status === "Pending"
                              ? "bg-amber-50 border-amber-200 text-amber-900"
                              : "bg-red-50 border-red-200 text-red-900"
                          }`}
                        >
                          <div>
                            <p className="text-[10px] font-extrabold tracking-wide uppercase truncate">{e.hallName}</p>
                            <p className="text-xs font-bold text-navy-800 mt-1 truncate">{e.eventType}</p>
                            <p className="text-[9px] font-semibold text-navy-500 mt-0.5 truncate">{e.customerName}</p>
                          </div>
                          <span className={`text-[8px] font-extrabold tracking-wide uppercase px-1.5 py-0.5 rounded-full self-start ${
                            e.status === "Approved" ? "bg-indigo-600 text-white" : "bg-amber-400 text-navy-900"
                          }`}>
                            {e.timeSlot.split(" - ")[0]}
                          </span>
                        </div>
                      ))}
                      {dayEvents.length === 0 && (
                        <div className="h-full flex items-center justify-center opacity-30 py-10">
                          <span className="text-[10px] font-semibold text-navy-400 uppercase tracking-widest">Free</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "day" && (
          <div className="space-y-4" id="calendar-day-grid">
            <div className="bg-navy-50 rounded-2xl p-4 border border-navy-100">
              <div className="flex items-center gap-2 text-navy-600 text-xs font-bold">
                <Info className="w-4 h-4 text-navy-400" />
                <span>Showing hourly reservations overview for Wed, May 15, 2024</span>
              </div>
            </div>

            <div className="border border-navy-100 rounded-2xl overflow-hidden divide-y divide-navy-100 bg-white">
              {["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "01:00 PM - 03:00 PM", "03:00 PM - 05:00 PM", "05:00 PM - 07:00 PM"].map((slot, idx) => {
                const slotEvent = filteredEvents.find(e => e.date === "2024-05-16" && e.timeSlot.includes(slot.split(" - ")[0]));

                return (
                  <div key={idx} className="flex p-4 hover:bg-navy-50/50 transition items-center justify-between">
                    <span className="text-xs font-bold text-navy-500 w-36 tracking-wider">{slot}</span>
                    <div className="flex-1 ml-4 text-left">
                      {slotEvent ? (
                        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                          <div>
                            <span className="text-xs font-extrabold text-indigo-950 tracking-wider uppercase">{slotEvent.hallName}</span>
                            <h4 className="text-sm font-extrabold text-navy-800 mt-0.5">{slotEvent.eventType} • {slotEvent.customerName}</h4>
                          </div>
                          <button
                            onClick={() => onSelectEvent && onSelectEvent(slotEvent.id)}
                            className="bg-white hover:bg-navy-50 text-xs font-bold px-3 py-1.5 rounded-lg border border-navy-200 transition shadow-sm"
                          >
                            Review Request
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-navy-400 tracking-wider">Unscheduled — Hall Available</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
