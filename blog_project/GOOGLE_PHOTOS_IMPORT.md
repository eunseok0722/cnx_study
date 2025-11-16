# Google Photos 앨범 가져오기 가이드

Google Photos 공유 링크에서 이미지와 메타데이터를 가져오는 방법입니다.

## ⚠️ 제한사항

Google Photos는 **공유 링크에서 직접 데이터를 가져오는 공식 API를 제공하지 않습니다**. 따라서 다음과 같은 대안을 사용해야 합니다.

## 방법 1: Google Photos Library API 사용 (권장)

### 장점
- 공식 API 사용
- 자동화 가능
- 메타데이터 자동 추출

### 단점
- OAuth 인증 필요
- 공유 링크가 아닌 본인 계정의 앨범만 접근 가능
- API 설정이 복잡함

### 설정 방법

1. **Google Cloud Console 설정**
   - [Google Cloud Console](https://console.cloud.google.com/) 접속
   - 새 프로젝트 생성
   - "API 및 서비스" > "라이브러리"에서 "Photos Library API" 활성화
   - OAuth 2.0 클라이언트 ID 생성

2. **환경변수 설정**
   ```env
   GOOGLE_PHOTOS_CLIENT_ID=your_client_id
   GOOGLE_PHOTOS_CLIENT_SECRET=your_client_secret
   ```

3. **API 사용**
   - 사용자가 OAuth로 로그인
   - 앨범 목록 가져오기
   - 앨범 내 사진 가져오기

## 방법 2: 수동 다운로드 후 변환 (현실적)

### 단계별 가이드

1. **Google Photos에서 이미지 다운로드**
   - 공유 앨범 열기: https://photos.app.goo.gl/4fcqLteyj17mzaW78
   - 모든 사진 선택 (Ctrl+A 또는 Cmd+A)
   - 다운로드 버튼 클릭

2. **이미지를 Cloudinary에 업로드**
   - Cloudinary 대시보드에서 업로드
   - 또는 API를 통한 자동 업로드

3. **메타데이터 추출 및 JSON 생성**
   - 다운로드한 이미지의 EXIF 데이터 확인
   - JSON 형식으로 변환

## 방법 3: 공유 링크 파싱 (제한적)

공유 링크에서 일부 정보를 추출할 수 있지만, 이미지 URL은 직접 가져올 수 없습니다.

### 공유 링크 형식
```
https://photos.app.goo.gl/4fcqLteyj17mzaW78
```

이 링크는:
- 앨범 ID: `4fcqLteyj17mzaW78`
- 하지만 이 ID로 API를 통해 접근하려면 OAuth 인증이 필요합니다.

## 방법 4: 브라우저 확장 프로그램 사용

일부 브라우저 확장 프로그램이 Google Photos에서 이미지를 다운로드하는 기능을 제공합니다:
- "Google Photos Downloader" (Chrome 확장)
- "Download All Images" (Firefox 확장)

⚠️ 주의: Google의 서비스 약관을 확인하고 사용하세요.

## 추천 워크플로우

1. **Google Photos에서 이미지 다운로드**
   - 공유 앨범 열기
   - 이미지 다운로드

2. **Cloudinary에 업로드**
   - 이미지 업로드
   - URL 복사

3. **JSON 파일 생성**
   - `data/albums.json`에 앨범 정보 추가
   - `data/album-photos.json`에 사진 정보 추가

4. **자동화 스크립트 사용** (선택)
   - 제공된 변환 스크립트 사용
   - 이미지 메타데이터 자동 추출

## 자동화 도구

프로젝트에 포함된 도구:
- `scripts/import-google-photos.js` - 이미지 메타데이터 추출 및 JSON 생성
- `scripts/upload-to-cloudinary.js` - Cloudinary 업로드 및 JSON URL 업데이트
- `scripts/import-album-complete.js` - **전체 프로세스 자동화 (권장) ⚡**

### `import-album-complete.js` - 완전 자동화 스크립트 (권장)

**한 번의 명령으로 모든 작업을 자동으로 처리합니다!**

#### 기능
1. ✅ 이미지 메타데이터 추출 및 JSON 생성
2. ✅ Cloudinary에 이미지 자동 업로드
3. ✅ JSON 파일의 URL 자동 업데이트
4. ✅ `data/albums.json`에 앨범 정보 자동 추가
5. ✅ `data/album-photos.json`에 사진 정보 자동 추가

#### 사용 방법

```bash
# 기본 사용법
node scripts/import-album-complete.js <이미지폴더경로> <앨범ID> <앨범제목>

# 실제 예시
node scripts/import-album-complete.js ./downloads/2510_상암 album-2510 "2510. 상암"

# Public ID에 prefix 추가
node scripts/import-album-complete.js ./downloads/2510_상암 album-2510 "2510. 상암" --public-id-prefix=photos

# Cloudinary 업로드 건너뜀 (JSON만 생성)
node scripts/import-album-complete.js ./downloads/2510_상암 album-2510 "2510. 상암" --skip-upload
```

#### 실행 예시

```bash
$ node scripts/import-album-complete.js ./downloads/album-2510 album-2510 "2510. 상암"

🎬 앨범 통합 가져오기 시작...

📁 이미지 폴더: ./downloads/album-2510
🆔 앨범 ID: album-2510
📝 앨범 제목: 2510. 상암

📋 Step 1: 이미지 메타데이터 추출 중...

✅ 10개의 이미지를 찾았습니다.

처리 중: IMG_001.jpg (10/10)

✅ JSON 파일 생성 완료

☁️  Step 2: Cloudinary에 이미지 업로드 중...

   Cloud Name: your_cloud_name
   Upload Preset: blog_photos

✅ 업로드 완료 (10/10): IMG_010.jpg

✅ 10개의 이미지 업로드 완료

🔗 Step 3: 프로젝트 데이터에 통합 중...

✅ albums.json 업데이트 완료
✅ album-photos.json 업데이트 완료

🎉 모든 작업이 완료되었습니다!

📊 요약:
   - 앨범 ID: album-2510
   - 앨범 제목: 2510. 상암
   - 이미지 개수: 10
   - 업로드 완료: 10개

✨ 이제 프로젝트에서 앨범을 확인할 수 있습니다!
```

#### 옵션

- `--public-id-prefix=<prefix>`: Cloudinary Public ID에 prefix 추가
  - 예: `--public-id-prefix=photos` → `photos/album-2510/IMG_001`
  
- `--skip-upload`: Cloudinary 업로드를 건너뜀 (JSON만 생성)
  - 환경변수가 설정되지 않았거나 수동 업로드를 원할 때 사용

#### 환경변수 설정

Cloudinary 업로드를 사용하려면 `.env.local` 파일에 다음을 추가:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

또는 Upload Preset 사용 (권장):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_UPLOAD_PRESET=blog_photos
```

#### 개별 스크립트 사용 (고급)

전체 프로세스를 단계별로 실행하려면:

1. `scripts/import-google-photos.js` - JSON 생성
2. `scripts/upload-to-cloudinary.js` - Cloudinary 업로드
3. 수동으로 `data/albums.json`과 `data/album-photos.json`에 통합

하지만 **`import-album-complete.js`를 사용하는 것을 강력히 권장합니다!**

### `import-google-photos.js` 상세 사용 가이드

이 스크립트는 Google Photos에서 다운로드한 이미지 폴더를 프로젝트의 JSON 형식으로 변환합니다.

#### 1. 사전 준비

**필수:**
- Node.js 설치 (프로젝트에 이미 포함됨)
- Google Photos에서 다운로드한 이미지 폴더

**선택 (메타데이터 추출용):**
- ExifTool 설치 (이미지 EXIF 데이터 추출)
  - Windows: [ExifTool 다운로드](https://exiftool.org/) 또는 `choco install exiftool`
  - macOS: `brew install exiftool`
  - Linux: `sudo apt-get install libimage-exiftool-perl`

#### ExifTool 설치 상세 가이드

##### Windows 설치 방법

1. **ExifTool 다운로드**
   - [ExifTool 공식 사이트](https://exiftool.org/) 접속
   - "Download" 섹션에서 "Windows Executable" 다운로드
   - 파일명: `exiftool(-k).exe` (예: `exiftool-12.70(-k).exe`)

2. **설치 경로 선택**
   - 권장 경로: `C:\exiftool\`
   - 또는: `C:\Program Files\ExifTool\`
   - 또는: `C:\Tools\exiftool\`

3. **파일 압축 해제 및 이름 변경**
   ```
   C:\exiftool\
   └── exiftool(-k).exe  →  exiftool.exe로 이름 변경
   ```
   - 다운로드한 `exiftool(-k).exe` 파일을 선택한 폴더에 압축 해제
   - 파일명을 `exiftool.exe`로 변경 (괄호 제거)

4. **PATH 환경변수에 추가**
   
   **방법 A: 시스템 환경변수 설정 (권장)**
   - Windows 키 + R → `sysdm.cpl` 입력 → Enter
   - "고급" 탭 → "환경 변수" 클릭
   - "시스템 변수" 섹션에서 `Path` 선택 → "편집" 클릭
   - "새로 만들기" 클릭 → `C:\exiftool` 입력 (설치한 경로)
   - "확인" 클릭하여 모든 창 닫기
   - **새 터미널 창을 열어야 변경사항 적용됨**

   **방법 B: PowerShell에서 임시 설정**
   ```powershell
   # 현재 세션에만 적용
   $env:Path += ";C:\exiftool"
   ```

5. **설치 확인**
   - 새 터미널(CMD 또는 PowerShell) 열기
   - 다음 명령어 실행:
   ```bash
   exiftool -ver
   ```
   - 버전 번호가 표시되면 성공 (예: `12.70`)

##### macOS 설치 방법

**Homebrew 사용 (권장):**
```bash
brew install exiftool
```

**수동 설치:**
1. [ExifTool 다운로드](https://exiftool.org/)
2. 압축 해제 후 `/usr/local/bin/` 또는 `~/bin/`에 복사
3. 실행 권한 부여:
   ```bash
   chmod +x /usr/local/bin/exiftool
   ```

##### Linux 설치 방법

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install libimage-exiftool-perl
```

**CentOS/RHEL:**
```bash
sudo yum install perl-Image-ExifTool
```

**설치 확인:**
```bash
exiftool -ver
```

##### 문제 해결

**Windows에서 "exiftool을 찾을 수 없습니다" 오류:**
1. PATH 환경변수가 올바르게 설정되었는지 확인
2. 터미널을 완전히 종료하고 새로 열기
3. 다음 명령어로 경로 확인:
   ```cmd
   where exiftool
   ```
   또는 PowerShell:
   ```powershell
   Get-Command exiftool
   ```

**스크립트가 ExifTool을 찾지 못하는 경우:**
- 스크립트는 `which exiftool` 명령어를 사용합니다
- Windows에서는 `where exiftool`로 확인 가능
- PATH에 추가했는데도 안 되면, 스크립트를 수정하여 전체 경로 지정:
  ```javascript
  // Windows 예시
  execSync('C:\\exiftool\\exiftool.exe -j ...')
  ```

**대안: ExifTool 없이 사용**
- ExifTool이 없어도 스크립트는 정상 작동합니다
- 다만 메타데이터 추출이 제한적입니다 (파일명과 생성일만 사용)

#### 2. 단계별 사용 방법

##### Step 1: Google Photos에서 이미지 다운로드

1. Google Photos 공유 앨범 열기
   ```
   https://photos.app.goo.gl/4fcqLteyj17mzaW78
   ```

2. 모든 사진 선택
   - Windows/Linux: `Ctrl + A`
   - macOS: `Cmd + A`

3. 다운로드 버튼 클릭
   - 다운로드한 ZIP 파일 압축 해제
   - 예: `C:\Users\YourName\Downloads\2510_상암\` 또는 `~/Downloads/2510_상암/`

##### Step 2: 스크립트 실행

터미널에서 프로젝트 루트 디렉토리로 이동 후 실행:

```bash
# 기본 사용법
node scripts/import-google-photos.js <이미지폴더경로> <앨범ID> <앨범제목>

# 실제 예시
node scripts/import-google-photos.js ./downloads/2510_상암 album-2510 "2510. 상암"

# 절대 경로 사용 (Windows)
node scripts/import-google-photos.js "C:\Users\YourName\Downloads\2510_상암" album-2510 "2510. 상암"

# 절대 경로 사용 (macOS/Linux)
node scripts/import-google-photos.js ~/Downloads/2510_상암 album-2510 "2510. 상암"
```

**파라미터 설명:**
- `<이미지폴더경로>`: 다운로드한 이미지가 있는 폴더 경로
  - 상대 경로: `./downloads/album1`
  - 절대 경로: `C:\Users\...` (Windows) 또는 `/Users/...` (macOS/Linux)
- `<앨범ID>`: 프로젝트에서 사용할 앨범 고유 ID (영문, 숫자, 하이픈 사용)
  - 예: `album-2510`, `sangam-2024`, `photo-001`
- `<앨범제목>`: 앨범 제목 (공백 포함 시 따옴표로 감싸기)
  - 예: `"2510. 상암"`, `"My Vacation"`

##### Step 3: 실행 결과 확인

스크립트 실행 시 다음과 같은 출력이 표시됩니다:

```
10개의 이미지를 찾았습니다.
처리 중: IMG_001.jpg (1/10)
처리 중: IMG_002.jpg (2/10)
...
처리 중: IMG_010.jpg (10/10)

앨범 정보 저장: D:\gitSouce\cnx_study\blog_project\data\imported\album-album-2510.json
사진 정보 저장: D:\gitSouce\cnx_study\blog_project\data\imported\photos-album-2510.json

=== 다음 단계 ===
1. Cloudinary에 이미지 업로드
2. 생성된 JSON 파일의 image URL을 Cloudinary URL로 교체
3. data/albums.json에 앨범 정보 추가
4. data/album-photos.json에 사진 정보 추가
```

**생성된 파일:**
- `data/imported/album-{앨범ID}.json` - 앨범 메타데이터
- `data/imported/photos-{앨범ID}.json` - 사진 목록 및 메타데이터

##### Step 4: 생성된 JSON 파일 확인

**앨범 정보 예시** (`album-album-2510.json`):
```json
{
  "id": "album-2510",
  "title": "2510. 상암",
  "thumbnail": "[Cloudinary URL을 여기에 입력]",
  "category": "photos",
  "createdAt": "2024-10-18",
  "imageCount": 10,
  "description": "2510. 상암 앨범"
}
```

**사진 정보 예시** (`photos-album-2510.json`):
```json
{
  "album-2510": [
    {
      "id": "1",
      "title": "IMG_001",
      "description": "",
      "image": "[Cloudinary URL을 여기에 입력]"
    },
    {
      "id": "2",
      "title": "IMG_002",
      "description": "",
      "image": "[Cloudinary URL을 여기에 입력]"
    }
  ]
}
```

##### Step 5: Cloudinary에 이미지 업로드 및 JSON 자동 업데이트

**방법 A: 자동 업로드 스크립트 사용 (권장) ⚡**

1. **환경변수 설정**
   
   프로젝트 루트에 `.env.local` 파일 생성 (또는 기존 파일에 추가):
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   
   또는 터미널에서 직접 설정 (Windows):
   ```cmd
   set CLOUDINARY_CLOUD_NAME=your_cloud_name
   set CLOUDINARY_API_KEY=your_api_key
   set CLOUDINARY_API_SECRET=your_api_secret
   ```
   
   macOS/Linux:
   ```bash
   export CLOUDINARY_CLOUD_NAME=your_cloud_name
   export CLOUDINARY_API_KEY=your_api_key
   export CLOUDINARY_API_SECRET=your_api_secret
   ```

2. **자동 업로드 스크립트 실행**
   ```bash
   # 기본 사용법
   node scripts/upload-to-cloudinary.js <이미지폴더경로> <앨범ID>
   
   # 실제 예시
   node scripts/upload-to-cloudinary.js ./downloads/2510_상암 album-2510
   
   # Public ID에 prefix 추가 (선택)
   node scripts/upload-to-cloudinary.js ./downloads/2510_상암 album-2510 --public-id-prefix=photos
   ```

3. **스크립트 동작**
   - 이미지 폴더의 모든 이미지를 Cloudinary에 업로드
   - 업로드된 URL을 자동으로 JSON 파일에 적용
   - 앨범 썸네일도 자동 업데이트
   - 진행 상황을 실시간으로 표시

**방법 B: 수동 업로드 (대안)**

1. **Cloudinary 대시보드에서 업로드**
   - [Cloudinary 대시보드](https://cloudinary.com/console) 접속
   - Media Library > Upload
   - 이미지 파일들을 드래그 앤 드롭
   - 업로드 후 각 이미지의 URL 복사

2. **JSON 파일에 URL 수동 적용**
   - 생성된 JSON 파일 열기
   - `[Cloudinary URL을 여기에 입력]` 부분을 실제 URL로 교체
   - 텍스트 에디터의 "찾기 및 바꾸기" 기능 활용

##### Step 6: JSON 파일 확인 (자동 업로드 사용 시 생략 가능)

자동 업로드 스크립트를 사용한 경우, 이 단계는 자동으로 완료됩니다.

수동 업로드를 사용한 경우에만 JSON 파일을 확인하고 URL을 교체하세요.

##### Step 7: 프로젝트 데이터에 통합

1. **앨범 정보 추가**
   - `data/albums.json` 파일 열기
   - 생성된 앨범 정보를 배열에 추가

2. **사진 정보 추가**
   - `data/album-photos.json` 파일 열기
   - 생성된 사진 정보를 객체에 추가

**예시:**
```json
// data/albums.json에 추가
{
  "id": "album-2510",
  "title": "2510. 상암",
  "thumbnail": "https://res.cloudinary.com/...",
  ...
}

// data/album-photos.json에 추가
{
  "album-2510": [
    { "id": "1", "title": "IMG_001", ... },
    ...
  ]
}
```

#### 3. 지원하는 이미지 형식

- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.heic`

#### 4. 메타데이터 추출

**ExifTool이 설치된 경우:**
- 이미지 제목 (Title)
- 설명 (Description)
- 촬영 날짜 (DateTimeOriginal)
- 이미지 크기 (Width, Height)

**ExifTool이 없는 경우:**
- 파일명을 제목으로 사용
- 파일 생성 날짜를 촬영 날짜로 사용
- 기본값으로 처리

#### 5. 문제 해결

**문제: "이미지 파일을 찾을 수 없습니다"**
- 이미지 폴더 경로가 올바른지 확인
- 폴더에 이미지 파일이 있는지 확인
- 지원하는 이미지 형식인지 확인

**문제: "exiftool을 찾을 수 없습니다" (경고)**
- 정상 동작합니다 (ExifTool 없이도 작동)
- 더 정확한 메타데이터를 원하면 ExifTool 설치

**문제: 경로 오류 (Windows)**
- 경로에 공백이 있으면 따옴표로 감싸기: `"C:\Users\My Name\Downloads\..."`

**문제: 한글 파일명 오류**
- 파일명을 영문으로 변경하거나
- Node.js가 UTF-8을 지원하는지 확인

#### 6. 고급 사용법

**여러 앨범 일괄 처리:**
```bash
# 앨범 1
node scripts/import-google-photos.js ./downloads/album1 album1 "Album 1"

# 앨범 2
node scripts/import-google-photos.js ./downloads/album2 album2 "Album 2"
```

**스크립트로 자동화:**
```bash
# Windows (batch)
for /d %d in (downloads\*) do node scripts/import-google-photos.js "%d" "album-%d" "%d"

# macOS/Linux (bash)
for dir in downloads/*/; do
  album_id=$(basename "$dir")
  node scripts/import-google-photos.js "$dir" "$album_id" "$album_id"
done
```

## 참고 자료

- [Google Photos Library API 문서](https://developers.google.com/photos/library/guides/overview)
- [Cloudinary 업로드 API](https://cloudinary.com/documentation/image_upload_api_reference)

