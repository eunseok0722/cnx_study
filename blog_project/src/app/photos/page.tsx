'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// 임시 데이터 (나중에 API에서 가져올 예정)
const mockAlbums = [
  {
    id: '1',
    title: 'Morning station',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    createdAt: 'April, 2020',
    imageCount: 24
  },
  {
    id: '2',
    title: 'Kyoto fashion snap',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=500&fit=crop',
    createdAt: 'March, 2020',
    imageCount: 18
  },
  {
    id: '3',
    title: 'Everyday life in Kyoto',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    createdAt: 'May, 2019',
    imageCount: 32
  },
  {
    id: '4',
    title: 'Kyoto life',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    createdAt: 'July, 2019',
    imageCount: 15
  },
  {
    id: '5',
    title: 'Today',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=350&fit=crop',
    createdAt: 'June, 2019',
    imageCount: 27
  },
  {
    id: '6',
    title: 'The relationship between you and me',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=450&fit=crop',
    createdAt: 'January, 2019',
    imageCount: 22
  },
  {
    id: '7',
    title: 'Urban exploration',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=380&fit=crop',
    createdAt: 'December, 2018',
    imageCount: 19
  },
  {
    id: '8',
    title: 'Street photography',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=520&fit=crop',
    createdAt: 'November, 2018',
    imageCount: 31
  },
  {
    id: '9',
    title: 'City lights',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=420&fit=crop',
    createdAt: 'October, 2018',
    imageCount: 28
  },
  {
    id: '10',
    title: 'Nature walk',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=480&fit=crop',
    createdAt: 'September, 2018',
    imageCount: 16
  },
  {
    id: '11',
    title: 'Portrait series',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=550&fit=crop',
    createdAt: 'August, 2018',
    imageCount: 25
  },
  {
    id: '12',
    title: 'Architecture',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    createdAt: 'July, 2018',
    imageCount: 33
  }
]

const ITEMS_PER_PAGE = 9

export default function PhotosPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentAlbums = mockAlbums.slice(startIndex, endIndex)
  const totalPages = Math.ceil(mockAlbums.length / ITEMS_PER_PAGE)
  
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

  const handleAlbumClick = (albumId: string) => {
    router.push(`/photos/${albumId}`)
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
                <span className="text-sm text-gray-500 font-mono">06</span>
                <h1 className="text-3xl font-bold">Gallery</h1>
              </div>
              <span className="text-sm text-gray-500">Desktop</span>
            </div>
          </div>

          {/* Masonry 그리드 */}
          <div className="max-w-6xl mx-auto">
            <div className="gallery-grid columns-1 md:columns-2 lg:columns-3">
                             {currentAlbums.map((album) => (
                 <div key={album.id} className="gallery-item">
                   <Card 
                     className="overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105"
                     onClick={() => handleAlbumClick(album.id)}
                   >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={album.thumbnail}
                          alt={album.title}
                          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium mb-1">{album.title}</h3>
                        <p className="text-sm text-gray-600">{album.createdAt}</p>
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
