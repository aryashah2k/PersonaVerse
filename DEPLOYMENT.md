# Deployment Guide - Railway

This guide will help you deploy PersonaVerse to Railway using Docker.

## Prerequisites

1. **Docker Desktop** installed and running
2. **Docker Hub account** (free at https://hub.docker.com)
3. **Railway account** (free at https://railway.app)
4. **Git** installed

## Step 1: Build and Push Docker Image

### 1.1 Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password.

### 1.2 Build the Docker Image

```bash
docker build -t your-dockerhub-username/personaverse:latest .
```

Replace `your-dockerhub-username` with your actual Docker Hub username.

### 1.3 Test Locally (Optional)

```bash
docker run -p 8080:8080 your-dockerhub-username/personaverse:latest
```

Visit http://localhost:8080 to test.

### 1.4 Push to Docker Hub

```bash
docker push your-dockerhub-username/personaverse:latest
```

## Step 2: Deploy to Railway

### 2.1 Create New Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from Docker Image"
4. Enter your image: `your-dockerhub-username/personaverse:latest`

### 2.2 Configure Environment Variables

In Railway dashboard, go to your project → Variables tab and add:

**Required:**
- `SECRET_KEY` = `your-secure-random-key-here-change-this-12345`

**Optional (if you want to pre-configure API keys):**
- `OPENAI_API_KEY` = `your-openai-key`
- `ANTHROPIC_API_KEY` = `your-anthropic-key`
- `GROQ_API_KEY` = `your-groq-key`

**Note:** Users can also configure API keys through the Settings UI after deployment.

### 2.3 Configure Port

Railway automatically detects the PORT environment variable. No additional configuration needed.

### 2.4 Deploy

1. Click "Deploy"
2. Wait for deployment to complete (2-3 minutes)
3. Railway will provide a public URL (e.g., `personaverse.up.railway.app`)

## Step 3: Post-Deployment Setup

### 3.1 Create First User

1. Visit your Railway URL
2. Click "Register"
3. Create your admin account

### 3.2 Configure API Keys

1. Login to your account
2. Click Settings (gear icon in sidebar)
3. Select your LLM provider (OpenAI, Anthropic, or Groq)
4. Paste your API key
5. Save

## Step 4: Update Deployment (Future Changes)

When you make code changes:

```bash
# 1. Rebuild image
docker build -t your-dockerhub-username/personaverse:latest .

# 2. Push to Docker Hub
docker push your-dockerhub-username/personaverse:latest

# 3. In Railway dashboard, click "Redeploy" or trigger a new deployment
```

## Alternative: Deploy Directly from GitHub

Instead of Docker Hub, you can deploy directly from GitHub:

1. Push your code to GitHub
2. In Railway, select "Deploy from GitHub repo"
3. Connect your repository
4. Railway will automatically detect the Dockerfile and build

## Troubleshooting

### Port Issues
- Railway automatically sets the `PORT` environment variable
- The app is configured to use `PORT` from environment or default to 8080

### Data Persistence
- User data (`Data/users.json`) is stored in the container
- For production, consider using Railway's Volume feature or external database
- To add a volume in Railway:
  1. Go to your service
  2. Click "Volumes"
  3. Add volume mounted to `/app/Data`

### API Keys
- Never commit `Config/config.json` with API keys to Git
- Use Railway environment variables or the Settings UI
- The `.gitignore` file is configured to exclude sensitive files

### Memory Issues
- If you encounter memory errors, upgrade your Railway plan
- Default free tier has 512MB RAM
- Recommended: 1GB+ for processing large surveys

## Security Recommendations

1. **Change SECRET_KEY**: Use a strong, random secret key in production
2. **API Keys**: Store in Railway environment variables, not in code
3. **HTTPS**: Railway provides automatic HTTPS
4. **Rate Limiting**: Already implemented for API calls
5. **User Authentication**: Already implemented with Flask-Login

## Monitoring

Railway provides:
- **Logs**: View real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: History of all deployments

## Costs

**Railway Free Tier:**
- $5 free credits per month
- 512MB RAM, 1GB Disk
- Shared CPU
- Good for testing and light usage

**Paid Plans:**
- Start at $5/month
- More resources and better performance
- Recommended for production use

## Support

For issues:
1. Check Railway logs for errors
2. Verify environment variables are set
3. Ensure Docker image built successfully
4. Check API key validity in Settings

## Quick Commands Reference

```bash
# Build image
docker build -t username/personaverse:latest .

# Test locally
docker run -p 8080:8080 username/personaverse:latest

# Push to Docker Hub
docker push username/personaverse:latest

# View running containers
docker ps

# Stop container
docker stop <container-id>

# View logs
docker logs <container-id>
```

---

**Your app is now live and accessible worldwide! 🚀**
