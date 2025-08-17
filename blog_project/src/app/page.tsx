'use client'

import { RecentWorkCarousel } from '@/components/home/recent-work-carousel'
import { useAppStore } from '@/store'

export default function Home() {
  const { recentWork } = useAppStore()
  
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        {/* 메인 콘텐츠 */}
        <div className="max-w-6xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 font-mono">01</span>
                <h1 className="text-3xl font-bold">Home</h1>
              </div>
              <span className="text-sm text-gray-500">Desktop</span>
            </div>
          </div>
          
          {/* RECENT WORK 섹션 */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 tracking-wide">RECENT WORK</h2>
            <RecentWorkCarousel albums={recentWork.slice(0, 8)} />
          </div>
        </div>
      </div>
    </div>
  )
}
