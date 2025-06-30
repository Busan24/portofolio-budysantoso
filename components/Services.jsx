"use client";
import { BsArrowUpRight } from "react-icons/bs"
import Link from "next/link";
import { Description } from "@radix-ui/react-dialog";

import { motion } from "framer-motion"

const services = [
  {
    num: "01",
    title: "Webs Developer",
    description: "Designing and developing dynamic, user-friendly web applications using modern frameworks like Laravel. Experienced in building responsive interfaces, and integrating APIs",
    href: "", 
  },
    {
      num: "02",
      title: "Frontend Mobile Developer",
      description: "Creating responsive, high-performance mobile applications using modern frameworks. Skilled in building seamless user interfaces and ensuring cross-platform compatibility.",
      href: "", 
    },
  ];
  

const Services = () => {
  return (
    <section id="services" className="flex flex-col justify-center pt-16 pb-8">
         <div className="container mx-auto">
         <h2 className="text-3xl font-bold mb-6">Services</h2>
        <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 2.4, duration: 0.4, ease: "easeIn" } }}
        className= "grid grid-cols-1 md:grid-cols-2 gap-[60px]"
        > 
        { services.map((service, index) => {
            return (
                <div key={index} className="flex-1 flex flex-col justify-center gap-6 group">
                    {/* {top} */}
                    <div className="w-full flex justify-between items-center">
                        <div className="text-5xl font-extrabold text-outline text-transparent group-hover:text-outline-hover transition-all duration-500">{service.num}</div>
                        <Link href={service.href} className="w-[70px] h-[70px] rounded-full bg-white group-hover:bg-accent transition-all duration-500 flex justify-center items-center hover:-rotate-45">
                        <BsArrowUpRight className="text-primary text-3xl"/>
                        </Link>
                    </div>
                    <h3 className="text-[32px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500">{ service.title }</h3>
                    <p className="text-white/60">{ service.description }</p>
                    <div className="border-b border-white/20 w-full"></div>
                </div>
            );
        })}
        </motion.div>
        </div>
    </section>
  )
}

export default Services
