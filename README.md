# PersonaVerse 🎭

**AI-Powered Survey Response Platform with Synthetic Personas**

|All the world's a stage, and all agents merely players|
|------------------------------------------------------|
|![coolguy](https://github.com/aryashah2k/PersonaVerse/blob/main/assets/cool_shakespeare.jpg)|

PersonaVerse automates survey response generation using AI agents with diverse synthetic personas. Upload your survey, generate or upload respondent profiles, and get comprehensive survey responses powered by state-of-the-art LLMs (OpenAI, Anthropic, Groq).

---

## ✨ Features

### 🔐 **Authentication & Credits System**
- Secure user authentication with Flask-Login
- Credit-based API usage (5 free credits to start)
- Password hashing with bcrypt

### 📊 **Survey Processing**
- **Upload surveys** in PDF or text format
- **Multimodal support** for surveys with images (OpenAI/Anthropic)
- **Automatic flow validation** and question parsing
- **Jump logic detection** for complex survey flows

### 👥 **Sample Space Generation**
- **Auto-generate** diverse respondent profiles using AI
- **Manual upload** of custom sample profiles
- **Editable dimensions** with scale and options-based attributes
- **Distribution control** for demographic realism

### 🤖 **AI-Powered Execution**
- **Multi-provider support**: OpenAI, Anthropic Claude, Groq
- **Reasoning field**: AI explains each answer based on persona
- **Rate limiting** to prevent API abuse
- **Cost estimation** (free for Groq, calculated for others)
- **Real-time progress** tracking

### 📥 **Results & Export**
- Download responses in **JSON** and **CSV** formats
- Export sample profiles
- Detailed execution logs

### 🎨 **Modern UI**
- Professional, responsive design
- Dark/light theme support
- Real-time credit display
- Interactive settings panel

---

## 🚀 Quick Start

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/PersonaVerse.git
cd PersonaVerse

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the application
python app.py

# 4. Open in browser
http://localhost:8080
```

### Docker Deployment

```bash
# Build and run with Docker
docker build -t personaverse .
docker run -p 8080:8080 personaverse
```

### Railway Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

---

## 🎯 How It Works

1. **Upload Survey** → Upload your survey document (PDF/TXT)
2. **Generate Personas** → Create diverse AI personas or upload custom profiles
3. **Execute Survey** → AI agents complete the survey based on their personas
4. **Download Results** → Get responses in JSON/CSV format

---

## 🔑 API Provider Setup

PersonaVerse supports three LLM providers:

| Provider | Cost | Multimodal | Speed |
|----------|------|------------|-------|
| **Groq** | Free | ❌ | ⚡⚡⚡ Fastest |
| **OpenAI** | Paid | ✅ | ⚡⚡ Fast |
| **Anthropic** | Paid | ✅ | ⚡ Standard |

**Configure in Settings:**
1. Click Settings (gear icon)
2. Select your provider
3. Paste API key
4. Save

Get API keys:
- [OpenAI](https://platform.openai.com/api-keys)
- [Anthropic](https://console.anthropic.com/settings/keys)
- [Groq](https://console.groq.com/keys)

---

## Project Structure

The project is organized into a modular structure to separate concerns, making it easier to maintain and extend.

```
PersonaVerse/
├── Config/                      # Configuration files and API pricing
├── Data/                        # User data and generated outputs
│   ├── Output/                  # Survey results (JSON, CSV)
│   ├── UserUpload/              # Uploaded survey files
│   └── users.json               # User database (auth & credits)
├── Module/                      # Core business logic
│   ├── PreprocessingModule/     # Survey parsing and validation
│   ├── SampleGenerationModule/  # Persona profile generation
│   └── ExecutionModule/         # Survey execution by AI agents
├── static/                      # Frontend assets
│   ├── css/                     # Professional UI styles
│   ├── js/                      # Interactive features
│   └── images/                  # UI images
├── templates/                   # HTML templates (Jinja2)
├── UtilityFunctions/            # Helper functions (LLM client, JSON processing)
├── auth_db.py                   # Authentication & credit management
├── app.py                       # Main Flask application
├── Dockerfile                   # Docker configuration
├── deploy.bat                   # Windows deployment script
└── requirements.txt             # Python dependencies
```

---

## 🛠️ Tech Stack

- **Backend**: Flask, Python 3.11+
- **Authentication**: Flask-Login, bcrypt
- **LLM Integration**: OpenAI, Anthropic, Groq SDKs
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Data Processing**: Pandas, NumPy
- **Deployment**: Docker, Railway

---

## 📖 Usage Guide

### 1. Register & Login
- Create an account (starts with 5 free credits)
- Each survey execution costs 1 credit

### 2. Upload Survey
- Supported formats: PDF, TXT
- PDF support requires OpenAI or Anthropic
- System validates survey flow automatically

### 3. Generate Sample Space
**Option A: Auto-Generate**
- Click "Generate Dimensions"
- AI creates demographic dimensions from survey
- Edit dimensions (age, education, etc.)
- Set sample size
- Generate personas

**Option B: Upload Profiles**
- Prepare CSV with sample profiles
- Upload file
- Set execution count

### 4. Execute Survey
- Review metrics (cost, agents, questions)
- Click "Start Execution"
- Monitor real-time progress
- Download results when complete

---

## 🔒 Security

- ✅ Password hashing with bcrypt
- ✅ Session management with Flask-Login
- ✅ API keys stored server-side only
- ✅ Rate limiting on API calls
- ✅ HTTPS on Railway deployment
- ✅ Environment variables for secrets

---

## 📊 Cost Estimation

| Provider | Model | Input (per 1M tokens) | Output (per 1M tokens) |
|----------|-------|----------------------|------------------------|
| **Groq** | llama-3.3-70b | FREE | FREE |
| **OpenAI** | gpt-4o-mini | $0.15 | $0.60 |
| **Anthropic** | claude-3-5-haiku | $0.80 | $4.00 |

*Groq offers free API access with rate limits*

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## References
For detailed research methodologies and implementations, refer to:
- [ACL 2023 Synthetic Data Generation](https://doi.org/10.18653/v1/2023.acl-long.608)
- [Scaling Synthetic Data with 1,000,000,000 Personas](https://arxiv.org/abs/2406.20094)



**PersonaVerse** - Transform surveys into insights with AI-powered synthetic personas 🎭
