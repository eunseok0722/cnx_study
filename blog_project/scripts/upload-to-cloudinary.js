/**
 * Cloudinary에 이미지를 업로드하고 JSON 파일의 URL을 자동으로 업데이트하는 스크립트
 * 
 * 사용 방법:
 * node scripts/upload-to-cloudinary.js <이미지폴더경로> <앨범ID> [--public-id-prefix=<prefix>]
 * 
 * 환경변수 필요:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 */

const fs = require('fs').promises
const path = require('path')
const https = require('https')
const crypto = require('crypto')

// .env.local 파일 로드 (있는 경우)
try {
  const envPath = path.join(process.cwd(), '.env.local')
  if (require('fs').existsSync(envPath)) {
    const envContent = require('fs').readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '')
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    })
  }
} catch (error) {
  // .env.local 파일이 없어도 계속 진행
}

// Cloudinary 설정
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default'

// Upload Preset이 있으면 API_SECRET 불필요
const usePreset = process.env.CLOUDINARY_UPLOAD_PRESET && process.env.CLOUDINARY_UPLOAD_PRESET !== 'ml_default'

if (!CLOUD_NAME || !API_KEY || (!API_SECRET && !usePreset)) {
  console.error('❌ Cloudinary 환경변수가 설정되지 않았습니다.')
  console.error('\n필수 환경변수:')
  console.error('  - CLOUDINARY_CLOUD_NAME')
  console.error('  - CLOUDINARY_API_KEY')
  
  if (!usePreset) {
    console.error('  - CLOUDINARY_API_SECRET (서명 기반 업로드 시 필요)')
  } else {
    console.error('\n선택 환경변수:')
    console.error('  - CLOUDINARY_UPLOAD_PRESET (설정 시 API_SECRET 불필요)')
  }
  
  console.error('\n.env.local 파일에 추가하거나 환경변수로 설정하세요.')
  console.error('\n현재 설정 상태:')
  console.error(`  CLOUD_NAME: ${CLOUD_NAME ? '✅' : '❌'}`)
  console.error(`  API_KEY: ${API_KEY ? '✅' : '❌'}`)
  console.error(`  API_SECRET: ${API_SECRET ? '✅' : '❌'}`)
  console.error(`  UPLOAD_PRESET: ${UPLOAD_PRESET}`)
  process.exit(1)
}

console.log('📋 Cloudinary 설정 확인:')
console.log(`  Cloud Name: ${CLOUD_NAME}`)
console.log(`  API Key: ${API_KEY ? '✅ 설정됨' : '❌ 없음'}`)
console.log(`  Upload Preset: ${usePreset ? UPLOAD_PRESET : '사용 안 함 (서명 기반)'}`)
console.log('')

// Cloudinary 서명 생성
function generateSignature(params) {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  const stringToSign = sortedParams + API_SECRET
  return crypto.createHash('sha1').update(stringToSign).digest('hex')
}

