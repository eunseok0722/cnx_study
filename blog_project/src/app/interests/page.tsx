'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { GalleryGrid } from '@/components/gallery/gallery-grid'

export default function InterestsPage() {
  const { 
    getCurrentGalleryItems, 
    youtubePagination, 
    setYouTubePagination,
    fetchYouTubePlaylists,
    youtubeLoading,
    youtubeError
  } = useAppStore()
  
  const currentItems = getCurrentGalleryItems('youtube')
  const { currentPage, totalPages } = youtubePagination
  
  // 컴포넌트 마운트 시 재생목록 가져오기
  useEffect(() => {
    fetchYouTubePlaylists()
  }, [fetchYouTubePlaylists])
  
  const handlePageChange = (page: number) => {
    setYouTubePagination({ currentPage: page })
  }

  if (youtubeLoading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">흥미거리를 불러오는 중...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (youtubeError) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h2>
                <p className="text-gray-600 mb-4">{youtubeError}</p>
                <button 
                  onClick={() => fetchYouTubePlaylists()}
                  className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        {/* 페이지 헤더 */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 font-mono">05</span>
              <h1 className="text-3xl font-bold">Interests</h1>
            </div>
          </div>
        </div>

        {/* 갤러리 그리드 */}
        <GalleryGrid
          items={currentItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          category="youtube"
        />
      </div>
    </div>
  )
}
