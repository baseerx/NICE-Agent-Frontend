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

  // Fetch dynamic sliders from backend
  const fetchSliders = async () => {
    try {
      const res = await axios.get("/slider/");
      const data = res.data.map((s: SliderItem) => ({
        ...s,
        // ensure absolute URL
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
      <div className="h-screen w-screen overflow-hidden bg-black relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-sm z-50 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition"
        >
          Go Back
        </button>

        {/* SWIPER FULLSCREEN */}
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
            <SwiperSlide key={slide.id} className="h-screen w-screen relative">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-6">
                {/* <h2
                  className="
                  text-white 
                  font-bold 
                  leading-tight
                  text-3xl 
                  sm:text-5xl 
                  md:text-6xl 
                  lg:text-7xl 
                  xl:text-8xl 
                  2xl:text-9xl
                "
                >
                  {slide.title}
                </h2>

                <p
                  className="
                  text-white 
                  mt-6
                  max-w-4xl
                  text-sm 
                  sm:text-lg 
                  md:text-xl 
                  lg:text-2xl 
                  xl:text-3xl
                "
                >
                  {slide.description}
                </p> */}
              </div>
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
