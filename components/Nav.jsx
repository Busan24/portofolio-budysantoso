"use client";

import { useState, useEffect } from "react";

const links = [
  { name: "home", path: "home" },
  { name: "about", path: "about" },
  { name: "services", path: "services" },
  { name: "project", path: "project" },
  { name: "achievement", path: "achievement" },
  // { name: "contact", path: "contact" },
];

const Nav = () => {
  const [activeSection, setActiveSection] = useState("");

  // Menggunakan IntersectionObserver untuk melacak bagian aktif
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Bagian terlihat setidaknya 50%
    );

    links.forEach((link) => {
      const element = document.getElementById(link.path);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleScroll = (id) => {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      const yOffset = -70; // Offset untuk header
      const yPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
  
      window.scrollTo({
        top: yPosition,
        behavior: "smooth",
      });
  
      // Perbarui bagian aktif
      setActiveSection(id);
    }
  };
  

  return (
    <nav className="flex gap-8">
      {links.map((link, index) => (
      <a
        key={index}
        onClick={() => handleScroll(link.path)}
        className={`capitalize font-medium hover:text-accent transition-all cursor-pointer ${
          activeSection === link.path
            ? "text-accent border-b-2 border-accent"
            : "border-b-2 border-transparent"
        }`}
        style={{ transition: "border-color 0.3s ease, color 0.3s ease" }}
      >
        {link.name}
      </a>
    ))}
    </nav>
  );
};

export default Nav;
