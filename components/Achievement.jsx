"use client";

import Image from "next/image";

const achievements = [
   {
    id: 1,
    image: "/assets/award-3.jpeg",
    title: "3rd Winner of Android Programming Competition",
    subtitle: "By Universitas Tarumanagara - 2025",
    description:
      "Participated in the Android Programming Competition organized by Universitas Tarumanagara. Developed Seraya, a mental health companion app for adolescents and young adults. The app features AI-based mood tracking, personalized wellness recommendations, and an anonymous community space. Built using Java and Firebase, Seraya provides an empathetic and accessible solution for emotional well-being through a reflective and data-driven.",
  },
  {
    id: 2,
    image: "/assets/award-1.jpg",
    title: "1st Winner of Mobile UI/UX Competition",
    subtitle: "By Universitas Atma Jaya Yogyakarta - 2024",
    description:
      "Participated in a Mobile UI/UX Competition organized by Universitas Atma Jaya Yogyakarta. Designed the UI/UX for WatchGang, a Video on Demand (VOD) platform offering unique features such as interactive watch parties, social networking based on location, personalized playlists, and offline viewing. The app enhanced user engagement by creating a highly interactive and localized streaming experience.",
  },
  {
    id: 3,
    image: "/assets/award-2.jpg",
    title: "1st Winner of Short Video Graphic Design",
    subtitle: "By Universitas Islam Kalimantan Muhammad Arsyad Al Banjari - 2024",
    description:
      "Created a promotional short video for the Sharia Economics program at Universitas Islam Kalimantan Muhammad Arsyad Al Banjari. The video effectively showcased the program's unique values and benefits, enhancing its visibility and appeal among prospective students.",
  },
];

const Achievement = () => {
  return (
    <section id="achievement" className="container mx-auto px-4 pt-16 pb-8">
      <h2 className="text-3xl font-bold text-left mb-4">Achievements</h2>
      <p className="text-left text-white/80 mb-8">
        Here are some of the recognitions and awards I have received for my
        contributions and excellence in the field of technology and design.
      </p>

      {/* Kontainer Kolom */}
      <div className="flex flex-col gap-8">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row items-center bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-transform duration-300 hover:scale-105"
          >
            {/* Gambar */}
            <div className="w-full h-64 overflow-hidden rounded-md flex-shrink-0 mb-4 md:mb-0 md:w-40 md:h-40 md:mr-6">
              <Image
                src={item.image}
                alt={item.title}
                width={640} // Gambar memenuhi lebar layar di mobile
                height={256} // Menjaga proporsi gambar
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>

            {/* Konten */}
            <div className="text-left"> {/* Mengubah text-center menjadi text-left */}
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
    </section>
  );
};

export default Achievement;
