"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { FiExternalLink, FiFolder, FiTag, FiCheck, FiX } from "react-icons/fi";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedProject]);

  // Filter projects by category
  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(project => project.category === activeCategory);

  // Get unique categories and sort them by specific order
  const categories = ["All", ...[...new Set(projects.map(p => p.category))].sort((a, b) => {
    const order = ["Website", "Mobile App", "UI/UX Design"];
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);
    // Assign high index to items not in the list to put them at the end
    const valA = indexA === -1 ? 999 : indexA;
    const valB = indexB === -1 ? 999 : indexB;
    return valA - valB;
  })];

  const closePopup = () => setSelectedProject(null);

  return (
    <section id="project" className="container mx-auto pt-16 pb-8">
      <h2 className="text-3xl font-bold text-left mb-4">Projects Portfolio</h2>
      <p className="text-left text-white/80 mb-8">
        Explore my portfolio showcasing innovative projects in Website, Mobile App and
        UI/UX Design. Each project reflects my dedication to blending creativity
        and functionality.
      </p>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 mt-4">Loading projects...</p>
        </div>
      ) : (
        <>
          {/* Categories */}
          <div className="flex gap-6 mb-12 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative text-lg font-semibold px-4 py-2 whitespace-nowrap ${
                  activeCategory === category
                    ? "text-white border-b-2 border-accent"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60">No projects found in this category.</p>
            </div>
          ) : (
            <>
              {/* Projects Grid - Modern Card Design */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-[#27272c] rounded-2xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-500 cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* Category Badge - Only show when "All" is selected */}
                    {activeCategory === "All" && (
                      <div className="absolute top-4 left-4 z-30">
                        <span className="px-3 py-1 bg-accent backdrop-blur-md text-primary text-xs font-bold rounded-full border border-accent shadow-lg">
                          {project.category}
                        </span>
                      </div>
                    )}

                    {/* Image Container with Gradient Overlay */}
                    <div className="relative h-56 overflow-hidden bg-[#1c1c21]">
                      <Image
                        src={project.imagePublicId ? getOptimizedImageUrl(project.imagePublicId, 500, 300) : "/assets/placeholder.png"}
                        alt={project.title}
                        width={500}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = '/assets/placeholder.png';
                        }}
                        loading="lazy"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#27272c] via-[#27272c]/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      
                      {/* Hover Overlay with Glassmorphism */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-center space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center justify-center">
                          <Button className="bg-accent hover:bg-accent/90 text-primary font-semibold px-6 py-2 rounded-lg flex items-center gap-2">
                            <FiExternalLink size={18} />
                            View Project
                          </Button>
                          
                          {/* Tech Stack Icons on Hover */}
                          {project.tools && project.tools.length > 0 && (
                            <div className="flex gap-2 justify-center flex-wrap px-4 max-w-[320px]">
                              {project.tools.slice(0, 6).map((tool, idx) => {
                                const toolLogo = typeof tool === 'string' ? null : tool.logo;
                                const toolName = typeof tool === 'string' ? tool : tool.name;
                                
                                return (
                                  <div 
                                    key={idx} 
                                    className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20 hover:border-accent/50 hover:bg-white/20 transition-all duration-200"
                                    title={toolName}
                                  >
                                    {toolLogo ? (
                                      <img
                                        src={toolLogo}
                                        alt={toolName || 'Tech'}
                                        className="w-6 h-6 object-contain"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                    ) : (
                                      <span className="text-white text-xs font-bold">
                                        {toolName?.substring(0, 2).toUpperCase() || "?"}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                      
                      {/* Footer with Icon */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-xs text-white/40 flex items-center gap-2">
                          <FiFolder size={14} />
                          Project Details
                        </span>
                        <FiExternalLink size={16} className="text-white/40 group-hover:text-accent transition-colors duration-300" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </>
      )}

      {/* Enhanced Dialog Modal - Responsive & Scrollable */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
            onClick={closePopup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1a1a1f] rounded-2xl relative w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              {/* Close Button - Fixed Position */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/80 hover:bg-black/90 rounded-full transition-colors border border-white/20 hover:border-accent/50 backdrop-blur-md shadow-lg"
                aria-label="Close"
              >
                <FiX size={20} className="text-white" />
              </button>

              {/* Image Container - Full View without Crop */}
              <div className="relative w-full bg-gradient-to-b from-[#1c1c21] to-[#1a1a1f] p-6 sm:p-8 lg:p-10">
                <div className="relative w-full max-w-4xl mx-auto bg-[#0d0d0f] rounded-xl overflow-hidden shadow-2xl border border-white/5">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <Image
                      src={selectedProject.imagePublicId ? getOptimizedImageUrl(selectedProject.imagePublicId, 1600, 900) : "/assets/placeholder.png"}
                      alt={selectedProject.title}
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      onError={(e) => {
                        e.target.src = '/assets/placeholder.png';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Content Section - Clean Layout */}
              <div className="px-6 sm:px-8 lg:px-10 pb-8 space-y-6">
                {/* Title and Description */}
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    {selectedProject.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Features Section */}
                {selectedProject.features && selectedProject.features.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-accent/20">
                      <FiCheck className="text-accent" size={20} />
                      <h4 className="text-lg sm:text-xl font-semibold text-white">Key Features</h4>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProject.features.map((feature, index) => (
                        <li 
                          key={index} 
                          className="flex items-start gap-3 text-white/70 bg-white/5 p-3 rounded-lg border border-white/5 hover:border-accent/20 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies Section */}
                {selectedProject.tools && selectedProject.tools.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-accent/20">
                      <FiFolder className="text-accent" size={20} />
                      <h4 className="text-lg sm:text-xl font-semibold text-white">Technologies Used</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.tools.map((tool, index) => {
                        const toolLogo = typeof tool === 'string' ? null : tool.logo;
                        const toolName = typeof tool === 'string' ? tool : tool.name;
                        
                        return (
                          <div 
                            key={index} 
                            className="group/tool relative px-4 py-2.5 bg-[#27272c] hover:bg-[#2d2d32] rounded-xl border border-white/5 hover:border-accent/30 transition-all duration-300 flex items-center gap-3"
                          >
                            {toolLogo && (
                              <img
                                src={toolLogo}
                                alt={toolName || 'Tech'}
                                className="w-5 h-5 object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            <span className="text-sm font-medium text-white/90 group-hover/tool:text-white">
                              {toolName || tool}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
