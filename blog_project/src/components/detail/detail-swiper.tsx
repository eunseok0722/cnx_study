"use client";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {DetailItem} from "@/types";

interface DetailSwiperProps {
  items: DetailItem[];
  title: string;
  createdAt: string;
  totalCount: number;
}

export function DetailSwiper({items, title, createdAt, totalCount}: DetailSwiperProps) {
  return (
    <div className="min-h-screen bg-black detail-swiper">
      {/* 정보 헤더 */}
      <div className="absolute top-20 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-gray-300">{createdAt}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">총 {totalCount}장</p>
            </div>
          </div>
        </div>
      </div>

      {/* Swiper 캐러셀 */}
      <div className="relative h-screen">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            type: "fraction",
            formatFractionCurrent: (number) => number.toString().padStart(2, "0"),
            formatFractionTotal: (number) => number.toString().padStart(2, "0"),
          }}
          onSlideChange={() => {}}
          className="h-full"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="relative h-full flex items-center justify-center">
                <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                {/* 아이템 정보 오버레이 */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-6 pb-24 md:pb-6">
                  <div className="container mx-auto">
                    <h3 className="text-white text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 커스텀 네비게이션 버튼 */}
        <div className="absolute bottom-8 right-8 z-20 flex items-center space-x-4">
          <div className="swiper-pagination text-white text-lg font-mono"></div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="swiper-button-prev bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="swiper-button-next bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
