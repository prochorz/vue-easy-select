<template>
  <div class="vue-easy-state-search">
      <slot name="search-icon">
          <span class="vue-easy-state-search__mglass" aria-hidden="true" />
      </slot>
      <input
          ref="refSearch"
          v-model="localSearch"
          :placeholder="globalProps.searchPlaceholder"
          type="text"
          class="vue-easy-state-search__input"
      />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { useInject } from '../../use/use-context';

defineOptions({ name: 'VueEasyStateSearch' });

const { globalProps, localSearch } = useInject();

const refSearch = ref();

function onInit() {
    refSearch.value?.focus();
}

onMounted(onInit);
</script>

<style scoped lang="scss" src="./vue-easy-state-search.scss" />
