<template>
  <div class="chat-message" :class="role">
    <div class="message-avatar">{{ role === 'user' ? 'U' : 'C' }}</div>
    <div class="message-content">
      <div class="message-bubble" v-html="html || text"></div>
      <QuoteCard
        v-if="quote"
        :quote="quote"
        :countdown="countdown"
        @confirm="$emit('confirm', quote)"
        @reject="$emit('reject')"
      />
    </div>
  </div>
</template>

<script setup>
import QuoteCard from './QuoteCard.vue'

defineProps({
  role: { type: String, required: true },
  html: { type: String, default: '' },
  text: { type: String, default: '' },
  quote: { type: Object, default: null },
  countdown: { type: Number, default: 10 }
})
defineEmits(['confirm', 'reject'])
</script>

<style scoped>
.chat-message {
  display: flex;
  gap: 10px;
  max-width: 680px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}

.chat-message.user .message-avatar {
  background: linear-gradient(135deg, #d4af37, #b8962e);
  color: #1a1f2e;
}

.chat-message.agent .message-avatar {
  background: #252a3a;
  color: #d4af37;
  border: 1px solid #d4af37;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.6;
  color: #d1d4dc;
}

.chat-message.user .message-bubble {
  background: #252a3a;
  border-bottom-right-radius: 4px;
}

.chat-message.agent .message-bubble {
  background: #1e2330;
  border-bottom-left-radius: 4px;
}

.message-bubble :deep(.greeting) {
  color: #d4af37;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
}

.message-bubble :deep(p) {
  margin-bottom: 6px;
}

.message-bubble :deep(p:last-child) {
  margin-bottom: 0;
}

.message-bubble :deep(strong) {
  color: #d4af37;
}

.message-bubble :deep(.intents-list) {
  background: #111827;
  border-radius: 8px;
  padding: 10px;
  margin-top: 8px;
  list-style: none;
  padding-left: 0;
}

.message-bubble :deep(.intents-list li) {
  color: #d1d4dc;
  font-size: 12px;
  padding: 4px 0;
  padding-left: 16px;
  position: relative;
}

.message-bubble :deep(.intents-list li::before) {
  content: '>';
  position: absolute;
  left: 0;
  color: #d4af37;
  font-weight: 700;
}
</style>
