"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const Marquee = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch skills from Firestore
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const q = query(collection(db, "skills"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const skillsData = querySnapshot.docs.map((doc) => doc.data().name);
        
        // If no data in Firestore, use default data
        if (skillsData.length === 0) {
          setItems(["Java", "JavaScript", "PHP", "Kotlin", "Dart", "XML", "Flutter", "Android Studio", "Laravel"]);
        } else {
          setItems(skillsData);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        // Fallback to default data on error
        setItems(["Java", "JavaScript", "PHP", "Kotlin", "Dart", "XML", "Flutter", "Android Studio", "Laravel"]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading || items.length === 0) {
    return null; // or return a loading skeleton
  }

  return (
    <div className="relative overflow-hidden w-full bg-accent py-1 mt-14">
      {/* Wrapper untuk animasi */}
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {/* Item pertama */}
        {items.map((item, index) => (
          <div
            key={`first-${index}`}
            className="flex items-center text-white text-2xl font-extrabold mx-4"
          >
            {/* Icon < */}
            <span className="mx-2 text-primary">{`< >`}</span>
            {/* Text */}
            <span className="mx-2">{item}</span>
            {/* Icon > */}
            <span className="mx-2 text-primary">{`< >`}</span>
          </div>
        ))}
        {/* Duplikasi item untuk efek looping */}
        {items.map((item, index) => (
          <div
            key={`second-${index}`}
            className="flex items-center text-white text-2xl font-extrabold mx-4"
          >
            <span className="mx-2 text-primary">{`< >`}</span>
            <span className="mx-2">{item}</span>
            <span className="mx-2 text-primary">{`< >`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
