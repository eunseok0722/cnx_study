import { create } from 'zustand'
import { Album, Place, MusicAlbum, Photo, PlacePhoto, PaginationState } from '@/types'

// Mock 데이터
const mockAlbums: Album[] = [
  {
    id: '1',
    title: 'Morning station',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    createdAt: 'April, 2020',
    imageCount: 24
  },
  {
    id: '2',
    title: 'Kyoto fashion snap',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=500&fit=crop',
    createdAt: 'March, 2020',
    imageCount: 18
  },
  {
    id: '3',
    title: 'Everyday life in Kyoto',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    createdAt: 'May, 2019',
    imageCount: 32
  },
  {
    id: '4',
    title: 'Kyoto life',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    createdAt: 'July, 2019',
    imageCount: 15
  },
  {
    id: '5',
    title: 'Today',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=350&fit=crop',
    createdAt: 'June, 2019',
    imageCount: 27
  },
  {
    id: '6',
    title: 'The relationship between you and me',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=450&fit=crop',
    createdAt: 'January, 2019',
    imageCount: 22
  },
  {
    id: '7',
    title: 'Urban exploration',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=380&fit=crop',
    createdAt: 'December, 2018',
    imageCount: 19
  },
  {
    id: '8',
    title: 'Street photography',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=520&fit=crop',
    createdAt: 'November, 2018',
    imageCount: 31
  },
  {
    id: '9',
    title: 'City lights',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=420&fit=crop',
    createdAt: 'October, 2018',
    imageCount: 28
  },
  {
    id: '10',
    title: 'Nature walk',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=480&fit=crop',
    createdAt: 'September, 2018',
    imageCount: 16
  },
  {
    id: '11',
    title: 'Portrait series',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=550&fit=crop',
    createdAt: 'August, 2018',
    imageCount: 25
  },
  {
    id: '12',
    title: 'Architecture',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    createdAt: 'July, 2018',
    imageCount: 33
  }
]

const mockPlaces: Place[] = [
  {
    id: "1",
    title: "Traditional Ramen House",
    thumbnail: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    createdAt: "April, 2020",
    imageCount: 24,
  },
  {
    id: "2",
    title: "Kyoto Sushi Bar",
    thumbnail: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=500&fit=crop",
    createdAt: "March, 2020",
    imageCount: 18,
  },
  {
    id: "3",
    title: "Street Food Market",
    thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop",
    createdAt: "May, 2019",
    imageCount: 32,
  },
  {
    id: "4",
    title: "Cozy Coffee Shop",
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=600&fit=crop",
    createdAt: "July, 2019",
    imageCount: 15,
  },
  {
    id: "5",
    title: "Authentic Izakaya",
    thumbnail: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=350&fit=crop",
    createdAt: "June, 2019",
    imageCount: 27,
  },
  {
    id: "6",
    title: "Modern Fusion Restaurant",
    thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=450&fit=crop",
    createdAt: "January, 2019",
    imageCount: 22,
  },
  {
    id: "7",
    title: "Traditional Tea House",
    thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=380&fit=crop",
    createdAt: "December, 2018",
    imageCount: 19,
  },
  {
    id: "8",
    title: "Seafood Market",
    thumbnail: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=520&fit=crop",
    createdAt: "November, 2018",
    imageCount: 31,
  },
  {
    id: "9",
    title: "Artisan Bakery",
    thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=420&fit=crop",
    createdAt: "October, 2018",
    imageCount: 28,
  },
  {
    id: "10",
    title: "Rooftop Dining",
    thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=480&fit=crop",
    createdAt: "September, 2018",
    imageCount: 16,
  },
  {
    id: "11",
    title: "Hidden Gem Cafe",
    thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=380&fit=crop",
    createdAt: "August, 2018",
    imageCount: 25,
  },
  {
    id: "12",
    title: "Traditional Tempura",
    thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=450&fit=crop",
    createdAt: "July, 2018",
    imageCount: 33,
  },
];

