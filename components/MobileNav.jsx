"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CiMenuFries } from "react-icons/ci";
import { useEffect, useState } from "react";

const links = [
  { name: "home", path: "home" },
  { name: "about", path: "about" },
  { name: "services", path: "services" },
  { name: "project", path: "project" },
  { name: "achievement", path: "achievement" },
  // { name: "contact", path: "contact" },
];

const MobileNav = () => {
  const [activeSection, setActiveSection] = useState("");

  // Menggunakan IntersectionObserver untuk mendeteksi elemen yang terlihat
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Memastikan elemen terlihat setidaknya 50%
    );

    // Memilih semua elemen dengan ID yang sesuai
    links.forEach((link) => {
      const element = document.getElementById(link.path);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleScroll = (id) => {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      // Perhitungan posisi dengan offset
      const yOffset = -70; // Sesuaikan dengan tinggi header
      const yPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
  
      window.scrollTo({
        top: yPosition,
        behavior: "smooth",
      });
  
      // Update status aktif langsung
      setActiveSection(id);
    }
  };
  
  

  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries className="text-[32px]" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <DialogTitle className="sr-only">Mobile Navigation</DialogTitle>

        <nav className="flex flex-col gap-4 mt-3">
          {links.map((link, index) => (
            <button
              key={index}
              onClick={() => handleScroll(link.path)}
              className={`capitalize text-xl font-medium hover:text-accent transition-all text-left inline-block ${
                activeSection === link.path
                  ? "text-accent border-b-2 border-accent w-fit"
                  : "w-fit"
              }`}
            >
              {link.name}
            </button>
          ))}
        </nav>

      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
