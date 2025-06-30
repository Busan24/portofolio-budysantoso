"use client";

const Footer = () => {
    return (
      <footer className="bg-primary text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Budy Santoso. All rights reserved.
          </p>
          <p className="text-sm mt-1">
            Built with me Budy Santoso | Software Engineering
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  