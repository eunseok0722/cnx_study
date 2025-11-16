import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'places.json')
    const fileContents = await readFile(filePath, 'utf8')
    const places = JSON.parse(fileContents)
    
    return NextResponse.json(places)
  } catch (error) {
    console.error('Error reading places.json:', error)
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    )
  }
}

