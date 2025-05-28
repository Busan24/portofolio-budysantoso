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

const Home = () => {
  return (
    <section className="h-full">
      <div id="home" className="container mx-auto h-full pt-32">
        <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8">
          <div className="text-center xl:text-left order-2 xl:order-none">
            <span className="text-xl text-accent">Hello, I'm Budy Santoso</span>
            <h1 className="h3 mt-2">
              Frontend Mobile Developer
              <br /> and UI/UX Design
            </h1>
            <p className="max-w-[600px] mb-4 mt-4 text-white/80 leading-normal">
              As a Frontend Mobile Developer and UI/UX Designer, I strive to
              blend creativity with technical expertise to build seamless and
              engaging user experiences. Let's bring ideas to life <br />
              with intuitive interfaces and innovative code.
            </p>
            <div className="flex flex-col xl:flex-row items-center gap-8 mt-6">
              <a
                  href="/assets/CV_BudySantoso.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="uppercase flex items-center gap-2 hover:text-primary"
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
