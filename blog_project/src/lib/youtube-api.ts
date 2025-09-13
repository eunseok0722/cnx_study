import { YouTubePlaylist, YouTubeVideo, YouTubePlaylistItem, YouTubeApiResponse } from '@/types'

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3'

// YouTube API 에러 클래스
export class YouTubeApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'YouTubeApiError'
  }
}

// API 키 검증
function validateApiKey() {
  if (!YOUTUBE_API_KEY) {
    throw new YouTubeApiError('YouTube API key is not configured')
  }
  if (!YOUTUBE_CHANNEL_ID) {
    throw new YouTubeApiError('YouTube Channel ID is not configured')
  }
}

// YouTube API 요청 헬퍼
async function fetchYouTubeData<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  validateApiKey()
  
  const searchParams = new URLSearchParams({
    key: YOUTUBE_API_KEY!,
    ...params
  })
  
  const url = `${YOUTUBE_API_BASE_URL}/${endpoint}?${searchParams}`
  
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new YouTubeApiError(
        errorData.error?.message || 'YouTube API request failed',
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof YouTubeApiError) {
      throw error
    }
    throw new YouTubeApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// 재생목록 목록 가져오기
export async function fetchPlaylists(pageToken?: string): Promise<YouTubeApiResponse<YouTubePlaylist>> {
  const response = await fetchYouTubeData<YouTubeApiResponse<any>>('playlists', {
    part: 'snippet,contentDetails',
    channelId: YOUTUBE_CHANNEL_ID!,
    maxResults: '10',
    ...(pageToken && { pageToken })
  })
  
  return {
    ...response,
    items: response.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      itemCount: parseInt(item.contentDetails.itemCount),
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle
    }))
  }
}

// 특정 재생목록의 비디오 목록 가져오기
export async function fetchPlaylistVideos(playlistId: string, pageToken?: string): Promise<YouTubeApiResponse<YouTubePlaylistItem>> {
  const response = await fetchYouTubeData<YouTubeApiResponse<any>>('playlistItems', {
    part: 'snippet,contentDetails',
    playlistId,
    maxResults: '50',
    ...(pageToken && { pageToken })
  })
  
  return {
    ...response,
    items: response.items.map((item: any) => ({
      id: item.id,
      playlistId: item.snippet.playlistId,
      position: item.snippet.position,
      video: {
        id: item.snippet.resourceId.videoId,
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        duration: '0:00', // duration은 별도 API 호출 필요
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle
      }
    }))
  }
}

// 비디오 상세 정보 가져오기 (duration 포함)
export async function fetchVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
  const response = await fetchYouTubeData<YouTubeApiResponse<any>>('videos', {
    part: 'snippet,contentDetails',
    id: videoIds.join(',')
  })
  
  return response.items.map((item: any) => ({
    id: item.id,
    videoId: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
    duration: formatDuration(item.contentDetails.duration),
    publishedAt: item.snippet.publishedAt,
    channelTitle: item.snippet.channelTitle
  }))
}

// ISO 8601 duration을 MM:SS 형식으로 변환
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 재생목록과 비디오 정보를 함께 가져오기
export async function fetchPlaylistWithVideos(playlistId: string): Promise<{
  playlist: YouTubePlaylist
  videos: YouTubeVideo[]
}> {
  const [playlistResponse, videosResponse] = await Promise.all([
    fetchYouTubeData<any>('playlists', {
      part: 'snippet,contentDetails',
      id: playlistId
    }),
    fetchPlaylistVideos(playlistId)
  ])
  
  if (!playlistResponse.items.length) {
    throw new YouTubeApiError('Playlist not found')
  }
  
  const playlist = playlistResponse.items[0]
  const playlistData: YouTubePlaylist = {
    id: playlist.id,
    title: playlist.snippet.title,
    description: playlist.snippet.description,
    thumbnail: playlist.snippet.thumbnails?.high?.url || playlist.snippet.thumbnails?.default?.url,
    itemCount: parseInt(playlist.contentDetails.itemCount),
    publishedAt: playlist.snippet.publishedAt,
    channelTitle: playlist.snippet.channelTitle
  }
  
  // 비디오 duration 정보 가져오기
  const videoIds = videosResponse.items.map(item => item.video.videoId)
  const videoDetails = await fetchVideoDetails(videoIds)
  
  // duration 정보를 기존 비디오 데이터에 병합
  const videos = videosResponse.items.map(item => ({
    ...item.video,
    duration: videoDetails.find(detail => detail.id === item.video.id)?.duration || '0:00'
  }))
  
  return { playlist: playlistData, videos }
}
