import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'albums.json')
    const fileContents = await readFile(filePath, 'utf8')
    const albums = JSON.parse(fileContents)
    
    return NextResponse.json(albums)
  } catch (error) {
    console.error('Error reading albums.json:', error)
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    )
  }
}

