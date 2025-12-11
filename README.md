# AI Super Hub - Comprehensive AI Learning Platform

A full-stack AI learning platform that combines course management, AI-powered chat assistance, curated AI tools directory, and an extensive prompt library. Built with modern web technologies and integrated with Google Gemini AI for intelligent conversational experiences.

## Live Demo

**Frontend:** [Add your deployed URL here]  
**Backend API:** [Add your deployed API URL here]  
**API Documentation:** [Your-API-URL]/api/docs

---

## Table of Contents

- [Project Description](#project-description)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Complete Transaction Flows](#complete-transaction-flows)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [AI Integration](#ai-integration)
- [External Services](#external-services)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Team Members](#team-members)
- [License](#license)

---

## Project Description

AI Super Hub is a comprehensive learning management system designed for AI enthusiasts and learners. The platform serves as a central hub for AI education, providing structured learning paths, intelligent assistance, and access to curated AI tools and resources.

### Platform Capabilities

- **70+ Curated AI Tools** - Comprehensive directory of AI tools across multiple categories
- **Structured Learning Courses** - Complete courses with video lessons, quizzes, and certificates
- **AI-Powered Chat System** - Four specialized AI assistants powered by Google Gemini
- **Prompt Library** - Extensive collection of AI prompts for various use cases
- **Admin Management Panel** - Full-featured content and user management system
- **Certificate System** - Automated certificate generation upon course completion
- **Progress Tracking** - Real-time learning analytics and performance metrics

---

## Key Features

### Student/User Features

**Course Management**
- Browse and filter courses by category and difficulty level
- Enroll in courses with one-click enrollment
- Access video lessons with rich text content
- Track progress through completion percentages
- Complete interactive quizzes with instant feedback
- Generate and download completion certificates
- View enrolled courses on personal dashboard

**AI Chat Assistant**
- Four specialized chat modes with distinct capabilities
  - General Mode: Full AI capabilities for any query
  - Tutor Mode: Educational assistant with explanatory focus
  - Coder Mode: Programming assistance with code examples
  - Summarizer Mode: Content condensation and key point extraction
- Context-aware conversations maintaining message history
- Persistent chat history across sessions
- Automatic chat title generation
- Platform-specific Helper Bot with learning path recommendations

**Tools Directory**
- Browse 70+ curated AI tools
- Advanced filtering by category
- Search functionality across tool database
- Bookmark favorite tools for quick access
- Direct external links to tool websites
- Bookmark count tracking

**Prompt Library**
- Access 100+ AI prompts across categories
- Filter by category and difficulty level
- One-click copy to clipboard
- Favorite prompts for quick access
- Usage count tracking

**Personal Dashboard**
- Overview of enrolled and completed courses
- Learning hours calculation
- Certificate count and access
- Chat session statistics
- Bookmarked tools overview

**Profile Management**
- Edit personal information
- Avatar upload and management
- Password change functionality
- Account deletion option
- Theme preferences (dark/light mode)

### Administrator Features

**Admin Dashboard**
- System-wide statistics and metrics
- User, course, tool, and prompt counts
- Recent user activity overview
- Quick access to management functions

**User Management**
- Complete user directory with search
- Role assignment (promote/demote administrators)
- User account deletion
- Filter by role and status

**Course Management**
- Create, edit, and delete courses
- Lesson management (CRUD operations)
- Quiz question management
- Course publishing controls
- Featured course designation
- Enrollment statistics tracking

**Tools Management**
- Add and manage AI tools
- Logo upload and management
- Category and pricing assignment
- Featured tool designation

**Prompts Management**
- Create and organize prompts
- Category and difficulty assignment
- Template and example management
- Featured prompt selection

**Support Management**
- View all support tickets
- Status management (new, in-progress, resolved, closed)
- Admin notes and responses
- Automatic email notifications
- Ticket deletion

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | User interface framework |
| Vite | Latest | Build tool and development server |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| Framer Motion | Latest | Animation library |
| React Router | 6.x | Client-side routing |
| Axios | Latest | HTTP client for API requests |
| React Hot Toast | Latest | Toast notification system |
| Lucide React | Latest | Icon library |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 16.x+ | JavaScript runtime environment |
| Express.js | 4.x | Web application framework |
| MongoDB | 5.x+ | NoSQL database |
| Mongoose | 7.x | MongoDB object modeling |
| JSON Web Token | Latest | Authentication token generation |
| bcrypt | Latest | Password hashing |
| Passport.js | Latest | Authentication middleware |
| Express Validator | Latest | Request validation |
| Swagger JSDoc | Latest | API documentation |
| Multer | Latest | File upload handling |

### External Services

| Service | Purpose | Documentation |
|---------|---------|---------------|
| Google Gemini AI | Chatbot intelligence | https://ai.google.dev/ |
| Cloudinary | Image and file storage | https://cloudinary.com/documentation |
| SendGrid | Email delivery service | https://docs.sendgrid.com/ |
| Google OAuth 2.0 | Social authentication | https://developers.google.com/identity |

---

## Installation & Setup

### Prerequisites

Ensure the following are installed on your system:
- Node.js (version 16.x or higher)
- npm (Node Package Manager)
- MongoDB (local installation or Atlas account)
- Git (for version control)

### Installation Steps

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ai-super-hub.git
cd ai-super-hub
```

#### 2. Backend Setup

```bash
cd server
npm install
```

#### 3. Frontend Setup

```bash
cd ../client
npm install
```

#### 4. Environment Configuration

Create `.env` file in the `server` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ai-super-hub

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d

# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SendGrid Configuration
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@aisuperhub.com
SENDGRID_FROM_NAME=AI Super Hub

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Application Configuration
CLIENT_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

#### 5. Obtain API Keys

**Google OAuth 2.0:**
1. Visit Google Cloud Console: https://console.cloud.google.com/
2. Create new project or select existing
3. Navigate to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret

**Cloudinary:**
1. Create account at https://cloudinary.com/
2. Navigate to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Free tier includes 25GB storage and bandwidth

**SendGrid:**
1. Create account at https://sendgrid.com/
2. Navigate to Settings > API Keys
3. Create new API key with full access
4. Verify sender email address
5. Free tier allows 100 emails per day

**Google Gemini AI:**
1. Visit Google AI Studio: https://makersuite.google.com/app/apikey
2. Create API key
3. Copy key to environment variables
4. Free tier includes generous quotas

#### 6. Database Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Recommended)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0 Sandbox)
3. Add database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string
6. Update MONGODB_URI in .env file

#### 7. Database Seeding (Optional)

Populate database with sample prompts:

```bash
cd server
node src/seeds/promptSeeds.js
```

#### 8. Run Application

**Start Backend (Terminal 1):**
```bash
cd server
npm run dev
```
Expected output: `Server running on port 5000`

**Start Frontend (Terminal 2):**
```bash
cd client
npm run dev
```
Expected output: `Local: http://localhost:3000`

#### 9. Create Administrator Account

After registration, promote user to admin via MongoDB:

```javascript
// MongoDB Shell
use ai-super-hub
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

#### 10. Access Application

- Frontend Application: http://localhost:3000
- Backend API: http://localhost:5000/api
- Swagger Documentation: http://localhost:5000/api/docs

---

## Project Structure

```
ai-super-hub/
│
├── client/                          # Frontend Application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── common/              # Shared components
│   │   │   ├── layout/              # Layout components
│   │   │   └── ui/                  # UI components
│   │   ├── context/                 # React context providers
│   │   ├── pages/                   # Page components
│   │   │   └── admin/               # Admin pages
│   │   ├── services/                # API service layer
│   │   ├── utils/                   # Utility functions
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # Application entry point
│   │   └── index.css                # Global styles
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   └── tailwind.config.js           # Tailwind configuration
│
├── server/                          # Backend Application
│   ├── src/
│   │   ├── config/                  # Configuration files
│   │   │   ├── cloudinary.js        # Cloudinary setup
│   │   │   ├── db.js                # Database connection
│   │   │   ├── passport.js          # OAuth configuration
│   │   │   ├── swagger.js           # API documentation
│   │   │   └── validateEnv.js       # Environment validation
│   │   ├── controllers/             # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── chat.controller.js
│   │   │   ├── course.controller.js
│   │   │   ├── prompt.controller.js
│   │   │   ├── tool.controller.js
│   │   │   └── user.controller.js
│   │   ├── middlewares/             # Custom middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── models/                  # Database models
│   │   │   ├── Chat.js
│   │   │   ├── Course.js
│   │   │   ├── Enrollment.js
│   │   │   ├── Prompt.js
│   │   │   ├── SupportMessage.js
│   │   │   ├── Tool.js
│   │   │   └── User.js
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── chat.routes.js
│   │   │   ├── course.routes.js
│   │   │   ├── prompt.routes.js
│   │   │   ├── support.routes.js
│   │   │   ├── tool.routes.js
│   │   │   ├── upload.routes.js
│   │   │   └── user.routes.js
│   │   ├── services/                # Business logic
│   │   │   ├── email.service.js
│   │   │   └── gemini.service.js
│   │   ├── utils/                   # Utilities
│   │   │   ├── apiResponse.js
│   │   │   ├── AppError.js
│   │   │   ├── constants.js
│   │   │   └── logger.js
│   │   ├── validators/              # Input validation
│   │   │   ├── auth.validator.js
│   │   │   ├── chat.validator.js
│   │   │   ├── course.validator.js
│   │   │   └── tool.validator.js
│   │   └── app.js                   # Express application
│   ├── .env                         # Environment variables
│   └── package.json                 # Backend dependencies
│
└── README.md                        # Project documentation
```

---

## API Documentation

### Overview

The platform provides a comprehensive REST API with 58+ endpoints across 9 major categories. All endpoints are documented using Swagger/OpenAPI 3.0 specification.

**API Base URL:** `http://localhost:5000/api`  
**Interactive Documentation:** `http://localhost:5000/api/docs`

### API Categories

| Category | Endpoints | Description |
|----------|-----------|-------------|
| Authentication | 9 | User registration, login, OAuth, password management |
| Users | 5 | User profile and account management |
| Courses | 15 | Course CRUD, enrollment, lessons, quiz operations |
| Tools | 9 | AI tools directory and bookmark management |
| Chats | 6 | AI conversation management |
| Prompts | 6 | Prompt library operations |
| Support | 4 | Support ticket system |
| Upload | 4 | File and image upload to Cloudinary |
| Health | 1 | API health check endpoint |

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Sample API Requests

**User Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Get All Courses:**
```http
GET /api/courses?page=1&limit=10&category=machine-learning
```

**Enroll in Course:**
```http
POST /api/courses/:courseId/enroll
Authorization: Bearer <token>
```

**Send Chat Message:**
```http
POST /api/chats/:chatId/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Explain neural networks"
}
```

**Bookmark Tool:**
```http
POST /api/tools/:toolId/bookmark
Authorization: Bearer <token>
```

---

## Complete Transaction Flows

### Flow 1: Student Course Learning Journey

**User Actions:**
1. User registers account or logs in
2. Navigates to Courses page
3. Filters courses by category or difficulty
4. Views course details including lessons and quiz information
5. Clicks Enroll button
6. Accesses unlocked lesson content (video and text)
7. Marks each lesson as complete
8. Monitors progress percentage (updated after each lesson)
9. Completes all lessons (100% progress)
10. Takes final quiz with multiple-choice questions
11. Submits quiz and receives instant score
12. Passes with 70% or higher
13. Receives automated certificate
14. Downloads certificate as image
15. Views completion status on dashboard

**Database Operations:**
- Enrollment document created linking user and course
- Progress calculated as (completedLessons / totalLessons) * 100
- Quiz attempts stored with answers and scores
- Best quiz score tracked across multiple attempts
- Certificate issued when all lessons completed AND quiz passed
- Completion timestamp recorded
- User statistics updated (learning hours, certificates earned)

**Data Consistency:**
- Enrollment unique constraint prevents duplicate enrollments
- Progress percentage automatically calculated
- Certificate issuance conditional on completion criteria
- Dashboard stats query real-time enrollment data

---

### Flow 2: Admin Course Creation and Publishing

**Admin Actions:**
1. Admin logs into admin panel
2. Navigates to Course Management section
3. Clicks Create New Course
4. Fills course form with title, description, category, difficulty
5. Uploads course thumbnail image to Cloudinary
6. Adds tags, prerequisites, and learning outcomes
7. Saves course (initially in draft status)
8. Navigates to Lesson Management
9. Adds multiple lessons with titles, content, video URLs, and durations
10. Navigates to Quiz Management
11. Creates quiz questions with options, correct answers, and explanations
12. Returns to course list
13. Toggles Publish status
14. Course becomes visible to all users
15. Monitors enrollment count as users enroll

**Database Operations:**
- Course document created with all metadata
- Lessons embedded in course.lessons array
- Quiz questions embedded in course.quiz array
- Publication flag updated (isPublished: true)
- Enrollment count incremented when users enroll

**Data Consistency:**
- Course validation ensures required fields
- Lesson order maintained
- Quiz integrity verified
- Only published courses visible to non-admin users

---

### Flow 3: AI Chat Interaction

**User Actions:**
1. User logs in to platform
2. Navigates to Chat page
3. Selects chat mode (General, Tutor, Coder, or Summarizer)
4. Creates new chat session
5. Types message in input field
6. Sends message to AI
7. Message appears in chat window
8. Backend processes message with context
9. AI generates response via Gemini API
10. Response appears in chat window
11. User continues conversation
12. System maintains context from previous messages
13. Chat title automatically generated from first message
14. Chat saved to history for future access
15. Dashboard chat session count incremented

**Database Operations:**
- Chat document created with user reference
- Messages array stores conversation history
- Each message includes role (user/assistant), content, and timestamp
- Chat title generated using AI
- Message count tracked

**AI Integration:**
- System prompt selected based on chat mode
- Last 10 messages included for context
- Gemini API called with conversation history
- Fallback system (3 models) ensures reliability
- Error handling provides graceful degradation

---

### Flow 4: Tool Discovery and Bookmarking

**User Actions:**
1. User logs in to platform
2. Navigates to Tools directory
3. Views 70+ available AI tools
4. Filters tools by category (e.g., Image Generation)
5. Searches for specific tool by name
6. Clicks on tool card to view details
7. Clicks bookmark icon
8. Tool added to user bookmarks
9. Bookmark count on tool incremented
10. Success notification displayed
11. Navigates to Dashboard
12. Views bookmarked tools count
13. Can access bookmarked tools filter
14. Can remove bookmark (reverses operation)

**Database Operations:**
- Tool ID added to user.bookmarkedTools array
- Tool.bookmarkCount field incremented
- User document saved
- Dashboard queries bookmark count

**Data Consistency:**
- Bookmark state synchronized between tool and user
- Count accurately reflects number of users who bookmarked
- Unbookmarking decrements count and removes from array

---

### Flow 5: Support Ticket Lifecycle

**User Actions:**
1. User navigates to Support page
2. Fills contact form with name, email, subject, message
3. Selects category (general, technical, billing, course, feature)
4. Submits form via API call
5. Receives success confirmation
6. Form resets for potential additional submissions

**Admin Actions:**
1. Admin logs into admin panel
2. Navigates to Support Management
3. Views list of support messages
4. Filters by status (new, in-progress, resolved)
5. Clicks message to view full details
6. Updates status to in-progress
7. Adds admin notes with resolution details
8. Changes status to resolved
9. System automatically sends email to user
10. User receives resolution notification

**Database Operations:**
- SupportMessage document created with status "new"
- User ID attached if user is authenticated
- Admin updates status field
- Admin notes stored
- Resolved timestamp and resolver ID recorded
- Email service triggered on status change to resolved

**Email Integration:**
- SendGrid API called with email template
- User receives notification with admin notes
- Delivery logged for audit trail
- Error handling if email fails (logged but doesn't block)

---

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (hashed with bcrypt),
  avatar: String (Cloudinary URL),
  role: String (enum: ['user', 'admin'], default: 'user'),
  googleId: String (for OAuth users),
  isEmailVerified: Boolean (default: false),
  emailVerificationOTP: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  bookmarkedTools: [ObjectId] (ref: Tool),
  createdAt: Date,
  updatedAt: Date
}
```

### Courses Collection

```javascript
{
  _id: ObjectId,
  title: String (required, max 200 chars),
  description: String (required, max 2000 chars),
  shortDescription: String (max 300 chars),
  thumbnail: String (Cloudinary URL),
  category: String (enum: predefined categories),
  difficulty: String (enum: ['beginner', 'intermediate', 'advanced']),
  duration: Number (total minutes),
  lessons: [{
    _id: ObjectId,
    title: String (required),
    content: String (required),
    videoUrl: String,
    duration: Number (minutes),
    order: Number (required),
    resources: [{ title: String, url: String }]
  }],
  quiz: [{
    _id: ObjectId,
    question: String (required),
    options: [String] (required),
    correctAnswer: Number (0-based index),
    explanation: String
  }],
  tags: [String],
  prerequisites: [String],
  learningOutcomes: [String],
  instructor: {
    name: String,
    avatar: String,
    bio: String
  },
  isPublished: Boolean (default: false),
  isFeatured: Boolean (default: false),
  enrollmentCount: Number (default: 0),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollments Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  course: ObjectId (ref: Course, required),
  progress: Number (0-100),
  completedLessons: [{
    lessonId: ObjectId,
    completedAt: Date
  }],
  quizAttempts: [{
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    answers: [{
      questionId: ObjectId,
      selectedAnswer: Number,
      isCorrect: Boolean
    }],
    attemptedAt: Date
  }],
  bestQuizScore: Number (default: 0),
  status: String (enum: ['enrolled', 'in-progress', 'completed']),
  startedAt: Date,
  lastAccessedAt: Date,
  completedAt: Date,
  certificateIssued: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Tools Collection

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  description: String (required),
  shortDescription: String,
  url: String (required, validated URL),
  logo: String (Cloudinary URL),
  category: String (enum: predefined categories),
  pricing: String (enum: ['free', 'freemium', 'paid']),
  tags: [String],
  featured: Boolean (default: false),
  bookmarkCount: Number (default: 0),
  rating: {
    average: Number,
    count: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Chats Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  title: String (default: 'New Chat'),
  model: String (Gemini model name),
  mode: String (enum: ['general', 'tutor', 'coder', 'summarizer']),
  messages: [{
    role: String (enum: ['user', 'assistant']),
    content: String,
    timestamp: Date
  }],
  messageCount: Number (virtual field),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Prompts Collection

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  template: String (required, with [PLACEHOLDERS]),
  example: String (required),
  category: String (required),
  difficulty: String (enum: ['Beginner', 'Intermediate', 'Advanced']),
  tags: [String],
  color: String (hex color),
  icon: String (icon name),
  aiModel: String (compatible AI model),
  useCount: Number (default: 0),
  isFeatured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Support Messages Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  subject: String (required),
  message: String (required),
  category: String (enum: ['general', 'technical', 'billing', 'course', 'feature']),
  status: String (enum: ['new', 'in-progress', 'resolved', 'closed']),
  userId: ObjectId (ref: User, optional),
  adminNotes: String,
  resolvedBy: ObjectId (ref: User),
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Security Features

### Authentication Mechanisms

**JWT Token Authentication:**
- Tokens generated on successful login
- Signed with secret key from environment variables
- Default expiration: 7 days
- Stored in localStorage on client
- Included in Authorization header for protected requests

**Password Security:**
- Hashing algorithm: bcrypt with 10 salt rounds
- Passwords never stored in plain text
- Password comparison using bcrypt.compare()
- Minimum password length: 6 characters

**Google OAuth 2.0:**
- Implemented using Passport.js Google Strategy
- Automatic account creation for new OAuth users
- Secure token exchange
- Profile information retrieval (name, email, avatar)

**Email Verification:**
- OTP-based verification system
- 6-digit verification codes
- Expiration time: 10 minutes
- Resend functionality available

**Password Reset:**
- Secure token generation (crypto.randomBytes)
- Token expiration: 1 hour
- Email delivery via SendGrid
- One-time use tokens

### Authorization Controls

**Role-Based Access:**
- Middleware: `protect` (requires authentication)
- Middleware: `adminOnly` (requires admin role)
- Middleware: `optionalAuth` (authentication optional)

**Protected Routes:**
- Admin routes: Require both authentication and admin role
- User routes: Require authentication
- Public routes: No authentication required

**Data Access Control:**
- Users can only access their own data
- Admins can access all user data
- Enrollment restricted to authenticated users
- Chat history isolated per user

### Input Validation

**Frontend Validation:**
- Form field validation (required, format, length)
- Email format validation
- Password strength requirements
- File type and size validation

**Backend Validation:**
- Express-validator middleware
- Schema validation via Mongoose
- Custom validation rules
- Sanitization of user inputs

### Security Headers

- CORS configuration
- Helmet.js for HTTP headers (if implemented)
- XSS protection
- CSRF protection considerations

---

## AI Integration

### Google Gemini AI Implementation

**Service Layer:** `server/src/services/gemini.service.js`

**Features:**
- Model: Gemini 2.5 Flash (primary), Gemini 2.5 Pro (fallback)
- Context management: Last 10 messages included in requests
- Error handling: 3-tier fallback system
- Safety filters: Content safety checking
- Title generation: AI-generated chat titles

**Chat Modes with System Prompts:**

**General Mode:**
- Purpose: Full AI capabilities for any question
- Use cases: General questions, brainstorming, creative writing
- System prompt: Helpful AI assistant

**Tutor Mode:**
- Purpose: Educational assistance
- Use cases: Learning concepts, step-by-step explanations
- System prompt: Expert tutor with teaching focus
- Features: Examples, analogies, guiding questions

**Coder Mode:**
- Purpose: Programming assistance
- Use cases: Code writing, debugging, best practices
- System prompt: Expert programmer
- Features: Code examples, explanations, optimizations

**Summarizer Mode:**
- Purpose: Content condensation
- Use cases: Article summaries, key point extraction
- System prompt: Summarization expert
- Features: Bullet points, main ideas, concise presentation

**Helper Bot (Platform Guide):**
- Purpose: Platform-specific assistance
- Knowledge: All platform features, courses, tools
- Capabilities: Learning path recommendations, feature guidance
- Implementation: Separate endpoint with specialized system prompt

**API Configuration:**
```javascript
// Request structure
{
  messages: [
    { role: 'user', content: 'User message' },
    { role: 'assistant', content: 'AI response' }
  ],
  model: 'gemini-2.5-flash',
  systemPrompt: 'Mode-specific instructions'
}
```

**Error Handling:**
1. Primary model attempt (Gemini 2.5 Flash)
2. Fallback to Gemini 2.5 Pro
3. Fallback to Gemini 2.5 Flash Lite
4. Ultimate fallback: User-friendly error message

---

## External Services

### Google Gemini AI

**Purpose:** AI chatbot functionality  
**Endpoint:** Google Generative AI API  
**Model:** Gemini 2.5 Flash, Gemini 2.5 Pro  
**Free Tier:** 15 requests per minute, 1500 requests per day  
**Documentation:** https://ai.google.dev/

**Usage in Application:**
- Chat message responses
- Chat title generation
- Context-aware conversations
- Multi-mode support

---

### Cloudinary

**Purpose:** Image and file storage  
**Service:** Cloud-based media management  
**Free Tier:** 25GB storage, 25GB bandwidth/month  
**Documentation:** https://cloudinary.com/documentation

**Usage in Application:**
- User avatar uploads
- Course thumbnail images
- Tool logo/icon uploads
- General image storage

**Features Used:**
- Automatic image optimization
- Format conversion
- Secure URL generation
- CDN delivery

---

### SendGrid

**Purpose:** Transactional email delivery  
**Free Tier:** 100 emails per day  
**Documentation:** https://docs.sendgrid.com/

**Email Types:**
- Welcome emails on registration
- Email verification with OTP codes
- Password reset links
- Support ticket resolution notifications

**Implementation:**
- SMTP API integration
- Custom email templates
- Error handling and retry logic
- Delivery tracking

---

### Google OAuth 2.0

**Purpose:** Social authentication  
**Implementation:** Passport.js Google Strategy  
**Documentation:** https://developers.google.com/identity

**Features:**
- One-click sign in with Google
- Automatic account creation
- Profile information retrieval
- Secure token exchange

---

## Testing

### Manual Testing Procedures

**Authentication Tests:**
1. Register new user with email and password
2. Verify email using OTP code
3. Login with credentials
4. Test Google OAuth sign-in
5. Test password reset flow
6. Verify JWT token authentication
7. Test logout functionality

**Course Tests:**
1. Browse courses as guest user
2. Enroll in course as authenticated user
3. View and complete lessons sequentially
4. Verify progress updates after each lesson
5. Take quiz when all lessons completed
6. Submit quiz and verify score calculation
7. Verify certificate generation on passing
8. Download certificate
9. Check dashboard reflects completion

**Admin Tests:**
1. Access admin panel with admin credentials
2. Create new course with all fields
3. Add multiple lessons with content
4. Create quiz questions
5. Publish course
6. Verify course appears in user course list
7. Check enrollment count updates

**Chat Tests:**
1. Create new chat session
2. Test each mode (General, Tutor, Coder, Summarizer)
3. Send multiple messages
4. Verify context is maintained
5. Check chat history saves
6. Test chat deletion

**API Tests:**
1. Access Swagger UI at /api/docs
2. Authenticate with Bearer token
3. Test each endpoint category
4. Verify request/response formats
5. Check error responses
6. Test pagination where applicable

### Browser Compatibility

Tested and verified on:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest)

### Responsive Design Testing

Tested on:
- Desktop (1920x1080, 1366x768)
- Tablet (768x1024)
- Mobile (375x667, 414x896)

---

## Deployment

### Frontend Deployment (Vercel)

**Prerequisites:**
- Vercel account
- GitHub repository

**Steps:**

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from client directory:
```bash
cd client
vercel --prod
```

4. Configure build settings:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

5. Set environment variables in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Backend Deployment (Render)

**Prerequisites:**
- Render account
- GitHub repository

**Steps:**

1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure service:
   - Name: ai-super-hub-api
   - Environment: Node
   - Region: Select closest to users
   - Branch: main
   - Root Directory: server
   - Build Command: `npm install`
   - Start Command: `node src/app.js`

4. Add environment variables in Render dashboard:
```
MONGODB_URI=<your-atlas-connection-string>
JWT_SECRET=<your-secret>
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
SENDGRID_API_KEY=<your-sendgrid-key>
SENDGRID_FROM_EMAIL=noreply@aisuperhub.com
SENDGRID_FROM_NAME=AI Super Hub
GEMINI_API_KEY=<your-gemini-key>
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5000
```

5. Deploy and wait for build completion

### Database Deployment (MongoDB Atlas)

**Already cloud-hosted if using Atlas.**

Ensure:
- Network access allows Render IP addresses
- Database user has proper permissions
- Connection string uses correct credentials

### Post-Deployment

1. Update frontend environment variable with backend URL
2. Update Google OAuth callback URL
3. Test all features on production
4. Verify API endpoints respond correctly
5. Test authentication flow end-to-end

---

## Troubleshooting

### MongoDB Connection Issues

**Symptom:** Cannot connect to database

**Solutions:**
- Verify MongoDB service is running
- Check MONGODB_URI format and credentials
- Ensure IP address is whitelisted (Atlas)
- Test connection string separately
- Check network connectivity

### Google OAuth Errors

**Symptom:** OAuth redirect fails or shows error

**Solutions:**
- Verify CLIENT_ID and CLIENT_SECRET are correct
- Check authorized redirect URIs in Google Console
- Ensure callback URL matches exactly
- Verify Google+ API is enabled
- Check credentials are for correct environment

### AI Chat Not Responding

**Symptom:** Messages sent but no AI response

**Solutions:**
- Verify GEMINI_API_KEY is valid
- Check API quota not exceeded (Google AI Studio)
- Review backend logs for error messages
- Test API key with simple request
- Ensure model name is correct

### File Upload Failures

**Symptom:** Images fail to upload

**Solutions:**
- Verify Cloudinary credentials are correct
- Check file size within limits (5MB)
- Ensure file format is supported (JPG, PNG, WEBP)
- Review network tab for HTTP errors
- Check Cloudinary quota not exceeded

### Email Delivery Issues

**Symptom:** Emails not received

**Solutions:**
- Verify SENDGRID_API_KEY is valid
- Check sender email is verified in SendGrid
- Review SendGrid dashboard for delivery errors
- Check spam folder
- Verify daily email quota not exceeded

### Port Already in Use

**Symptom:** Error starting server - port in use

**Solutions:**
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change port in .env
PORT=5001
```

### Build Errors

**Symptom:** npm install or build fails

**Solutions:**
- Delete node_modules and package-lock.json
- Run `npm install` again
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`

---

## Performance Optimization

### Frontend Optimizations

- Code splitting with React lazy loading
- Image optimization via Cloudinary
- Tailwind CSS purging in production
- Vite production build optimization
- Component memoization where appropriate

### Backend Optimizations

- Database indexing on frequently queried fields
- Connection pooling for MongoDB
- Response compression
- Efficient aggregation queries
- Pagination for large datasets

### Caching Strategies

- Browser caching for static assets
- API response caching (can be implemented)
- Database query result caching (can be implemented)

---

## Future Enhancements

### Planned Features

**User Features:**
- Course reviews and ratings
- Discussion forums for courses
- Certificate sharing on social media
- Learning streak tracking
- Achievement badges
- Course recommendations based on interests

**Admin Features:**
- Advanced analytics dashboard
- Bulk operations for content management
- Course scheduling and auto-publishing
- User engagement metrics
- A/B testing for course content

**Technical Improvements:**
- Redis caching layer
- WebSocket for real-time features
- Elasticsearch for advanced search
- Rate limiting for API endpoints
- Automated testing (Jest, Cypress)
- CI/CD pipeline

---

## API Quota Management

### Free Tier Limits

**Google Gemini AI:**
- Requests per minute: 15
- Requests per day: 1,500
- Sufficient for development and moderate usage

**Cloudinary:**
- Storage: 25GB
- Bandwidth: 25GB/month
- Transformations: 25,000/month

**SendGrid:**
- Emails per day: 100
- Adequate for development and testing

**MongoDB Atlas:**
- Storage: 512MB (M0 Sandbox)
- Shared cluster
- No connection limits

### Cost Estimate

**Development/Testing:** $0 (all free tiers)  
**Production (estimated):**
- Gemini API: ~$10-20/month (with usage)
- Cloudinary: $0 (within free tier typically)
- SendGrid: $0-15/month
- MongoDB Atlas: $0 (M0) or $9/month (M2)
- Hosting: $0 (Vercel + Render free tiers)

**Total:** $0-50/month depending on usage

---

## Contributing Guidelines

This project is developed as part of an academic course requirement. For any modifications or improvements:

1. Fork the repository
2. Create feature branch
3. Make changes with proper commits
4. Test thoroughly
5. Submit pull request with description

---

## Team Members

**Developer:** [Your Name]  
**Course:** INFO 6150 - Web Design & User Experience Engineering  
**Semester:** Fall 2025  
**Institution:** Northeastern University  
**Professor:** [Professor Name]

---

## License

This project is developed for educational purposes as part of the INFO 6150 course final project at Northeastern University.

---

## Acknowledgments

**Course Instruction:**
- Professor [Professor Name] for course guidance and requirements
- Teaching Assistants for technical support and code reviews

**External Services:**
- Google Gemini AI for providing the conversational AI API
- Cloudinary for cloud-based image storage infrastructure
- SendGrid for reliable email delivery service
- MongoDB for database platform and Atlas hosting
- Google for OAuth 2.0 authentication services

**Open Source Community:**
- React team for the frontend framework
- Express.js contributors for the backend framework
- Tailwind CSS team for the utility-first CSS framework
- Framer Motion for animation capabilities
- All npm package contributors

**Institution:**
- Northeastern University for educational resources

---

## Contact Information

**Project Repository:** [GitHub URL]  
**Live Application:** [Deployed URL]  
**Developer Email:** [Your Email]  
**Academic Email:** [Your NEU Email]

For questions, issues, or feedback regarding this project, please contact the development team or create an issue in the repository.

---

## Technical Specifications

### System Requirements

**Development Environment:**
- Operating System: Windows 10/11, macOS, or Linux
- Node.js: v16.x or higher
- npm: v7.x or higher
- MongoDB: v5.x or higher
- RAM: 4GB minimum, 8GB recommended
- Storage: 2GB available space

**Production Environment:**
- Node.js runtime support
- MongoDB Atlas or similar database hosting
- Cloud storage for media files
- Email service integration
- Sufficient bandwidth for API requests

### Browser Support

- Chrome/Edge: Version 90+
- Firefox: Version 88+
- Safari: Version 14+
- Mobile browsers: iOS Safari 14+, Chrome Mobile 90+

---

## Project Metrics

**Development Statistics:**
- Total Components: 50+ React components
- Total API Endpoints: 58+ REST endpoints
- Database Collections: 7 collections
- Pages/Views: 29 distinct pages
- Lines of Code: Approximately 15,000+ lines
- External APIs: 4 services integrated
- Transaction Flows: 5 complete flows

**Features Count:**
- User features: 20+ features
- Admin features: 15+ features
- Security features: 10+ implementations
- Integration points: 4 external services

---

**Project Status:** Production Ready  
**Last Updated:** December 2025  
**Version:** 1.0.0  
**Documentation Status:** Complete