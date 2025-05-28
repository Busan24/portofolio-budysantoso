import Link from "next/link";
import { Button } from "./ui/button";
import Nav from "./Nav";
import MobileNav from "./MobileNav";
const Header = () => {
  return (
    <header className="py-8 xl:py-6 text-white bg-primary fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
            {/* {logo} */}
            <Link href="/">
            <h1 className="text-2xl font-semibold">
                Budy<span className="text-accent">.</span>
            </h1>
            </Link>

             {/* {nav} */}
            <div className="hidden xl:flex items-center gap-8">
            <Nav />
            {/* <Link href="/contact">
                <Button>Hire Me</Button>
            </Link> */}
            </div>

            {/* {mobile nav} */}
            <div className="xl:hidden">
                <MobileNav />
            </div>
        </div>
    </header>
  )
}

export default Header
