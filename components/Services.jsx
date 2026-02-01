"use client";
import { useState, useEffect } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import Link from "next/link";
import { motion } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "services"), orderBy("num", "asc"));
        const snapshot = await getDocs(q);
        
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services" className="flex flex-col justify-center pt-16 pb-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Services</h2>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 dark:text-white/60 mt-4">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-white/60">No services available yet.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.4, ease: "easeIn" } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-[60px]"
          > 
            {services.map((service, index) => {
              return (
                <div key={service.id} className="flex-1 flex flex-col justify-center gap-6 group">
                  {/* top */}
                  <div className="w-full flex justify-between items-center">
                    <div className="text-5xl font-extrabold text-outline text-transparent group-hover:text-outline-hover transition-all duration-500">
                      {service.num}
                    </div>
                    <Link 
                      href={service.href || "#"} 
                      className="w-[70px] h-[70px] rounded-full bg-gray-200 dark:bg-white group-hover:bg-accent transition-all duration-500 flex justify-center items-center hover:-rotate-45"
                    >
                      <BsArrowUpRight className="text-primary text-3xl"/>
                    </Link>
                  </div>
                  <h3 className="text-[32px] font-bold leading-none text-gray-900 dark:text-white group-hover:text-accent transition-all duration-500">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-white/60">{service.description}</p>
                  <div className="border-b border-gray-300 dark:border-white/20 w-full"></div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Services;
