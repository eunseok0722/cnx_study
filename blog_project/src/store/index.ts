import { create } from 'zustand'
import { Album, Place, MusicAlbum, Photo, PlacePhoto, PaginationState, GalleryItem, DetailItem } from '@/types'

// 통합 Mock 데이터
const mockAlbums: Album[] = [
  {
    id: '1',
    title: 'Morning station',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'photos',
    createdAt: '2024-04-15',
    imageCount: 24,
    description: '아침 기차역의 평화로운 순간들을 담은 사진 모음입니다. 일상의 아름다움을 발견하는 여정을 기록했습니다.'
  },
  {
    id: '2',
    title: 'Kyoto fashion snap',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=500&fit=crop',
    category: 'photos',
    createdAt: '2024-03-20',
    imageCount: 18,
    description: '교토의 전통과 현대가 만나는 패션 스냅을 담았습니다. 한복과 기모노의 우아함을 현대적 감각으로 재해석했습니다.'
  },
  {
    id: '3',
    title: 'Everyday life in Kyoto',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    category: 'photos',
    createdAt: '2024-05-10',
    imageCount: 32,
    description: '교토의 일상적인 순간들을 담은 사진 모음입니다. 전통과 현대가 공존하는 도시의 매력을 기록했습니다.'
  },
  {
    id: '4',
    title: 'Kyoto life',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    category: 'photos',
    createdAt: '2024-07-05',
    imageCount: 15,
    description: '교토에서의 삶의 순간들을 담은 사진들입니다. 사계절의 변화와 함께하는 도시의 아름다움을 표현했습니다.'
  },
  {
    id: '5',
    title: 'Today',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=350&fit=crop',
    category: 'photos',
    createdAt: '2024-06-12',
    imageCount: 27,
    description: '오늘 하루의 특별한 순간들을 담은 사진 모음입니다. 일상 속에서 발견하는 작은 기적들을 기록했습니다.'
  },
  {
    id: '6',
    title: 'The relationship between you and me',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=450&fit=crop',
    category: 'photos',
    createdAt: '2024-01-25',
    imageCount: 22,
    description: '우리 사이의 특별한 관계를 담은 사진들입니다. 사랑과 우정의 순간들을 따뜻하게 기록했습니다.'
  },
  {
    id: '7',
    title: 'Urban exploration',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=380&fit=crop',
    category: 'photos',
    createdAt: '2023-12-18',
    imageCount: 19,
    description: '도시의 숨겨진 공간들을 탐험하며 발견한 아름다움을 담았습니다. 도시의 또 다른 얼굴을 만나보세요.'
  },
  {
    id: '8',
    title: 'Street photography',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=520&fit=crop',
    category: 'photos',
    createdAt: '2023-11-30',
    imageCount: 31,
    description: '거리의 생생한 순간들을 담은 스트리트 포토그래피입니다. 도시의 리듬과 사람들의 이야기를 기록했습니다.'
  },
  {
    id: '9',
    title: 'City lights',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=420&fit=crop',
    category: 'photos',
    createdAt: '2023-10-15',
    imageCount: 28,
    description: '도시의 밤을 밝히는 불빛들을 담은 사진 모음입니다. 야경의 매력과 도시의 활기를 느껴보세요.'
  },
  {
    id: '10',
    title: 'Nature walk',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=480&fit=crop',
    category: 'photos',
    createdAt: '2023-09-08',
    imageCount: 16,
    description: '자연 속을 걸으며 발견한 아름다움을 담은 사진들입니다. 숲과 산의 평화로움을 함께 느껴보세요.'
  },
  {
    id: '11',
    title: 'Portrait series',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=550&fit=crop',
    category: 'photos',
    createdAt: '2023-08-22',
    imageCount: 25,
    description: '다양한 사람들의 이야기를 담은 포트레이트 시리즈입니다. 각자의 독특한 매력과 개성을 표현했습니다.'
  },
  {
    id: '12',
    title: 'Architecture',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    category: 'photos',
    createdAt: '2023-07-14',
    imageCount: 33,
    description: '세계 각지의 아름다운 건축물들을 담은 사진 모음입니다. 건축의 예술성과 역사를 함께 만나보세요.'
  }
]

