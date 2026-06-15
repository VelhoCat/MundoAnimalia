import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnimalCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-18 rounded-full" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}
