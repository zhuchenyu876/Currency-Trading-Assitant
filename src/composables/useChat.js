import { ref, nextTick } from 'vue'
import { TRADING_PAIRS } from './tradingData.js'

export function useChat() {
  const messages = ref([])
  const isTyping = ref(false)
  const countdown = ref(10)
  let countdownTimer = null

  // ----------------------------------------
  //  兜底策略回复
  // ----------------------------------------
  const fallbackResponse = {
    html: `<p>抱歉，我无法理解您的请求。</p>
           <p style="margin-top: 6px;">请尝试以下指令：</p>
           <div class="intents-list">
             <li><strong>hello</strong> - 开始对话</li>
             <li><strong>buy [数量] [货币] with [计价货币]</strong> - 买入</li>
             <li><strong>sell [数量] [货币]</strong> - 卖出</li>
             <li><strong>查询报价</strong> - 获取实时价格</li>
             <li><strong>交易对</strong> - 查看支持列表</li>
           </div>
           <p style="margin-top: 10px; color: #787b86; font-size: 12px;">如需协商价格，请 @群管理员</p>`
  }

  // ----------------------------------------
  //  欢迎消息
  // ----------------------------------------
  const welcomeResponse = {
    html: `<div class="greeting">您好！</div>
            <p>请提供以下信息：</p>
            <ol style="margin-top: 6px; padding-left: 18px;">
              <li><strong>交易对</strong>：如 BTC/USD、USDT/USD</li>
              <li><strong>方向</strong>：买入或卖出</li>
              <li><strong>数量</strong>：您要交易多少？</li>
            </ol>`
  }

  // ----------------------------------------
  //  意图解析与回复
  // ----------------------------------------
  const parseAndReply = async (text, selectedPair, onConfirm, onReject) => {
    const lower = text.toLowerCase().trim()

    // hello / hi / 你好
    if (/^(hello|hi|你好|您好)$/.test(lower)) {
      return welcomeResponse
    }

    // 买入
    if (lower.includes('buy') || lower.includes('买入')) {
      const match = lower.match(/buy\s+([\d.]+)\s*(\w+)\s*(?:with\s+(\w+))?/)
      if (match) {
        const amount = match[1]
        const base = match[2].toUpperCase()
        const quote = match[3] ? match[3].toUpperCase() : 'USD'
        const pair = `${base}/${quote}`
        const price = selectedPair?.value?.price ?? getPriceForPair(pair)
        const numericPrice = parseFloat(price.replace(/,/g, ''))
        const total = (parseFloat(amount) * numericPrice).toFixed(2)

        return {
          html: `<p>好的，我为您准备了 <strong>买入 ${amount} ${base}</strong> 的报价。</p>
                 <p style="color: #787b86; font-size: 12px; margin-top: 6px;">请确认以下信息并点击确认交易。</p>`,
          quote: {
            pair,
            direction: '买入',
            amount: `${amount} ${base}`,
            price: `$${price}`,
            total: `$${parseFloat(total).toLocaleString()}`
          }
        }
      }
      return {
        html: `<p>请提供完整的买入指令，例如：</p>
               <div class="intents-list">
                 <li>buy 0.001 btc with usd</li>
                 <li>buy 100 usdt with sgd</li>
               </div>
               <p style="margin-top: 10px; color: #787b86; font-size: 12px;">格式：买入 [数量] [基础货币] with [计价货币]</p>`
      }
    }

    // 卖出
    if (lower.includes('sell') || lower.includes('卖出')) {
      return {
        html: `<p>好的，我为您准备了 <strong>卖出</strong> 报价。</p>
               <p style="color: #787b86; font-size: 12px;">请提供数量，我为您生成详细报价。</p>`
      }
    }

    // 查询报价
    if (lower.includes('报价') || lower.includes('quote') || lower.includes('price')) {
      if (selectedPair?.value) {
        const ask = (parseFloat(selectedPair.value.price.replace(/,/g, '')) * 1.0002).toFixed(4)
        return {
          html: `<p>以下是 <strong>${selectedPair.value.symbol}</strong> 当前报价：</p>
                 <div class="quote-inline-grid">
                   <div class="quote-inline-item">
                     <div class="quote-inline-label">买入价 (Bid)</div>
                     <div class="quote-inline-value">${selectedPair.value.price}</div>
                   </div>
                   <div class="quote-inline-item">
                     <div class="quote-inline-label">卖出价 (Ask)</div>
                     <div class="quote-inline-value text-green">${ask}</div>
                   </div>
                 </div>`
        }
      }
      return {
        html: `<p>请问您要查询哪个交易对的报价？</p>
               <p style="color: #787b86; font-size: 12px;">您可以在左侧选择交易对，或告诉我如 <strong>BTC/USD</strong>、<strong>USDT/SGD</strong> 等。</p>`
      }
    }

    // 交易对列表
    if (lower.includes('交易对') || lower.includes('pairs')) {
      const pairList = TRADING_PAIRS.map(p => `<li><strong>${p.symbol}</strong> - ${p.name}</li>`).join('')
      return {
        html: `<p>以下是支持的交易对：</p>
               <ul class="intents-list" style="list-style: none; padding: 0;">${pairList}</ul>
               <p style="margin-top: 10px; color: #787b86; font-size: 12px;">您可以直接说：买入 0.001 BTC with USD</p>`
      }
    }

    return fallbackResponse
  }

  // ----------------------------------------
  //  辅助：获取交易对价格
  // ----------------------------------------
  const getPriceForPair = (pair) => {
    const found = TRADING_PAIRS.find(p => p.symbol === pair)
    return found?.price ?? '1.0000'
  }

  // ----------------------------------------
  //  发送消息主流程
  // ----------------------------------------
  const sendMessage = async (text, selectedPair, onConfirm, onReject) => {
    if (!text.trim()) return

    messages.value.push({ role: 'user', html: null, text, quote: null })
    isTyping.value = true
    await scrollToBottom()

    await new Promise(r => setTimeout(r, 1000))
    isTyping.value = false

    const response = await parseAndReply(text, selectedPair, onConfirm, onReject)
    messages.value.push({ role: 'agent', ...response })
    await scrollToBottom()

    if (response.quote) {
      startCountdown(onReject)
    }
  }

  // ----------------------------------------
  //  滚动到底部
  // ----------------------------------------
  const scrollToBottom = async () => {
    await nextTick()
  }

  // ----------------------------------------
  //  倒计时
  // ----------------------------------------
  const startCountdown = (onExpire) => {
    countdown.value = 10
    clearInterval(countdownTimer)
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer)
        if (onExpire) onExpire()
      }
    }, 1000)
  }

  // ----------------------------------------
  //  确认交易
  // ----------------------------------------
  const confirmTrade = (msg) => {
    clearInterval(countdownTimer)
    messages.value.push({
      role: 'agent',
      html: `<p style="color: #0ecb81; font-weight: 600;">交易确认成功！</p>
             <p>您的 <strong>${msg.quote.direction} ${msg.quote.amount}</strong> 订单已提交。</p>
             <p style="color: #787b86; font-size: 12px; margin-top: 6px;">订单ID: TXN-${Date.now().toString().slice(-8)}</p>`
    })
  }

  // ----------------------------------------
  //  取消交易
  // ----------------------------------------
  const cancelTrade = () => {
    clearInterval(countdownTimer)
    messages.value.push({
      role: 'agent',
      html: `<p>好的，交易已取消。</p>
             <p style="color: #787b86; font-size: 12px;">如需新报价，请重新输入。</p>`
    })
  }

  return {
    messages,
    isTyping,
    countdown,
    sendMessage,
    confirmTrade,
    cancelTrade,
    scrollToBottom,
    getPriceForPair,
  }
}
