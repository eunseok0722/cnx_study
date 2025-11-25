import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

interface CarouselSkeletonProps {
  title?: string
  itemCount?: number
}

export function CarouselSkeleton({ title, itemCount = 3 }: CarouselSkeletonProps) {
  return (
    <div className={title ? 'mb-16' : 'w-full'}>
      {title && (
        <Skeleton className="h-9 w-48 mb-8" />
      )}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: itemCount }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

