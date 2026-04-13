import Link from "next/link"; 
import Image from 'next/image';

const NavItems = () => {
    return (
        <div className="flex items-center gap-8">
            <p className="cursor-pointer hover:text-blue-500">Home</p>
            <p className="cursor-pointer hover:text-blue-500">Companions</p>
            <p className="cursor-pointer hover:text-blue-500">Problems</p>
        </div>
    );
};

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center p-4">
            <Link href="/">
                <div className="flex items-center gap-2.5 cursor-pointer">
                    <Image
                        src="/images/logo.svg"
                        alt="logo" 
                        width={46} 
                        height={44}
                    />
                </div>
            </Link>
            <div className="flex items-center gap-8">
                <NavItems />
                <p className="cursor-pointer">Sign In</p>  
            </div>
        </nav>
    );
};

export default Navbar;