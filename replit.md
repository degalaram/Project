# JobPortal - Student & Fresher Job Portal Application

## Overview

A comprehensive job portal application specifically designed for students and fresh graduates. The platform connects job seekers with opportunities tailored to their experience level, provides learning resources through courses, and offers project-based skill development. Enhanced with dark/light theme support, visual course thumbnails, and professional company branding.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**August 29, 2025:**
- Added dark/light theme functionality with ThemeProvider and theme toggle component
- Integrated course images with AI-generated thumbnails for all course categories (HTML/CSS, Python, JavaScript, React, Angular, Node.js, Java, Django, Selenium, Docker)
- Added company logo support with professional company branding images
- Enhanced UI with proper theme-aware styling using CSS custom properties
- Updated Vite configuration for Replit environment compatibility
- Improved user experience with visual enhancements across all pages

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds
- **Theme System**: Custom ThemeProvider with dark/light/system theme support using CSS custom properties
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query for server state management, React hooks for local component state
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Local storage-based session management with login/signup flows

### Backend Architecture
- **Framework**: Express.js server with TypeScript
- **API Design**: RESTful API endpoints for jobs, courses, applications, and contact management
- **Request Processing**: Express middleware for JSON parsing, URL encoding, and request logging
- **Authentication**: Bcrypt password hashing with email-based user identification
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

### Database Schema Design
- **Users Table**: Email-based authentication with full name, phone, and timestamps
- **Companies Table**: Company profiles with name, description, website, LinkedIn URLs, and logos
- **Jobs Table**: Comprehensive job listings with experience levels, requirements, skills, and closing dates
- **Courses Table**: Educational content with instructors, duration, categories, and pricing
- **Applications Table**: User job applications with status tracking
- **Contacts Table**: Contact form submissions for user inquiries

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema**: Type-safe database schema with proper relationships and constraints
- **Development Storage**: In-memory storage implementation with sample data for development/testing
- **Sample Data**: Pre-populated jobs from major companies (Accenture, TCS, Infosys) and courses
- **Asset Management**: Local image storage for course thumbnails and company logos
- **Connection**: Neon Database serverless PostgreSQL for production

### Authentication and Authorization
- **Password Security**: Bcrypt hashing for secure password storage
- **User Sessions**: Local storage-based session management
- **Email Validation**: Unique email constraints with proper validation
- **Route Protection**: Client-side route guards for authenticated pages

### Core Features
- **Theme System**: Dark/light theme toggle with system preference detection
- **Job Management**: Categorized listings with search, filters, and detailed job descriptions
- **Company Integration**: Company profiles with LinkedIn links, logos, and comprehensive information
- **Course System**: Educational content with visual thumbnails, progress tracking and enrollment management
- **Project Showcase**: Curated projects for skill development with difficulty levels
- **Application Tracking**: User application history and status management
- **Contact System**: Contact form with FAQ section and support information

### User Experience
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- **Visual Enhancement**: Course thumbnails and company logos for better user engagement
- **Search & Filters**: Advanced search functionality for jobs and courses
- **Category Navigation**: Tabbed interface for different job types and course categories
- **Progress Tracking**: Course completion tracking and skill development metrics
- **Accessibility**: Theme-aware color schemes and accessible component design

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database for production data storage
- **Drizzle ORM**: Type-safe database toolkit with migrations and query builder

### UI and Styling
- **Radix UI**: Headless UI component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide Icons**: Icon library for consistent iconography
- **Google Fonts**: Web fonts (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter)

### Theme Management
- **Next Themes**: Theme management system for React applications
- **CSS Custom Properties**: Dynamic theme switching with CSS variables

### Data Visualization
- **Recharts**: React charting library built on D3.js
- **Date-fns**: Date manipulation library for time-based data

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and enhanced development experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for server development

### Utility Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Hookform Resolvers**: Validation resolver for Zod schemas
- **Class Variance Authority**: Type-safe CSS class composition
- **CLSX**: Conditional CSS class utility