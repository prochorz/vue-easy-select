<template>
  <div
    :class="[disabledClass]"
    class="ad-control"
  >
      <div class="input__content">
          <span>
              {{ localValue }}
          </span>
      </div>
      <div
          v-if="$slots.arrow"
          class="input__arrow"
      >
          <slot name="arrow" />
      </div>

      <NativeSelect />
  </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent
} from 'vue';

import NativeSelect from '../native-select';

import { useInject } from '../../use/use-context';
export default defineComponent({
    name: "ADControl",
    components: {
        NativeSelect
    },
    emits: {
        'update:modelValue': null
    },
    setup() {
        const { globalProps, localValue, localOptions } = useInject();

        const disabledClass = computed(() => globalProps.isDisabled ? 'input--disabled' : null)

        return {
            localValue,
            globalProps,
            localOptions,
            disabledClass
        }
    }
})
</script>

<style scoped lang="scss" src="./ad-control.scss" />