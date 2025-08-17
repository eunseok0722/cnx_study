// 앨범 관련 타입
export interface Album {
  id: string
  title: string
  thumbnail: string
  createdAt: string
  imageCount: number
}

// 장소 관련 타입
export interface Place {
  id: string
  title: string
  thumbnail: string
  createdAt: string
  imageCount: number
}

// 음악 앨범 관련 타입
export interface MusicAlbum {
  id: string
  title: string
  artist: string
  albumArt: string
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

// 페이지네이션 관련 타입
export interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalPages: number
}
