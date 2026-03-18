import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router-dom";

const VideoFullScreen = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageMeta
        title="Full Screen Video - NICE Agentic AI Application Dashboard"
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

        {/* FULLSCREEN VIDEO */}
        <video
          src="/videos/ismo_welcome.mp4" // place your video in public/videos
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </>
  );
};

export default VideoFullScreen;