const mockMusicAlbums: Record<string, MusicAlbum> = {
  '1': {
    id: '1',
    title: 'Midnight Jazz Collection',
    artist: 'Jazz Ensemble',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop',
    tracks: [
      { 
        id: '1-1', 
        title: 'Midnight Blues', 
        artist: 'Jazz Ensemble', 
        duration: '4:32',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '1-2', 
        title: 'Smooth Sailing', 
        artist: 'Jazz Ensemble', 
        duration: '3:45',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '1-3', 
        title: 'Late Night Groove', 
        artist: 'Jazz Ensemble', 
        duration: '5:12',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '1-4', 
        title: 'Urban Jazz', 
        artist: 'Jazz Ensemble', 
        duration: '4:18',
        albumArt: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop'
      },
      { 
        id: '1-5', 
        title: 'Moonlight Serenade', 
        artist: 'Jazz Ensemble', 
        duration: '6:24',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Classical Piano Sonatas',
    artist: 'Maria Schmidt',
    albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=800&fit=crop',
    tracks: [
      { 
        id: '2-1', 
        title: 'Sonata No. 1 in C Major', 
        artist: 'Maria Schmidt', 
        duration: '8:45',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '2-2', 
        title: 'Sonata No. 2 in A Minor', 
        artist: 'Maria Schmidt', 
        duration: '7:32',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '2-3', 
        title: 'Sonata No. 3 in G Major', 
        artist: 'Maria Schmidt', 
        duration: '9:18',
        albumArt: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop'
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Indie Folk Stories',
    artist: 'The Wanderers',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop',
    tracks: [
      { 
        id: '3-1', 
        title: 'Road Less Traveled', 
        artist: 'The Wanderers', 
        duration: '3:56',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '3-2', 
        title: 'Mountain Echo', 
        artist: 'The Wanderers', 
        duration: '4:23',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '3-3', 
        title: 'River Song', 
        artist: 'The Wanderers', 
        duration: '5:11',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '3-4', 
        title: 'Forest Whispers', 
        artist: 'The Wanderers', 
        duration: '4:47',
        albumArt: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop'
      }
    ]
  }
}

const mockAlbumPhotos: Record<string, Photo[]> = {
  '1': [
    {
      id: '1-1',
      title: 'Morning station',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      description: 'Early morning at the train station'
    },
    {
      id: '1-2',
      title: 'Station platform',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
      description: 'Waiting for the train'
    },
    {
      id: '1-3',
      title: 'Train arrival',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
      description: 'The train arrives at the platform'
    },
    {
      id: '1-4',
      title: 'Passengers boarding',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      description: 'People boarding the train'
    },
    {
      id: '1-5',
      title: 'Station exit',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
      description: 'Exiting the station'
    }
  ],
  '2': [
    {
      id: '2-1',
      title: 'Kyoto fashion snap',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
      description: 'Fashion photography in Kyoto'
    },
    {
      id: '2-2',
      title: 'Traditional kimono',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
      description: 'Beautiful traditional kimono'
    },
    {
      id: '2-3',
      title: 'Modern fashion',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      description: 'Contemporary fashion in Kyoto'
    }
  ],
  '3': [
    {
      id: '3-1',
      title: 'Everyday life in Kyoto',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
      description: 'Daily life in the ancient capital'
    },
    {
      id: '3-2',
      title: 'Traditional streets',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      description: 'Historic streets of Kyoto'
    },
    {
      id: '3-3',
      title: 'Local markets',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
      description: 'Vibrant local markets'
    }
  ]
}

const mockPlacePhotos: Record<string, PlacePhoto[]> = {
  '1': [
    {
      id: '1-1',
      title: 'Traditional Ramen House',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&h=800&fit=crop',
      description: 'Authentic ramen with rich broth and fresh ingredients'
    },
    {
      id: '1-2',
      title: 'Ramen preparation',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&h=800&fit=crop',
      description: 'Chef carefully preparing the perfect bowl of ramen'
    },
    {
      id: '1-3',
      title: 'Ramen ingredients',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
      description: 'Fresh vegetables and premium noodles'
    },
    {
      id: '1-4',
      title: 'Ramen serving',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=800&fit=crop',
      description: 'Steaming hot ramen ready to be enjoyed'
    },
    {
      id: '1-5',
      title: 'Ramen interior',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&h=800&fit=crop',
      description: 'Cozy traditional ramen house atmosphere'
    }
  ],
  '2': [
    {
      id: '2-1',
      title: 'Kyoto Sushi Bar',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&h=800&fit=crop',
      description: 'Premium sushi prepared by master chef'
    },
    {
      id: '2-2',
      title: 'Sushi preparation',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
      description: 'Artistic sushi making process'
    },
    {
      id: '2-3',
      title: 'Sushi presentation',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=800&fit=crop',
      description: 'Beautifully arranged sushi platter'
    }
  ],
  '3': [
    {
      id: '3-1',
      title: 'Street Food Market',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop',
      description: 'Bustling street food market with various vendors'
    },
    {
      id: '3-2',
      title: 'Takoyaki stand',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=800&fit=crop',
      description: 'Fresh takoyaki being made on the spot'
    },
    {
      id: '3-3',
      title: 'Street food variety',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&h=800&fit=crop',
      description: 'Colorful array of street food options'
    }
  ]
}

// 스토어 인터페이스
interface AppStore {
  // 데이터
  albums: Album[]
  places: Place[]
  musicAlbums: Record<string, MusicAlbum>
  albumPhotos: Record<string, Photo[]>
  placePhotos: Record<string, PlacePhoto[]>
  
  // 페이지네이션 상태
  photosPagination: PaginationState
  placesPagination: PaginationState
  musicPagination: PaginationState
  
  // 액션
  setPhotosPagination: (pagination: Partial<PaginationState>) => void
  setPlacesPagination: (pagination: Partial<PaginationState>) => void
  setMusicPagination: (pagination: Partial<PaginationState>) => void
  
  // 게터
  getCurrentPhotos: () => Album[]
  getCurrentPlaces: () => Place[]
  getCurrentMusicAlbums: () => MusicAlbum[]
  getAlbumById: (id: string) => Album | undefined
  getPlaceById: (id: string) => Place | undefined
  getMusicAlbumById: (id: string) => MusicAlbum | undefined
  getAlbumPhotos: (albumId: string) => Photo[]
  getPlacePhotos: (placeId: string) => PlacePhoto[]
}

// Zustand 스토어 생성
export const useAppStore = create<AppStore>((set, get) => ({
  // 초기 데이터
  albums: mockAlbums,
  places: mockPlaces,
  musicAlbums: mockMusicAlbums,
  albumPhotos: mockAlbumPhotos,
  placePhotos: mockPlacePhotos,
  
  // 초기 페이지네이션 상태
  photosPagination: {
    currentPage: 1,
    itemsPerPage: 9,
    totalPages: Math.ceil(mockAlbums.length / 9)
  },
  placesPagination: {
    currentPage: 1,
    itemsPerPage: 9,
    totalPages: Math.ceil(mockPlaces.length / 9)
  },
  musicPagination: {
    currentPage: 1,
    itemsPerPage: 9,
    totalPages: Math.ceil(Object.keys(mockMusicAlbums).length / 9)
  },
  
  // 페이지네이션 액션
  setPhotosPagination: (pagination) => set((state) => ({
    photosPagination: { ...state.photosPagination, ...pagination }
  })),
  
  setPlacesPagination: (pagination) => set((state) => ({
    placesPagination: { ...state.placesPagination, ...pagination }
  })),
  
  setMusicPagination: (pagination) => set((state) => ({
    musicPagination: { ...state.musicPagination, ...pagination }
  })),
  
  // 게터 함수들
  getCurrentPhotos: () => {
    const state = get()
    const { currentPage, itemsPerPage } = state.photosPagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return state.albums.slice(startIndex, endIndex)
  },
  
  getCurrentPlaces: () => {
    const state = get()
    const { currentPage, itemsPerPage } = state.placesPagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return state.places.slice(startIndex, endIndex)
  },
  
  getCurrentMusicAlbums: () => {
    const state = get()
    const { currentPage, itemsPerPage } = state.musicPagination
    const albumIds = Object.keys(state.musicAlbums)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return albumIds.slice(startIndex, endIndex).map(id => state.musicAlbums[id])
  },
  
  getAlbumById: (id) => {
    const state = get()
    return state.albums.find(album => album.id === id)
  },
  
  getPlaceById: (id) => {
    const state = get()
    return state.places.find(place => place.id === id)
  },
  
  getMusicAlbumById: (id) => {
    const state = get()
    return state.musicAlbums[id]
  },
  
  getAlbumPhotos: (albumId) => {
    const state = get()
    return state.albumPhotos[albumId] || []
  },
  
  getPlacePhotos: (placeId) => {
    const state = get()
    return state.placePhotos[placeId] || []
  }
}))
