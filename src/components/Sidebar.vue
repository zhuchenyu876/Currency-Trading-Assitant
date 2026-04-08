<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo-area">
        <div class="logo-icon">C</div>
        <span class="logo-text">CRYPTO AGENT</span>
      </div>
      <div class="nav-tabs">
        <div class="nav-tab active">交易</div>
        <div class="nav-tab">历史</div>
        <div class="nav-tab">设置</div>
      </div>
    </div>

    <TradingPairList
      :pairs="pairs"
      :selectedSymbol="selectedPair?.symbol ?? null"
      @select="selectPair"
    />
  </div>
</template>

<script setup>
import TradingPairList from './TradingPairList.vue'

defineProps({
  pairs: { type: Array, required: true },
  selectedPair: { type: Object, default: null }
})
const emit = defineEmits(['select'])

const selectPair = (pair) => {
  emit('select', pair)
}
</script>

<style scoped>
.sidebar {
  width: 300px;
  background: #1a1f2e;
  border-right: 1px solid #2a2e39;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 20px 16px 12px;
  border-bottom: 1px solid #2a2e39;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #d4af37 0%, #f0c850 50%, #d4af37 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #1a1f2e;
}

.logo-text {
  color: #d4af37;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.nav-tabs {
  display: flex;
  gap: 4px;
  background: #131722;
  border-radius: 10px;
  padding: 4px;
}

.nav-tab {
  flex: 1;
  padding: 6px;
  border-radius: 8px;
  color: #787b86;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
}

.nav-tab.active {
  background: #2a2e39;
  color: #d4af37;
}
</style>
