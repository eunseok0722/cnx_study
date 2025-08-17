'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/store'

export default function PlacePage() {
  const router = useRouter()
  const { 
    getCurrentPlaces, 
    placesPagination, 
    setPlacesPagination 
  } = useAppStore()
  
  const currentPlaces = getCurrentPlaces()
  const { currentPage, totalPages } = placesPagination
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      setPlacesPagination({ currentPage: currentPage + 1 })
    }
  }
  
  const handlePrev = () => {
    if (currentPage > 1) {
      setPlacesPagination({ currentPage: currentPage - 1 })
    }
  }

  const handlePlaceClick = (placeId: string) => {
    router.push(`/place/${placeId}`)
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
            <span className="text-sm text-gray-500">Desktop</span>
          </div>
        </div>

        {/* Masonry 그리드 */}
        <div className="max-w-6xl mx-auto">
          <div className="gallery-grid columns-1 md:columns-2 lg:columns-3">
            {currentPlaces.map((place) => (
              <div key={place.id} className="gallery-item">
                <Card 
                  className="overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => handlePlaceClick(place.id)}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={place.thumbnail}
                        alt={place.title}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-1">{place.title}</h3>
                      <p className="text-sm text-gray-600">{place.createdAt}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
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
            
            {/* Next 링크 */}
            <div className="page-nav-right">
              <span className="next-link text-sm">
                Next
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
