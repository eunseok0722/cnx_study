/**
 * Google Photos에서 다운로드한 이미지를 JSON 형식으로 변환하는 스크립트
 * 
 * 사용 방법:
 * 1. Google Photos에서 이미지를 다운로드
 * 2. 이미지를 특정 폴더에 저장
 * 3. 이 스크립트를 실행하여 JSON 생성
 * 
 * node scripts/import-google-photos.js <이미지폴더경로> <앨범ID> <앨범제목>
 */

const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')

// 이미지 메타데이터 추출 (exiftool 필요)
async function extractMetadata(imagePath) {
  try {
    // exiftool이 설치되어 있는지 확인 (OS별 명령어)
    const isWindows = process.platform === 'win32'
    const checkCommand = isWindows ? 'where exiftool' : 'which exiftool'
    
    try {
      execSync(checkCommand, { stdio: 'ignore' })
    } catch (checkError) {
      // exiftool이 없으면 기본값 반환
      throw new Error('ExifTool not found')
    }
    
    // exiftool 실행 (Windows에서는 .exe 확장자 자동 처리)
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
    // exiftool이 없거나 실패한 경우 기본값 반환
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

// 지원하는 이미지 확장자
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic']

// 이미지 파일인지 확인
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase()
  return imageExtensions.includes(ext)
}

// 메인 함수
async function importGooglePhotos(imagesFolder, albumId, albumTitle) {
  try {
    // 이미지 폴더 확인
    const folderPath = path.resolve(imagesFolder)
    const files = await fs.readdir(folderPath)
    
    // 이미지 파일만 필터링
    const imageFiles = files.filter(isImageFile)
    
    if (imageFiles.length === 0) {
      console.error('이미지 파일을 찾을 수 없습니다.')
      process.exit(1)
    }
    
    console.log(`${imageFiles.length}개의 이미지를 찾았습니다.`)
    
    // 각 이미지의 메타데이터 추출
    const photos = []
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const filePath = path.join(folderPath, file)
      
      console.log(`처리 중: ${file} (${i + 1}/${imageFiles.length})`)
      
      const metadata = await extractMetadata(filePath)
      
      photos.push({
        id: String(i + 1),
        title: metadata.title,
        description: metadata.description,
        image: `[Cloudinary URL을 여기에 입력]` // Cloudinary 업로드 후 URL로 교체
      })
    }
    
    // 앨범 정보 생성
    const album = {
      id: albumId,
      title: albumTitle,
      thumbnail: photos[0]?.image || '',
      category: 'photos',
      createdAt: photos[0]?.createdAt || new Date().toISOString().split('T')[0],
      imageCount: photos.length,
      description: `${albumTitle} 앨범`
    }
    
    // JSON 파일 생성
    const outputDir = path.join(process.cwd(), 'data', 'imported')
    await fs.mkdir(outputDir, { recursive: true })
    
    // 앨범 정보 저장
    const albumPath = path.join(outputDir, `album-${albumId}.json`)
    await fs.writeFile(albumPath, JSON.stringify(album, null, 2), 'utf-8')
    console.log(`\n앨범 정보 저장: ${albumPath}`)
    
    // 사진 정보 저장
    const photosPath = path.join(outputDir, `photos-${albumId}.json`)
    const photosData = { [albumId]: photos }
    await fs.writeFile(photosPath, JSON.stringify(photosData, null, 2), 'utf-8')
    console.log(`사진 정보 저장: ${photosPath}`)
    
    // 통합 가이드 출력
    console.log('\n=== 다음 단계 ===')
    console.log('1. Cloudinary에 이미지 업로드')
    console.log('2. 생성된 JSON 파일의 image URL을 Cloudinary URL로 교체')
    console.log('3. data/albums.json에 앨범 정보 추가')
    console.log('4. data/album-photos.json에 사진 정보 추가')
    
  } catch (error) {
    console.error('오류 발생:', error.message)
    process.exit(1)
  }
}

// 명령줄 인자 확인
const args = process.argv.slice(2)
if (args.length < 3) {
  console.log('사용 방법: node scripts/import-google-photos.js <이미지폴더경로> <앨범ID> <앨범제목>')
  console.log('예시: node scripts/import-google-photos.js ./downloads/album1 album1 "My Album"')
  process.exit(1)
}

const [imagesFolder, albumId, albumTitle] = args
importGooglePhotos(imagesFolder, albumId, albumTitle)

