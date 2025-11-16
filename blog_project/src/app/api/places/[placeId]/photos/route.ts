import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ placeId: string }> }
) {
  try {
    const { placeId } = await params
    const filePath = join(process.cwd(), 'data', 'place-photos.json')
    const fileContents = await readFile(filePath, 'utf8')
    const placePhotos = JSON.parse(fileContents)
    
    const photos = placePhotos[placeId] || []
    
    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error reading place-photos.json:', error)
    return NextResponse.json(
      { error: 'Failed to fetch place photos' },
      { status: 500 }
    )
  }
}

