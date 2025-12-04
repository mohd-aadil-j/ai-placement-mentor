# AI Placement Mentor

A full-stack web application that helps students analyze their resume, compare it with job descriptions, and generate skill-based insights using AI (Google Gemini + LangChain).

## 🚀 Features

- **Resume Analysis**: Upload PDF resumes and get AI-powered skill extraction and analysis
- **Job Description Matching**: Compare resumes with job descriptions to get ATS scores and match percentages
- **Skill Gap Analysis**: Identify missing skills, strengths, and weaknesses
- **Learning Recommendations**: Get personalized project suggestions and learning resources
- **Career Roadmap**: Generate week-by-week learning roadmaps for target roles
- **User Authentication**: Secure JWT-based authentication system

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **Multer** for file uploads
- **pdf-parse** for PDF text extraction
- **bcrypt** for password hashing

### AI Service
- **Python** + **FastAPI**
- **LangChain** for AI orchestration
- **Google Gemini** (gemini-pro model)
- **pypdf** for PDF processing

## 📁 Project Structure

```
ai-placement-mentor/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Mongoose models
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth middleware
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── uploads/            # PDF file storage
│   ├── package.json
│   └── .env.example
│
├── ai-service/             # Python FastAPI AI Service
│   ├── services/           # AI processing logic
│   │   ├── resume_analyzer.py
│   │   ├── jd_matcher.py
│   │   └── roadmap_generator.py
│   ├── prompts/            # LLM prompt templates
│   ├── app.py              # FastAPI app
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/               # React + Vite Frontend
    ├── src/
    │   ├── api/           # API client modules
    │   ├── components/    # Reusable components
    │   ├── context/       # Auth context
    │   ├── pages/         # Page components
    │   ├── App.tsx        # Main app component
    │   └── main.tsx       # Entry point
    ├── package.json
    └── vite.config.ts
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.9 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API Key

### 1. Clone the Repository
```bash
cd C:\MyProject\AImentor\ai-placement-mentor
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env and add:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/ai-placement-mentor
# JWT_SECRET=your_secure_jwt_secret_key
# AI_SERVICE_URL=http://localhost:8000
# NODE_ENV=development

# Start the server
npm run dev
```

### 3. AI Service Setup

```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env and add:
# GOOGLE_API_KEY=your_google_gemini_api_key
# PORT=8000

# Start the service
python app.py
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:8000

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resume
- `POST /api/resume/upload` - Upload PDF resume
- `POST /api/resume/analyze/:resumeId` - Analyze resume with AI
- `GET /api/resume` - Get user's resumes

### Job Descriptions
- `POST /api/jd` - Create job profile
- `GET /api/jd` - Get user's job profiles

### Analysis
- `POST /api/analysis/compare` - Compare resume with JD
- `GET /api/analysis` - Get user's analyses

### Roadmap
- `POST /api/roadmap/generate` - Generate learning roadmap

### AI Service Endpoints
- `POST /ai/analyze-resume` - Analyze resume text
- `POST /ai/compare-resume-jd` - Compare resume with job description
- `POST /ai/generate-roadmap` - Generate learning roadmap

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-placement-mentor
JWT_SECRET=your_jwt_secret_key
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

### AI Service (.env)
```
GOOGLE_API_KEY=your_google_gemini_api_key
PORT=8000
```

## 🎯 Usage Flow

1. **Register/Login**: Create an account or login
2. **Upload Resume**: Go to Resume Analysis and upload your PDF resume
3. **Analyze Resume**: Click "Analyze with AI" to extract skills and projects
4. **Add Job Descriptions**: Add target job descriptions in JD Match page
5. **Compare**: Select resume and JD to get match scores and recommendations
6. **Generate Roadmap**: Create a personalized learning roadmap for your target role

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📦 Production Build

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm start
```

## 🚀 Deployment

### Backend & AI Service
- Deploy to services like Heroku, AWS, or DigitalOcean
- Ensure MongoDB is accessible (use MongoDB Atlas for cloud)
- Set environment variables in deployment platform

### Frontend
- Deploy to Vercel, Netlify, or similar
- Update API base URL in `axiosInstance.ts`

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding input validation
- Implementing rate limiting
- Adding comprehensive error handling
- Implementing file size limits
- Adding unit and integration tests
- Implementing logging and monitoring

## 📄 License

ISC

## 👨‍💻 Author

Created as a full-stack AI-powered placement mentor application.

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- LangChain for AI orchestration
- MongoDB for database
- React and Vite teams for frontend tooling
