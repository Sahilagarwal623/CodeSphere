# Code Executor Microservice

A self-contained code execution service for CodeSphere that runs Python, JavaScript, Java, and C++ code securely.

## 🚀 Deployment on Render

### Step 1: Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Choose **"Deploy from a Git repository"** or **"Deploy an existing image from a registry"**

### Step 2: If deploying from Git

1. Connect your GitHub/GitLab repository
2. Set the **Root Directory** to `code-executor`
3. Set **Environment** to `Docker`
4. Render will automatically detect the Dockerfile

### Step 3: Configure Environment

| Setting | Value |
|---------|-------|
| Name | `codesphere-executor` |
| Region | Choose closest to your users |
| Instance Type | Starter ($7/mo) or higher recommended |
| Port | `3001` |

### Step 4: Deploy

Click **"Create Web Service"** and wait for the build to complete.

### Step 5: Get the Service URL

Once deployed, Render will give you a URL like:
```
https://codesphere-executor.onrender.com
```

### Step 6: Configure Main Backend

Add this environment variable to your main CodeSphere backend on Render:

```
CODE_EXECUTOR_URL=https://codesphere-executor.onrender.com
```

---

## 🧪 Local Development

### Run with Docker

```bash
cd code-executor
docker build -t code-executor .
docker run -p 3001:3001 code-executor
```

### Run without Docker (for testing)

Make sure you have Python3, Node.js, Java, and g++ installed locally.

```bash
cd code-executor
npm install
npm start
```

---

## 📡 API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-02-01T12:00:00.000Z"
}
```

### Execute Code
```
POST /execute
```

Request Body:
```json
{
  "code": "print('Hello World')",
  "language": "py",
  "input": "optional input"
}
```

Response:
```json
{
  "output": "Hello World\n",
  "error": null
}
```

### Get Supported Languages
```
GET /languages
```

Response:
```json
{
  "languages": ["py", "js", "java", "cpp"],
  "details": {
    "py": { "name": "Python 3", "extension": ".py" },
    "js": { "name": "JavaScript (Node.js)", "extension": ".js" },
    "java": { "name": "Java 17", "extension": ".java" },
    "cpp": { "name": "C++ (g++)", "extension": ".cpp" }
  }
}
```

---

## 🔒 Security Features

- **10 second timeout** for code execution
- **1MB output limit** to prevent memory issues
- **Isolated execution** in temporary directories
- **Automatic cleanup** of temporary files


## 📋 Supported Languages

| Language | Version | Extension |
|----------|---------|-----------|
| Python | 3.x | `.py` |
| JavaScript | Node.js 20.x | `.js` |
| Java | 17 | `.java` |
| C++ | g++ | `.cpp` |
