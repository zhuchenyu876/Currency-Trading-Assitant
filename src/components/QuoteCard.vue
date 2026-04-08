<template>
  <div class="quote-card">
    <div class="quote-card-header">
      <span class="quote-card-title">交易报价</span>
      <span class="quote-timer">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        {{ countdown }}s
      </span>
    </div>
    <div class="quote-detail-grid">
      <div class="quote-detail-item">
        <div class="quote-detail-label">交易对</div>
        <div class="quote-detail-value">{{ quote.pair }}</div>
      </div>
      <div class="quote-detail-item">
        <div class="quote-detail-label">方向</div>
        <div class="quote-detail-value text-green">{{ quote.direction }}</div>
      </div>
      <div class="quote-detail-item">
        <div class="quote-detail-label">数量</div>
        <div class="quote-detail-value">{{ quote.amount }}</div>
      </div>
      <div class="quote-detail-item">
        <div class="quote-detail-label">单价</div>
        <div class="quote-detail-value">{{ quote.price }}</div>
      </div>
      <div class="quote-detail-item" style="grid-column: span 2;">
        <div class="quote-detail-label">总价</div>
        <div class="quote-detail-value text-green" style="font-size: 18px;">{{ quote.total }}</div>
      </div>
    </div>
    <div class="quote-actions">
      <button class="quote-btn quote-btn-confirm" @click="$emit('confirm', quote)">确认交易</button>
      <button class="quote-btn quote-btn-reject" @click="$emit('reject')">取消</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  quote: { type: Object, required: true },
  countdown: { type: Number, required: true }
})
defineEmits(['confirm', 'reject'])
</script>

<style scoped>
.quote-card {
  background: #1a2432;
  border: 1px solid #2a3045;
  border-radius: 14px;
  padding: 16px;
  margin-top: 8px;
}

.quote-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.quote-card-title {
  color: #d4af37;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quote-timer {
  color: #f6465d;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

.quote-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.quote-detail-item {
  background: #111827;
  padding: 10px 12px;
  border-radius: 8px;
}

.quote-detail-label {
  color: #787b86;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.quote-detail-value {
  color: #d4af37;
  font-size: 15px;
  font-weight: 700;
}

.quote-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.quote-btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.quote-btn-confirm {
  background: #d4af37;
  color: #1a1f2e;
}

.quote-btn-confirm:hover {
  background: #f0c850;
}

.quote-btn-reject {
  background: #2a2e39;
  color: #d1d4dc;
}

.quote-btn-reject:hover {
  background: #3a3e49;
}

/* 内联报价网格（查询报价时使用） */
.quote-inline-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}

.quote-inline-item {
  background: #111827;
  padding: 10px 12px;
  border-radius: 8px;
}

.quote-inline-label {
  color: #787b86;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.quote-inline-value {
  color: #d4af37;
  font-size: 15px;
  font-weight: 700;
}
</style>
