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
};

const Slider = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<SliderItem[]>([]);

  const fetchSliders = async () => {
    try {
      const res = await axios.get("/slider/");
      const data = res.data.map((s: SliderItem) => ({
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
  }, []);

  return (
    <>
      <PageMeta
        title="Slider - NICE Agentic AI Application Dashboard"
        description="NICE Agentic AI Application Dashboard"
      />

      {/* FULL SCREEN WRAPPER */}
      <div className="h-screen w-screen bg-black relative overflow-hidden">
        
        {/* Back Button */}
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
          className="h-full w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="h-full w-full flex items-center justify-center">
              
              {/* Image Wrapper */}
              <div className="w-full h-full flex items-center justify-center bg-black">
                
                {/* IMAGE (NO CROP) */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="
                    max-w-full 
                    max-h-full 
                    object-contain 
                    transition-transform duration-700
                    hover:scale-105
                  "
                />
              </div>

              {/* Optional Overlay (if needed later) */}
              {/* 
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
                <h2 className="text-white text-4xl font-bold">{slide.title}</h2>
                <p className="text-white mt-4">{slide.description}</p>
              </div> 
              */}

            </SwiperSlide>
          ))}

          {slides.length === 0 && (
            <SwiperSlide className="h-screen w-screen flex items-center justify-center">
              <p className="text-white text-xl">Loading slides...</p>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </>
  );
};

export default Slider;
