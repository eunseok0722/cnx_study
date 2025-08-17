'use client'

import { useAppStore } from '@/store'
import { GalleryGrid } from '@/components/gallery/gallery-grid'

export default function MusicPage() {
  const { 
    getCurrentGalleryItems, 
    musicPagination, 
    setMusicPagination 
  } = useAppStore()
  
  const currentItems = getCurrentGalleryItems('music')
  const { currentPage, totalPages } = musicPagination
  
  const handlePageChange = (page: number) => {
    setMusicPagination({ currentPage: page })
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        {/* 페이지 헤더 */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 font-mono">04</span>
              <h1 className="text-3xl font-bold">Music</h1>
            </div>
          </div>
        </div>

        {/* 갤러리 그리드 */}
        <GalleryGrid
          items={currentItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          category="music"
        />
      </div>
    </div>
  )
}
