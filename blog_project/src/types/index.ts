// 지도 위치 정보 타입
export interface MapLocation {
  latitude: number
  longitude: number
  title?: string
  description?: string
}

// 통합 아이템 타입
export interface Album {
  id: string
  title: string
  thumbnail: string
  category: 'photos' | 'place'
  createdAt: string
  imageCount: number
  description: string
  playlistId?: string // 연결된 YouTube 재생목록 ID
  favoriteMapUrl?: string // 네이버 지도 즐겨찾기 리스트 URL
  favoriteLocations?: MapLocation[] // 즐겨찾기 리스트의 위치 정보 배열
}

// 장소 관련 타입 (기존 호환성을 위해 유지)
export interface Place {
  id: string
  title: string
  thumbnail: string
  category: 'photos' | 'place'
  createdAt: string
  imageCount: number
  description: string
}


// 상세페이지 아이템 타입
export interface DetailItem {
  id: string
  title: string
  description: string
  image: string
  latitude?: number // 지도 위도 (선택적)
  longitude?: number // 지도 경도 (선택적)
}

// 페이지네이션 관련 타입
export interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalPages: number
}

// 갤러리 아이템 공통 타입
export interface GalleryItem {
  id: string
  title: string
  thumbnail: string
  subtitle?: string // artist for music, createdAt for others
  category: 'photos' | 'place' | 'youtube'
  createdAt: string
}

// YouTube API 관련 타입
export interface YouTubePlaylist {
  id: string
  title: string
  description: string
  thumbnail: string
  itemCount: number
  publishedAt: string
  channelTitle: string
}

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  publishedAt: string
  channelTitle: string
  videoId: string
}

export interface YouTubePlaylistItem {
  id: string
  playlistId: string
  video: YouTubeVideo
  position: number
}

// YouTube API 응답 타입
export interface YouTubeApiResponse<T> {
  items: T[]
  nextPageToken?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}

// YouTube Player 관련 타입
export interface YouTubePlayerState {
  isPlaying: boolean
  currentVideoId: string | null
  currentVideoIndex: number
  volume: number
  duration: number
  currentTime: number
}

export interface YouTubePlayerEvents {
  onStateChange?: (event: any) => void
  onPlaybackQualityChange?: (event: any) => void
  onPlaybackRateChange?: (event: any) => void
  onError?: (event: any) => void
}