const mockPlaces: Place[] = [
  {
    id: "1",
    title: "Traditional Ramen House",
    thumbnail: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    category: "place",
    createdAt: "2024-04-10",
    imageCount: 24,
    description: "전통적인 라멘 맛집입니다. 50년 전통의 육수와 수제 면발로 만든 진정한 일본 라멘의 맛을 경험해보세요."
  },
  {
    id: "2",
    title: "Kyoto Sushi Bar",
    thumbnail: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=500&fit=crop",
    category: "place",
    createdAt: "2024-03-15",
    imageCount: 18,
    description: "교토의 전통과 현대가 만나는 스시 바입니다. 신선한 재료와 장인의 솜씨로 만든 스시를 즐겨보세요."
  },
  {
    id: "3",
    title: "Street Food Market",
    thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop",
    category: "place",
    createdAt: "2024-05-05",
    imageCount: 32,
    description: "다양한 길거리 음식을 한자리에서 만날 수 있는 시장입니다. 현지인들이 사랑하는 맛집들이 모여있습니다."
  },
  {
    id: "4",
    title: "Cozy Coffee Shop",
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=600&fit=crop",
    category: "place",
    createdAt: "2024-07-01",
    imageCount: 15,
    description: "아늑한 분위기의 커피숍입니다. 로스팅한 원두로 내린 커피와 수제 디저트를 즐길 수 있습니다."
  },
  {
    id: "5",
    title: "Authentic Izakaya",
    thumbnail: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=350&fit=crop",
    category: "place",
    createdAt: "2024-06-08",
    imageCount: 27,
    description: "진정한 일본 이자카야의 분위기를 느낄 수 있는 곳입니다. 전통적인 안주와 사케를 함께 즐겨보세요."
  },
  {
    id: "6",
    title: "Modern Fusion Restaurant",
    thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=450&fit=crop",
    category: "place",
    createdAt: "2024-01-20",
    imageCount: 22,
    description: "동서양의 맛을 창의적으로 조합한 퓨전 레스토랑입니다. 독특한 조합으로 만든 특별한 요리를 경험해보세요."
  },
  {
    id: "7",
    title: "Traditional Tea House",
    thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=380&fit=crop",
    category: "place",
    createdAt: "2023-12-12",
    imageCount: 19,
    description: "전통 다실에서 차 문화를 체험할 수 있는 곳입니다. 정갈한 다과와 함께하는 차 한 잔의 여유를 느껴보세요."
  },
  {
    id: "8",
    title: "Seafood Market",
    thumbnail: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=520&fit=crop",
    category: "place",
    createdAt: "2023-11-25",
    imageCount: 31,
    description: "신선한 해산물을 직접 구매할 수 있는 수산시장입니다. 아침 일찍 방문하면 최고급 생선들을 만날 수 있습니다."
  },
  {
    id: "9",
    title: "Artisan Bakery",
    thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=420&fit=crop",
    category: "place",
    createdAt: "2023-10-10",
    imageCount: 28,
    description: "아티장 베이커리에서 만든 수제 빵과 페이스트리를 즐길 수 있습니다. 매일 아침 구워내는 신선한 빵의 맛을 경험해보세요."
  },
  {
    id: "10",
    title: "Rooftop Dining",
    thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=480&fit=crop",
    category: "place",
    createdAt: "2023-09-03",
    imageCount: 16,
    description: "도시의 아름다운 전경을 바라보며 식사를 즐길 수 있는 루프탑 레스토랑입니다. 로맨틱한 저녁 식사에 최적입니다."
  },
  {
    id: "11",
    title: "Hidden Gem Cafe",
    thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=380&fit=crop",
    category: "place",
    createdAt: "2023-08-18",
    imageCount: 25,
    description: "알고 있는 사람만 아는 숨겨진 보석 같은 카페입니다. 특별한 분위기와 맛있는 음료를 즐길 수 있습니다."
  },
  {
    id: "12",
    title: "Traditional Tempura",
    thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=450&fit=crop",
    category: "place",
    createdAt: "2023-07-10",
    imageCount: 33,
    description: "전통적인 텐푸라 전문점입니다. 바삭한 튀김과 신선한 재료로 만든 텐푸라의 진정한 맛을 경험해보세요."
  },
];

