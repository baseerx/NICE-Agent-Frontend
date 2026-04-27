import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type SliderItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  flag: boolean;
};

const Slider = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<SliderItem[]>([]);

  const fetchSliders = async () => {
    try {
      const res = await axios.get("/slider/");
      const data = res.data
        .filter((s: SliderItem) => s.flag === true)
        .map((s: SliderItem) => ({
          ...s,
          image: s.image.startsWith("http")
            ? s.image
            : `${window.location.origin}${s.image}`,
        }));
      setSlides(data);
    } catch (err) {
      console.error("Failed to fetch sliders:", err);
    }
  };

  useEffect(() => {
    fetchSliders();

    const interval = setInterval(() => {
      fetchSliders();
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);



  return (
    <>
      <PageMeta
        title="Slider - NICE Agentic AI Application Dashboard"
        description="NICE Agentic AI Application Dashboard"
      />

      {/* FULL SCREEN ROOT */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden m-0 p-0 bg-black">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-xs z-50 px-3 py-1 bg-gray-300 hover:bg-black/10 text-black rounded-lg shadow-sm transition"
        >
          Back
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          loop
          className="w-full h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="w-full h-full">

              {/* 🔥 STRETCHED IMAGE (NO GAPS, NO BLUR) */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-fill"
              />



            </SwiperSlide>
          ))}

          {slides.length === 0 && (
            <SwiperSlide className="w-full h-full flex items-center justify-center bg-black">
              <p className="text-white text-xl">Loading slides...</p>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </>
  );
};

export default Slider;
