'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// 임시 데이터 (음식/식당 이미지)
const mockPlaces = [
  {
    id: '1',
    title: 'Traditional Ramen House',
    thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    createdAt: 'April, 2020',
    imageCount: 24
  },
  {
    id: '2',
    title: 'Kyoto Sushi Bar',
    thumbnail: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=500&fit=crop',
    createdAt: 'March, 2020',
    imageCount: 18
  },
  {
    id: '3',
    title: 'Street Food Market',
    thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
    createdAt: 'May, 2019',
    imageCount: 32
  },
  {
    id: '4',
    title: 'Cozy Coffee Shop',
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=600&fit=crop',
    createdAt: 'July, 2019',
    imageCount: 15
  },
  {
    id: '5',
    title: 'Authentic Izakaya',
    thumbnail: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=350&fit=crop',
    createdAt: 'June, 2019',
    imageCount: 27
  },
  {
    id: '6',
    title: 'Modern Fusion Restaurant',
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=450&fit=crop',
    createdAt: 'January, 2019',
    imageCount: 22
  },
  {
    id: '7',
    title: 'Traditional Tea House',
    thumbnail: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=380&fit=crop',
    createdAt: 'December, 2018',
    imageCount: 19
  },
  {
    id: '8',
    title: 'Seafood Market',
    thumbnail: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=520&fit=crop',
    createdAt: 'November, 2018',
    imageCount: 31
  },
  {
    id: '9',
    title: 'Artisan Bakery',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=420&fit=crop',
    createdAt: 'October, 2018',
    imageCount: 28
  },
  {
    id: '10',
    title: 'Rooftop Dining',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=480&fit=crop',
    createdAt: 'September, 2018',
    imageCount: 16
  },
  {
    id: '11',
    title: 'Hidden Gem Cafe',
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=550&fit=crop',
    createdAt: 'August, 2018',
    imageCount: 25
  },
  {
    id: '12',
    title: 'Traditional Tempura',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
    createdAt: 'July, 2018',
    imageCount: 33
  }
]

const ITEMS_PER_PAGE = 9

export default function PlacePage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPlaces = mockPlaces.slice(startIndex, endIndex)
  const totalPages = Math.ceil(mockPlaces.length / ITEMS_PER_PAGE)
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePlaceClick = (placeId: string) => {
    router.push(`/place/${placeId}`)
  }

  return (
    <>
      <Header />
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          {/* 페이지 헤더 */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 font-mono">07</span>
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

          {/* 푸터 */}
          <div className="gallery-footer max-w-6xl mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Copyright © tsukudani 2024</span>
              <div className="social-links">
                <a href="#" className="hover:text-gray-700 transition-colors">Facebook</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Instagram</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Pinterest</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
