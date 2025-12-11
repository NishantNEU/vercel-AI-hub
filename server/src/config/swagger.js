/**
 * @fileoverview Swagger/OpenAPI documentation configuration
 * @description Configures Swagger UI for interactive API documentation.
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Swagger configuration options
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Super Hub API',
      version: '1.0.0',
      description: `
## AI Super Hub - Comprehensive AI Learning Platform API

Welcome to the AI Super Hub API documentation. This API powers a full-featured AI learning platform.

### Features
- 🔐 **Authentication** - JWT-based auth with Google OAuth 2.0
- 💬 **AI Chat** - Powered by Google Gemini AI
- 🚀 **AI Tools** - Directory of 50+ AI tools
- 📚 **Courses** - Learning courses with lessons & quizzes
- 📤 **File Upload** - Cloudinary integration for images
- 👤 **Admin Panel** - User and content management

### Authentication
Most endpoints require a Bearer token:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

### Getting Started
1. Register an account via \`POST /api/auth/register\`
2. Or login with Google via \`GET /api/auth/google\`
3. Use the returned token for authenticated requests
      `,
      contact: {
        name: 'AI Super Hub Team',
        email: 'support@aisuperhub.com',
        url: 'https://aisuperhub.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      },
      {
        url: 'https://api.aisuperhub.com',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from login/register'
        }
      },
      schemas: {
        // ==================== USER SCHEMAS ====================
        User: {
          type: 'object',
          properties: {
            _id: { 
              type: 'string', 
              example: '507f1f77bcf86cd799439011',
              description: 'MongoDB ObjectId'
            },
            name: { 
              type: 'string', 
              example: 'John Doe',
              description: 'User display name'
            },
            email: { 
              type: 'string', 
              format: 'email',
              example: 'john@example.com',
              description: 'User email address'
            },
            avatar: { 
              type: 'string', 
              example: 'https://res.cloudinary.com/demo/image/avatar.jpg',
              description: 'Profile picture URL (Cloudinary)'
            },
            role: { 
              type: 'string', 
              enum: ['user', 'admin'], 
              example: 'user',
              description: 'User role for access control'
            },
            googleId: {
              type: 'string',
              example: '118234567890123456789',
              description: 'Google OAuth ID (if signed in with Google)'
            },
            isEmailVerified: {
              type: 'boolean',
              example: true,
              description: 'Whether email is verified'
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },

        // ==================== AUTH SCHEMAS ====================
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { 
              type: 'string', 
              format: 'email',
              example: 'john@example.com' 
            },
            password: { 
              type: 'string', 
              minLength: 6,
              example: 'password123' 
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { 
              type: 'string', 
              minLength: 2,
              maxLength: 50,
              example: 'John Doe' 
            },
            email: { 
              type: 'string', 
              format: 'email',
              example: 'john@example.com' 
            },
            password: { 
              type: 'string', 
              minLength: 6,
              example: 'password123',
              description: 'Min 6 characters'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { 
                  type: 'string', 
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
                }
              }
            }
          }
        },

        // ==================== TOOL SCHEMAS ====================
        Tool: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'ChatGPT' },
            description: { type: 'string', example: 'AI chatbot by OpenAI' },
            shortDescription: { type: 'string', example: 'Advanced AI assistant' },
            url: { type: 'string', format: 'uri', example: 'https://chat.openai.com' },
            logo: { type: 'string', example: 'https://cloudinary.com/logo.png' },
            category: { 
              type: 'string', 
              enum: ['chatbots', 'image-generation', 'writing', 'coding', 'video', 'audio', 'productivity', 'research', 'other'],
              example: 'chatbots' 
            },
            pricing: { 
              type: 'string', 
              enum: ['free', 'freemium', 'paid'],
              example: 'freemium' 
            },
            tags: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['AI', 'chatbot', 'GPT-4'] 
            },
            featured: { type: 'boolean', example: true },
            bookmarkCount: { type: 'integer', example: 150 },
            rating: {
              type: 'object',
              properties: {
                average: { type: 'number', example: 4.5 },
                count: { type: 'integer', example: 120 }
              }
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        CreateToolRequest: {
          type: 'object',
          required: ['name', 'description', 'url', 'category', 'pricing'],
          properties: {
            name: { type: 'string', example: 'New AI Tool' },
            description: { type: 'string', example: 'A powerful AI tool for...' },
            shortDescription: { type: 'string', example: 'Powerful AI tool' },
            url: { type: 'string', format: 'uri', example: 'https://newtool.ai' },
            logo: { type: 'string', example: 'https://cloudinary.com/logo.png' },
            category: { type: 'string', example: 'productivity' },
            pricing: { type: 'string', enum: ['free', 'freemium', 'paid'] },
            tags: { type: 'array', items: { type: 'string' } },
            featured: { type: 'boolean', default: false }
          }
        },

        // ==================== COURSE SCHEMAS ====================
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', example: 'Introduction to Machine Learning' },
            description: { type: 'string', example: 'Learn the fundamentals of ML...' },
            shortDescription: { type: 'string', example: 'ML fundamentals course' },
            thumbnail: { type: 'string', example: 'https://cloudinary.com/course.jpg' },
            category: { 
              type: 'string',
              enum: ['ai-fundamentals', 'machine-learning', 'deep-learning', 'nlp', 'computer-vision', 'generative-ai', 'ai-tools', 'prompt-engineering', 'ai-ethics', 'other'],
              example: 'machine-learning'
            },
            difficulty: { 
              type: 'string', 
              enum: ['beginner', 'intermediate', 'advanced'],
              example: 'beginner' 
            },
            duration: { type: 'integer', example: 180 },
            lessons: {
              type: 'array',
              items: { $ref: '#/components/schemas/Lesson' }
            },
            quiz: {
              type: 'array',
              items: { $ref: '#/components/schemas/QuizQuestion' }
            },
            tags: { type: 'array', items: { type: 'string' } },
            prerequisites: { type: 'array', items: { type: 'string' } },
            learningOutcomes: { type: 'array', items: { type: 'string' } },
            isPublished: { type: 'boolean', example: true },
            isFeatured: { type: 'boolean', example: false },
            enrollmentCount: { type: 'integer', example: 250 },
            rating: {
              type: 'object',
              properties: {
                average: { type: 'number', example: 4.8 },
                count: { type: 'integer', example: 45 }
              }
            }
          }
        },

        Lesson: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string', example: 'Introduction to Neural Networks' },
            content: { type: 'string', example: 'In this lesson, we will learn...' },
            videoUrl: { type: 'string', example: 'https://youtube.com/watch?v=...' },
            duration: { type: 'integer', example: 15 },
            order: { type: 'integer', example: 1 }
          }
        },

        QuizQuestion: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            question: { type: 'string', example: 'What is a neural network?' },
            options: {
              type: 'array',
              items: { type: 'string' }
            },
            correctAnswer: { type: 'integer', example: 1 },
            explanation: { type: 'string', example: 'A neural network is inspired by biological neurons...' }
          }
        },

        CreateCourseRequest: {
          type: 'object',
          required: ['title', 'description', 'category', 'difficulty'],
          properties: {
            title: { type: 'string', maxLength: 200 },
            description: { type: 'string', maxLength: 2000 },
            shortDescription: { type: 'string', maxLength: 300 },
            thumbnail: { type: 'string' },
            category: { type: 'string' },
            difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
            tags: { type: 'array', items: { type: 'string' } },
            prerequisites: { type: 'array', items: { type: 'string' } },
            learningOutcomes: { type: 'array', items: { type: 'string' } },
            isPublished: { type: 'boolean', default: false },
            isFeatured: { type: 'boolean', default: false }
          }
        },

        Enrollment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            course: { type: 'string' },
            completedLessons: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  lessonId: { type: 'string' },
                  completedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            quizAttempts: { type: 'integer' },
            bestQuizScore: { type: 'number' },
            isCompleted: { type: 'boolean' },
            completedAt: { type: 'string', format: 'date-time' }
          }
        },

        // ==================== CHAT SCHEMAS ====================
        Chat: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            title: { type: 'string', example: 'ML Discussion' },
            model: { type: 'string', example: 'gemini-2.0-flash' },
            mode: { 
              type: 'string', 
              enum: ['general', 'tutor', 'coder', 'summarizer'],
              example: 'general' 
            },
            messages: {
              type: 'array',
              items: { $ref: '#/components/schemas/Message' }
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        Message: {
          type: 'object',
          properties: {
            role: { type: 'string', enum: ['user', 'assistant'] },
            content: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },

        SendMessageRequest: {
          type: 'object',
          required: ['message'],
          properties: {
            message: { 
              type: 'string', 
              example: 'Explain machine learning in simple terms'
            }
          }
        },

        // ==================== UPLOAD SCHEMAS ====================
        UploadResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Image uploaded successfully' },
            data: {
              type: 'object',
              properties: {
                url: { type: 'string', example: 'https://res.cloudinary.com/demo/image/upload/...' },
                filename: { type: 'string' },
                size: { type: 'integer' }
              }
            }
          }
        },

        // ==================== COMMON SCHEMAS ====================
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message describing what went wrong' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Invalid email format' }
                }
              }
            }
          }
        },

        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' }
          }
        },

        PaginationMeta: {
          type: 'object',
          properties: {
            pagination: {
              type: 'object',
              properties: {
                currentPage: { type: 'integer', example: 1 },
                itemsPerPage: { type: 'integer', example: 10 },
                totalItems: { type: 'integer', example: 100 },
                totalPages: { type: 'integer', example: 10 }
              }
            }
          }
        }
      },

      // ==================== RESPONSES ====================
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Not authorized. Please login.'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Resource not found'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },

    // ==================== TAGS ====================
    tags: [
      { 
        name: 'Health', 
        description: 'API health check and status' 
      },
      { 
        name: 'Auth', 
        description: 'Authentication - Register, Login, Google OAuth, Profile management' 
      },
      { 
        name: 'Users', 
        description: 'User management (Admin only)' 
      },
      { 
        name: 'Tools', 
        description: 'AI Tools directory - Browse, search, bookmark tools' 
      },
      { 
        name: 'Courses', 
        description: 'Learning courses - Enroll, lessons, quizzes, progress tracking' 
      },
      { 
        name: 'Chats', 
        description: 'AI Chat - Conversations with Google Gemini AI' 
      },
      { 
        name: 'Upload', 
        description: 'File uploads - Avatars, thumbnails, images (Cloudinary)' 
      },
      { 
        name: 'Prompts', 
        description: 'AI Prompt Library - Browse, favorite, improve prompts' 
      },
      { 
        name: 'Support', 
        description: 'Support messages - Submit and manage support requests' 
      }
    ]
  },

  apis: ['./src/routes/*.js', './src/app.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