// Cloudinary에 이미지 업로드 (multipart/form-data 사용)
function uploadToCloudinary(imagePath, publicId) {
  return new Promise((resolve, reject) => {
    try {
      const imageData = require('fs').readFileSync(imagePath)
      const base64Image = imageData.toString('base64')
      
      // 파일 확장자에 따라 MIME 타입 결정
      const ext = path.extname(imagePath).toLowerCase()
      const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.heic': 'image/heic'
      }
      const mimeType = mimeTypes[ext] || 'image/jpeg'
      const dataUri = `data:${mimeType};base64,${base64Image}`
      
      const timestamp = Math.floor(Date.now() / 1000).toString()
      
      // Upload Preset 사용 여부 확인
      const usePreset = UPLOAD_PRESET && UPLOAD_PRESET !== 'ml_default'
      
      let params = {
        file: dataUri,
        public_id: publicId,
        timestamp: timestamp
      }
      
      if (usePreset) {
        // Upload Preset 사용 (서명 불필요)
        params.upload_preset = UPLOAD_PRESET
      } else {
        // 서명 기반 업로드
        params.api_key = API_KEY
        
        // 서명 생성 (file 파라미터 제외)
        const signParams = {
          public_id: publicId,
          timestamp: timestamp,
          api_key: API_KEY
        }
        params.signature = generateSignature(signParams)
      }
      
      // multipart/form-data 형식으로 변환
      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2)
      const parts = []
      
      for (const [key, value] of Object.entries(params)) {
        parts.push(`--${boundary}`)
        if (key === 'file') {
          parts.push(`Content-Disposition: form-data; name="${key}"`)
          parts.push(`Content-Type: ${mimeType}`)
          parts.push('')
          parts.push(value)
        } else {
          parts.push(`Content-Disposition: form-data; name="${key}"`)
          parts.push('')
          parts.push(String(value))
        }
      }
      parts.push(`--${boundary}--`)
      
      const body = parts.join('\r\n')
      const bodyBuffer = Buffer.from(body, 'utf-8')
      
      const options = {
        hostname: 'api.cloudinary.com',
        path: `/v1_1/${CLOUD_NAME}/image/upload`,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': bodyBuffer.length
        }
      }
      
      const req = https.request(options, (res) => {
        let data = ''
        
        res.on('data', (chunk) => {
          data += chunk
        })
        
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const result = JSON.parse(data)
              if (result.secure_url) {
                resolve(result.secure_url)
              } else {
                reject(new Error(`Upload failed: No URL in response - ${JSON.stringify(result)}`))
              }
            } else {
              let errorMessage = `HTTP ${res.statusCode}`
              try {
                const errorData = JSON.parse(data)
                errorMessage = errorData.error?.message || errorMessage
              } catch (e) {
                errorMessage = data || errorMessage
              }
              reject(new Error(`Upload failed: ${errorMessage}`))
            }
          } catch (parseError) {
            reject(new Error(`Failed to parse response: ${parseError.message} - Response: ${data.substring(0, 200)}`))
          }
        })
      })
      
      req.on('error', (error) => {
        reject(new Error(`Network error: ${error.message}`))
      })
      
      req.setTimeout(60000, () => {
        req.destroy()
        reject(new Error('Upload timeout after 60 seconds'))
      })
      
      req.write(bodyBuffer)
      req.end()
    } catch (error) {
      reject(new Error(`File read error: ${error.message}`))
    }
  })
}

// 지원하는 이미지 확장자
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic']

// 이미지 파일인지 확인
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase()
  return imageExtensions.includes(ext)
}

