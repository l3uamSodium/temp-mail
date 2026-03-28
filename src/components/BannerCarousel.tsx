"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// The hardcoded banner filenames that the user will replace later.
// Note: We use .png because the placeholder API generates PNGs. Feel free to use .jpg or .webp later!
const banners = [
  "/banners/banner-cash.png",
  "/banners/banner-service.png",
  "/banners/banner-invites.png",
  "/banners/banner-bait.png",
];

export function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = right, -1 = left
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only auto-slide if the user isn't hovering on the carousel
    if (isHovered) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isHovered]);

  const slideVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
      };
    },
  };

  // Swipe sensitivity
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + banners.length) % banners.length);
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-[24px] mb-8 bg-white/40 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-md group"
      // Enforce a good banner aspect ratio (approx 21:6 desktop, but we handle responsive with minHeight below)
      style={{ aspectRatio: "21/6", minHeight: "140px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={banners[currentIndex]}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: 0.5, ease: "easeOut" },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
          alt={`Banner ${currentIndex + 1}`}
        />
      </AnimatePresence>

      {/* Manual Chevron Controls (Fade in on hover on larger screens) */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/70 backdrop-blur shadow hover:bg-white flex items-center justify-center text-[var(--accent)] md:opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronLeft size={20} className="md:w-6 md:h-6" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/70 backdrop-blur shadow hover:bg-white flex items-center justify-center text-[var(--accent)] md:opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronRight size={20} className="md:w-6 md:h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 md:bottom-5 left-0 right-0 flex justify-center gap-2 md:gap-2.5 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
              ? "bg-white w-5 md:w-6 opacity-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              : "bg-white/50 hover:bg-white/80 w-2 md:w-2.5"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
