# Slack AI Bot with Redmine Integration

Slack bot tích hợp AI với khả năng tìm kiếm Google, điều khiển đèn thông minh, và tạo task trong Redmine.

## 🚀 Features

- ✅ **AI-Powered Responses**: Trả lời thông minh dựa trên context của thread
- ✅ **Google Search**: Tìm kiếm thông tin real-time
- ✅ **Smart Light Control**: Điều khiển đèn thông minh (mock)
- ✅ **Redmine Integration**: Tạo task/issue trong Redmine project management
- ✅ **Vietnamese Support**: Hỗ trợ tiếng Việt với timezone Việt Nam
- ✅ **Thread-Aware**: Hiểu context của toàn bộ conversation

## 📋 Prerequisites

- Node.js 18+
- Vercel account
- Slack workspace với bot token
- AI API key (cliproxyapi)
- Redmine instance với API access

## 🔧 Environment Variables

Tạo file `.env` hoặc config trên Vercel:

```bash
# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token

# AI Configuration
AI_API_KEY=your-ai-api-key
AI_MODEL=gemini-3-flash-preview  # Optional, default value

# Redmine Configuration (Optional - for task creation)
REDMINE_URL=https://your-redmine.com
REDMINE_API_KEY=your-redmine-api-key
REDMINE_DEFAULT_PROJECT_ID=1
```

### Lấy Slack Bot Token:

1. Tạo Slack App tại https://api.slack.com/apps
2. Add Bot Token Scopes:
   - `app_mentions:read`
   - `chat:write`
   - `channels:history`
3. Install app vào workspace
4. Copy Bot User OAuth Token

### Lấy Redmine API Key:

1. Đăng nhập Redmine
2. Vào **My account** → **API access key**
3. Click **Show** hoặc **Reset** để lấy key
4. Lấy Project ID từ URL project (ví dụ: `/projects/123`)

## 📦 Installation

```bash
# Clone repository
git clone <repo-url>
cd slack-bot

# Install dependencies
npm install

# Run locally
npm run dev
```

## 🚀 Deployment

### Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add SLACK_BOT_TOKEN
vercel env add AI_API_KEY
vercel env add REDMINE_URL
vercel env add REDMINE_API_KEY
vercel env add REDMINE_DEFAULT_PROJECT_ID

# Deploy to production
vercel --prod
```

### Configure Slack Event Subscriptions:

1. Vào Slack App settings → **Event Subscriptions**
2. Enable Events
3. Request URL: `https://your-vercel-app.vercel.app/api/slack`
4. Subscribe to bot events:
   - `app_mention`
5. Save changes

## 💡 Usage

### Basic Chat:

```
@YourBot Xin chào!
@YourBot Thời tiết hôm nay thế nào?
```

### Google Search:

```
@YourBot Tìm kiếm tin tức AI mới nhất
@YourBot Giá Bitcoin hiện tại
```

### Smart Light Control:

```
@YourBot Bật đèn
@YourBot Bật đèn với độ sáng 50%
@YourBot Tắt đèn
```

### Redmine Task Creation:

```
@YourBot Tạo task: Fix bug login
@YourBot Tạo task urgent: Optimize database performance
@YourBot Tạo feature: Add dark mode support với mô tả là cần implement dark theme cho toàn bộ app
```

**AI tự động parse:**
- **Priority**: urgent/khẩn cấp (Urgent), high/cao (High), normal/bình thường (Normal), low/thấp (Low)
- **Tracker**: bug/lỗi (Bug), feature/tính năng (Feature), support/hỗ trợ (Support)
- **Subject**: Trích xuất từ câu lệnh
- **Description**: Lấy từ context hoặc mô tả chi tiết

## 🏗️ Architecture

```
slack-bot/
├── api/
│   └── slack.js          # Main serverless function (entry point)
├── lib/
│   ├── ai.js             # AI service & tool execution orchestration
│   ├── aiTools.js        # AI tools configuration & system prompt
│   ├── redmine.js        # Redmine integration module
│   ├── slack.js          # Slack helper functions
│   └── smartLight.js     # Smart light control module
├── package.json
├── .env.example          # Environment variables template
└── README.md
```

### Tech Stack:

- **Platform**: Vercel (Serverless)
- **Runtime**: Node.js (ES Modules)
- **Slack SDK**: @slack/web-api
- **AI API**: Custom endpoint with Google Search
- **Redmine API**: REST API v3+

### Code Organization:

- **High cohesion, low coupling**: Each module has a single responsibility
- **Immutable patterns**: No mutations, always create new objects
- **Small files**: Each file < 200 lines for maintainability
- **Clear separation**: API layer → Service layer → Integration modules

## 🔍 Function Calling

Bot hỗ trợ 3 function calls:

### 1. Google Search
```javascript
{
  google_search: {}
}
```

### 2. Control Light
```javascript
{
  name: 'controlLight',
  parameters: {
    action: 'on' | 'off',
    brightness: 0-100  // optional
  }
}
```

### 3. Create Redmine Issue
```javascript
{
  name: 'createRedmineIssue',
  parameters: {
    subject: string,           // required
    description: string,       // optional
    priority_id: 3-7,         // optional, default: 4 (Normal)
    tracker_id: 1-3,          // optional, default: 2 (Feature)
    estimated_hours: number   // optional
  }
}
```

## 🐛 Troubleshooting

### Bot không phản hồi:

1. Check Vercel logs: `vercel logs`
2. Verify environment variables
3. Check Slack Event Subscriptions URL
4. Verify bot có quyền `app_mentions:read` và `chat:write`

### Redmine integration không hoạt động:

1. Verify `REDMINE_URL` không có trailing slash
2. Check `REDMINE_API_KEY` còn valid
3. Verify `REDMINE_DEFAULT_PROJECT_ID` tồn tại
4. Check Redmine API enabled: **Administration** → **Settings** → **API** → Enable REST API

### Logs:

```bash
# View real-time logs
vercel logs --follow

# View specific deployment logs
vercel logs [deployment-url]
```

## 📝 Development

### Local Development:

```bash
# Start Vercel dev server
npm run dev

# Expose local server (for Slack webhooks)
ngrok http 3000

# Update Slack Event Subscriptions URL to ngrok URL
```

### Add New Function Calling:

1. **Create new module** in `lib/` (e.g., `lib/weather.js`)
   ```javascript
   export async function executeGetWeather(args) {
     // Implementation
     return { success: true, data: {...} };
   }
   ```

2. **Add tool definition** in `lib/aiTools.js`
   ```javascript
   {
     type: 'function',
     function: {
       name: 'getWeather',
       description: 'Get weather information',
       parameters: { ... }
     }
   }
   ```

3. **Import and register** in `lib/ai.js`
   ```javascript
   import { executeGetWeather } from './weather.js';

   // Add to executeToolCall switch
   case 'getWeather':
     return await executeGetWeather(args);
   ```

4. **Update system prompt** in `lib/aiTools.js` to mention new capability

## 🔐 Security

- ✅ API keys stored in environment variables
- ✅ Duplicate event detection
- ✅ Slack signature verification (recommended to add)
- ✅ Rate limiting (handled by Vercel)

## 📄 License

MIT

## 🤝 Contributing

Pull requests are welcome!

## 📞 Support

For issues, please create a GitHub issue or contact the maintainer.
