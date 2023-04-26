<template>
  <div class="ad-state-search">
      <span class="state-search__mglass" />
      <input
          ref="refSearch"
          v-model="localSearch"
          :placeholder="globalProps.searchPlaceholder"
          type="text"
          class="state-search__input"
      />
  </div>
</template>

<script lang="ts">
import {
    ref,
    computed,
    onMounted,
    defineComponent
} from 'vue';
import {useInject} from "../../use/use-context";
export default defineComponent({
    name: 'AdStateSearch',
    setup() {
        const {
            globalProps,
            localSearch
        } = useInject();

        const refSearch = ref();

        function onInit() {
            refSearch.value?.focus();
        }

        onMounted(onInit);

        return {
            refSearch,
            globalProps,
            localSearch
        };
    }
})
</script>

<style scoped lang="scss" src="./ad-state-search.scss" />