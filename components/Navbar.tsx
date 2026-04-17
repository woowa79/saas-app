"use client";

import Link from "next/link"; 
import Image from 'next/image';
import { 
  SignInButton, 
  UserButton,
  useUser
} from "@clerk/nextjs"; 
import NavItems from "@/components/NavItems";

const Navbar = () => {
    const { user } = useUser();

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
                
                {/* 로그아웃 상태일 때: Sign In 버튼 표시 */}
                {!user && (
                    <SignInButton mode="modal">
                        <button className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
                            Sign In
                        </button>
                    </SignInButton>
                )}

                {/* 로그인 상태일 때: 사용자 프로필 버튼 표시 */}
                {user && (
                    <UserButton />
                )}
            </div>
        </nav>
    );
};

export default Navbar;