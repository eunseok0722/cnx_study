import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: Request,
  { params }: { params: { albumId: string } }
) {
  try {
    const { albumId } = params
    const filePath = join(process.cwd(), 'data', 'album-photos.json')
    const fileContents = await readFile(filePath, 'utf8')
    const albumPhotos = JSON.parse(fileContents)
    
    const photos = albumPhotos[albumId] || []
    
    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error reading album-photos.json:', error)
    return NextResponse.json(
      { error: 'Failed to fetch album photos' },
      { status: 500 }
    )
  }
}

