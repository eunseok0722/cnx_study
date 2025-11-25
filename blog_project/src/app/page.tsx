'use client'

import { useEffect } from 'react'
import { Carousel } from '@/components/home/carousel'
import { useAppStore } from '@/store'

export default function Home() {
  const { 
    recentWork, 
    albums, 
    places, 
    youtubePlaylists,
    fetchAlbums, 
    fetchPlaces, 
    fetchYouTubePlaylists 
  } = useAppStore()
  
  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchAlbums()
    fetchPlaces()
    fetchYouTubePlaylists()
  }, [fetchAlbums, fetchPlaces, fetchYouTubePlaylists])
  
  // 각 카테고리별 아이템 변환
  const photosItems = albums.map(album => ({
    id: album.id,
    title: album.title,
    thumbnail: album.thumbnail,
    category: 'photos' as const,
    createdAt: album.createdAt,
  }))

  const placeItems = places.map(place => ({
    id: place.id,
    title: place.title,
    thumbnail: place.thumbnail,
    category: 'place' as const,
    createdAt: place.createdAt,
  }))

  const interestsItems = youtubePlaylists.map(playlist => ({
    id: playlist.id,
    title: playlist.title,
    thumbnail: playlist.thumbnail,
    category: 'youtube' as const,
    createdAt: playlist.publishedAt,
    subtitle: playlist.channelTitle,
  }))
  
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
            </div>
          </div>
          
          {/* RECENT WORK 섹션 */}
          <Carousel 
            items={recentWork?.slice(0, 8) || []} 
            title="RECENT WORK"
            removeIdPrefix={true}
            className="carousel-swiper"
          />

          {/* Photos 캐러셀 */}
          <Carousel 
            title="Photos" 
            items={photosItems} 
            category="photos"
            className="carousel-swiper"
          />

          {/* Place 캐러셀 */}
          {/* <Carousel 
            title="Place" 
            items={placeItems} 
            category="place"
            className="carousel-swiper"
          /> */}

          {/* Interests 캐러셀 */}
          <Carousel 
            title="Interests" 
            items={interestsItems} 
            category="youtube"
            className="carousel-swiper"
          />
        </div>
      </div>
    </div>
  )
}
