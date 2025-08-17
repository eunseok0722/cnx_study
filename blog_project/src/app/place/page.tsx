'use client'

import { useAppStore } from '@/store'
import { GalleryGrid } from '@/components/gallery/gallery-grid'

export default function PlacePage() {
  const { 
    getCurrentGalleryItems, 
    placesPagination, 
    setPlacesPagination 
  } = useAppStore()
  
  const currentItems = getCurrentGalleryItems('place')
  const { currentPage, totalPages } = placesPagination
  
  const handlePageChange = (page: number) => {
    setPlacesPagination({ currentPage: page })
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        {/* 페이지 헤더 */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 font-mono">03</span>
              <h1 className="text-3xl font-bold">Place</h1>
            </div>
          </div>
        </div>

        {/* 갤러리 그리드 */}
        <GalleryGrid
          items={currentItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          category="place"
        />
      </div>
    </div>
  )
}
