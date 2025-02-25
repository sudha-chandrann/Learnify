import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpenCheck,
  ChartBarIncreasing,
  LayoutDashboard,
  UserRoundCheck,
  ShoppingCart,
  BookPlus,
  ArrowRight,
  Star,
  Users,
  BookOpen,
  Sparkles,
  FileText,
  BookMarked,
  BrainCircuit,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import Logo from "@/components/customui/Logo";

const features = [
  {
    icon: ShoppingCart,
    title: "Buy Courses",
    desc: "Explore a wide variety of expert-led courses.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: BookOpenCheck,
    title: "Sell Courses",
    desc: "Share your expertise and earn while teaching.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    icon: LayoutDashboard,
    title: "Track Progress",
    desc: "Stay on top of your learning journey.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: ChartBarIncreasing,
    title: "Teacher Dashboard",
    desc: "Monitor revenue and student performance.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const aiFeatures = [
  {
    icon: BookMarked,
    title: "Study Notes",
    description: "Generate comprehensive study notes from any topic or textbook with a single click.",
  },
  {
    icon: FileText,
    title: "Practice Questions",
    description: "Create custom quizzes and practice tests tailored to your learning objectives.",
  },
  {
    icon: MessageSquare,
    title: "Interactive Explanations",
    description: "Get detailed explanations on complex topics with conversational AI assistance.",
  },
  {
    icon: Lightbulb,
    title: "Concept Summaries",
    description: "Simplify difficult concepts with AI-generated summaries and visual aids.",
  },
];

const timelineData = [
  {
    icon: UserRoundCheck,
    title: "Sign-up",
    description:
      "Create an account to get started on your journey. Enter your details and set up your profile.",
  },
  {
    icon: BookPlus,
    title: "Create Course & Add Chapters",
    description:
      "Design your course structure, add engaging chapters, and upload content seamlessly.",
  },
  {
    icon: BookOpenCheck,
    title: "Set Price & Publish",
    description:
      "Decide on the pricing for your course, review all details, and make it available to learners worldwide.",
  },
];

const stats = [
  { value: "500+", label: "Courses", icon: BookOpen },
  { value: "50k+", label: "Students", icon: Users },
  { value: "4.8", label: "Rating", icon: Star },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Navbar - with glass effect */}
      <nav className="flex items-center justify-between w-full h-20 fixed top-0 left-0 z-50 px-6 md:px-12 bg-white/90 backdrop-blur-md shadow-sm">
        <Logo/>
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-sky-600 text-sky-600 hover:bg-sky-50 hover:text-sky-700 transition-all"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section with wave background */}
      <main className="pt-20">
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
       
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-sky-400 to-emerald-500 opacity-90"></div>
          
          {/* Wave separator */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
              <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,176C672,192,768,192,864,181.3C960,171,1056,149,1152,149.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-fade-in leading-tight">
              Empower Your <span className="text-emerald-300">Learning</span> with Learnify
            </h1>
            <p className="text-lg md:text-xl text-white text-opacity-90 max-w-3xl mx-auto mb-10 animate-fade-in delay-100">
              Discover top-notch courses, track your progress, and generate AI-powered study materials—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
              <Link href="/sign-up">
                <Button className="bg-white text-sky-600 hover:bg-gray-100 shadow-lg px-8 py-6 text-lg font-semibold rounded-full group transition-all duration-300">
                  Get Started 
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm hover:shadow-md transition-all">
                  <stat.icon className="w-12 h-12 text-sky-600 mr-4" />
                  <div>
                    <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-emerald-500">Our Features</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Unlock the power of knowledge with our comprehensive features
                designed to enhance your learning experience.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center p-8 rounded-xl ${feature.bgColor} border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="p-4 rounded-full bg-white shadow-md mb-6">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* AI Study Material Section */}
        <section className="px-6 py-20 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="mb-6 inline-flex items-center px-4 py-2 rounded-full bg-purple-900/50 text-purple-300">
                  <Sparkles className="w-5 h-5 mr-2" />
                  <span className="font-medium">Powered by AI</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Generate Free Study Materials <span className="text-purple-400">With AI</span>
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Leverage cutting-edge artificial intelligence to create personalized study materials instantly. 
                  Save time and enhance your learning with AI-generated notes, practice questions, and more.
                </p>
                <Link href="/ai-study-tools">
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg px-6 py-3 rounded-lg group transition-all duration-300">
                    Try AI Study Tools
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiFeatures.map((feature, index) => (
                  <div key={index} className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all">
                    <feature.icon className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* AI Demo Section */}
        <section className="px-6 py-20 bg-gray-800 relative overflow-hidden">
          {/* Background abstract patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-purple-600 filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-indigo-600 filter blur-3xl"></div>
          </div>
          
          <div className="max-w-5xl mx-auto relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                See AI-Generated Study Materials in Action
              </h2>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700">
              <div className="flex items-center mb-6">
                <BrainCircuit className="w-10 h-10 text-purple-400 mr-4" />
                <div>
                  <h3 className="text-xl font-bold text-white">Study Material Generator</h3>
                  <p className="text-gray-400">Enter a topic to generate comprehensive study notes</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-300 font-medium mb-2">Example Topic:</p>
                  <p className="text-white">Photosynthesis process and its importance in biology</p>
                </div>
                <div className="md:w-48">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center cursor-pointer hover:from-purple-700 hover:to-indigo-700 transition-all">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <BookMarked className="w-5 h-5 text-purple-400 mr-2" />
                  <p className="text-white font-medium">Generated Study Notes</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">What is Photosynthesis?</h4>
                    <p className="text-gray-300">Photosynthesis is the process by which green plants, algae, and certain bacteria convert light energy into chemical energy...</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Key Components</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Chlorophyll: The green pigment that captures light energy</li>
                      <li>Carbon dioxide: Absorbed from the atmosphere</li>
                      <li>Water: Absorbed through the roots</li>
                      <li>Sunlight: Provides the energy for the reaction</li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 italic">... and much more comprehensive content generated instantly!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="px-6 py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-emerald-500">
                  How It Works
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Whether you&apos;re an educator looking to share knowledge or a
                student eager to learn, our platform makes it simple.
              </p>
            </div>
            <div className="relative max-w-4xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-sky-500 to-emerald-500 hidden md:block"></div>
              
              {timelineData.map((event, index) => (
                <div key={index} className="mb-16 md:mb-24 relative">
                  <div className={`md:absolute md:w-6 md:h-6 bg-white rounded-full border-4 border-sky-500 z-10 md:left-1/2 md:top-0 md:transform md:-translate-x-1/2 hidden md:block`}></div>
                  
                  <div className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2"></div>
                    <div className={`bg-white rounded-xl shadow-lg p-8 md:w-1/2 hover:shadow-xl transition-all duration-300 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                      <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 mb-4">
                        <event.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-sky-600 to-emerald-500 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning Journey?</h2>
            <p className="text-xl mb-10 text-white/90">
              Join thousands of students and teachers who have already experienced the power of CampusPro.
            </p>
            <Link href="/sign-up">
              <Button className="bg-white text-sky-600 hover:bg-gray-100 shadow-lg px-8 py-6 text-lg font-semibold rounded-full group transition-all duration-300">
                Get Started Today
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
             
              <Logo/>
              <p className="text-gray-400">Empowering educators and learners worldwide with cutting-edge learning management tools.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/guides" className="text-gray-400 hover:text-white transition-colors">Guides</Link></li>
                <li><Link href="/api" className="text-gray-400 hover:text-white transition-colors">API Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} CampusPro. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}