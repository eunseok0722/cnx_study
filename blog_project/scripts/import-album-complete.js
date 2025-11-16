/**
 * Google Photos 앨범을 완전 자동화하여 프로젝트에 통합하는 스크립트
 * 
 * 사용 방법:
 * node scripts/import-album-complete.js <이미지폴더경로> <앨범ID> <앨범제목> [--public-id-prefix=<prefix>] [--skip-upload]
 * 
 * 기능:
 * 1. 이미지 메타데이터 추출 및 JSON 생성
 * 2. Cloudinary에 이미지 업로드 (선택)
 * 3. JSON 파일의 URL 업데이트
 * 4. data/albums.json에 앨범 정보 추가
 * 5. data/album-photos.json에 사진 정보 추가
 * 
 * 환경변수 필요 (Cloudinary 업로드 시):
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET (또는 CLOUDINARY_UPLOAD_PRESET)
 */

const fs = require('fs').promises
const path = require('path')
const https = require('https')
const crypto = require('crypto')
const { execSync } = require('child_process')

// ==================== 환경변수 로드 ====================
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

// ==================== Cloudinary 설정 ====================
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default'
const usePreset = UPLOAD_PRESET && UPLOAD_PRESET !== 'ml_default'

// ==================== 이미지 메타데이터 추출 ====================
async function extractMetadata(imagePath) {
  try {
    const isWindows = process.platform === 'win32'
    const checkCommand = isWindows ? 'where exiftool' : 'which exiftool'
    
    try {
      execSync(checkCommand, { stdio: 'ignore' })
    } catch (checkError) {
      throw new Error('ExifTool not found')
    }
    
    const exiftoolCommand = isWindows ? 'exiftool.exe' : 'exiftool'
    const output = execSync(`${exiftoolCommand} -j "${imagePath}"`, { encoding: 'utf-8' })
    const metadata = JSON.parse(output)[0]
    
    return {
      title: metadata.Title || path.basename(imagePath, path.extname(imagePath)),
      description: metadata.Description || metadata.UserComment || '',
      createdAt: metadata.DateTimeOriginal || metadata.CreateDate || new Date().toISOString().split('T')[0],
      width: metadata.ImageWidth,
      height: metadata.ImageHeight
    }
  } catch (error) {
    const stats = await fs.stat(imagePath)
    return {
      title: path.basename(imagePath, path.extname(imagePath)),
      description: '',
      createdAt: stats.birthtime.toISOString().split('T')[0],
      width: null,
      height: null
    }
  }
}

// ==================== Cloudinary 업로드 ====================
function generateSignature(params) {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  const stringToSign = sortedParams + API_SECRET
  return crypto.createHash('sha1').update(stringToSign).digest('hex')
}

function uploadToCloudinary(imagePath, publicId) {
  return new Promise((resolve, reject) => {
    try {
      const imageData = require('fs').readFileSync(imagePath)
      const base64Image = imageData.toString('base64')
      
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
      
      let params = {
        file: dataUri,
        public_id: publicId,
        timestamp: timestamp
      }
      
      if (usePreset) {
        params.upload_preset = UPLOAD_PRESET
      } else {
        params.api_key = API_KEY
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
                reject(new Error(`No URL in response - ${JSON.stringify(result)}`))
              }
            } else {
              let errorMessage = `HTTP ${res.statusCode}`
              try {
                const errorData = JSON.parse(data)
                errorMessage = errorData.error?.message || errorMessage
              } catch (e) {
                errorMessage = data || errorMessage
              }
              reject(new Error(errorMessage))
            }
          } catch (parseError) {
            reject(new Error(`Parse error: ${parseError.message}`))
          }
        })
      })
      
      req.on('error', (error) => {
        reject(new Error(`Network error: ${error.message}`))
      })
      
      req.setTimeout(60000, () => {
        req.destroy()
        reject(new Error('Upload timeout'))
      })
      
      req.write(bodyBuffer)
      req.end()
    } catch (error) {
      reject(new Error(`File read error: ${error.message}`))
    }
  })
}

// ==================== 유틸리티 함수 ====================
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic']

function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase()
  return imageExtensions.includes(ext)
}

