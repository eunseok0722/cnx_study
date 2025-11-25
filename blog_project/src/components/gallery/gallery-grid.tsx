'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { GalleryItem } from '@/types'

interface GalleryGridProps {
  items: GalleryItem[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  category: 'photos' | 'place' | 'youtube'
  isLoading?: boolean
}

export function GalleryGrid({ 
  items, 
  currentPage, 
  totalPages, 
  onPageChange, 
  category,
  isLoading = false
}: GalleryGridProps) {
  const router = useRouter()

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }
  
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleItemClick = (itemId: string) => {
    // ID에서 카테고리 접두사 제거하여 실제 ID 추출
    const actualId = itemId.replace(`${category}-`, '')
    
    if (category === 'youtube') {
      router.push(`/interests/${actualId}`)
    } else {
      router.push(`/${category}/${actualId}`)
    }
  }

  // 다양한 높이를 위한 랜덤 높이 배열 (실제 masonry 레이아웃과 유사하게)
  const skeletonHeights = [
    'h-48', 'h-56', 'h-64', 'h-52', 'h-60', 
    'h-44', 'h-52', 'h-56', 'h-48', 'h-64'
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Masonry 그리드 */}
      <div className="gallery-grid columns-1 md:columns-2 lg:columns-3">
        {isLoading || items.length === 0 ? (
          // 스켈레톤 카드
          Array.from({ length: 9 }).map((_, index) => {
            const height = skeletonHeights[index % skeletonHeights.length]
            return (
              <div key={`skeleton-${index}`} className="gallery-item">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Skeleton className={`w-full ${height}`} />
                    </div>
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })
        ) : (
          // 실제 카드
          items.map((item) => (
            <div key={item.id} className="gallery-item">
              <Card 
                className="overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => handleItemClick(item.id)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      {item.subtitle || item.createdAt}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="page-nav">
        <div className="page-nav-left">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="text-sm"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="text-sm"
          >
            Next
          </Button>
        </div>
      
      </div>
    </div>
  )
}
