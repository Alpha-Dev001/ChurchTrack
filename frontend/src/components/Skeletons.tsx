import React from "react";

export function HallCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-navy-200 overflow-hidden animate-pulse flex flex-col h-full">
      <div className="relative aspect-[16/10] bg-navy-200 w-full overflow-hidden">
        <div className="absolute top-3 right-3 w-16 h-6 bg-navy-300 rounded" />
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="w-24 h-3 bg-navy-200 rounded" />
          <div className="w-3/4 h-5 bg-navy-300 rounded" />
          <div className="w-full h-3 bg-navy-100 rounded mt-2" />
          <div className="w-2/3 h-3 bg-navy-100 rounded" />
        </div>
        <div className="pt-3 border-t border-navy-100 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="w-12 h-2.5 bg-navy-200 rounded" />
            <div className="w-20 h-4 bg-navy-300 rounded" />
          </div>
          <div className="space-y-1">
            <div className="w-12 h-2.5 bg-navy-200 rounded" />
            <div className="w-24 h-4 bg-navy-300 rounded" />
          </div>
        </div>
        <div className="w-full h-10 bg-navy-200 rounded-lg mt-2" />
      </div>
    </div>
  );
}

export function HallDetailsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-pulse space-y-8">
      <div className="w-48 h-3 bg-navy-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="aspect-[16/10] bg-navy-200 rounded-lg" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-14 bg-navy-100 rounded" />
            ))}
          </div>
          <div className="space-y-3">
            <div className="w-2/3 h-8 bg-navy-300 rounded" />
            <div className="w-1/3 h-4 bg-navy-200 rounded" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-navy-100 rounded-lg" />
            ))}
          </div>
          <div className="h-32 bg-navy-100 rounded-lg" />
        </div>
        <div className="h-[28rem] bg-navy-100 rounded-lg" />
      </div>
    </div>
  );
}

export function BookingTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg border border-navy-200 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-navy-100 flex justify-between items-center">
        <div className="w-36 h-5 bg-navy-200 rounded" />
        <div className="w-20 h-4 bg-navy-200 rounded" />
      </div>
      <div className="divide-y divide-navy-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-200 rounded shrink-0" />
              <div className="space-y-1.5">
                <div className="w-32 h-4 bg-navy-300 rounded" />
                <div className="w-24 h-3 bg-navy-200 rounded" />
              </div>
            </div>
            <div className="hidden sm:block space-y-1.5">
              <div className="w-28 h-4 bg-navy-200 rounded" />
              <div className="w-20 h-3 bg-navy-100 rounded" />
            </div>
            <div className="w-20 h-7 bg-navy-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-lg border border-navy-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-navy-200 rounded-lg shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="w-20 h-3 bg-navy-200 rounded" />
            <div className="w-16 h-6 bg-navy-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrackBookingSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-navy-200 p-6 shadow-sm animate-pulse space-y-6">
      <div className="flex justify-between items-center border-b border-navy-100 pb-4">
        <div className="space-y-2">
          <div className="w-24 h-3 bg-navy-200 rounded" />
          <div className="w-40 h-6 bg-navy-300 rounded" />
        </div>
        <div className="w-24 h-8 bg-navy-200 rounded" />
      </div>
      <div className="space-y-4">
        <div className="h-16 bg-navy-100 rounded-lg" />
        <div className="h-16 bg-navy-100 rounded-lg" />
        <div className="h-24 bg-navy-100 rounded-lg" />
      </div>
    </div>
  );
}

export function BookingDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" id="booking-details-skeleton">
      <div className="flex items-center gap-3 border-b border-navy-100 pb-5">
        <div className="w-10 h-10 bg-navy-200 rounded-lg" />
        <div className="space-y-2 flex-1">
          <div className="w-28 h-3 bg-navy-200 rounded" />
          <div className="w-56 h-6 bg-navy-300 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="h-40 bg-navy-100 rounded-lg" />
          <div className="h-52 bg-navy-100 rounded-lg" />
          <div className="h-36 bg-navy-100 rounded-lg" />
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-navy-100 rounded-lg" />
          <div className="h-40 bg-navy-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ButtonSkeleton({ className = "" }: { className?: string }) {
  return <span className={`inline-block h-4 w-16 bg-navy-200/60 rounded animate-pulse ${className}`} />;
}
