import React from 'react';
import Image from 'next/image';

function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 to-sky-800 text-white shadow-lg">
      <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-sky-300 opacity-30 blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-sky-900 opacity-20 blur-xl"></div>
      
      <div className="relative z-10 flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
        <div className="flex-1">
          <h2 className="mb-1 text-2xl font-bold md:text-3xl">Hello User</h2>
          <p className="text-lg text-blue-100">
            Welcome Back, it's time to get back and start learning new courses
          </p>
          <button className="mt-4 rounded-lg bg-white px-4 py-2 font-semibold text-sky-700 shadow transition-all hover:bg-blue-50">
            Explore Courses
          </button>
        </div>
        
        <div className="hidden md:block">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white/30 shadow-inner">
            <Image 
              src="/study.png" 
              alt="Student" 
              layout="fill"
              objectFit="cover"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;