// ==================== 메인 함수 ====================
async function importAlbumComplete(imagesFolder, albumId, albumTitle, publicIdPrefix = '', skipUpload = false) {
  try {
    console.log('🎬 앨범 통합 가져오기 시작...\n')
    console.log(`📁 이미지 폴더: ${imagesFolder}`)
    console.log(`🆔 앨범 ID: ${albumId}`)
    console.log(`📝 앨범 제목: ${albumTitle}\n`)
    
    // ========== Step 1: 이미지 메타데이터 추출 및 JSON 생성 ==========
    console.log('📋 Step 1: 이미지 메타데이터 추출 중...\n')
    
    const folderPath = path.resolve(imagesFolder)
    const files = await fs.readdir(folderPath)
    const imageFiles = files.filter(isImageFile).sort()
    
    if (imageFiles.length === 0) {
      console.error('❌ 이미지 파일을 찾을 수 없습니다.')
      process.exit(1)
    }
    
    console.log(`✅ ${imageFiles.length}개의 이미지를 찾았습니다.\n`)
    
    const photos = []
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const filePath = path.join(folderPath, file)
      
      process.stdout.write(`\r처리 중: ${file} (${i + 1}/${imageFiles.length})`)
      
      const metadata = await extractMetadata(filePath)
      
      photos.push({
        id: String(i + 1),
        title: metadata.title,
        description: metadata.description,
        image: skipUpload ? '' : '[Cloudinary URL을 여기에 입력]'
      })
    }
    console.log('\n')
    
    // 앨범 정보 생성
    const album = {
      id: albumId,
      title: albumTitle,
      thumbnail: '',
      category: 'photos',
      createdAt: photos[0]?.createdAt || new Date().toISOString().split('T')[0],
      imageCount: photos.length,
      description: `${albumTitle} 앨범`
    }
    
    // 임시 JSON 파일 저장 (imported 폴더)
    const outputDir = path.join(process.cwd(), 'data', 'imported')
    await fs.mkdir(outputDir, { recursive: true })
    
    const tempAlbumPath = path.join(outputDir, `album-${albumId}.json`)
    const tempPhotosPath = path.join(outputDir, `photos-${albumId}.json`)
    
    await fs.writeFile(tempAlbumPath, JSON.stringify(album, null, 2), 'utf-8')
    const photosData = { [albumId]: photos }
    await fs.writeFile(tempPhotosPath, JSON.stringify(photosData, null, 2), 'utf-8')
    
    console.log('✅ JSON 파일 생성 완료\n')
    
    // ========== Step 2: Cloudinary 업로드 (선택) ==========
    if (!skipUpload) {
      if (!CLOUD_NAME || !API_KEY || (!API_SECRET && !usePreset)) {
        console.warn('⚠️  Cloudinary 환경변수가 설정되지 않아 업로드를 건너뜁니다.')
        console.warn('   --skip-upload 플래그를 사용하여 업로드 없이 진행할 수 있습니다.\n')
      } else {
        console.log('☁️  Step 2: Cloudinary에 이미지 업로드 중...\n')
        console.log(`   Cloud Name: ${CLOUD_NAME}`)
        console.log(`   Upload Preset: ${usePreset ? UPLOAD_PRESET : '서명 기반'}\n`)
        
        const uploadPromises = []
        
        for (let i = 0; i < imageFiles.length; i++) {
          const imageFile = imageFiles[i]
          const imagePath = path.join(folderPath, imageFile)
          const photo = photos[i]
          
          if (!photo) continue
          
          const fileNameWithoutExt = path.basename(imageFile, path.extname(imageFile))
          const publicId = publicIdPrefix 
            ? `${publicIdPrefix}/${albumId}/${fileNameWithoutExt}`
            : `${albumId}/${fileNameWithoutExt}`
          
          uploadPromises.push(
            uploadToCloudinary(imagePath, publicId)
              .then(url => {
                process.stdout.write(`\r✅ 업로드 완료 (${i + 1}/${imageFiles.length}): ${imageFile}`)
                return { index: i, url }
              })
              .catch(error => {
                console.error(`\n❌ 업로드 실패: ${imageFile} - ${error.message}`)
                return { index: i, url: null, error }
              })
          )
        }
        
        const results = await Promise.all(uploadPromises)
        console.log('\n')
        
        // URL 업데이트
        let uploadedCount = 0
        for (const result of results) {
          if (result.url && photos[result.index]) {
            photos[result.index].image = result.url
            uploadedCount++
          }
        }
        
        // 썸네일 업데이트
        if (photos.length > 0 && photos[0].image) {
          album.thumbnail = photos[0].image
        }
        
        // 임시 JSON 파일 업데이트
        await fs.writeFile(tempAlbumPath, JSON.stringify(album, null, 2), 'utf-8')
        photosData[albumId] = photos
        await fs.writeFile(tempPhotosPath, JSON.stringify(photosData, null, 2), 'utf-8')
        
        console.log(`✅ ${uploadedCount}개의 이미지 업로드 완료\n`)
      }
    } else {
      console.log('⏭️  Step 2: Cloudinary 업로드 건너뜀 (--skip-upload)\n')
    }
    
    // ========== Step 3: 프로젝트 데이터에 통합 ==========
    console.log('🔗 Step 3: 프로젝트 데이터에 통합 중...\n')
    
    // albums.json 읽기 및 업데이트
    const albumsPath = path.join(process.cwd(), 'data', 'albums.json')
    let albums = []
    
    try {
      const albumsContent = await fs.readFile(albumsPath, 'utf-8')
      albums = JSON.parse(albumsContent)
    } catch (error) {
      console.warn(`⚠️  albums.json 파일을 읽을 수 없습니다. 새로 생성합니다.`)
    }
    
    // 기존 앨범이 있으면 제거 (중복 방지)
    albums = albums.filter(a => a.id !== albumId)
    
    // 새 앨범 추가
    albums.push(album)
    
    // 최신순으로 정렬
    albums.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    await fs.writeFile(albumsPath, JSON.stringify(albums, null, 2), 'utf-8')
    console.log(`✅ albums.json 업데이트 완료`)
    
    // album-photos.json 읽기 및 업데이트
    const albumPhotosPath = path.join(process.cwd(), 'data', 'album-photos.json')
    let albumPhotos = {}
    
    try {
      const albumPhotosContent = await fs.readFile(albumPhotosPath, 'utf-8')
      albumPhotos = JSON.parse(albumPhotosContent)
    } catch (error) {
      console.warn(`⚠️  album-photos.json 파일을 읽을 수 없습니다. 새로 생성합니다.`)
    }
    
    // 새 사진 정보 추가
    albumPhotos[albumId] = photos
    
    await fs.writeFile(albumPhotosPath, JSON.stringify(albumPhotos, null, 2), 'utf-8')
    console.log(`✅ album-photos.json 업데이트 완료\n`)
    
    // ========== 완료 ==========
    console.log('🎉 모든 작업이 완료되었습니다!\n')
    console.log('📊 요약:')
    console.log(`   - 앨범 ID: ${albumId}`)
    console.log(`   - 앨범 제목: ${albumTitle}`)
    console.log(`   - 이미지 개수: ${photos.length}`)
    console.log(`   - 업로드 완료: ${skipUpload ? '건너뜀' : photos.filter(p => p.image && !p.image.includes('[Cloudinary')).length + '개'}`)
    console.log('\n✨ 이제 프로젝트에서 앨범을 확인할 수 있습니다!')
    
  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// ==================== 명령줄 인자 파싱 ====================
const args = process.argv.slice(2)
if (args.length < 3) {
  console.log('사용 방법: node scripts/import-album-complete.js <이미지폴더경로> <앨범ID> <앨범제목> [옵션]')
  console.log('\n옵션:')
  console.log('  --public-id-prefix=<prefix>  Cloudinary Public ID에 prefix 추가')
  console.log('  --skip-upload                Cloudinary 업로드 건너뜀')
  console.log('\n예시:')
  console.log('  node scripts/import-album-complete.js ./downloads/album1 album1 "My Album"')
  console.log('  node scripts/import-album-complete.js ./downloads/album1 album1 "My Album" --public-id-prefix=photos')
  console.log('  node scripts/import-album-complete.js ./downloads/album1 album1 "My Album" --skip-upload')
  console.log('\n환경변수 (Cloudinary 업로드 시):')
  console.log('  CLOUDINARY_CLOUD_NAME=your_cloud_name')
  console.log('  CLOUDINARY_API_KEY=your_api_key')
  console.log('  CLOUDINARY_API_SECRET=your_api_secret (또는 CLOUDINARY_UPLOAD_PRESET)')
  process.exit(1)
}

const imagesFolder = args[0]
const albumId = args[1]
const albumTitle = args[2]
const prefixArg = args.find(arg => arg.startsWith('--public-id-prefix='))
const publicIdPrefix = prefixArg ? prefixArg.split('=')[1] : ''
const skipUpload = args.includes('--skip-upload')

importAlbumComplete(imagesFolder, albumId, albumTitle, publicIdPrefix, skipUpload)

