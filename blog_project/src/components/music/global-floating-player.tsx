'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/store'
import { FloatingMusicPlayer } from './floating-music-player'

export function GlobalFloatingPlayer() {
  const pathname = usePathname()
  const { activePlaylistId, activeAlbumId, getAlbumById, clearActivePlaylist } = useAppStore()

  // 경로가 앨범 관련 페이지인지 확인
  // /photos/[albumId] 또는 /photos/[albumId]/[photoId] 형식
  const albumPathMatch = pathname?.match(/^\/photos\/([^/]+)(?:\/([^/]+))?$/)
  const currentAlbumId = albumPathMatch?.[1]

  // 현재 페이지가 앨범 관련 페이지인지 확인
  const isAlbumPage = !!currentAlbumId
  const currentAlbum = currentAlbumId ? getAlbumById(currentAlbumId) : null
  const hasPlaylist = !!currentAlbum?.playlistId

  // 앨범 페이지이고 재생목록이 있으며, 활성화된 앨범과 일치할 때만 표시
  const shouldShow = isAlbumPage && hasPlaylist && activePlaylistId && currentAlbumId === activeAlbumId

  // 다른 페이지로 이동하면 플레이어 비활성화
  useEffect(() => {
    if (!shouldShow && activePlaylistId) {
      clearActivePlaylist()
    }
  }, [shouldShow, activePlaylistId, clearActivePlaylist])

  // 표시 조건을 만족하지 않으면 숨김
  if (!shouldShow) {
    return null
  }

  return <FloatingMusicPlayer playlistId={activePlaylistId!} />
}

