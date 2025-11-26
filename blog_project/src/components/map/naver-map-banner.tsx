'use client'

import { useEffect, useRef, useState } from 'react'
import { MapLocation } from '@/types'

interface NaverMapBannerProps {
  locations: MapLocation[] // 여러 위치를 받을 수 있도록 변경
  height?: number
  favoriteMapUrl?: string // 네이버 지도 즐겨찾기 리스트 URL
}

// 네이버 지도 API 타입 정의
interface NaverMaps {
  LatLng: new (lat: number, lng: number) => NaverLatLng
  LatLngBounds: new () => NaverLatLngBounds
  Map: new (element: HTMLElement | string, options: MapOptions) => NaverMap
  Marker: new (options: MarkerOptions) => NaverMarker
  InfoWindow: new (options: InfoWindowOptions) => NaverInfoWindow
  Event: {
    addListener: (target: any, event: string, handler: () => void) => void
  }
  Position: {
    TOP_RIGHT: string
  }
}

interface NaverLatLngBounds {
  extend: (point: NaverLatLng) => void
}

interface NaverLatLng {
  lat: () => number
  lng: () => number
}

interface MapOptions {
  center: NaverLatLng
  zoom: number
  zoomControl?: boolean
  zoomControlOptions?: {
    position: string
  }
}

interface MarkerOptions {
  position: NaverLatLng
  map: NaverMap
}

interface InfoWindowOptions {
  content: string
}

interface NaverMap {
  // Map 인스턴스 메서드들 (필요시 추가)
  fitBounds: (bounds: NaverLatLngBounds) => void
  [key: string]: any
}

interface NaverMarker {
  // Marker 인스턴스 메서드들 (필요시 추가)
  setMap: (map: NaverMap | null) => void
  [key: string]: any
}

interface NaverInfoWindow {
  getMap: () => NaverMap | null
  close: () => void
  open: (map: NaverMap, marker: NaverMarker) => void
}

declare global {
  interface Window {
    naver?: {
      maps: NaverMaps
    }
    navermap_authFailure?: () => void
  }
}

export function NaverMapBanner({ locations, height = 300, favoriteMapUrl }: NaverMapBannerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const mapInstanceRef = useRef<NaverMap | null>(null)
  const markersRef = useRef<NaverMarker[]>([])
  const infoWindowsRef = useRef<NaverInfoWindow[]>([])

  useEffect(() => {
    // 네이버 지도 API가 이미 로드되어 있는지 확인
    if (window.naver && window.naver.maps) {
      initializeMap()
      return
    }

    // 네이버 지도 API 로드
    const script = document.createElement('script')
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || 'YOUR_CLIENT_ID'
    
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
    script.async = true
    
    script.onload = () => {
      setIsLoaded(true)
      initializeMap()
    }
    
    script.onerror = () => {
      setMapError('네이버 지도 API를 로드할 수 없습니다.')
    }

    // 인증 실패 핸들러 설정
    window.navermap_authFailure = () => {
      setMapError('네이버 지도 API 인증에 실패했습니다. 클라이언트 ID를 확인해주세요.')
    }

    document.head.appendChild(script)

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거 (선택적)
      // document.head.removeChild(script)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // locations가 변경되면 지도 재초기화
  useEffect(() => {
    if (isLoaded && window.naver && window.naver.maps && locations.length > 0) {
      initializeMap()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, isLoaded])

  const initializeMap = () => {
    if (!mapRef.current || !window.naver || !window.naver.maps || locations.length === 0) {
      return
    }

    try {
      // 기존 마커와 정보창 제거
      markersRef.current.forEach(marker => {
        marker.setMap(null)
      })
      infoWindowsRef.current.forEach(infoWindow => {
        infoWindow.close()
      })
      markersRef.current = []
      infoWindowsRef.current = []

      // 첫 번째 위치를 중심으로 지도 초기화
      const firstLocation = locations[0]
      const mapOptions = {
        center: new window.naver.maps.LatLng(firstLocation.latitude, firstLocation.longitude),
        zoom: 12,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT
        }
      }

      const map = new window.naver.maps.Map(mapRef.current, mapOptions)
      mapInstanceRef.current = map

      // 모든 위치에 대한 경계 계산
      const bounds = new window.naver.maps.LatLngBounds()

      // 각 위치에 마커 추가
      locations.forEach((location, index) => {
        const position = new window.naver.maps.LatLng(location.latitude, location.longitude)
        bounds.extend(position)

        // 마커 추가
        const marker = new window.naver.maps.Marker({
          position: position,
          map: map
        })
        markersRef.current.push(marker)

        // 정보창 추가
        let infoContent = location.title 
          ? `<div style="padding:10px;min-width:200px;text-align:center;"><strong>${location.title}</strong>${location.description ? `<br/><small>${location.description}</small>` : ''}`
          : `<div style="padding:10px;min-width:200px;text-align:center;">위치 ${index + 1}`
        
        // favoriteMapUrl이 있으면 링크 추가
        if (favoriteMapUrl) {
          infoContent += `<br/><a href="${favoriteMapUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:8px;padding:6px 12px;background-color:#03C75A;color:white;text-decoration:none;border-radius:4px;font-size:12px;cursor:pointer;">지도에서 보기</a>`
        }
        
        infoContent += `</div>`
        
        const infoWindow = new window.naver.maps.InfoWindow({
          content: infoContent
        })
        infoWindowsRef.current.push(infoWindow)

        // 마커 클릭 시 정보창 표시
        window.naver.maps.Event.addListener(marker, 'click', () => {
          // 다른 정보창 닫기
          infoWindowsRef.current.forEach((iw, i) => {
            if (i !== index && iw.getMap()) {
              iw.close()
            }
          })
          
          // 현재 정보창 토글
          if (infoWindow.getMap()) {
            infoWindow.close()
          } else {
            infoWindow.open(map, marker)
          }
        })
      })

      // 모든 위치를 포함하도록 지도 범위 조정
      if (locations.length > 1) {
        map.fitBounds(bounds)
      }
    } catch (error) {
      console.error('지도 초기화 오류:', error)
      setMapError('지도를 표시할 수 없습니다.')
    }
  }

  if (locations.length === 0) {
    return null
  }

  if (mapError) {
    return (
      <div 
        className="w-full bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-500 text-sm">{mapError}</p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
      <div 
        ref={mapRef} 
        className="w-full"
        style={{ height: `${height}px` }}
      />
    </div>
  )
}

