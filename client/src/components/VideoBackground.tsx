import { useEffect, useRef } from "react";

interface VideoBackgroundProps {
  src: string;
  opacity?: number;
  overlay?: boolean;
  className?: string;
}

export default function VideoBackground({ 
  src, 
  opacity = 0.3, 
  overlay = true,
  className = ""
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Ensure video plays on mount
      videoRef.current.play().catch(err => {
        console.log("Video autoplay prevented:", err);
      });
    }
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        style={{ opacity }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      )}
    </>
  );
}
