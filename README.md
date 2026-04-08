# Currency-Trading-Assistant

聊天买币助手 - 一款通过自然语言对话实现加密货币交易的 AI Agent，支持接入 WhatsApp 等聊天工具。

> **线上预览**: https://currency-trading-assistant.vercel.app

## 产品定位

- **目标用户**: 加密货币交易新手及懒人用户
- **产品类型**: ToB / ToC AI Agent 货币交易助手

## 核心功能

| 功能 | 说明 |
|------|------|
| **意图识别** | 支持买入、卖出、查询报价、重新报价、协商价格等自然语言指令 |
| **交易对支持** | 10 种主流交易对（USDT/USD、BTC/USD、USDC/SGD 等） |
| **报价卡片** | 实时显示交易对、方向、数量、单价、总价，含 10 秒有效期倒计时 |
| **会话记忆** | 保留上下文对话历史，支持多轮对话 |
| **兜底策略** | 无法识别的指令，引导用户使用可用指令 |
| **协商价格** | 如需特殊价格，可 @群管理员 |

## 技术架构

### Agent 设计 (Handsoff + Function Call)

```
┌──────────────────────────────────┐
│        用户消息输入               │
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│   意图识别 Agent（主Agent）        │
│   分析用户输入，分发到对应处理Agent│
└──────────────┬───────────────────┘
               ▼
    ┌─────────┼─────────┐
    ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐
│报价Agent│ │交易Agent│ │兜底Agent│
└───────┘ └───────┘ └───────┘
    │         │         │
    ▼         ▼         ▼
┌──────────────────────────────────┐
│      Function Calling            │
│  • getQuote()     获取最新报价    │
│  • validateUser() 验证客户信息    │
│  • executeTrade() 执行真实交易    │
└──────────────────────────────────┘
               │
               ▼
┌────────��─────────────────────────┐
│      后端交易 API / WebSocket    │
└──────────────────────────────────┘
```

### 前端技术栈

- **Vue 3** + Composition API
- **Vite 5** 构建工具
- 组件化架构（Sidebar / ChatMessage / QuoteCard / TradingPairList / RightPanel）
- Composable 逻辑抽离（useChat / tradingData）

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录

### 部署到 Vercel

Vercel 已配置完成，直接将项目推送到 GitHub，Vercel 会自动构建部署。

## 支持的对话指令

```
hello                          → 欢迎引导
buy 0.001 btc with usd         → 生成买入报价
sell 0.001 btc                 → 生成卖出报价
查询报价 / quote / price       → 获取实时价格
交易对 / pairs                 → 查看支持列表
（其他内容）                   → 兜底回复
```

## 项目结构

```
currency-trading-assistant/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── main.css           ← 全局样式
│   ├── components/
│   │   ├── ChatMessage.vue    ← 聊天消息气泡
│   │   ├── QuoteCard.vue      ← 交易报价卡片
│   │   ├── RightPanel.vue     ← 右侧账户/历史面板
│   │   ├── Sidebar.vue        ← 左侧边栏
│   │   └── TradingPairList.vue← 交易对列表
│   ├── composables/
│   │   ├── tradingData.js     ← 交易对数据
│   │   └── useChat.js         ← 聊天逻辑
│   ├── App.vue                ← 根组件
│   └── main.js               ← 入口文件
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── jsconfig.json
```

## License

MIT
