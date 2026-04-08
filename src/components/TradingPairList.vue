<template>
  <div class="trading-pair-list">
    <div class="section-label">支持交易对</div>
    <div class="pair-list">
      <div
        v-for="pair in pairs"
        :key="pair.symbol"
        class="pair-item"
        :class="{ selected: selectedSymbol === pair.symbol }"
        @click="$emit('select', pair)"
      >
        <div class="pair-left">
          <div class="pair-icon">{{ pair.icon }}</div>
          <div>
            <div class="pair-name">{{ pair.symbol }}</div>
            <div class="pair-sub">{{ pair.name }}</div>
          </div>
        </div>
        <div class="pair-price">
          <div class="pair-rate">{{ pair.price }}</div>
          <div class="pair-change up">{{ pair.change }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pairs: { type: Array, required: true },
  selectedSymbol: { type: String, default: null }
})
defineEmits(['select'])
</script>

<style scoped>
.trading-pair-list {
  height: 100%;
  overflow-y: auto;
  padding: 12px;
  flex: 1;
}

.section-label {
  color: #787b86;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 10px;
}

.pair-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pair-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
  background: transparent;
}

.pair-item:hover {
  background: #1e2330;
}

.pair-item.selected {
  background: #252a3a;
  border: 1px solid #d4af37;
}

.pair-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pair-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #2a2e39;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #d4af37;
}

.pair-name {
  color: #d1d4dc;
  font-size: 13px;
  font-weight: 600;
}

.pair-sub {
  color: #787b86;
  font-size: 11px;
}

.pair-price {
  text-align: right;
}

.pair-rate {
  color: #d1d4dc;
  font-size: 13px;
  font-weight: 600;
}

.pair-change {
  font-size: 11px;
}

.pair-change.up {
  color: #0ecb81;
}

.pair-change.down {
  color: #f6465d;
}
</style>
