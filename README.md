# AutomatchAI

An AI-powered application to match users with nearby dealers based on their product requirements.

## Docker Setup

### Prerequisites

- Docker and Docker Compose installed on your system
- API keys for external services (SERP API, Gemini API)

### Environment Setup

1. Copy the example environment file and update with your API keys:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your API keys:
   ```
   JWT_SECRET=your_jwt_secret_key_here
   SERP_API_KEY=your_serp_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running the Application Locally

1. Build and start all services:
   ```bash
   docker-compose up -d
   ```

2. Initialize the database (first time only):
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

### Stopping the Application

```bash
docker-compose down
```

### Viewing Logs

```bash
docker-compose logs -f
```

## GCP Deployment

### Prerequisites

- Google Cloud Platform account
- gcloud CLI installed and configured
- Docker installed locally

### Deployment Steps

1. Update the `deploy-to-gcp.sh` script with your GCP project ID and preferred region:
   ```bash
   # Configuration
   PROJECT_ID="your-gcp-project-id"  # Replace with your GCP project ID
   REGION="us-central1"  # Replace with your preferred region
   ```

2. Make sure your environment variables are set:
   ```bash
   export DATABASE_URL="your_database_url"
   export JWT_SECRET="your_jwt_secret"
   export GEMINI_API_KEY="your_gemini_api_key"
   export SERP_API_KEY="your_serp_api_key"
   ```

3. Run the deployment script:
   ```bash
   ./deploy-to-gcp.sh
   ```

4. The script will:
   - Build the combined Docker image
   - Push it to Google Container Registry
   - Deploy it to Cloud Run
   - Output the URL where your application is accessible

### Updating the Deployment

To update your application, make your changes and run the deployment script again.

### Monitoring and Logs

You can monitor your application and view logs in the Google Cloud Console:

1. Go to Cloud Run in the GCP Console
2. Select your service (automatch-ai)
3. Click on "Logs" to view application logs

## Development

### Backend

The backend is built with Express.js and TypeScript, using Prisma ORM for database operations.

### Frontend

The frontend is built with React and uses Tailwind CSS for styling.

## API Endpoints

### Authentication
- POST `/api/v1/auth/signup` - Register a new user
- POST `/api/v1/auth/signin` - Login a user
- GET `/api/v1/auth/me` - Get current user info

### AI/Chatbot
- POST `/api/v1/ai/start` - Start a new chat session
- POST `/api/v1/ai/reply` - Reply to an ongoing chat

### Dealer
- POST `/api/v1/dealer/find` - Find nearby dealers based on product and location

### Session
- GET `/api/v1/user/sessions` - Get all user sessions
- GET `/api/v1/user/messages/:sessionId` - Get messages for a specific session
