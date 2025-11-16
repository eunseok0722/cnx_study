import { Album, Place, DetailItem } from '@/types'

// API 에러 클래스
export class AlbumsApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'AlbumsApiError'
  }
}

// 클라이언트 및 서버 사이드 모두에서 API 엔드포인트를 사용
// 서버 사이드에서도 API 엔드포인트를 사용하여 fs/promises 의존성 제거
async function fetchFromApi<T>(endpoint: string): Promise<T> {
  try {
    // 서버 사이드에서는 절대 URL 사용
    const baseUrl = typeof window !== 'undefined' 
      ? '' // 클라이언트에서는 상대 경로
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' // 서버에서는 절대 URL
    
    const url = `${baseUrl}${endpoint}`
    const response = await fetch(url, {
      cache: 'no-store' // 개발 중에는 항상 최신 데이터를 가져오도록
    })
    
    if (!response.ok) {
      throw new AlbumsApiError(
        `Failed to fetch from ${endpoint}: ${response.statusText}`,
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof AlbumsApiError) {
      throw error
    }
    throw new AlbumsApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// 클라이언트 및 서버 사이드 모두에서 사용할 API 함수들
export async function fetchAlbums(): Promise<Album[]> {
  return await fetchFromApi<Album[]>('/api/albums')
}

export async function fetchPlaces(): Promise<Place[]> {
  return await fetchFromApi<Place[]>('/api/places')
}

export async function fetchAlbumById(id: string): Promise<Album | null> {
  const albums = await fetchAlbums()
  return albums.find(album => album.id === id) || null
}

export async function fetchPlaceById(id: string): Promise<Place | null> {
  const places = await fetchPlaces()
  return places.find(place => place.id === id) || null
}

export async function fetchAlbumPhotos(albumId: string): Promise<DetailItem[]> {
  return await fetchFromApi<DetailItem[]>(`/api/albums/${albumId}/photos`)
}

export async function fetchPlacePhotos(placeId: string): Promise<DetailItem[]> {
  return await fetchFromApi<DetailItem[]>(`/api/places/${placeId}/photos`)
}

