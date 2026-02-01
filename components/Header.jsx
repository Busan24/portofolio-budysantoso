import Link from "next/link";
import { Button } from "./ui/button";
import Nav from "./Nav";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="py-8 xl:py-6 text-gray-900 dark:text-white bg-white/95 dark:bg-primary backdrop-blur-md fixed top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center">
            {/* {logo} */}
            <Link href="/">
            <h2 className="text-2xl font-semibold">
                Budy Santoso
            </h2>
            </Link>

             {/* {nav} */}
            <div className="hidden xl:flex items-center gap-8">
            <Nav />
            <ThemeToggle />
            {/* <Link href="/contact">
                <Button>Hire Me</Button>
            </Link> */}
            </div>

            {/* {mobile nav} */}
            <div className="xl:hidden flex items-center gap-4">
                <ThemeToggle />
                <MobileNav />
            </div>
        </div>
    </header>
  )
}

export default Header
