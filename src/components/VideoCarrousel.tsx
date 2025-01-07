import { useGSAP } from "@gsap/react";
import { hightlightsSlides } from "constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { pauseImg, playImg, replayImg } from "utils";
gsap.registerPlugin(ScrollTrigger);

export default function VideoCarrousel() {

  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState<any[]>([]);

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    })
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none restart none",
      },
      onComplete: () => {
        console.log('TESTE')
        setVideo((prevVideo) => ({
          ...prevVideo,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId]?.pause();
      } else {
        startPlay && videoRef.current[videoId]?.play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedData = (index: number, event: any) => setLoadedData((prev) => [...prev, event]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width: window.innerWidth < 760 
                ? '10vw' 
                : window.innerWidth < 1200
                  ? '10vw'
                  : '4vw',
            });

            gsap.to(span[videoId], { 
              width: `${currentProgress}%`,
              backgroundColor: "white",
            })
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px',
            })
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            })
          }
        },
      })

      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        const currentTime = videoRef.current[videoId]?.currentTime ?? 0;
        anim.progress(currentTime / hightlightsSlides[videoId].videoDuration);
      }

      if (isPlaying)  {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }

    }
  }, [videoId, startPlay]);

  const handleProcess = (type: string, index?: number) => {
    switch (type) {
      case "video-end":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isEnd: true,
          videoId: (index || 0 ) + 1 ,
        }));
        break;
      case "video-last":
        setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: true }));
        break;
      case "video-reset":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: false,
          videoId: 0,
        }));
        break;
      case "play":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;
      case "pause":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;
      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, index) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline
                  preload="auto"
                  muted
                  className={`${list.id === 2 && 'translate-x-4'} pointer-events-none`}
                  ref={(el) => (videoRef.current[index] = el)}
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onEnded={() => 
                    index !== 3
                    ? handleProcess("video-end", index)
                    : handleProcess("video-last")
                  }
                  onLoadedMetadata={(event) => handleLoadedData(index, event)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
                <div className="absolute top-12 left-[5%] z-10">
                  {list.textLists.map((text) => (
                    <p key={text} className="md:text-2xl text-xl font-medium">
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, index) => (
            <span
              key={index}
              ref={(el) => (videoDivRef.current[index] = el)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[index] = el)}
              />
            </span>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                  ? () => handleProcess("play")
                  : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
}
