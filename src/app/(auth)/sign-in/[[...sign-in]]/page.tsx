import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <main className='h-screen '>
      <section className="relative h-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
       
       <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-sky-400 to-emerald-500 opacity-90"></div>
       
       {/* Wave separator */}
       <div className="absolute bottom-0 left-0 w-full">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
           <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,176C672,192,768,192,864,181.3C960,171,1056,149,1152,149.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
         </svg>
       </div>
       
       <div className="relative z-10 max-w-4xl mx-auto">

       <SignIn />
       </div>
     </section>
        
    </main>

  
  )
}