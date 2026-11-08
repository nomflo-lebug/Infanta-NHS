import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Filter, 
  Tag, 
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { schoolDb } from '../services/schoolDatabase';
import { SchoolUpdate, SchoolActivity } from '../types/school';

export const SchoolUpdatesSection: React.FC = () => {
  const [updates, setUpdates] = useState<SchoolUpdate[]>([]);
  const [activities, setActivities] = useState<SchoolActivity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalUpdate, setActiveModalUpdate] = useState<SchoolUpdate | null>(null);

  useEffect(() => {
    const refreshData = () => {
      setUpdates(schoolDb.getSchoolUpdates());
      setActivities(schoolDb.getSchoolActivities());
    };

    refreshData();
    const unsubscribe = schoolDb.subscribe(refreshData);
    return () => unsubscribe();
  }, []);

  const categories = ['All', 'Announcement', 'Academic', 'Activities', 'Admissions'];

  const filteredUpdates = selectedCategory === 'All' 
    ? updates 
    : updates.filter(u => u.category === selectedCategory);

  return (
    <section id="updates" className="py-20 bg-slate-50 border-b border-slate-200 scroll-mt-48 sm:scroll-mt-52 lg:scroll-mt-56">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-blue-900">
              Bulletin & Events
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-crest tracking-tight text-slate-900 mt-1">
              School Updates & Activities
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Official DepEd memorandums, academic triumphs, calendar of activities, and student announcements.
            </p>
          </div>

          {/* Category Filter Pills (Functional interactive filters) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Layout: News Feed (8 cols) & Activities Calendar (4 cols) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main School Updates Feed */}
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Latest Articles & Official Releases ({filteredUpdates.length})
            </div>

            <div className="space-y-4">
              {filteredUpdates.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-900">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{item.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>By {item.author}</span>
                    </div>
                    {item.featured && (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">
                        Featured Announcement
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-crest text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Ref: {item.id} · {item.tag}
                    </span>
                    <button
                      onClick={() => setActiveModalUpdate(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      <span>Read Full Notice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredUpdates.length === 0 && (
                <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                  No announcements found under "{selectedCategory}".
                </div>
              )}
            </div>
          </div>

          {/* School Activities & Examination Calendar */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-900" />
                <h3 className="text-base font-bold font-crest text-slate-900">School Calendar</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">S.Y. 2026-2027</span>
            </div>

            <div className="space-y-3.5">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-blue-900 font-mono-num">{act.date}</span>
                    <span className="text-emerald-700 font-medium">{act.status}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {act.title}
                  </h4>

                  <div className="space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{act.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{act.venue}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 pt-1 leading-normal">
                    {act.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-200/60 text-xs text-blue-950">
              <strong>DepEd Calendar Advisory:</strong> Exam clearances are distributed by class advisers one week prior to assessment dates.
            </div>
          </div>

        </div>

      </div>

      {/* Full Update Modal */}
      {activeModalUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalUpdate(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-bold text-blue-900">{activeModalUpdate.category}</span>
              <span>·</span>
              <span className="font-mono-num">{activeModalUpdate.date}</span>
              <span>·</span>
              <span>By {activeModalUpdate.author}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-crest text-slate-900">
              {activeModalUpdate.title}
            </h3>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pt-2 border-t border-slate-100">
              <p>{activeModalUpdate.content}</p>
            </div>

            <div className="pt-4 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setActiveModalUpdate(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
