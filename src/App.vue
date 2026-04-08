<template>
  <div id="app">
    <Sidebar
      :pairs="pairs"
      :selectedPair="selectedPair"
      @select="selectPair"
    />

    <div class="main-chat">
      <!-- 顶部栏 -->
      <div class="chat-header">
        <div class="header-left">
          <div v-if="selectedPair" class="header-pair-badge">
            <span class="header-pair-name">{{ selectedPair.symbol }}</span>
            <span class="header-pair-price">{{ selectedPair.price }}</span>
            <span class="header-pair-rate">{{ selectedPair.change }}</span>
          </div>
          <div v-else class="header-hint">请选择交易对</div>
        </div>
        <div class="header-status">
          <div class="status-dot"></div>
          <span>在线</span>
        </div>
      </div>

      <!-- 消息区域 -->
      <div class="chat-messages" ref="messagesContainer">
        <!-- 欢迎消息（空消息时显示） -->
        <ChatMessage
          v-if="messages.length === 0"
          role="agent"
          html='<div class="greeting">您好！我是加密货币交易助手</div>
                 <p>我可以帮您 <strong>查询报价</strong>、<strong>执行交易</strong> 和 <strong>协商价格</strong>。</p>
                 <p style="margin-top: 10px; color: #787b86;">请告诉我：</p>
                 <ol style="margin-top: 6px; padding-left: 18px;">
                   <li>您要交易哪个<strong>交易对</strong>？（如 BTC/USD、USDT/USD 等）</li>
                   <li>交易<strong>方向</strong>：买入还是卖出？</li>
                   <li>交易<strong>数量</strong>或<strong>金额</strong>？</li>
                 </ol>'
        />

        <!-- 历史消息 -->
        <ChatMessage
          v-for="(msg, idx) in messages"
          :key="idx"
          :role="msg.role"
          :html="msg.html"
          :text="msg.text"
          :quote="msg.quote"
          :countdown="countdown"
          @confirm="handleConfirm"
          @reject="handleReject"
        />

        <!-- 打字指示器 -->
        <div v-if="isTyping" class="message agent typing-message">
          <div class="message-avatar">C</div>
          <div class="message-bubble">
            <div class="typing-indicator">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input-area">
        <div class="input-wrapper">
          <input
            class="chat-input"
            v-model="inputText"
            @keyup.enter="handleSend"
            placeholder="输入您的消息，例如: buy 0.0001 btc with usd"
          />
          <div class="input-actions">
            <button class="input-btn" title="刷新报价">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
            </button>
            <button class="send-btn" @click="handleSend" title="发送">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <RightPanel :summary="accountSummary" :history="sessionMemory" />
  </div>
</template>

<script setup>
import { ref, nextTick, onUnmounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import RightPanel from './components/RightPanel.vue'
import ChatMessage from './components/ChatMessage.vue'
import { useChat } from './composables/useChat.js'
import { TRADING_PAIRS, ACCOUNT_SUMMARY } from './composables/tradingData.js'

const pairs = ref(TRADING_PAIRS)
const selectedPair = ref(null)
const inputText = ref('')
const messagesContainer = ref(null)

const accountSummary = ACCOUNT_SUMMARY

const sessionMemory = ref([
  { icon: 'B', action: '买入 0.001 BTC @ $67,234', time: '今天 14:32', status: '成功', statusClass: 'success' },
  { icon: 'B', action: '查询 BTC/USD 报价', time: '今天 14:28', status: '完成', statusClass: 'success' },
  { icon: 'S', action: '卖出 500 USDT @ 1.3521', time: '今天 11:15', status: '成功', statusClass: 'success' },
])

const { messages, isTyping, countdown, sendMessage, confirmTrade, cancelTrade } = useChat()

const selectPair = (pair) => {
  selectedPair.value = pair
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleSend = async () => {
  await sendMessage(inputText.value, selectedPair, confirmTrade, cancelTrade)
  inputText.value = ''
  await scrollToBottom()
}

const handleConfirm = (quote) => {
  confirmTrade({ quote })
  scrollToBottom()
}

const handleReject = () => {
  cancelTrade()
  scrollToBottom()
}

onUnmounted(() => {
  // useChat 内部会清理 countdownTimer
})
</script>

<style>
/* ============================================
   主布局
   ============================================ */
#app {
  height: 100vh;
  display: flex;
}

.main-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ============================================
   顶部栏
   ============================================ */
.chat-header {
  padding: 16px 24px;
  background: #1a1f2e;
  border-bottom: 1px solid #2a2e39;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-pair-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #252a3a;
  padding: 6px 12px;
  border-radius: 20px;
}

.header-pair-name {
  color: #d4af37;
  font-size: 13px;
  font-weight: 700;
}

.header-pair-price {
  color: #0ecb81;
  font-size: 13px;
  font-weight: 600;
}

.header-pair-rate {
  color: #0ecb81;
  font-size: 12px;
}

.header-hint {
  color: #787b86;
  font-size: 13px;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #0ecb81;
  font-size: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0ecb81;
  animation: pulse 2s infinite;
}

/* ============================================
   消息区域
   ============================================ */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.typing-message {
  display: flex;
  gap: 10px;
  max-width: 680px;
  align-self: flex-start;
}

.typing-message .message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  background: #252a3a;
  color: #d4af37;
  border: 1px solid #d4af37;
}

.typing-message .message-bubble {
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.6;
  color: #d1d4dc;
  background: #1e2330;
  border-bottom-left-radius: 4px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d4af37;
  animation: typingBounce 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) { animation-delay: 0s; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

/* ============================================
   输入区域
   ============================================ */
.chat-input-area {
  padding: 16px 24px 20px;
  background: #1a1f2e;
  border-top: 1px solid #2a2e39;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #131722;
  border: 1px solid #2a2e39;
  border-radius: 14px;
  padding: 8px 8px 8px 16px;
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: #d4af37;
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #d1d4dc;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
}

.chat-input::placeholder {
  color: #787b86;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: transparent;
  color: #787b86;
}

.input-btn:hover {
  background: #2a2e39;
  color: #d4af37;
}

.send-btn {
  background: #d4af37;
  color: #1a1f2e;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.send-btn:hover {
  background: #f0c850;
}
</style>
