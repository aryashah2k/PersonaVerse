@echo off
echo ================================================
echo PersonaVerse - Docker Deployment
echo ================================================
echo.

REM Get Docker Hub username
set /p DOCKER_USERNAME="Enter your Docker Hub username: "

echo.
echo Building Docker image...
docker build -t %DOCKER_USERNAME%/personaverse:latest .

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Docker build failed!
    pause
    exit /b 1
)

echo.
echo ================================================
echo Build successful!
echo ================================================
echo.
echo Would you like to:
echo 1. Test locally
echo 2. Push to Docker Hub
echo 3. Both
echo 4. Exit
echo.
set /p CHOICE="Enter choice (1-4): "

if "%CHOICE%"=="1" goto test
if "%CHOICE%"=="2" goto push
if "%CHOICE%"=="3" goto both
if "%CHOICE%"=="4" goto end

:test
echo.
echo Starting local test on http://localhost:8080
echo Press Ctrl+C to stop the container
echo.
docker run -p 8080:8080 %DOCKER_USERNAME%/personaverse:latest
goto end

:push
echo.
echo Logging in to Docker Hub...
docker login
echo.
echo Pushing image to Docker Hub...
docker push %DOCKER_USERNAME%/personaverse:latest
echo.
echo ================================================
echo Image pushed successfully!
echo ================================================
echo.
echo Next steps:
echo 1. Go to https://railway.app
echo 2. Create new project
echo 3. Deploy from Docker image: %DOCKER_USERNAME%/personaverse:latest
echo 4. Set environment variable: SECRET_KEY
echo 5. Deploy!
echo.
pause
goto end

:both
echo.
echo Starting local test on http://localhost:8080
echo.
start http://localhost:8080
docker run -p 8080:8080 %DOCKER_USERNAME%/personaverse:latest
echo.
echo Test completed. Now pushing to Docker Hub...
docker login
docker push %DOCKER_USERNAME%/personaverse:latest
echo.
echo ================================================
echo Deployment complete!
echo ================================================
echo.
pause
goto end

:end
echo.
echo Deployment script finished.
pause
