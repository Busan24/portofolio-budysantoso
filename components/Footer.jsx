"use client";

const Footer = () => {
    return (
      <footer className="bg-white dark:bg-primary text-gray-900 dark:text-white py-6 border-t border-gray-200 dark:border-transparent">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-white">
            &copy; {new Date().getFullYear()} Budy Santoso. All rights reserved.
          </p>
          <p className="text-sm mt-1 text-gray-600 dark:text-white">
            Built with me Budy Santoso | Software Engineering
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  