@echo off
SETLOCAL EnableDelayedExpansion

echo ===================================================
echo 🚀 Secure User CRUD API - Git ^& GitHub Setup
echo ===================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Error: 'git' is not installed or not in your system PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    pause
    exit /b 1
)

:: Initialize git repository
if not exist .git (
    echo 📂 [1/3] Initializing local Git repository...
    git init
    if !ERRORLEVEL! neq 0 (
        echo ❌ Failed to initialize local Git repository.
        pause
        exit /b !ERRORLEVEL!
    )
) else (
    echo 📂 [1/3] Git repository already initialized.
)

:: Add files and commit
echo 💾 [2/3] Adding files and creating initial commit...
git add .
git commit -m "feat: initial commit with secure user CRUD and middlewares"
if !ERRORLEVEL! neq 0 (
    :: It might fail if there's nothing to commit, check if that's the case
    echo ℹ️ Note: If there were no new changes, this step is skipped.
)

:: Push to GitHub options
echo.
echo 🌐 [3/3] GitHub Integration
echo ===================================================
echo Select an option to publish your repository:
echo 1. Connect to an existing GitHub repository URL (Manual)
echo 2. Create a NEW PUBLIC repository using GitHub CLI (gh)
echo 3. Create a NEW PRIVATE repository using GitHub CLI (gh)
echo 4. Skip for now (Manual upload later)
echo ===================================================
echo.

set /p opt="Choose an option (1-4): "

if "%opt%"=="1" (
    set /p repo_url="Enter your full GitHub repository URL (e.g., https://github.com/user/repo.git): "
    if not "!repo_url!"=="" (
        git branch -M main
        :: Remove existing origin if it exists
        git remote remove origin >nul 2>nul
        git remote add origin !repo_url!
        echo 📤 Pushing main branch to origin...
        git push -u origin main
        if !ERRORLEVEL! neq 0 (
            echo ❌ Push failed. Make sure your repository exists and is empty.
        ) else (
            echo 🎉 Successfully pushed to GitHub!
        )
    ) else (
        echo ❌ URL cannot be empty.
    )
) else if "%opt%"=="2" (
    where gh >nul 2>nul
    if !ERRORLEVEL! neq 0 (
        echo ❌ Error: GitHub CLI 'gh' is not installed or not authenticated.
        echo Please install it or use Option 1.
    ) else (
        set /p repo_name="Enter new repository name (e.g. secure-user-crud-api): "
        if not "!repo_name!"=="" (
            echo 🚀 Creating public repository and pushing...
            gh repo create !repo_name! --public --source=. --remote=origin --push
        ) else (
            echo ❌ Repository name cannot be empty.
        )
    )
) else if "%opt%"=="3" (
    where gh >nul 2>nul
    if !ERRORLEVEL! neq 0 (
        echo ❌ Error: GitHub CLI 'gh' is not installed or not authenticated.
        echo Please install it or use Option 1.
    ) else (
        set /p repo_name="Enter new repository name (e.g. secure-user-crud-api): "
        if not "!repo_name!"=="" (
            echo 🚀 Creating private repository and pushing...
            gh repo create !repo_name! --private --source=. --remote=origin --push
        ) else (
            echo ❌ Repository name cannot be empty.
        )
    )
) else (
    echo ℹ️ Setup completed locally. You can link your remote repository later.
)

echo.
echo ===================================================
echo 🎉 Setup Process Completed!
echo ===================================================
pause