const mockMusicAlbums: Record<string, MusicAlbum> = {
  '1': {
    id: '1',
    title: 'Midnight Jazz Collection',
    artist: 'Jazz Ensemble',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop',
    category: 'music',
    createdAt: '2024-04-12',
    description: '밤의 고요함 속에서 흘러나오는 재즈의 아름다움을 담은 앨범입니다. 부드러운 멜로디와 즉흥적인 연주가 어우러진 명작입니다.',
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
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '1-5', 
        title: 'Coffee Shop Vibes', 
        artist: 'Jazz Ensemble', 
        duration: '3:55',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Acoustic Sessions',
    artist: 'Folk Collective',
    albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=800&fit=crop',
    category: 'music',
    createdAt: '2024-03-18',
    description: '자연의 소리와 어우러진 어쿠스틱 포크 음악을 담은 앨범입니다. 따뜻한 기타 선율과 진정성 있는 가사가 돋보입니다.',
    tracks: [
      { 
        id: '2-1', 
        title: 'Mountain Echo', 
        artist: 'Folk Collective', 
        duration: '4:15',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '2-2', 
        title: 'River Flow', 
        artist: 'Folk Collective', 
        duration: '3:52',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '2-3', 
        title: 'Forest Whispers', 
        artist: 'Folk Collective', 
        duration: '5:08',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '2-4', 
        title: 'Sunset Serenade', 
        artist: 'Folk Collective', 
        duration: '4:33',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '2-5', 
        title: 'Morning Dew', 
        artist: 'Folk Collective', 
        duration: '3:41',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Electronic Dreams',
    artist: 'Synthwave',
    albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
    category: 'music',
    createdAt: '2024-05-08',
    description: '미래지향적인 신스웨이브 사운드를 담은 앨범입니다. 레트로 퓨처리즘의 분위기와 몽환적인 멜로디가 특징입니다.',
    tracks: [
      { 
        id: '3-1', 
        title: 'Neon Lights', 
        artist: 'Synthwave', 
        duration: '4:28',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '3-2', 
        title: 'Digital Rain', 
        artist: 'Synthwave', 
        duration: '3:59',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '3-3', 
        title: 'Cyber City', 
        artist: 'Synthwave', 
        duration: '5:22',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '3-4', 
        title: 'Future Retro', 
        artist: 'Synthwave', 
        duration: '4:11',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '3-5', 
        title: 'Virtual Reality', 
        artist: 'Synthwave', 
        duration: '3:47',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      }
    ]
  },
  '4': {
    id: '4',
    title: 'Classical Moments',
    artist: 'Symphony Orchestra',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop',
    category: 'music',
    createdAt: '2024-07-02',
    description: '클래식 음악의 아름다움을 담은 교향곡 모음입니다. 오케스트라의 웅장한 사운드와 정교한 연주가 돋보입니다.',
    tracks: [
      { 
        id: '4-1', 
        title: 'Moonlight Sonata', 
        artist: 'Symphony Orchestra', 
        duration: '6:15',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '4-2', 
        title: 'Spring Awakening', 
        artist: 'Symphony Orchestra', 
        duration: '4:52',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '4-3', 
        title: 'Winter Dreams', 
        artist: 'Symphony Orchestra', 
        duration: '7:08',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '4-4', 
        title: 'Summer Breeze', 
        artist: 'Symphony Orchestra', 
        duration: '5:33',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '4-5', 
        title: 'Autumn Leaves', 
        artist: 'Symphony Orchestra', 
        duration: '4:41',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      }
    ]
  },
  '5': {
    id: '5',
    title: 'Rock Anthems',
    artist: 'Electric Storm',
    albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=800&fit=crop',
    category: 'music',
    createdAt: '2024-06-10',
    description: '강력한 기타 리프와 에너지 넘치는 록 음악을 담은 앨범입니다. 열정적인 보컬과 화려한 연주가 특징입니다.',
    tracks: [
      { 
        id: '5-1', 
        title: 'Thunder Road', 
        artist: 'Electric Storm', 
        duration: '4:18',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '5-2', 
        title: 'Lightning Strike', 
        artist: 'Electric Storm', 
        duration: '3:45',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '5-3', 
        title: 'Storm Warning', 
        artist: 'Electric Storm', 
        duration: '5:22',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '5-4', 
        title: 'Electric Dreams', 
        artist: 'Electric Storm', 
        duration: '4:11',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '5-5', 
        title: 'Rock Revolution', 
        artist: 'Electric Storm', 
        duration: '3:47',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      }
    ]
  },
  '6': {
    id: '6',
    title: 'Chill Vibes',
    artist: 'Ambient Collective',
    albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
    category: 'music',
    createdAt: '2024-01-15',
    description: '편안하고 평화로운 앰비언트 음악을 담은 앨범입니다. 명상과 휴식을 위한 완벽한 배경음악입니다.',
    tracks: [
      { 
        id: '6-1', 
        title: 'Ocean Waves', 
        artist: 'Ambient Collective', 
        duration: '6:32',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '6-2', 
        title: 'Forest Meditation', 
        artist: 'Ambient Collective', 
        duration: '8:15',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '6-3', 
        title: 'Zen Garden', 
        artist: 'Ambient Collective', 
        duration: '7:42',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '6-4', 
        title: 'Mountain Silence', 
        artist: 'Ambient Collective', 
        duration: '9:18',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '6-5', 
        title: 'Desert Wind', 
        artist: 'Ambient Collective', 
        duration: '5:55',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      }
    ]
  },
  '7': {
    id: '7',
    title: 'Pop Hits',
    artist: 'Chart Toppers',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop',
    category: 'music',
    createdAt: '2023-12-20',
    description: '차트를 석권한 팝 히트곡들을 모은 앨범입니다. 중독성 있는 멜로디와 신나는 비트가 특징입니다.',
    tracks: [
      { 
        id: '7-1', 
        title: 'Summer Love', 
        artist: 'Chart Toppers', 
        duration: '3:28',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '7-2', 
        title: 'Dance All Night', 
        artist: 'Chart Toppers', 
        duration: '3:45',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '7-3', 
        title: 'Heartbeat', 
        artist: 'Chart Toppers', 
        duration: '4:12',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '7-4', 
        title: 'Star Light', 
        artist: 'Chart Toppers', 
        duration: '3:59',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '7-5', 
        title: 'Magic Moment', 
        artist: 'Chart Toppers', 
        duration: '3:33',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      }
    ]
  },
  '8': {
    id: '8',
    title: 'Indie Folk',
    artist: 'Woodland Tales',
    albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=800&fit=crop',
    category: 'music',
    createdAt: '2023-11-30',
    description: '독립적인 정신과 자연의 이야기를 담은 인디 포크 앨범입니다. 진정성 있는 가사와 따뜻한 멜로디가 돋보입니다.',
    tracks: [
      { 
        id: '8-1', 
        title: 'Cabin in the Woods', 
        artist: 'Woodland Tales', 
        duration: '4:18',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '8-2', 
        title: 'Mountain Song', 
        artist: 'Woodland Tales', 
        duration: '3:52',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '8-3', 
        title: 'River Flow', 
        artist: 'Woodland Tales', 
        duration: '5:08',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '8-4', 
        title: 'Forest Echo', 
        artist: 'Woodland Tales', 
        duration: '4:33',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '8-5', 
        title: 'Wilderness Call', 
        artist: 'Woodland Tales', 
        duration: '3:41',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      }
    ]
  },
  '9': {
    id: '9',
    title: 'Blues Collection',
    artist: 'Delta Blues',
    albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
    category: 'music',
    createdAt: '2023-10-15',
    description: '미시시피 델타 블루스의 진정한 맛을 담은 앨범입니다. 깊이 있는 감정과 원초적인 리듬이 특징입니다.',
    tracks: [
      { 
        id: '9-1', 
        title: 'Mississippi Blues', 
        artist: 'Delta Blues', 
        duration: '4:28',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '9-2', 
        title: 'Crossroads', 
        artist: 'Delta Blues', 
        duration: '3:59',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '9-3', 
        title: 'Stormy Weather', 
        artist: 'Delta Blues', 
        duration: '5:22',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '9-4', 
        title: 'Midnight Train', 
        artist: 'Delta Blues', 
        duration: '4:11',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '9-5', 
        title: 'Blues in the Night', 
        artist: 'Delta Blues', 
        duration: '3:47',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      }
    ]
  },
  '10': {
    id: '10',
    title: 'World Music',
    artist: 'Global Sounds',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop',
    category: 'music',
    createdAt: '2023-09-08',
    description: '세계 각국의 전통 음악을 현대적으로 재해석한 월드뮤직 앨범입니다. 다양한 문화의 아름다움을 음악으로 만나보세요.',
    tracks: [
      { 
        id: '10-1', 
        title: 'Desert Caravan', 
        artist: 'Global Sounds', 
        duration: '6:15',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '10-2', 
        title: 'Asian Fusion', 
        artist: 'Global Sounds', 
        duration: '4:52',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '10-3', 
        title: 'African Rhythms', 
        artist: 'Global Sounds', 
        duration: '7:08',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '10-4', 
        title: 'Latin Groove', 
        artist: 'Global Sounds', 
        duration: '5:33',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '10-5', 
        title: 'Celtic Dreams', 
        artist: 'Global Sounds', 
        duration: '4:41',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      }
    ]
  },
  '11': {
    id: '11',
    title: 'Hip Hop Beats',
    artist: 'Urban Flow',
    albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=800&fit=crop',
    category: 'music',
    createdAt: '2023-08-22',
    description: '도시의 리듬과 현실을 담은 힙합 비트 앨범입니다. 강력한 비트와 의미 있는 가사가 특징입니다.',
    tracks: [
      { 
        id: '11-1', 
        title: 'Street Flow', 
        artist: 'Urban Flow', 
        duration: '3:28',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '11-2', 
        title: 'City Lights', 
        artist: 'Urban Flow', 
        duration: '3:45',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '11-3', 
        title: 'Night Ride', 
        artist: 'Urban Flow', 
        duration: '4:12',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '11-4', 
        title: 'Urban Poetry', 
        artist: 'Urban Flow', 
        duration: '3:59',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '11-5', 
        title: 'Beat Drop', 
        artist: 'Urban Flow', 
        duration: '3:33',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      }
    ]
  },
  '12': {
    id: '12',
    title: 'Country Roads',
    artist: 'Southern Charm',
    albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
    category: 'music',
    createdAt: '2023-07-14',
    description: '남부의 따뜻함과 향수를 담은 컨트리 음악 앨범입니다. 기타와 바이올린의 아름다운 하모니가 특징입니다.',
    tracks: [
      { 
        id: '12-1', 
        title: 'Dirt Road', 
        artist: 'Southern Charm', 
        duration: '4:18',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '12-2', 
        title: 'Pickup Truck', 
        artist: 'Southern Charm', 
        duration: '3:52',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      },
      { 
        id: '12-3', 
        title: 'Small Town', 
        artist: 'Southern Charm', 
        duration: '5:08',
        albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop'
      },
      { 
        id: '12-4', 
        title: 'Front Porch', 
        artist: 'Southern Charm', 
        duration: '4:33',
        albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop'
      },
      { 
        id: '12-5', 
        title: 'Country Heart', 
        artist: 'Southern Charm', 
        duration: '3:41',
        albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      }
    ]
  }
};

// 통합된 최신 작업 데이터 생성
const createRecentWorkData = () => {
  const allItems = [
    // Photos 데이터
    ...mockAlbums.map(album => ({
      id: `photos-${album.id}`,
      title: album.title,
      thumbnail: album.thumbnail,
      category: album.category,
      createdAt: album.createdAt
    })),
    // Places 데이터
    ...mockPlaces.map(place => ({
      id: `place-${place.id}`,
      title: place.title,
      thumbnail: place.thumbnail,
      category: place.category,
      createdAt: place.createdAt
    })),
    // Music 데이터
    ...Object.values(mockMusicAlbums).map(album => ({
      id: `music-${album.id}`,
      title: album.title,
      thumbnail: album.albumArt,
      category: album.category,
      createdAt: album.createdAt
    }))
  ];

  // 최신순으로 정렬
  return allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Store 타입 정의
interface AppStore {
  // 기존 데이터
  albums: Album[]
  places: Place[]
  musicAlbums: Record<string, MusicAlbum>
  
  // 통합된 최신 작업 데이터
  recentWork: ReturnType<typeof createRecentWorkData>
  
  // 페이지네이션 상태
  photosPagination: PaginationState
  placesPagination: PaginationState
  musicPagination: PaginationState
  
  // 액션들
  getCurrentAlbums: () => Album[]
  getCurrentPlaces: () => Place[]
  getCurrentMusicAlbums: () => MusicAlbum[]
  getCurrentGalleryItems: (category: 'photos' | 'place' | 'music') => GalleryItem[]
  getMusicAlbumById: (id: string) => MusicAlbum | null
  getAlbumById: (id: string) => Album | null
  getPlaceById: (id: string) => Place | null
  getAlbumPhotos: (albumId: string) => DetailItem[]
  getPlacePhotos: (placeId: string) => DetailItem[]
  setPhotosPagination: (pagination: Partial<PaginationState>) => void
  setPlacesPagination: (pagination: Partial<PaginationState>) => void
  setMusicPagination: (pagination: Partial<PaginationState>) => void
}

// Store 생성
export const useAppStore = create<AppStore>((set, get) => ({
  // 초기 데이터
  albums: mockAlbums,
  places: mockPlaces,
  musicAlbums: mockMusicAlbums,
  recentWork: createRecentWorkData(),
  
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
  
  // 액션들
  getCurrentAlbums: () => {
    const { albums, photosPagination } = get()
    const startIndex = (photosPagination.currentPage - 1) * photosPagination.itemsPerPage
    const endIndex = startIndex + photosPagination.itemsPerPage
    return albums.slice(startIndex, endIndex)
  },
  
  getCurrentPlaces: () => {
    const { places, placesPagination } = get()
    const startIndex = (placesPagination.currentPage - 1) * placesPagination.itemsPerPage
    const endIndex = startIndex + placesPagination.itemsPerPage
    return places.slice(startIndex, endIndex)
  },
  
  getCurrentMusicAlbums: () => {
    const { musicAlbums, musicPagination } = get()
    const albumIds = Object.keys(musicAlbums)
    const startIndex = (musicPagination.currentPage - 1) * musicPagination.itemsPerPage
    const endIndex = startIndex + musicPagination.itemsPerPage
    return albumIds.slice(startIndex, endIndex).map(id => musicAlbums[id])
  },
  
  getCurrentGalleryItems: (category: 'photos' | 'place' | 'music') => {
    const { albums, places, musicAlbums, photosPagination, placesPagination, musicPagination } = get()
    
    switch (category) {
      case 'photos':
        const startPhotoIndex = (photosPagination.currentPage - 1) * photosPagination.itemsPerPage
        const endPhotoIndex = startPhotoIndex + photosPagination.itemsPerPage
        return albums.slice(startPhotoIndex, endPhotoIndex).map(album => ({
          id: album.id,
          title: album.title,
          thumbnail: album.thumbnail,
          subtitle: album.createdAt,
          category: album.category,
          createdAt: album.createdAt
        }))
      
      case 'place':
        const startPlaceIndex = (placesPagination.currentPage - 1) * placesPagination.itemsPerPage
        const endPlaceIndex = startPlaceIndex + placesPagination.itemsPerPage
        return places.slice(startPlaceIndex, endPlaceIndex).map(place => ({
          id: place.id,
          title: place.title,
          thumbnail: place.thumbnail,
          subtitle: place.createdAt,
          category: place.category,
          createdAt: place.createdAt
        }))
      
      case 'music':
        const albumIds = Object.keys(musicAlbums)
        const startMusicIndex = (musicPagination.currentPage - 1) * musicPagination.itemsPerPage
        const endMusicIndex = startMusicIndex + musicPagination.itemsPerPage
        return albumIds.slice(startMusicIndex, endMusicIndex).map(id => {
          const album = musicAlbums[id]
          return {
            id: album.id,
            title: album.title,
            thumbnail: album.albumArt,
            subtitle: album.artist,
            category: album.category,
            createdAt: album.createdAt
          }
        })
      
      default:
        return []
    }
  },
  
  getMusicAlbumById: (id: string) => {
    const { musicAlbums } = get()
    return musicAlbums[id] || null
  },
  
  getAlbumById: (id: string) => {
    const { albums } = get()
    return albums.find(album => album.id === id) || null
  },
  
  getPlaceById: (id: string) => {
    const { places } = get()
    return places.find(place => place.id === id) || null
  },
  
  getAlbumPhotos: (albumId: string): DetailItem[] => {
    // Mock photos for albums with new structure
    const albumPhotos: Record<string, DetailItem[]> = {
      '1': [
        {
          id: '1',
          title: 'Morning Station View',
          description: '아침 기차역의 평화로운 순간을 담은 사진입니다. 일상의 아름다움을 발견하는 여정을 기록했습니다.',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
        },
        {
          id: '2',
          title: 'Forest Path',
          description: '자연 속 숲길을 걷는 순간의 평화로움을 담은 사진입니다. 녹색의 아름다움이 가득한 풍경입니다.',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
        },
        {
          id: '3',
          title: 'Mountain Lake',
          description: '산속 호수의 고요한 아름다움을 담은 사진입니다. 거울 같은 수면에 비친 자연의 모습입니다.',
          image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
        },
        {
          id: '4',
          title: 'City Sunset',
          description: '도시의 석양을 담은 사진입니다. 하루의 마무리를 아름답게 장식하는 황금빛 순간입니다.',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
        },
        {
          id: '5',
          title: 'Autumn Colors',
          description: '가을의 다채로운 색감을 담은 사진입니다. 계절의 변화를 아름답게 표현한 작품입니다.',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
        }
      ],
      '2': [
        {
          id: '1',
          title: 'Urban Landscape',
          description: '도시의 현대적인 건축물들을 담은 사진입니다. 인간의 창조물과 자연이 어우러진 풍경입니다.',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
        },
        {
          id: '2',
          title: 'Serene Waters',
          description: '고요한 물의 표면을 담은 사진입니다. 평화로운 순간의 아름다움을 느낄 수 있습니다.',
          image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
        },
        {
          id: '3',
          title: 'Railway Journey',
          description: '기차 여행의 로맨틱한 순간을 담은 사진입니다. 새로운 모험을 향한 설렘을 느낄 수 있습니다.',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
        },
        {
          id: '4',
          title: 'Nature\'s Harmony',
          description: '자연의 조화로운 모습을 담은 사진입니다. 모든 생명체가 어우러진 아름다운 풍경입니다.',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
        },
        {
          id: '5',
          title: 'Mountain Vista',
          description: '산맥의 웅장한 전경을 담은 사진입니다. 자연의 위대함을 느낄 수 있는 순간입니다.',
          image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
        }
      ]
    }
    
    return albumPhotos[albumId] || [
      {
        id: '1',
        title: 'Default Morning View',
        description: '기본 아침 풍경을 담은 사진입니다. 새로운 하루의 시작을 상징합니다.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      },
      {
        id: '2',
        title: 'Default Forest Scene',
        description: '기본 숲 풍경을 담은 사진입니다. 자연의 평화로움을 느낄 수 있습니다.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
      },
      {
        id: '3',
        title: 'Default Lake View',
        description: '기본 호수 풍경을 담은 사진입니다. 고요한 물의 아름다움을 담았습니다.',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
      },
      {
        id: '4',
        title: 'Default Sunset',
        description: '기본 석양 풍경을 담은 사진입니다. 하루의 마무리를 아름답게 장식합니다.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      },
      {
        id: '5',
        title: 'Default Autumn',
        description: '기본 가을 풍경을 담은 사진입니다. 계절의 변화를 아름답게 표현했습니다.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
      }
    ]
  },
  
  getPlacePhotos: (placeId: string): DetailItem[] => {
    // Mock photos for places with new structure
    const placePhotos: Record<string, DetailItem[]> = {
      '1': [
        {
          id: '1',
          title: 'Traditional Ramen Bowl',
          description: '전통적인 일본 라멘의 진정한 맛을 경험할 수 있는 그릇입니다. 50년 전통의 육수와 수제 면발이 어우러진 완벽한 한 그릇입니다.',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop'
        },
        {
          id: '2',
          title: 'Fresh Sushi Selection',
          description: '신선한 재료로 만든 다양한 초밥 모음입니다. 일본 전통 요리의 정교함과 아름다움을 담은 작품입니다.',
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop'
        },
        {
          id: '3',
          title: 'Gourmet Burger',
          description: '프리미엄 재료로 만든 고급 버거입니다. 풍부한 맛과 질감이 어우러진 완벽한 조합의 버거입니다.',
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'
        },
        {
          id: '4',
          title: 'Artisan Pizza',
          description: '수제 도우와 신선한 토핑으로 만든 아티잔 피자입니다. 이탈리아 전통의 맛을 현대적으로 재해석한 작품입니다.',
          image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop'
        },
        {
          id: '5',
          title: 'Fresh Pasta',
          description: '신선한 수제 파스타와 홈메이드 소스의 완벽한 조합입니다. 이탈리아 가정식의 따뜻함을 느낄 수 있는 요리입니다.',
          image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop'
        }
      ],
      '2': [
        {
          id: '1',
          title: 'Sushi Masterpiece',
          description: '스시 장인의 솜씨가 돋보이는 예술적인 초밥입니다. 신선한 생선과 쌀의 완벽한 조화를 느낄 수 있습니다.',
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop'
        },
        {
          id: '2',
          title: 'Premium Burger',
          description: '최고급 육질과 신선한 채소로 만든 프리미엄 버거입니다. 한 입 베어물 때마다 풍부한 맛이 가득합니다.',
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'
        },
        {
          id: '3',
          title: 'Neapolitan Pizza',
          description: '나폴리 전통 방식으로 구운 피자입니다. 얇은 도우와 신선한 모짜렐라의 완벽한 조합입니다.',
          image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop'
        },
        {
          id: '4',
          title: 'Homemade Pasta',
          description: '집에서 만든 신선한 파스타입니다. 이탈리아 전통 레시피로 만든 따뜻한 가정식의 맛입니다.',
          image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop'
        },
        {
          id: '5',
          title: 'Authentic Ramen',
          description: '진정한 일본 라멘의 맛을 경험할 수 있는 그릇입니다. 깊은 육수의 맛과 쫄깃한 면발이 어우러집니다.',
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop'
        }
      ]
    }
    
    return placePhotos[placeId] || [
      {
        id: '1',
        title: 'Default Ramen',
        description: '기본 라멘 그릇입니다. 전통적인 일본 라멘의 맛을 느낄 수 있습니다.',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop'
      },
      {
        id: '2',
        title: 'Default Sushi',
        description: '기본 초밥 모음입니다. 신선한 생선과 쌀의 조화로운 맛을 담았습니다.',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop'
      },
      {
        id: '3',
        title: 'Default Burger',
        description: '기본 버거입니다. 풍부한 맛과 질감이 어우러진 완벽한 조합입니다.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'
      },
      {
        id: '4',
        title: 'Default Pizza',
        description: '기본 피자입니다. 신선한 토핑과 치즈의 완벽한 조화를 느낄 수 있습니다.',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop'
      },
      {
        id: '5',
        title: 'Default Pasta',
        description: '기본 파스타입니다. 이탈리아 전통의 맛을 현대적으로 재해석했습니다.',
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop'
      }
    ]
  },
  
  setPhotosPagination: (pagination) => {
    set((state) => ({
      photosPagination: { ...state.photosPagination, ...pagination }
    }))
  },
  
  setPlacesPagination: (pagination) => {
    set((state) => ({
      placesPagination: { ...state.placesPagination, ...pagination }
    }))
  },
  
  setMusicPagination: (pagination) => {
    set((state) => ({
      musicPagination: { ...state.musicPagination, ...pagination }
    }))
  }
}))
