# Slack AI Bot with Redmine Integration

Slack bot tích hợp AI với khả năng tìm kiếm Google và quản lý Redmine tasks qua MCP server.

## 🚀 Features

- ✅ **AI-Powered Responses**: Trả lời thông minh dựa trên context của thread
- ✅ **Google Search**: Tìm kiếm thông tin real-time
- ✅ **Redmine Integration**: Quản lý tasks, log time, update status qua MCP server
- ✅ **Vietnamese Support**: Hỗ trợ tiếng Việt với timezone Việt Nam
- ✅ **Thread-Aware**: Hiểu context của toàn bộ conversation

## 📋 Prerequisites

- Node.js 18+
- Vercel account
- Slack workspace với bot token
- AI API key (cliproxyapi)
- MCP server deployment (Redmine)

## 🔧 Environment Variables

Tạo file `.env` hoặc config trên Vercel:

```bash
# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token

# AI Configuration
AI_API_KEY=your-ai-api-key
AI_MODEL=gemini-3-flash-preview  # Optional, default value

# Redmine Configuration (Passed to MCP server via URL params)
REDMINE_URL=https://your-redmine.com
REDMINE_API_KEY=your-redmine-api-key
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

### Redmine Management:

```
@YourBot xem task của tôi
@YourBot xem task #225061
@YourBot log 4 giờ vào task #225061 với mô tả là "Hoàn thành API integration"
@YourBot chuyển task #225061 sang In Progress
@YourBot task #225061 đã xong 80%
@YourBot thêm comment vào task #225061: đã xong phần frontend
@YourBot xem giờ đã log hôm nay
```

**MCP Tools (8 tools):**
- `listMyRedmineTasks` - Xem danh sách tasks được assign
- `getRedmineIssueDetails` - Xem chi tiết issue
- `logRedmineTime` - Log thời gian làm việc
- `updateRedmineIssueStatus` - Đổi status
- `updateRedmineProgress` - Cập nhật % hoàn thành
- `addRedmineNote` - Thêm comment
- `getTodayRedmineLogs` - Xem time logs hôm nay
- `getRedmineLogsRange` - Xem time logs theo khoảng thời gian

## 🏗️ Architecture

```
slack-bot/
├── api/
│   └── slack.js          # Main serverless function (entry point)
├── lib/
│   ├── ai.js             # AI service & tool execution orchestration
│   ├── aiTools.js        # AI tools configuration & system prompt
│   ├── mcpManager.js     # MCP multi-server manager
│   ├── mcpClient.js      # MCP client wrapper
│   └── slack.js          # Slack helper functions
├── mcp-config.json       # MCP servers configuration
├── package.json
├── .env.example          # Environment variables template
└── README.md
```

### Tech Stack:

- **Platform**: Vercel (Serverless)
- **Runtime**: Node.js (ES Modules)
- **Slack SDK**: @slack/web-api
- **AI API**: Custom endpoint with Google Search
- **Redmine Integration**: MCP Protocol (Model Context Protocol)

### Code Organization:

- **High cohesion, low coupling**: Each module has a single responsibility
- **Immutable patterns**: No mutations, always create new objects
- **Small files**: Each file < 200 lines for maintainability
- **Clear separation**: API layer → Service layer → Integration modules

## 🔍 MCP Function Calling

Bot hỗ trợ 9 function calls (1 Google Search + 8 Redmine MCP Tools):

### 1. Google Search
```javascript
{
  google_search: {}
}
```

### 2-9. Redmine MCP Tools

**List My Tasks:**
```javascript
{
  name: 'listMyRedmineTasks',
  parameters: {}
}
```

**Get Issue Details:**
```javascript
{
  name: 'getRedmineIssueDetails',
  parameters: {
    issue_id: number  // required
  }
}
```

**Log Time:**
```javascript
{
  name: 'logRedmineTime',
  parameters: {
    issue_id: number,     // required
    hours: number,        // required
    comments: string      // optional
  }
}
```

**Update Status:**
```javascript
{
  name: 'updateRedmineIssueStatus',
  parameters: {
    issue_id: number,  // required
    status: string     // required: "Open", "In Progress", "Completed", etc.
  }
}
```

**Update Progress:**
```javascript
{
  name: 'updateRedmineProgress',
  parameters: {
    issue_id: number,  // required
    progress: number   // required: 0-100
  }
}
```

**Add Note:**
```javascript
{
  name: 'addRedmineNote',
  parameters: {
    issue_id: number,  // required
    note: string       // required
  }
}
```

**Get Today Logs:**
```javascript
{
  name: 'getTodayRedmineLogs',
  parameters: {}
}
```

**Get Logs Range:**
```javascript
{
  name: 'getRedmineLogsRange',
  parameters: {
    start_date: string,  // required: YYYY-MM-DD
    end_date: string     // required: YYYY-MM-DD
  }
}
```

## 🐛 Troubleshooting

### Bot không phản hồi:

1. Check Vercel logs: `vercel logs`
2. Verify environment variables
3. Check Slack Event Subscriptions URL
4. Verify bot có quyền `app_mentions:read` và `chat:write`

### Redmine MCP integration không hoạt động:

1. Verify `REDMINE_URL` không có trailing slash
2. Check `REDMINE_API_KEY` còn valid
3. Check MCP server deployment: https://redmine-mcp-server.vercel.app/api/mcp
4. Verify `mcp-config.json` đã config đúng

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

### Add New MCP Server:

1. **Update `mcp-config.json`** - Thêm server mới
   ```json
   {
     "mcpServers": {
       "redmine": { ... },
       "gitlab": {
         "url": "https://gitlab-mcp-server.com/api/mcp",
         "params": {
           "gitlab_url": "${GITLAB_URL}",
           "token": "${GITLAB_TOKEN}"
         }
       }
     }
   }
   ```

2. **Add environment variables** - Set credentials
   ```bash
   vercel env add GITLAB_URL
   vercel env add GITLAB_TOKEN
   ```

3. **Deploy** - MCP manager sẽ tự động discover tools từ server mới

### Add New Function (non-MCP):

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
