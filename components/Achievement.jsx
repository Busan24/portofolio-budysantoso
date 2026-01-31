"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

const Achievement = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "achievements"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        
        const achievementsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setAchievements(achievementsData);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <section id="achievement" className="container mx-auto px-4 pt-16 pb-8">
      <h2 className="text-3xl font-bold text-left mb-4">Achievements</h2>
      <p className="text-left text-white/80 mb-8">
        Here are some of the recognitions and awards I have received for my
        contributions and excellence in the field of technology and design.
      </p>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 mt-4">Loading achievements...</p>
        </div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/60">No achievements available yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-transform duration-300 hover:scale-105"
            >
              {/* Gambar */}
              <div className="w-full h-64 overflow-hidden rounded-md flex-shrink-0 mb-4 md:mb-0 md:w-40 md:h-40 md:mr-6">
                <Image
                  src={item.imagePublicId ? getOptimizedImageUrl(item.imagePublicId, 640, 256) : "/assets/placeholder.png"}
                  alt={item.title}
                  width={640}
                  height={256}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Konten */}
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-accent font-medium mb-2">
                  {item.subtitle}
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Achievement;
