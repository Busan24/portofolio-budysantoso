"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Experimen = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const q = query(collection(db, "experiences"), orderBy("startDate", "desc"));
        const snapshot = await getDocs(q);
        
        const experiencesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setExperiences(experiencesData);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section id="experimen" className="py-8 bg-white dark:bg-primary text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Experience</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg animate-pulse">
                <div className="h-4 w-32 bg-gray-300 dark:bg-white/10 rounded mb-3" />
                <div className="h-6 w-48 bg-gray-300 dark:bg-white/10 rounded mb-2" />
                <div className="h-4 w-40 bg-gray-300 dark:bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-white/60 text-lg">No experiences available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-transparent text-gray-900 dark:text-white/90 hover:shadow-accent/20 hover:shadow-xl transition-shadow duration-300">
                <p className="text-sm text-accent mb-2">
                  {exp.startDate} - {exp.endDate}
                </p>
                <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">{exp.title}</h3>
                <p className="text-sm text-gray-600 dark:text-white/70 flex items-start gap-1">
                  <span className="text-white/50">•</span>
                  {exp.company}, {exp.location}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experimen;
