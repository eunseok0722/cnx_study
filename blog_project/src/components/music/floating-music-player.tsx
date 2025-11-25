'use client'

import { useEffect, useState, useRef } from 'react'
import { Play, Pause, ChevronsLeft, ChevronsRight, Volume2, VolumeX, X } from 'lucide-react'
import { useAppStore } from '@/store'
import { YouTubePlayerState } from '@/types'
import { YouTubePlayer } from '@/components/youtube/youtube-player'

interface FloatingMusicPlayerProps {
  playlistId: string
  className?: string
}

export function FloatingMusicPlayer({ playlistId, className = '' }: FloatingMusicPlayerProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const playerInstanceRef = useRef<any>(null)
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const {
    getYouTubePlaylistById,
    getYouTubePlaylistVideos,
    fetchYouTubePlaylistVideos,
    youtubeLoading
  } = useAppStore()

  const playlist = getYouTubePlaylistById(playlistId)
  const videos = getYouTubePlaylistVideos(playlistId)
  const currentVideo = videos[currentVideoIndex]

  // 재생목록 비디오 로드
  useEffect(() => {
    if (playlistId && videos.length === 0) {
      fetchYouTubePlaylistVideos(playlistId)
    }
  }, [playlistId, videos.length, fetchYouTubePlaylistVideos])

  // 컴포넌트 언마운트 시 재생 중지
  useEffect(() => {
    return () => {
      // 컴포넌트가 언마운트될 때 재생 중지
      if (playerInstanceRef.current && playerInstanceRef.current.pauseVideo) {
        try {
          playerInstanceRef.current.pauseVideo()
        } catch (error) {
          console.warn('Failed to pause video on unmount:', error)
        }
      }
      // interval 정리
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
        timeUpdateIntervalRef.current = null
      }
    }
  }, [])

  // 플레이어 상태 업데이트
  const handlePlayerStateChange = (state: YouTubePlayerState) => {
    setIsPlaying(state.isPlaying)
    setCurrentTime(state.currentTime)
    setDuration(state.duration)
  }

  // 1초마다 재생 진행 시간 업데이트
  useEffect(() => {
    if (isPlaying && currentVideo) {
      // 플레이어 인스턴스가 준비될 때까지 대기
      const checkPlayer = () => {
        if (playerInstanceRef.current && playerInstanceRef.current.getCurrentTime) {
          timeUpdateIntervalRef.current = setInterval(() => {
            try {
              if (playerInstanceRef.current && playerInstanceRef.current.getCurrentTime) {
                const current = playerInstanceRef.current.getCurrentTime()
                const total = playerInstanceRef.current.getDuration()
                if (current !== null && total !== null && !isNaN(current) && !isNaN(total)) {
                  setCurrentTime(current)
                  setDuration(total)
                }
              }
            } catch (error) {
              console.warn('Failed to update current time:', error)
            }
          }, 1000) // 1초마다 업데이트
        } else {
          // 플레이어가 아직 준비되지 않았으면 잠시 후 다시 시도
          setTimeout(checkPlayer, 100)
        }
      }
      
      checkPlayer()
    }

    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
        timeUpdateIntervalRef.current = null
      }
    }
  }, [isPlaying, currentVideo?.videoId])

  // 이전 곡
  const handlePrevious = () => {
    if (videos.length === 0) return
    const newIndex = currentVideoIndex > 0 ? currentVideoIndex - 1 : videos.length - 1
    setCurrentVideoIndex(newIndex)
    setIsPlaying(true)
  }

  // 다음 곡
  const handleNext = () => {
    if (videos.length === 0) return
    const newIndex = currentVideoIndex < videos.length - 1 ? currentVideoIndex + 1 : 0
    setCurrentVideoIndex(newIndex)
    setIsPlaying(true)
  }

  // 재생/일시정지
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // 볼륨 토글
  const handleVolumeToggle = () => {
    setIsMuted(!isMuted)
  }

  // 진행 바 클릭
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return
    
    const rect = progressBarRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = percentage * duration
    
    setCurrentTime(newTime)
    // YouTube 플레이어 API를 통해 시간 설정
    if (playerInstanceRef.current && playerInstanceRef.current.seekTo) {
      try {
        playerInstanceRef.current.seekTo(newTime, true)
      } catch (error) {
        console.warn('Failed to seek:', error)
      }
    }
  }

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 재생목록이 없거나 로딩 중이면 표시하지 않음
  if (!playlist || youtubeLoading || videos.length === 0) {
    return null
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={`fixed bottom-24 left-3 right-3 md:left-6 md:right-auto z-50 ${isMinimized ? 'w-16 h-16' : 'w-auto max-w-[calc(100%-1.5rem)] md:max-w-[420px] md:w-[420px]'} transition-all duration-300 ${className}`}>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* 메인 플레이어 영역 */}
        {!isMinimized && (
          <div className="relative flex items-center p-4 gap-4">
            {/* 닫기 버튼 - 좌측 상단 */}
            <button
              onClick={() => setIsMinimized(true)}
              className="absolute top-2 left-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 z-10"
              title="최소화"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 원형 앨범 아트 */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 ring-2 ring-gray-100">
                {currentVideo?.thumbnail ? (
                  <img
                    src={currentVideo.thumbnail}
                    alt={currentVideo.title}
                    className="w-full h-full object-cover"
                  />
                ) : playlist.thumbnail ? (
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {playlist.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {/* 재생 중 표시 점 */}
              {isPlaying && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </div>

            {/* 곡 정보 및 컨트롤 */}
            <div className="flex-1 min-w-0">
              {/* 곡 제목 및 아티스트 */}
              <div className="mb-2">
                <h3 className="text-sm font-bold text-gray-900 truncate mb-0.5">
                  {currentVideo?.title || '재생 중...'}
                </h3>
                <p className="text-xs text-gray-600 truncate">
                  {currentVideo?.channelTitle || playlist.channelTitle}
                </p>
              </div>

              {/* 재생 진행 바 */}
              <div
                ref={progressBarRef}
                className="relative h-1.5 bg-gray-200 rounded-full mb-3 cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div
                  className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  style={{ left: `calc(${progressPercentage}% - 8px)` }}
                />
              </div>

              {/* 컨트롤 버튼 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {/* 이전 곡 */}
                  <button
                    onClick={handlePrevious}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={videos.length <= 1}
                    title="이전 곡"
                  >
                    <ChevronsLeft className="w-4 h-4 text-gray-700" />
                  </button>

                  {/* 재생/일시정지 */}
                  <button
                    onClick={handlePlayPause}
                    className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors ml-1"
                    title={isPlaying ? '일시정지' : '재생'}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>

                  {/* 다음 곡 */}
                  <button
                    onClick={handleNext}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={videos.length <= 1}
                    title="다음 곡"
                  >
                    <ChevronsRight className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* 볼륨 컨트롤 */}
                <button
                  onClick={handleVolumeToggle}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  title={isMuted ? '음소거 해제' : '음소거'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 최소화된 상태 */}
        {isMinimized && (
          <button
            onClick={() => setIsMinimized(false)}
            className="w-16 h-16 p-2 hover:bg-gray-50 transition-colors"
            title="플레이어 열기"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 ring-2 ring-gray-100">
              {currentVideo?.thumbnail ? (
                <img
                  src={currentVideo.thumbnail}
                  alt={currentVideo.title}
                  className="w-full h-full object-cover"
                />
              ) : playlist.thumbnail ? (
                <img
                  src={playlist.thumbnail}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400" />
              )}
            </div>
            {isPlaying && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>
        )}

        {/* 숨겨진 YouTube 플레이어 (실제 재생용) */}
        <div className="hidden">
          {currentVideo && (
            <YouTubePlayer
              video={currentVideo}
              isPlaying={isPlaying}
              onStateChange={handlePlayerStateChange}
              playerRef={playerInstanceRef}
            />
          )}
        </div>
      </div>
    </div>
  )
}

