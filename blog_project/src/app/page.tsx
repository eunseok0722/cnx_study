import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">환영합니다! 👋</h1>
        <p className="text-xl text-muted-foreground">
          Google Photos와 YouTube를 활용한 개인 블로그입니다
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link href="/photos">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📸 사진 갤러리
              </CardTitle>
              <CardDescription>
                Google Photos에서 가져온 사진들을 감상해보세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                개인 사진들을 아름다운 갤러리 형태로 볼 수 있습니다.
                Google Photos API를 통해 실시간으로 사진을 가져옵니다.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/music">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎵 음악 플레이어
              </CardTitle>
              <CardDescription>
                YouTube에서 음악을 검색하고 재생해보세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                YouTube Data API를 활용하여 음악을 검색하고 재생할 수 있습니다.
                좋아하는 음악을 찾아보세요!
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">기술 스택</h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Next.js 14</span>
          <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full">TypeScript</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">Tailwind CSS</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">shadcn/ui</span>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">Google Photos API</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">YouTube Data API</span>
        </div>
      </div>
    </div>
  );
}
