import PageMeta from "../../components/common/PageMeta";
import MainCard from "../../components/cards/MainCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import FirstImg from "../../assets/images/slider/1.jpg";
import SecondImg from "../../assets/images/slider/2.jpg";
import ThirdImg from "../../assets/images/slider/3.jpg";
import FourthImg from "../../assets/images/slider/4.jpg";
import FifthImg from "../../assets/images/slider/5.jpg";
import SixthImg from "../../assets/images/slider/6.jpg";
import SeventhImg from "../../assets/images/slider/7.jpg";
import EighthImg from "../../assets/images/slider/8.jpg";
import NinthImg from "../../assets/images/slider/9.jpg";
import TenthImg from "../../assets/images/slider/10.jpg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Slider = () => {
  const slides = [
    {
      image: FirstImg,
      title: "Renewable Energy Expansion",
      description:
        "Investment in solar and wind power continues to reshape the power sector landscape.",
    },
    {
      image: SecondImg,
      title: "Grid Modernization Initiatives",
      description:
        "Advanced smart grid technologies are improving reliability and efficiency.",
    },
    {
      image: ThirdImg,
      title: "Energy Market Reforms",
      description:
        "Policy reforms are driving competitive electricity markets and transparency.",
    },
    {
      image: FourthImg,
      title: "Sustainable Power Planning",
      description:
        "Data-driven planning ensures long-term sustainability in power generation.",
    },
    {
      image: FifthImg,
      title: "Decarbonization Efforts",
      description:
        "Power companies are accelerating efforts to reduce carbon emissions.",
    },
    {
      image: SixthImg,
      title: "Energy Storage Solutions",
      description:
        "Innovative storage technologies are enhancing grid stability and flexibility.",
    },
    {
      image: SeventhImg,
      title: "Digital Transformation",
      description:
        "AI and IoT are revolutionizing operations and maintenance in the power sector.",
    },
    {
      image: EighthImg,
      title: "Electric Vehicle Integration",
      description:
        "The rise of EVs is creating new opportunities and challenges for the grid.",
    },
    {
      image: NinthImg,
      title: "Resilience and Disaster Recovery",
      description:
        "Power companies are investing in infrastructure to withstand extreme weather events.",
    },
    {
      image: TenthImg,
      title: "Global Energy Transition",
      description:
        "International collaboration is accelerating the shift towards a sustainable energy future.",
    },
  ];

  const navigate = useNavigate();

  return (
    <>
      <PageMeta
        title="Slider - NICE Agentic AI Application Dashboard"
        description="NICE Agentic AI Application Dashboard"
      />

      <div className="h-screen w-screen overflow-hidden flex justify-center items-center bg-gray-50 p-4">

        <div className="w-full min-w-[98vw] 2xl:max-w-[85vw] h-full flex flex-col overflow-hidden">

          <MainCard cardtitle="Latest News & Updates in the Power Sector">

            <div className="flex flex-col h-[88vh] overflow-hidden">

              {/* Back Button */}
              <div className="mb-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Go Back
                </button>
              </div>

              {/* Slider */}
              <div className="flex-1 overflow-hidden rounded-2xl">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 8000, disableOnInteraction: false }}
                  loop
                  className="h-full w-full"
                >
                  {slides.map((slide, index) => (
                    <SwiperSlide key={index} className="h-full w-full relative">

                      {/* Image */}
                      <img
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Text Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-6">
                        <h2 className="text-white text-2xl md:text-8xl font-bold mb-4">
                          {slide.title}
                        </h2>
                        <p className="text-white text-sm md:text-3xl max-w-3xl">
                          {slide.description}
                        </p>
                      </div>

                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

            </div>
          </MainCard>

        </div>
      </div>
    </>
  );
};

export default Slider;
