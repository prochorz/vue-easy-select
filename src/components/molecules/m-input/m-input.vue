<template>
  <div
    :class="[disabledClass]"
    class="m-input"
  >
      {{ localValue }}
      <select
          v-show="false"
          :id="globalProps.name"
          v-model="localValue"
          :multiple="false"
          :disabled="globalProps.isDisabled"
      >
          <option
              v-for="option in localOptions"
              :key="option[globalProps.keyField]"
              :value="option[globalProps.keyField]"
              :disabled="option.isDisabled"
          >
              {{ option[globalProps.nameField] }}
          </option>
      </select>
  </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent
} from 'vue';

import { useInject } from '../../../use/use-context';
export default defineComponent({
    name: "m-input",
    emits: {
        'update:modelValue': null
    },
    setup() {
        const { globalProps, localValue, localOptions } = useInject();

        const disabledClass = computed(() => globalProps.isDisabled ? 'input--disabled' : null)

        return {
            globalProps,
            localValue,
            localOptions,
            disabledClass
        }
    }
})
</script>

<style scoped lang="scss" src="./m-input.scss" />