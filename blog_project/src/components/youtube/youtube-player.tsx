'use client'

import { useEffect, useRef, useState } from 'react'
import { YouTubeVideo, YouTubePlayerState } from '@/types'
import { loadYouTubeAPI, createPlayerOptions, YT_PLAYER_STATE, getErrorMessage } from '@/lib/youtube-player'

interface YouTubePlayerProps {
  video: YouTubeVideo
  isPlaying: boolean
  onStateChange?: (state: YouTubePlayerState) => void
  onError?: (error: string) => void
  className?: string
  playerRef?: React.MutableRefObject<any> // 플레이어 인스턴스를 외부에 노출
}

export function YouTubePlayer({ 
  video, 
  isPlaying, 
  onStateChange, 
  onError,
  className = '',
  playerRef: externalPlayerRef
}: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const playerInstanceRef = useRef<any>(null)
  
  // 외부 ref가 제공되면 플레이어 인스턴스를 노출
  useEffect(() => {
    if (externalPlayerRef) {
      externalPlayerRef.current = playerInstanceRef.current
    }
  }, [externalPlayerRef, playerInstanceRef.current])
  const [isReady, setIsReady] = useState(false)
  const [playerState, setPlayerState] = useState<YouTubePlayerState>({
    isPlaying: false,
    currentVideoId: null,
    currentVideoIndex: 0,
    volume: 50,
    duration: 0,
    currentTime: 0
  })

  // YouTube API 로드 및 플레이어 초기화
  useEffect(() => {
    const initializePlayer = async () => {
      try {
        console.log('Initializing YouTube Player for video:', video.videoId)
        await loadYouTubeAPI()
        
        if (playerRef.current && video.videoId) {
          const options = createPlayerOptions(video.videoId, {
            onReady: (event: any) => {
              try {
                playerInstanceRef.current = event.target
                // 외부 ref에 플레이어 인스턴스 노출
                if (externalPlayerRef) {
                  externalPlayerRef.current = event.target
                }
                setIsReady(true)
                console.log('YouTube Player ready for video:', video.videoId)
                setPlayerState(prev => ({
                  ...prev,
                  currentVideoId: video.videoId,
                  duration: event.target.getDuration() || 0,
                  isPlaying: true
                }))
                // 초기 상태를 isPlaying prop 값으로 설정
              } catch (error) {
                console.warn('YouTube Player ready error:', error)
                // ready 에러는 치명적이지 않으므로 에러 상태로 설정하지 않음
              }
            },
            onStateChange: (event: any) => {
              try {
                console.log('YouTube Player state changed:', event.data)
                const isCurrentlyPlaying = event.data === YT_PLAYER_STATE.PLAYING
                const newState = {
                  isPlaying: isCurrentlyPlaying,
                  currentVideoId: video.videoId,
                  currentVideoIndex: 0,
                  volume: playerInstanceRef.current?.getVolume() || 50,
                  duration: playerInstanceRef.current?.getDuration() || 0,
                  currentTime: playerInstanceRef.current?.getCurrentTime() || 0
                }
                setPlayerState(newState)
                onStateChange?.(newState)
              } catch (error) {
                console.warn('YouTube Player state change error:', error)
              }
            },
            onError: (event: any) => {
              try {
                console.error('YouTube Player error:', event.data)
                // 일부 에러는 치명적이지 않으므로 특정 에러만 처리
                if (event.data === 100 || event.data === 101 || event.data === 150) {
                  const errorMessage = getErrorMessage(event.data)
                  onError?.(errorMessage)
                }
              } catch (error) {
                console.warn('Error handling error:', error)
              }
            }
          })

          new window.YT.Player(playerRef.current, options)
        }
      } catch (error) {
        console.error('YouTube Player initialization error:', error)
        // 초기화 에러만 에러 상태로 설정
        if (error instanceof Error && error.message.includes('API')) {
          onError?.(error.message)
        }
      }
    }

    // 비디오 ID가 있을 때만 초기화
    if (video.videoId) {
      initializePlayer()
    }

    // 컴포넌트 언마운트 시 플레이어 정리
    return () => {
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy()
        } catch (error) {
          console.warn('YouTube Player destroy error:', error)
        }
        playerInstanceRef.current = null
      }
    }
  }, [video.videoId])

  // 재생/일시정지 제어
  useEffect(() => {
    if (playerInstanceRef.current && isReady) {
      try {
        // 플레이어가 준비되었는지 확인
        if (playerInstanceRef.current.getPlayerState) {
          const currentState = playerInstanceRef.current.getPlayerState()
          console.log('Current player state:', currentState, 'isPlaying:', isPlaying)
          
          // 상태가 실제로 다를 때만 제어
          if (isPlaying && currentState !== 1) { // 1 = PLAYING
            playerInstanceRef.current.playVideo()
          } else if (!isPlaying && currentState === 1) { // 1 = PLAYING
            playerInstanceRef.current.pauseVideo()
          }
        }
      } catch (error) {
        console.warn('YouTube Player control error:', error)
        // 제어 에러는 에러 상태로 설정하지 않음
      }
    }
  }, [isPlaying, isReady])

  // 비디오 변경 시 플레이어 업데이트
  useEffect(() => {
    if (playerInstanceRef.current && isReady && video.videoId !== playerState.currentVideoId) {
      try {
        console.log('Loading new video:', video.videoId)
        playerInstanceRef.current.loadVideoById(video.videoId)
        // 새 비디오 로드 시 재생 상태는 isPlaying prop에 따라 결정됨
      } catch (error) {
        console.warn('YouTube Player video load error:', error)
        onError?.('비디오 로드 중 오류가 발생했습니다.')
      }
    }
  }, [video.videoId, isReady, playerState.currentVideoId, onError])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div 
        ref={playerRef}
        className="w-full h-full"
      />
      {!isReady && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-3"></div>
            <p className="text-sm">플레이어 로딩 중...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// 플레이어 컨트롤 컴포넌트
interface YouTubePlayerControlsProps {
  onPrevious: () => void
  onNext: () => void
  totalVideos: number
  currentVideoIndex: number
}

export function YouTubePlayerControls({
  onPrevious,
  onNext,
  totalVideos,
  currentVideoIndex
}: YouTubePlayerControlsProps) {

  return (
    <div className="flex flex-col items-center lg:items-start space-y-8">
      {/* 이전/다음 컨트롤 버튼들 */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onPrevious}
          className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>
        
        <button
          onClick={onNext}
          className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>

      {/* 비디오 정보 */}
      <div className="text-white/80">
        <p className="text-sm">
          {currentVideoIndex + 1} / {totalVideos}
        </p>
      </div>
    </div>
  )
}
