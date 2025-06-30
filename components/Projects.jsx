"use client";
import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const projects = [
   {
    id: 1,
    category: "Mobile App",
    title: "Seraya",
    description:
        "Seraya is an Android app designed to help adolescents and young adults manage their mental health independently. It features AI-based mood tracking, personalized activity suggestions, and an anonymous community space for emotional expression. Developed using Java and Firebase, Seraya offers a supportive, user-centered experience that promotes emotional well-being and reduces stigma through accessible digital tools.",
    image: "/assets/Seraya.png",
    tools: [
        { name: "Android", logo: "/assets/logo/android-logo.png" },
        { name: "Java", logo: "/assets/logo/java-logo.png" },
        { name: "Firebase", logo: "/assets/logo/firebase-logo.png" },
    ],
    features: [
        "Mood tracking with AI-powered insights",
        "CBT-based self-reflection",
        "Private emotional journaling",
        "Anonymous community support",
    ],
  },
  {
    id: 2,
    category: "Mobile App",
    title: "Foody",
    description:
        "Foody is a smart mobile application powered by AI that helps users monitor their daily nutrition and maintain healthy eating habits. Designed especially for teenagers and health-conscious individuals, Foody offers personalized meal recommendations, nutrition tracking, and practical tools to support a healthier lifestyle. With a user-friendly interface and intelligent features, Foody makes it easy to stay on top of your health goals every day.",
    image: "/assets/foody_app.png",
    tools: [
        { name: "Android", logo: "/assets/logo/android-logo.png" },
        { name: "Java", logo: "/assets/logo/java-logo.png" },
    ],
    features: [
        "AI-based personal meal recommendations",
        "Daily food intake and nutrition tracking",
        "BMI calculator and health summaries",
    ],
  },
  {
    id: 3,
    category: "UI/UX Design",
    title: "MaxinClouth",
    description: "MaxinClouth is a mobile e-commerce application design that offers a wide variety of clothing options. The app includes categories such as T-shirts, hoodies, and shirts, providing a seamless and user-friendly shopping experience.",
    image: "/assets/maxinclouth-banner.png",
    tools: [
      { name: "Figma", logo: "/assets/logo/figma-logo.png" },
    ],
    features: ["E-Commerce"],
  },
  {
    id: 4,
    category: "Mobile App",
    title: "PETIKU",
    description: "Petiku is an innovative and engaging solution designed to revolutionize learning. The application offers an interactive learning platform equipped with features like augmented reality (AR) and quizzes to enhance user engagement. Leveraging advanced tools such as Unity, Vuforia, and Blender, Petiku delivers immersive 3D AR experiences that make learning both fun and effective.",
    image: "/assets/petiku-banner.png",
    tools: [
      { name: "Unity", logo: "/assets/logo/unity-logo.png" },
      { name: "Fuvoria", logo: "/assets/logo/fuvoria-logo.png" },
      { name: "Blender", logo: "/assets/logo/blender-logo.png" },
    ],
    features: ["Augmented Reality (AR)", "Quiz Game"],
  },
  {
    id: 5,
    category: "UI/UX Design",
    title: "WatchGang",
    description: "WatchGang is a modern Video on Demand (VOD) platform offering an engaging and seamless user experience. Designed with user-centric principles, the application features an intuitive interface that simplifies content discovery, interactive viewing, and personalized entertainment. This design combines simplicity, personalization, and connection to deliver a truly immersive experience.",
    image: "/assets/wg-banner.png",
    tools: [
      { name: "Figma", logo: "/assets/logo/figma-logo.png" },
    ],
    features: ["Streaming", "People Nearby", "Playlist", "Profile"],
  },
  {
    id: 6,
    category: "UI/UX Design",
    title: "Traspoter",
    description: "Transporter is a web-based platform with a mobile interface designed to simplify waste classification through automation and advanced technology. By utilizing Convolutional Neural Networks (CNN), the application ensures high accuracy in identifying and categorizing waste types. The user-friendly web interface enhances accessibility, enabling efficient and effective waste management for users.",
    image: "/assets/traspoter-banner.png",
    tools: [
      { name: "Figma", logo: "/assets/logo/figma-logo.png" },
    ],
    features: ["Scan Waste Classification", "Garbage Bank", "Trash Category"],
  },
  {
    id: 10,
    category: "Website",
    title: "Bakkar Fried Chicken",
    description: "This project involved revamping the website of Bakkar Fried Chicken, a culinary brand specializing in grilled and smokey chicken, by implementing a modern, responsive design using Laravel, Tailwind CSS, and MySQL. Key features include a user-friendly interface, admin content management with CRUD operations, and integration with delivery services like WhatsApp, GoFood, and ShopeeFood. The development focused on enhancing digital presence and customer experience through seamless navigation, real-time updates, and secure data handling.",
    image: "/assets/bakkar-banner.png",
    tools: [
      { name: "Laravel", logo: "/assets/logo/laravel-logo.png" },
      { name: "PHP", logo: "/assets/logo/php-logo.png" },
      { name: "TailwindCSS", logo: "/assets/logo/tailwind-logo.png" },
      { name: "JavaScript", logo: "/assets/logo/javascript-logo.png" },
      { name: "MySql", logo: "/assets/logo/mysql-logo.png" },
    ],
    features: ["Company Profile and Product Highlights", "Admin Dashboard with CRUD for Menu and Content Management", "Integration with Delivery Services (WhatsApp, GoFood, ShopeeFood)"],
  },
    {
    id: 8,
    category: "Website",
    title: "GorTour",
    description: "GorTour is a dynamic tourism and culinary website for Bogor, developed using the Laravel framework on a Ubuntu Server with Apache Web Server. The project adopts an MVC architecture and utilizes Blade templating for efficient front-end rendering. It integrates MongoDB Atlas (NoSQL) for scalable cloud-based database management via custom REST API endpoints built without third-party packages, ensuring full control over data flow and system behavior. Apache is configured for secure and optimized performance using SSL/TLS encryption, multi-processing modules, and content delivery tuning. The site was developed and deployed on DOM Cloud VPS hosting, with SSH access for secure deployment workflows. Development followed structured UML modeling, including ERD and Use Case diagrams, and the system was tested on a VirtualBox-based Ubuntu environment. This architecture allows for future scalability, responsive user experiences, and robust admin content management for tourism information, galleries, and culinary recommendations.",
    image: "/assets/gotour-banner.png",
    tools: [
      { name: "Laravel", logo: "/assets/logo/laravel-logo.png" },
      { name: "PHP", logo: "/assets/logo/php-logo.png" },
      { name: "BootStrap", logo: "/assets/logo/bootstrap-logo.png" },
      { name: "JavaScript", logo: "/assets/logo/javascript-logo.png" },
      { name: "MongoDB", logo: "/assets/logo/mongo-logo.png" },
    ],
    features: ["List of Tourist Destinations in Bogor", "Bogor Culinary List", "Gallery", "Popular Tourism and Culinary Recommendations"],
  },
   {
    id: 9,
    category: "Website",
    title: "Tukuniku",
    description: "Tukuniku is a web-based application developed to support a local grilled meat SME in Bogor by improving visibility and operational efficiency through geolocation technology. Built using modern web technologies and the Leaflet Routing Machine library, the platform integrates Geographic Information Systems (GIS) to help users find the shortest route from their current location to the Tukuniku store. It also provides valuable customer location data to support marketing and business expansion strategies. The system combines interactive map-based search with e-commerce capabilities and adopts Agile development methodology to ensure continuous improvement and adaptability based on user feedback.",
    image: "/assets/tukuniku-banner.png",
    tools: [
      { name: "Laravel", logo: "/assets/logo/laravel-logo.png" },
      { name: "PHP", logo: "/assets/logo/php-logo.png" },
      { name: "BootStrap", logo: "/assets/logo/bootstrap-logo.png" },
      { name: "JavaScript", logo: "/assets/logo/javascript-logo.png" },
      { name: "MySql", logo: "/assets/logo/mysql-logo.png" },
    ],
    features: ["Company Profile and Product Highlights", "Interactive Route Finder with Geolocation (GIS Integration)", "Online Ordering and Transaction System", "Secure Payment Gateway Integration"],
  },
  {
    id: 7,
    category: "Website",
    title: "Babeh Burger (Bager)",
    description: "Babeh Burger (Bager) is a web application built using Java Spring Boot, designed to help new students at the vocational campus of IPB University easily find nearby food spots with accurate information. The project applies core Object-Oriented Programming (OOP) principles such as classes, objects, encapsulation, and access modifiers. The backend is developed with Java Spring Boot and implements full CRUD functionality, while data is managed using a PostgreSQL database. The user interface is created using HTML, CSS, and JavaScript, and development was carried out in the JetBrains IntelliJ IDEA environment.",
    image: "/assets/bager.png",
    tools: [
      { name: "SpringBoot", logo: "/assets/logo/spring-boot-logo.png" },
      { name: "HTML", logo: "/assets/logo/html-logo.png" },
      { name: "CSS", logo: "/assets/logo/css-logo.png" },
      { name: "JavaScript", logo: "/assets/logo/javascript-logo.png" },
      { name: "PostgreSql", logo: "/assets/logo/postgresql-logo.png" },
    ],
    features: ["Location and Navigation Integration", "Menu Details and Prices", "Automated Order Processing via WhatsApp Integration"],
  },
  {
    id: 11,
    category: "Website",
    title: "Style Logram",
    description: "Style Logram is a fashion image classification web application that utilizes Convolutional Neural Networks (CNN) trained on DeepFashion and Fashion Product Images datasets. Built using Python (Flask), TensorFlow, and OpenCV for image processing and model inference, the system classifies clothing items into multiple categories. The frontend is developed with Next.js and styled using Tailwind CSS, ensuring responsive UI/UX. This project integrates AI accuracy with seamless web deployment for fashion-related applications.",
    image: "/assets/stylogram.png",
    tools: [
      { name: "NextJs", logo: "/assets/logo/nextjs-logo.png" },
      { name: "Python", logo: "/assets/logo/python-logo.png" },
      { name: "TailwindCSS", logo: "/assets/logo/tailwind-logo.png" },
      { name: "TensorFlow", logo: "/assets/logo/tensorflow-logo.png" },
    ],
    features: ["Real-Time Fashion Image Classification using CNN"],
  },
  
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("Website");
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = projects.filter(
    (project) => project.category === activeCategory
  );

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedProject]);

  const closePopup = () => setSelectedProject(null);

  return (
    <section id="project" className="container mx-auto pt-16 pb-8">
      <h2 className="text-3xl font-bold text-left mb-4">Projects Portfolio</h2>
      <p className="text-left text-white/80 mb-8">
        Explore my portfolio showcasing innovative projects in Website, Mobile App and
        UI/UX Design. Each project reflects my dedication to blending creativity
        and functionality.
      </p>

      {/* Categories */}
      <div className="flex gap-6 mb-12">
        {["Website","Mobile App", "UI/UX Design"].map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`relative text-lg font-semibold px-4 py-2 ${
              activeCategory === category
                ? "text-white border-b-2 border-accent w-fit"
                : "text-white/80 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group relative bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-transform duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

            <Image
              src={project.image}
              alt={project.title}
              width={500}
              height={300}
              className="w-full max-h-64 object-contain transition-transform duration-300"
              />


            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <Button
                onClick={() => setSelectedProject(project)}
                className="mb-4 text-white bg-accent px-4 py-2 rounded-md hover:bg-accent-dark"
              >
                View Details
              </Button>
              <div className="flex gap-2">
                {project.tools.map((tool, index) => (
                  <Image
                    key={index}
                    src={tool.logo}
                    alt={tool.name}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                ))}
              </div>
            </div>

            <div className="p-4 z-30 relative">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-sm text-white/80 description-project">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog Pop-Up with Animation */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
            onClick={closePopup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 p-4 sm:p-6 rounded-lg relative max-w-lg w-[95%] max-h-[80vh] overflow-y-auto md:w-3/4"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Tombol Close */}
              <button
                    onClick={closePopup}
                    className="absolute top-4 right-5 text-white text-2xl p-2 bg-transparent"
                    aria-label="Close"
                    style={{
                        textShadow: "0 0 1px black, 0 0 2px black, 0 0 3px black",
                    }}
                    >
                    &times;
                </button>

              {/* Gambar Zoom */}
              <div className="overflow-hidden mb-4">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  width={500}
                  height={300}
                  className="w-full max-h-64 object-contain transition-transform duration-300"
                />
              </div>

              {/* Detail */}
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedProject.title}
              </h3>
              <p className="text-white/80 mb-4">{selectedProject.description}</p>

              {/* Fitur */}
              <h4 className="text-xl font-semibold text-white mb-2">Features:</h4>
              <ul className="list-disc list-inside text-white/80 mb-4">
                {selectedProject.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              {/* Tools */}
              <div className="flex gap-4">
                {selectedProject.tools.map((tool, index) => (
                  <Image
                    key={index}
                    src={tool.logo}
                    alt={tool.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;