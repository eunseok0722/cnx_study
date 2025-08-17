// 통합 아이템 타입
export interface Album {
  id: string
  title: string
  thumbnail: string
  category: 'photos' | 'place' | 'music'
  createdAt: string
  imageCount: number
  description: string
}

// 장소 관련 타입 (기존 호환성을 위해 유지)
export interface Place {
  id: string
  title: string
  thumbnail: string
  category: 'photos' | 'place' | 'music'
  createdAt: string
  imageCount: number
  description: string
}

// 음악 앨범 관련 타입
export interface MusicAlbum {
  id: string
  title: string
  artist: string
  albumArt: string
  category: 'photos' | 'place' | 'music'
  createdAt: string
  description: string
  tracks: MusicTrack[]
}

// 음악 트랙 관련 타입
export interface MusicTrack {
  id: string
  title: string
  artist: string
  duration: string
  albumArt: string
}

// 사진 관련 타입
export interface Photo {
  id: string
  title: string
  image: string
  description: string
}

// 장소 사진 관련 타입
export interface PlacePhoto {
  id: string
  title: string
  image: string
  description: string
}

// 상세페이지 아이템 타입
export interface DetailItem {
  id: string
  title: string
  description: string
  image: string
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
  category: 'photos' | 'place' | 'music'
  createdAt: string
}
