# Learnify - Learning Management System

![Learnify Dashboard](https://api.placeholder.com/800/400)

## Overview

Learnify is a comprehensive Learning Management System (LMS) designed for educators and content creators to publish, manage, and monetize their courses. The platform offers robust analytics, student management, and course creation tools in a modern, user-friendly interface. Learnify also incorporates AI-powered features to enhance the learning experience for students.

## Features

### For Educators

- **Course Creation**: Easily create and organize courses with chapters, lessons, and multimedia content
- **Content Management**: Upload videos, documents, and assignments
- **Student Management**: Track student progress and engagement
- **Analytics Dashboard**: Comprehensive insights into course performance, revenue, and student completion rates
- **Payment Processing**: Secure payment integration for course purchases

### For Students

- **Course Discovery**: Browse and search available courses
- **Learning Dashboard**: Track progress across enrolled courses
- **Interactive Learning**: Engage with course content, complete assignments
- **Progress Tracking**: View completion status and achievements

### AI-Powered Learning Tools

- **AI-Generated Course Notes**: Automatically generate comprehensive notes from course content
- **Smart Flashcards**: Create AI-powered flashcards to reinforce key concepts
- **Quiz Generation**: Generate quizzes based on course material to test understanding
- **Q&A Collections**: AI-curated question and answer sets for improved comprehension
- **Personalized Learning Paths**: Adaptive learning recommendations based on progress and performance

## Technology Stack

- **Frontend**: React.js, Next.js 14, Tailwind CSS
- **Backend**:  Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: Clerk Authentication
- **UI Components**: shadcn/ui component library
- **Data Visualization**: Recharts
- **File Storage**: Cloudinary,MUX,EDGE_STORE integration for course content
- **AI Integration**: OpenAI API for content generation and learning tools

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL database
- OpenAI API key (for AI features)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/learnify.git
   cd learnify
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Then fill in the required environment variables in `.env.local`, including your OpenAI API key

4. Set up the database
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:3000`


```

## Analytics Features

The analytics dashboard provides instructors with valuable insights:

- **Revenue Tracking**: Monitor total and per-course revenue
- **Sales Analysis**: Track purchases over time
- **Category Performance**: Compare revenue across different course categories
- **Course Completion**: Monitor student progress and completion rates
- **Top Performing Courses**: Identify your most successful content

## AI Learning Tools

Learnify leverages artificial intelligence to enhance the learning experience:

- **Smart Notes**: AI analyzes course content to generate concise, well-structured notes highlighting key concepts
- **Adaptive Flashcards**: Intelligently created flashcards that focus on important terminology and concepts
- **Custom Quizzes**: AI-generated quizzes with varying difficulty levels to test comprehension
- **Learning Assistant**: AI-powered assistant that can answer questions about course material
- **Study Recommendations**: Personalized study suggestions based on performance and learning patterns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework used
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Prisma](https://www.prisma.io/) - ORM for database access
- [Clerk](https://clerk.dev/) - Authentication provider
- [Recharts](https://recharts.org/) - Charting library
- [OpenAI](https://openai.com/) - AI capabilities provider