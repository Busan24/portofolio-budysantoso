"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";
import Social from "@/components/Social";
import Photo from "@/components/Photo";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Experimen from "@/components/Experimen";
import BackToTop from "@/components/BackToTop";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Achievement from "@/components/Achievement";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [heroData, setHeroData] = useState({
    name: "Budy Santoso",
    roles: ["Software Engineering", "Frontend Developer", "UI/UX Designer"],
    description: "As a Software Engineering enthusiast, I have been actively involved in developing both web-based and mobile applications through various academic and independent projects.",
    cvUrl: "/assets/CV_BudySantoso.pdf"
  });
  const [loading, setLoading] = useState(true);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [downloadingCV, setDownloadingCV] = useState(false);

  const handleDownloadCV = async () => {
    if (!heroData.cvUrl || downloadingCV) return;
    
    try {
      setDownloadingCV(true);
      
      // Download file
      const response = await fetch(heroData.cvUrl);
      if (!response.ok) throw new Error('Failed to download CV');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${heroData.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Open in new tab after download
      setTimeout(() => {
        window.open(url, '_blank');
      }, 500);
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 10000);
      
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Failed to download CV. Please try again.');
    } finally {
      setDownloadingCV(false);
    }
  };

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const heroDoc = await getDoc(doc(db, "settings", "hero"));
        if (heroDoc.exists()) {
          const data = heroDoc.data();
          // Support both old (single role) and new (multiple roles) format
          if (data.roles && Array.isArray(data.roles)) {
            setHeroData(data);
          } else if (data.role) {
            setHeroData({ ...data, roles: [data.role] });
          } else {
            setHeroData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Rotating roles animation
  useEffect(() => {
    if (!heroData.roles || heroData.roles.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % heroData.roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroData.roles]);

  return (
    <section className="h-full">
      <div id="home" className="container mx-auto h-full pt-32">
        <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8">
          <div className="text-center xl:text-left order-2 xl:order-none">
            {loading ? (
              <div className="space-y-3">
                <div className="h-6 w-48 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                <div className="h-10 w-64 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                <div className="h-24 w-full max-w-[600px] bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <span className="text-xl text-accent">Hello, I'm {heroData.name}</span>
                <h1 className="h3 mt-2 min-h-[60px] flex items-center text-gray-900 dark:text-white">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentRoleIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="inline-block"
                    >
                      {heroData.roles && heroData.roles.length > 0 
                        ? heroData.roles[currentRoleIndex] 
                        : "Software Engineering"}
                    </motion.span>
                  </AnimatePresence>
                </h1>
                <p className="max-w-[600px] mb-4 mt-4 text-gray-600 dark:text-white/80 leading-normal">
                  {heroData.description}
                </p>
              </>
            )}
            <div className="flex flex-col xl:flex-row items-center gap-8 mt-6">
              <a
                href={heroData.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                suppressHydrationWarning
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="uppercase flex items-center gap-2 hover:text-primary"
                  suppressHydrationWarning
                >
                  <span>Curriculum Vitae</span>
                </Button>
              </a>
              <div className="mb-8 xl:mb-0">
                <Social containerStyles="flex gap-6" iconStyles="w-9 h-9 border border-accent rounded-full flex justify-center items-center text-accent text-base hover:bg-accent hover:text-primary hover:transition-all duration-500" />
              </div>
            </div>
          </div>
          <div className="order-1 xl:order-none mb-8 xl:mb-0">
            <Photo />
          </div>
        </div>
      </div>
      {/* Komponen Marquee */}
      <Marquee />
      <About />
      <Experimen />
      {/* Tombol Back to Top */}
      <BackToTop />
      <Services />
      <Projects />
      <Achievement />
      <Contact />
      <Footer />
    </section>
  );
};

export default Home;
