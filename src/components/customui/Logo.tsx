import Image from 'next/image';
import React from 'react';
import { Pacifico } from 'next/font/google';

const playfair = Pacifico({ subsets: ['latin'], weight: ['400' ] });

function Logo() {
  return (
    <div className="flex items-center gap-3  p-2 max-h-12">
      <Image
        src="/logo.svg"
        alt="CampusPro Logo"
        width={50}
        height={50}
        className=" w-8 h-8 sm:w-12 sm:h-12 "
      />
      <span className={` text-lg sm:text-2xl font-extrabold ${playfair.className} text-sky-700`}>
        Learnify
      </span>
    </div>
  );
}

export default Logo;
