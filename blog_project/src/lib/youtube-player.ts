// YouTube Player API 유틸리티

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

// YouTube Player API 스크립트 로드
export const loadYouTubeAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (window.YT && window.YT.Player) {
      resolve()
      return
    }

    // 스크립트가 이미 로드 중인 경우
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      // 기존 콜백이 있는지 확인
      const existingCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        if (existingCallback) existingCallback()
        resolve()
      }
      return
    }

    // API 준비 콜백 설정
    window.onYouTubeIframeAPIReady = () => {
      // API가 완전히 로드될 때까지 잠시 대기
      setTimeout(() => {
        if (window.YT && window.YT.Player) {
          resolve()
        } else {
          reject(new Error('YouTube API not properly loaded'))
        }
      }, 100)
    }

    // 스크립트 로드
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.onerror = () => reject(new Error('Failed to load YouTube API'))
    document.head.appendChild(script)
  })
}

// YouTube Player 생성 옵션
export const createPlayerOptions = (videoId: string, events: any = {}) => ({
  height: '100%',
  width: '100%',
  videoId,
  playerVars: {
    autoplay: 0,
    controls: 1,
    modestbranding: 1,
    rel: 0,
    showinfo: 0,
    fs: 1,
    cc_load_policy: 0,
    iv_load_policy: 3,
    autohide: 0,
    enablejsapi: 1,
    origin: window.location.origin,
    ...events
  },
  events: {
    onReady: events.onReady,
    onStateChange: events.onStateChange,
    onPlaybackQualityChange: events.onPlaybackQualityChange,
    onPlaybackRateChange: events.onPlaybackRateChange,
    onError: events.onError
  }
})

// YouTube Player 상태 상수
export const YT_PLAYER_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
}

// YouTube Player 에러 코드
export const YT_PLAYER_ERROR = {
  INVALID_PARAMETER: 2,
  HTML5_PLAYER_ERROR: 5,
  VIDEO_NOT_FOUND: 100,
  VIDEO_NOT_EMBEDDABLE: 101,
  VIDEO_NOT_EMBEDDABLE_2: 150
}

// 에러 메시지 매핑
export const getErrorMessage = (errorCode: number): string => {
  switch (errorCode) {
    case YT_PLAYER_ERROR.INVALID_PARAMETER:
      return '잘못된 매개변수입니다.'
    case YT_PLAYER_ERROR.HTML5_PLAYER_ERROR:
      return 'HTML5 플레이어 오류가 발생했습니다.'
    case YT_PLAYER_ERROR.VIDEO_NOT_FOUND:
      return '비디오를 찾을 수 없습니다.'
    case YT_PLAYER_ERROR.VIDEO_NOT_EMBEDDABLE:
    case YT_PLAYER_ERROR.VIDEO_NOT_EMBEDDABLE_2:
      return '이 비디오는 임베드할 수 없습니다.'
    default:
      return '알 수 없는 오류가 발생했습니다.'
  }
}
