'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'

// 임시 데이터 (앨범별 음악 정보)
const mockMusicAlbums = {
  '1': {
    id: '1',
    title: 'Midnight Jazz Collection',
    artist: 'Jazz Ensemble',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop',
    tracks: [
      { id: '1-1', title: 'Midnight Blues', artist: 'Jazz Ensemble', duration: '4:32' },
      { id: '1-2', title: 'Smooth Sailing', artist: 'Jazz Ensemble', duration: '3:45' },
      { id: '1-3', title: 'Late Night Groove', artist: 'Jazz Ensemble', duration: '5:12' },
      { id: '1-4', title: 'Urban Jazz', artist: 'Jazz Ensemble', duration: '4:18' },
      { id: '1-5', title: 'Moonlight Serenade', artist: 'Jazz Ensemble', duration: '6:24' }
    ]
  },
  '2': {
    id: '2',
    title: 'Classical Piano Sonatas',
    artist: 'Maria Schmidt',
    albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=800&fit=crop',
    tracks: [
      { id: '2-1', title: 'Sonata No. 1 in C Major', artist: 'Maria Schmidt', duration: '8:45' },
      { id: '2-2', title: 'Sonata No. 2 in A Minor', artist: 'Maria Schmidt', duration: '7:32' },
      { id: '2-3', title: 'Sonata No. 3 in G Major', artist: 'Maria Schmidt', duration: '9:18' }
    ]
  },
  '3': {
    id: '3',
    title: 'Indie Folk Stories',
    artist: 'The Wanderers',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop',
    tracks: [
      { id: '3-1', title: 'Road Less Traveled', artist: 'The Wanderers', duration: '3:56' },
      { id: '3-2', title: 'Mountain Echo', artist: 'The Wanderers', duration: '4:23' },
      { id: '3-3', title: 'River Song', artist: 'The Wanderers', duration: '5:11' },
      { id: '3-4', title: 'Forest Whispers', artist: 'The Wanderers', duration: '4:47' }
    ]
  }
}

export default function MusicDetailPage() {
  const params = useParams()
  const albumId = params.albumId as string
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const album = mockMusicAlbums[albumId as keyof typeof mockMusicAlbums]
  const currentTrack = album?.tracks[currentTrackIndex]

  if (!album || !currentTrack) {
    return (
      <>
        <Header />
        <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">앨범을 찾을 수 없습니다</h1>
            <p className="text-gray-600">요청하신 앨범이 존재하지 않습니다.</p>
          </div>
        </div>
      </>
    )
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    setCurrentTrackIndex(prev => 
      prev > 0 ? prev - 1 : album.tracks.length - 1
    )
  }

  const handleNext = () => {
    setCurrentTrackIndex(prev => 
      prev < album.tracks.length - 1 ? prev + 1 : 0
    )
  }

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index)
  }

  return (
    <>
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-6 py-12">
          {/* 메인 음악 플레이어 */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
              {/* 좌측: 앨범아트 및 음악 정보 */}
              <div className="flex flex-col items-center lg:items-start space-y-6">
                {/* 트랙 번호 */}
                <div className="text-white/70 text-sm font-mono">
                  {(currentTrackIndex + 1).toString().padStart(2, '0')} / {album.tracks.length.toString().padStart(2, '0')}
                </div>
                
                {/* 앨범아트 */}
                <div className="relative">
                  <img
                    src={album.albumArt}
                    alt={album.title}
                    className="w-80 h-80 lg:w-96 lg:h-96 object-cover rounded-lg shadow-2xl"
                  />
                  {/* 재생 오버레이 */}
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      className="w-16 h-16 bg-white/90 text-black hover:bg-white"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                    </Button>
                  </div>
                </div>
                
                {/* 음악 정보 */}
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {currentTrack.title}
                  </h1>
                  <p className="text-xl text-white/80">
                    {album.artist}
                  </p>
                  <p className="text-sm text-white/60 mt-2">
                    {currentTrack.duration}
                  </p>
                </div>
              </div>

              {/* 우측: 재생 컨트롤 */}
              <div className="flex flex-col items-center lg:items-start space-y-8">
                {/* 재생 컨트롤 버튼들 */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 border-white/30 text-white hover:bg-white/10"
                    onClick={handlePrevious}
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    size="icon"
                    className="w-16 h-16 bg-white text-black hover:bg-white/90"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 border-white/30 text-white hover:bg-white/10"
                    onClick={handleNext}
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>
                </div>

                {/* 볼륨 컨트롤 */}
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-white/70" />
                  <div className="w-32 h-1 bg-white/30 rounded-full">
                    <div className="w-20 h-1 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* 앨범 정보 */}
                <div className="text-white/80">
                  <h2 className="text-xl font-semibold mb-2">{album.title}</h2>
                  <p className="text-sm">{album.tracks.length} tracks</p>
                </div>
              </div>
            </div>

            {/* 하단: 재생목록 */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Playlist</h3>
                <p className="text-white/70">
                  {(currentTrackIndex + 1).toString().padStart(2, '0')} / {album.tracks.length.toString().padStart(2, '0')}
                </p>
              </div>
              
              {/* 앨범아트 썸네일들 */}
              <div className="flex justify-center">
                <div className="grid grid-cols-5 md:grid-cols-10 gap-4 max-w-4xl">
                  {album.tracks.slice(0, 10).map((track, index) => (
                    <div
                      key={track.id}
                      className={`relative cursor-pointer transition-transform hover:scale-105 ${
                        index === currentTrackIndex ? 'ring-2 ring-white' : ''
                      }`}
                      onClick={() => handleTrackSelect(index)}
                    >
                      <img
                        src={album.albumArt}
                        alt={track.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black text-xs rounded-full flex items-center justify-center font-bold">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      {index === currentTrackIndex && (
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
