import { Header } from '@/components/layout/header'
import { RecentWorkCarousel } from '@/components/home/recent-work-carousel'

// 임시 데이터 (나중에 API에서 가져올 예정)
const mockAlbums = [
  {
    id: '1',
    title: 'Quiet Place',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    createdAt: '2024-01-15',
    imageCount: 24
  },
  {
    id: '2',
    title: 'Movement',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    createdAt: '2024-01-10',
    imageCount: 18
  },
  {
    id: '3',
    title: 'Urban Life',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    createdAt: '2024-01-05',
    imageCount: 32
  },
  {
    id: '4',
    title: 'Nature Walk',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    createdAt: '2024-01-01',
    imageCount: 15
  },
  {
    id: '5',
    title: 'City Lights',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    createdAt: '2023-12-28',
    imageCount: 27
  }
]

export default function Home() {
  return (
    <>
      <Header />
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          {/* 메인 콘텐츠 */}
          <div className="max-w-6xl mx-auto">
            {/* RECENT WORK 섹션 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 tracking-wide">RECENT WORK</h2>
              <RecentWorkCarousel albums={mockAlbums} />
            </div>

            {/* 하단 정보 */}
            <div className="flex items-center justify-between text-sm text-gray-500 mt-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-1 bg-gray-300 rounded-full">
                  <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
                </div>
                <span>Progress</span>
              </div>
              <span>copyright 2024</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
