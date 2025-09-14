'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { useAppStore } from '@/store'
import { YouTubePlayerState } from '@/types'
import { YouTubePlayer, YouTubePlayerControls } from '@/components/youtube/youtube-player'

export default function InterestsPlaylistDetailPage() {
  const params = useParams()
  const playlistId = params.playlistId as string
  
  console.log('Playlist ID from params:', playlistId)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  // const [playerState, setPlayerState] = useState<YouTubePlayerState>({
  //   isPlaying: true,
  //   currentVideoId: null,
  //   currentVideoIndex: 0,
  //   volume: 50,
  //   duration: 0,
  //   currentTime: 0
  // })
  const [playerError, setPlayerError] = useState<string | null>(null)
  
  const { 
    getYouTubePlaylistById, 
    getYouTubePlaylistVideos, 
    fetchYouTubePlaylistVideos,
    youtubeLoading,
    youtubeError
  } = useAppStore()
  
  const playlist = getYouTubePlaylistById(playlistId)
  const videos = getYouTubePlaylistVideos(playlistId)
  const currentVideo = videos[currentVideoIndex]
  
  console.log('Playlist found:', playlist)
  console.log('Videos found:', videos)
  console.log('YouTube loading:', youtubeLoading)
  console.log('YouTube error:', youtubeError)

  // 컴포넌트 마운트 시 비디오 목록 가져오기
  useEffect(() => {
    if (playlistId && videos.length === 0) {
      fetchYouTubePlaylistVideos(playlistId)
    }
  }, [playlistId, videos.length, fetchYouTubePlaylistVideos])

  if (!playlist) {
    return (
      <>
        <Header />
        <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">재생목록을 찾을 수 없습니다</h1>
            <p className="text-gray-600">요청하신 재생목록이 존재하지 않습니다.</p>
          </div>
        </div>
      </>
    )
  }

  if (youtubeLoading) {
    return (
      <>
        <Header />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white/80">비디오를 불러오는 중...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (youtubeError) {
    return (
      <>
        <Header />
        <div className="pt-20 min-h-screen bg-gray-50">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h2>
                  <p className="text-gray-600 mb-4">{youtubeError}</p>
                  <button 
                    onClick={() => fetchYouTubePlaylistVideos(playlistId)}
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!currentVideo) {
    return (
      <>
        <Header />
        <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">비디오가 없습니다</h1>
            <p className="text-gray-600">이 재생목록에는 비디오가 없습니다.</p>
          </div>
        </div>
      </>
    )
  }

  // 핸들러 함수들 정의
  const handlePrevious = () => {
    setCurrentVideoIndex(prev => 
      prev > 0 ? prev - 1 : videos.length - 1
    )
    // 이전 비디오로 이동 시 자동 재생
    setIsPlaying(true)
  }

  const handleNext = () => {
    setCurrentVideoIndex(prev => 
      prev < videos.length - 1 ? prev + 1 : 0
    )
    // 다음 비디오로 이동 시 자동 재생
    setIsPlaying(true)
  }

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index)
    // 비디오 변경 시 에러 상태 초기화
    setPlayerError(null)
    // 썸네일 클릭 시 자동 재생
    setIsPlaying(true)
  }

  const handlePlayerStateChange = (newState: YouTubePlayerState) => {
    console.log('Player state changed:', newState)
    // isPlaying 상태는 YouTubePlayer 컴포넌트에서 직접 관리
  }



  const handlePlayerError = (error: string) => {
    console.error('Player error:', error)
    // 치명적인 에러만 에러 상태로 설정
    if (error.includes('비디오를 찾을 수 없습니다') || 
        error.includes('임베드할 수 없습니다') ||
        error.includes('API')) {
      setPlayerError(error)
    }
  }

  const openInYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${currentVideo.videoId}`, '_blank')
  }

  // 플레이어 에러 상태 처리
  if (playerError) {
    return (
      <>
        <Header />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-white">
                  <h2 className="text-2xl font-bold mb-4">플레이어 오류</h2>
                  <p className="text-white/80 mb-4">{playerError}</p>
                  <div className="flex space-x-4 justify-center">
                    <button 
                      onClick={() => setPlayerError(null)}
                      className="px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
                    >
                      다시 시도
                    </button>
                    <button 
                      onClick={openInYouTube}
                      className="px-4 py-2 bg-white text-black rounded hover:bg-white/90 transition-colors"
                    >
                      YouTube에서 보기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
        <div className="container mx-auto px-6 py-12">
          {/* 메인 YouTube 플레이어 */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
              {/* 좌측: YouTube 플레이어 */}
              <div className="flex flex-col items-center lg:items-start space-y-6">
                {/* 비디오 번호 */}
                <div className="text-white/70 text-sm font-mono">
                  {(currentVideoIndex + 1).toString().padStart(2, '0')} / {videos.length.toString().padStart(2, '0')}
                </div>
                
                {/* YouTube 플레이어 */}
                <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-lg overflow-hidden shadow-2xl">
                  <YouTubePlayer
                    video={currentVideo}
                    isPlaying={isPlaying}
                    onStateChange={handlePlayerStateChange}
                    onError={handlePlayerError}
                    className="w-full h-full"
                  />
                </div>
                
                {/* 비디오 정보 */}
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {currentVideo.title}
                  </h1>
                  <p className="text-xl text-white/80">
                    {currentVideo.channelTitle}
                  </p>
                  <p className="text-sm text-white/60 mt-2">
                    {currentVideo.duration}
                  </p>
                </div>
              </div>

              {/* 우측: 재생 컨트롤 */}
              <div className="flex flex-col items-center lg:items-start space-y-8">
                <YouTubePlayerControls
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  totalVideos={videos.length}
                  currentVideoIndex={currentVideoIndex}
                />

                {/* 재생목록 정보 */}
                <div className="text-white/80">
                  <h2 className="text-xl font-semibold mb-2">{playlist.title}</h2>
                  <p className="text-sm">{videos.length} videos</p>
                </div>

                {/* YouTube에서 보기 버튼 */}
                <Button
                  variant="outline"
                  className="border-white/30 hover:bg-white/10"
                  onClick={openInYouTube}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  YouTube에서 보기
                </Button>
              </div>
            </div>

            {/* 하단: 재생목록 */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Playlist</h3>
                <p className="text-white/70">
                  {(currentVideoIndex + 1).toString().padStart(2, '0')} / {videos.length.toString().padStart(2, '0')}
                </p>
              </div>
              
              {/* 비디오 썸네일 Swiper */}
              <div className="max-w-6xl mx-auto">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={30}
                  slidesPerView={5}
                  slidesPerGroup={5}
                  navigation={true}
                  pagination={{ 
                    clickable: true,
                    dynamicBullets: true,
                    dynamicMainBullets: 5
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 8,
                      slidesPerGroup: 8,
                      spaceBetween: 20,
                      pagination: {
                        clickable: true,
                        dynamicBullets: true,
                        dynamicMainBullets: 5
                      }
                    },
                    768: {
                      slidesPerView: 10,
                      slidesPerGroup: 10,
                      spaceBetween: 30,
                      pagination: {
                        clickable: true,
                        dynamicBullets: true,
                        dynamicMainBullets: 5
                      }
                    },
                    1024: {
                      slidesPerView: 12,
                      slidesPerGroup: 10,
                      spaceBetween: 30,
                      pagination: {
                        clickable: true,
                        dynamicBullets: true,
                        dynamicMainBullets: 5
                      }
                    },
                  }}
                  className="playlist-swiper"
                >
                  {videos.map((video, index) => (
                    <SwiperSlide key={`${video.id}-${index}`}>
                      <div
                        className={`relative cursor-pointer transition-transform duration-300 hover:scale-105 ${
                          index === currentVideoIndex ? 'ring-2 ring-white' : ''
                        }`}
                        onClick={() => handleVideoSelect(index)}
                      >
                        <div className="relative aspect-square overflow-hidden rounded-lg">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black text-xs rounded-full flex items-center justify-center font-bold">
                          {(index + 1).toString().padStart(2, '0')}
                        </div>
                        {index === currentVideoIndex && (
                          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
