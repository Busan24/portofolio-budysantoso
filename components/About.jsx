"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const About = () => {
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const aboutDoc = await getDoc(doc(db, "settings", "about"));
        if (aboutDoc.exists()) {
          setAboutText(aboutDoc.data().bioText || "");
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  return (
    <section id="about" className="pt-16 pb-8 bg-gray-50 dark:bg-primary text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">About Me</h2>
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          </div>
        ) : (
          <p className="text-base leading-relaxed text-gray-700 dark:text-white/80">
            {aboutText || "I am a Software Engineering Technology student at IPB University with a strong passion for web and mobile application development. Experienced in using Java, PHP, JavaScript, Python, Dart, and frameworks such as Laravel, and Flutter, I am eager to apply my skills in real-world projects that support digital transformation. I thrive in collaborative environments, have a solid understanding of database systems like PostgreSQL and MySQL."}
          </p>
        )}
      </div>
    </section>
  );
};

export default About;
