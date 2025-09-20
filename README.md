# 💼 JobMate - AI-Powered Career Companion for Africa

[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://golang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Material Design](https://img.shields.io/badge/Material%20Design%203-757575?style=for-the-badge&logo=material-design&logoColor=white)](https://m3.material.io)

> **A comprehensive AI-powered career development platform specifically designed to address youth unemployment challenges in Africa. Built with cutting-edge AI technology and modern development practices.**

## 📋 **Project Overview**

JobMate is a comprehensive AI-powered career development platform designed to address youth unemployment challenges across Africa. By leveraging Google Gemini AI, the platform provides personalized career guidance, CV optimization, intelligent job matching, and interview preparation to help young Africans bridge skill gaps and connect with global opportunities.

**Key Benefits:**
- Tackles Africa's youth unemployment crisis with AI-powered solutions
- Provides personalized career guidance and skill development paths
- Offers multilingual support (English & Amharic) for accessibility
- Delivers seamless experience across web and mobile platforms

## 📱 Application Screenshots

### 🔐 Authentication Flow (Mobile App)

| Welcome Screen | Sign Up | Login | Dashboard |
| -------------- | -------------- | -------------- | --------- |
| ![Welcome](docs/screenshots/welcome-screen.png) | ![Sign Up](docs/screenshots/sign-up.png) | ![Login](docs/screenshots/login.png) | ![Dashboard](docs/screenshots/dashboard.png) |

### 📄 CV Management Features (Mobile App)

| CV Upload Interface | CV Analysis Results |
| ------------------- | ------------------- |
| ![CV Upload](docs/screenshots/cv-upload.png) | ![CV Analysis](docs/screenshots/cv-analysis.png) |

### 🎤 Interview Preparation Suite (Mobile App)

| Free-form Interview | Free-form Interview Chat | Structured Interview |
| ------------------- | -------------- | -------------------- | 
| ![Free-form Interview](docs/screenshots/freeform-interview.png) | ![Free-form Interview Chat](docs/screenshots/freeform-interview-chat.png) | ![Structured Interview](docs/screenshots/structured-interview.png) |

### 🔍 Job Search & AI Features (Mobile App)

| Job Search Interface |
| ------------ |
| ![Job Search](docs/screenshots/job-search.png) |

### 🌐 Web Application
**[🚀 Try Live Demo](https://jobmate.africa)** - Full-featured web interface with responsive design

*The web application includes all mobile features plus enhanced desktop experience with advanced analytics and reporting capabilities.*

## ✨ **Key Features**

### 🤖 **AI-Powered Career Intelligence**

- **Smart CV Analysis** - Advanced AI feedback on content, structure, and ATS optimization
- **Intelligent Job Matching** - Skill-based ranking with personalized recommendations
- **Interview Coaching** - Mock sessions with real-time feedback and cultural adaptation
- **Career Path Planning** - Personalized roadmaps with skill gap analysis
- **24/7 AI Assistant** - Conversational support in English and Amharic

### 📄 **CV Management System**
- **Multi-format Upload** - Support for PDF, DOC, and image uploads
- **Real-time Analysis** - Instant feedback and improvement suggestions
- **ATS Optimization** - Resume optimization for Applicant Tracking Systems
- **Version Control** - Track CV improvements and maintain multiple versions

### 🔍 **Job Discovery & Matching**
- **Smart Search** - AI-powered job discovery with relevance scoring
- **Skill-Based Ranking** - Jobs matched to user competencies and experience
- **Application Tracking** - Monitor application status and follow-ups
- **Salary Insights** - Market data for informed career decisions
- **Remote Opportunities** - Focus on global remote work possibilities

### 🎤 **Interview Preparation Suite**
- **Free-form Interview Practice** - Open-ended AI-powered interview sessions with natural conversation
- **Structured Interview Sessions** - Guided practice with specific question formats and categories
- **Interactive Interview Chat** - Real-time AI feedback and conversation during practice sessions
- **Cultural Adaptation** - Interview tips tailored to African and international contexts
- **Performance Analytics** - Detailed feedback on responses and communication skills

### 🌐 **Multilingual & Cultural Support**
- **English & Amharic** - Native language support with seamless switching
- **Cultural Context** - Africa-focused career advice and market insights
- **Local Job Markets** - Integration with African job boards and opportunities
- **Community Features** - Connect with other job seekers and mentors

## 🏗️ Architecture

### **Frontend (Flutter & Next.js)**

```
Flutter Mobile App           Next.js Web App
├── features/                ├── app/
│   ├── auth/               │   ├── login/
│   ├── cv/                 │   ├── register/
│   ├── interview/          │   ├── dashboard/
│   └── job_search/         │   ├── cv/
├── core/                   │   ├── interview/
│   ├── network/            │   ├── chat/
│   └── presentation/       │   └── reset-password/
└── l10n/                   ├── components/
    ├── app_localizations   │   └── ui/
    └── multilingual        └── lib/
```

### **Backend (Go)**

```
backend/
├── cmd/                     # Application entry points
├── internal/
│   ├── domain/             # Business logic & entities
│   ├── handlers/           # HTTP handlers
│   ├── services/           # Business services
│   └── repository/         # Data access layer
├── pkg/                    # Shared packages
└── configs/                # Configuration files
```


## 🚀 Quick Start Guide

### 📋 Prerequisites

- **Flutter SDK** (3.7 or higher)
- **Node.js** (18 or higher)
- **Go** (1.21 or higher)
- **MongoDB** (6.0 or higher - local installation or MongoDB Atlas)
- **Google Gemini API Key** - For AI-powered features
- **Development IDE** (VS Code, Android Studio, or IntelliJ)

### ⚡ Fast Setup (5 Minutes)

#### 1. **Clone and Navigate**

```bash
git clone https://github.com/your-organization/jobmate.git
cd jobmate
```

#### 2. **Backend Configuration**

```bash
cd Backend
go mod tidy

# Create environment file
cat > .env << EOF
PORT=8080
MONGODB_URI=mongodb://localhost:27017/jobmate
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_super_secret_jwt_key_here
GIN_MODE=release
EOF

# Start the server
go run main.go
```

#### 3. **Web Frontend Setup**

```bash
cd ../frontend
npm install

# Create environment file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_ENV=development
EOF

# Start development server
npm run dev
```

#### 4. **Mobile App Setup**

```bash
cd ../Mobile
flutter pub get

# For Android emulator
flutter run

# For iOS simulator (macOS only)
flutter run
```



## 💼 Professional Development Showcase

### **🎯 Technical Skills Demonstrated**

- **Full-Stack Development**: Complete mobile, web, and backend implementation
- **AI Integration**: Advanced AI capabilities using Google Gemini for career guidance
- **Mobile & Web Development**: Flutter mobile app and Next.js web application
- **Backend Architecture**: Go REST API with clean architecture principles
- **Database Design**: MongoDB schemas optimized for career data
- **State Management**: BLoC pattern for Flutter and Redux for web
- **Multilingual Support**: English and Amharic language implementations
- **Modern UI/UX**: Material Design 3 with responsive components


### **🎯 Key Achievements**

- ✅ **AI-Powered CV Analysis**: Advanced document processing with actionable feedback
- ✅ **Intelligent Job Matching**: Skill-based ranking with machine learning algorithms
- ✅ **Multilingual Platform**: Native English and Amharic support with cultural context
- ✅ **Multi-Platform Development**: Flutter mobile app and Next.js web application
- ✅ **Scalable Backend**: Go-based REST API with clean architecture
- ✅ **Real-World Impact**: Addresses Africa's youth unemployment crisis with innovative solutions

### **🎓 Technical Skills Demonstrated**

- **Mobile Development**: Flutter, Dart, BLoC, Material Design 3
- **Web Development**: Next.js, React, TypeScript, Redux Toolkit, Tailwind CSS
- **Backend Development**: Go, Gin, MongoDB, JWT Authentication, REST APIs
- **AI/ML Integration**: Google Gemini API, natural language processing
- **Architecture**: Clean Architecture, SOLID principles, domain-driven design
- **Security**: JWT authentication, input validation, secure data handling


---

<p align="center">
  <strong>🌍 Building a brighter future for African youth, one career at a time.</strong>
</p>

<p align="center">
  Made with ❤️ for Africa by Africans
</p>

---

**⭐ Star this repository if you find it helpful and want to support African tech innovation!**

**JobMate represents a complete AI-powered career guidance solution built with modern technologies and best practices. The platform successfully demonstrates full-stack development capabilities while providing real impact for African youth facing unemployment challenges.**
