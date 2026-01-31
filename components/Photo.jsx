"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

const Photo = () => {
  const [photoUrl, setPhotoUrl] = useState("/assets/photo.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const heroDoc = await getDoc(doc(db, "settings", "hero"));
        if (heroDoc.exists() && heroDoc.data().photoPublicId) {
          setPhotoUrl(getOptimizedImageUrl(heroDoc.data().photoPublicId, 476, 476));
        }
      } catch (error) {
        console.error("Error fetching photo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, []);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 2, duration: 0.4, ease: "easeIn" } }}
      >
        {/* Wrapper for image and circle */}
        <div className="relative w-[286px] h-[286px] xl:w-[476px] xl:h-[476px] flex items-center justify-center overflow-hidden rounded-full">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 2.4, duration: 0.4, ease: "easeInOut" } }}
            className="absolute w-full h-full"
          >
            {loading ? (
              <div className="w-full h-full bg-white/10 animate-pulse" />
            ) : (
              <Image
                src={photoUrl}
                priority
                quality={100}
                fill
                alt="Profile Photo"
                className="object-cover"
              />
            )}
          </motion.div>
          {/* Animated Circle */}
          <motion.svg
            className="absolute w-full h-full"
            fill="transparent"
            viewBox="0 0 506 506"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.circle
              cx="253"
              cy="253"
              r="250"
              stroke="#03b5fc"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ strokeDasharray: "24 10 0 0" }}
              animate={{
                strokeDasharray: ["15 120 25 25", "16 25 92 72", "4 250 22 22"],
                rotate: [120, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.svg>
        </div>
      </motion.div>
    </div>
  );
};

export default Photo;