// 메인 함수
async function uploadAndUpdateJson(imagesFolder, albumId, publicIdPrefix = '') {
  try {
    console.log('🚀 Cloudinary 업로드 시작...\n')
    
    // 이미지 폴더 확인
    const folderPath = path.resolve(imagesFolder)
    const files = await fs.readdir(folderPath)
    const imageFiles = files.filter(isImageFile).sort()
    
    if (imageFiles.length === 0) {
      console.error('❌ 이미지 파일을 찾을 수 없습니다.')
      process.exit(1)
    }
    
    console.log(`📁 ${imageFiles.length}개의 이미지를 찾았습니다.\n`)
    
    // JSON 파일 경로
    const photosJsonPath = path.join(process.cwd(), 'data', 'imported', `photos-${albumId}.json`)
    const albumJsonPath = path.join(process.cwd(), 'data', 'imported', `album-${albumId}.json`)
    
    // JSON 파일 읽기
    let photosData
    let albumData
    
    try {
      const photosContent = await fs.readFile(photosJsonPath, 'utf-8')
      photosData = JSON.parse(photosContent)
    } catch (error) {
      console.error(`❌ JSON 파일을 읽을 수 없습니다: ${photosJsonPath}`)
      process.exit(1)
    }
    
    try {
      const albumContent = await fs.readFile(albumJsonPath, 'utf-8')
      albumData = JSON.parse(albumContent)
    } catch (error) {
      console.warn(`⚠️  앨범 JSON 파일을 읽을 수 없습니다: ${albumJsonPath}`)
    }
    
    const photos = photosData[albumId] || []
    
    // 이미지 파일과 JSON 항목 매칭
    const uploadPromises = []
    const urlMap = new Map()
    
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i]
      const imagePath = path.join(folderPath, imageFile)
      const photo = photos[i]
      
      if (!photo) {
        console.warn(`⚠️  JSON에 해당하는 항목이 없습니다: ${imageFile}`)
        continue
      }
      
      // 이미 Cloudinary URL이 있으면 스킵
      if (photo.image && !photo.image.includes('[Cloudinary URL을 여기에 입력]')) {
        console.log(`⏭️  이미 업로드됨: ${imageFile}`)
        continue
      }
      
      // Public ID 생성
      const fileNameWithoutExt = path.basename(imageFile, path.extname(imageFile))
      const publicId = publicIdPrefix 
        ? `${publicIdPrefix}/${albumId}/${fileNameWithoutExt}`
        : `${albumId}/${fileNameWithoutExt}`
      
      uploadPromises.push(
        uploadToCloudinary(imagePath, publicId)
          .then(url => {
            console.log(`✅ 업로드 완료 (${i + 1}/${imageFiles.length}): ${imageFile}`)
            urlMap.set(i, url)
            return { index: i, url }
          })
          .catch(error => {
            console.error(`❌ 업로드 실패: ${imageFile} - ${error.message}`)
            return { index: i, url: null, error }
          })
      )
    }
    
    // 모든 업로드 완료 대기
    console.log('\n📤 Cloudinary에 업로드 중...\n')
    const results = await Promise.all(uploadPromises)
    
    // JSON 파일 업데이트
    let updatedCount = 0
    for (const result of results) {
      if (result.url && photos[result.index]) {
        photos[result.index].image = result.url
        updatedCount++
      }
    }
    
    // 썸네일 업데이트 (첫 번째 이미지)
    if (photos.length > 0 && photos[0].image && albumData) {
      albumData.thumbnail = photos[0].image
    }
    
    // JSON 파일 저장
    photosData[albumId] = photos
    await fs.writeFile(photosJsonPath, JSON.stringify(photosData, null, 2), 'utf-8')
    console.log(`\n💾 사진 JSON 업데이트: ${photosJsonPath}`)
    
    if (albumData) {
      await fs.writeFile(albumJsonPath, JSON.stringify(albumData, null, 2), 'utf-8')
      console.log(`💾 앨범 JSON 업데이트: ${albumJsonPath}`)
    }
    
    console.log(`\n✨ 완료! ${updatedCount}개의 URL이 업데이트되었습니다.`)
    console.log('\n=== 다음 단계 ===')
    console.log('1. data/albums.json에 앨범 정보 추가')
    console.log('2. data/album-photos.json에 사진 정보 추가')
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message)
    process.exit(1)
  }
}

// 명령줄 인자 파싱
const args = process.argv.slice(2)
if (args.length < 2) {
  console.log('사용 방법: node scripts/upload-to-cloudinary.js <이미지폴더경로> <앨범ID> [--public-id-prefix=<prefix>]')
  console.log('\n예시:')
  console.log('  node scripts/upload-to-cloudinary.js ./downloads/album1 album1')
  console.log('  node scripts/upload-to-cloudinary.js ./downloads/album1 album1 --public-id-prefix=photos')
  console.log('\n환경변수 설정:')
  console.log('  CLOUDINARY_CLOUD_NAME=your_cloud_name')
  console.log('  CLOUDINARY_API_KEY=your_api_key')
  console.log('  CLOUDINARY_API_SECRET=your_api_secret')
  process.exit(1)
}

const imagesFolder = args[0]
const albumId = args[1]
const prefixArg = args.find(arg => arg.startsWith('--public-id-prefix='))
const publicIdPrefix = prefixArg ? prefixArg.split('=')[1] : ''

uploadAndUpdateJson(imagesFolder, albumId, publicIdPrefix)

