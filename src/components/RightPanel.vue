<template>
  <div class="right-panel">
    <!-- 账户摘要 -->
    <div class="panel-section">
      <div class="panel-title">账户摘要</div>
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-item-label">可用 USDT</div>
          <div class="summary-item-value">{{ summary.availableUSDT }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-item-label">冻结中</div>
          <div class="summary-item-value">{{ summary.frozen }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-item-label">今日交易</div>
          <div class="summary-item-value">{{ summary.todayTrades }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-item-label">盈亏</div>
          <div class="summary-item-value text-green">{{ summary.profitLoss }}</div>
        </div>
      </div>
    </div>

    <!-- 会话记忆 -->
    <div class="panel-section" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
      <div class="panel-title">会话记忆</div>
      <div class="history-list">
        <div class="history-item" v-for="(item, idx) in history" :key="idx">
          <div class="history-icon">{{ item.icon }}</div>
          <div class="history-info">
            <div class="history-action">{{ item.action }}</div>
            <div class="history-time">{{ item.time }}</div>
          </div>
          <div class="history-status" :class="item.statusClass">{{ item.status }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  summary: { type: Object, required: true },
  history: { type: Array, default: () => [] }
})
</script>

<style scoped>
.right-panel {
  width: 280px;
  background: #1a1f2e;
  border-left: 1px solid #2a2e39;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-section {
  padding: 16px;
  border-bottom: 1px solid #2a2e39;
}

.panel-title {
  color: #787b86;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 12px;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.summary-item {
  background: #131722;
  padding: 10px;
  border-radius: 8px;
}

.summary-item-label {
  color: #787b86;
  font-size: 10px;
  margin-bottom: 4px;
}

.summary-item-value {
  color: #d4af37;
  font-size: 14px;
  font-weight: 700;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 16px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #2a2e39;
}

.history-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #252a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #d4af37;
  font-weight: 700;
}

.history-info {
  flex: 1;
}

.history-action {
  color: #d1d4dc;
  font-size: 12px;
}

.history-time {
  color: #787b86;
  font-size: 10px;
}

.history-status {
  font-size: 10px;
  font-weight: 600;
}

.history-status.success {
  color: #0ecb81;
}

.history-status.pending {
  color: #f0c850;
}

.history-status.cancelled {
  color: #f6465d;
}
</style>
