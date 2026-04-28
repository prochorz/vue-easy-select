<template>
    <div class="demo-card">
        <div v-if="title || description" class="demo-card__header">
            <h3 v-if="title" class="demo-card__title">{{ title }}</h3>
            <p v-if="description" class="demo-card__desc">{{ description }}</p>
        </div>
        <div class="demo-card__preview">
            <slot name="demo" />
        </div>
        <div class="demo-card__toolbar">
            <button
                type="button"
                class="demo-card__toggle-btn"
                :aria-expanded="open"
                @click="open = !open"
            >
                <span class="demo-card__caret" :class="{ 'demo-card__caret--open': open }">▸</span>
                {{ open ? 'Hide code' : 'Show code' }}
            </button>
        </div>
        <div v-show="open" class="demo-card__source">
            <slot name="source" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    title?: string
    description?: string
}>();

const open = ref(false);
</script>

<style scoped>
.demo-card {
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    margin: 24px 0;
    background: var(--vp-c-bg);
    overflow: hidden;
}

.demo-card__header {
    padding: 16px 20px 0;
}

.demo-card__title {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0 0 4px;
    letter-spacing: 0;
    border: 0;
    padding: 0;
}

.demo-card__desc {
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
    margin: 0 0 4px;
    line-height: 1.5;
}

.demo-card__preview {
    padding: 28px 24px;
    background: var(--vp-c-bg);
}

.demo-card__toolbar {
    display: flex;
    justify-content: center;
    border-top: 1px dashed var(--vp-c-divider);
    background: var(--vp-c-bg-soft);
}

.demo-card__toggle-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: transparent;
    border: 0;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--vp-c-text-2);
    cursor: pointer;
    transition: color 0.15s ease;
}

.demo-card__toggle-btn:hover {
    color: var(--vp-c-brand-1);
}

.demo-card__caret {
    display: inline-block;
    font-size: 0.7rem;
    transition: transform 0.15s ease;
}

.demo-card__caret--open {
    transform: rotate(90deg);
}

.demo-card__source {
    border-top: 1px solid var(--vp-c-divider);
}

.demo-card__source :deep(div[class*='language-']) {
    margin: 0;
    border-radius: 0;
}

.demo-card__source :deep(pre) {
    margin: 0;
    border-radius: 0;
}
</style>
