<template>
  <div
    :class="[disabledClass]"
    class="ad-control"
  >
      <div class="input__content">
          <span v-if="isEmptyValue">
              placeholder
          </span>
          <template v-else>
              <slot name="state" :state="currentState">
                  <AdStateMultiple v-if="isMultiple" />
                  <template v-else>
                    <span>
                      {{ localValue }}
                    </span>
                  </template>
              </slot>
          </template>
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
import type { TModelValue } from '../../types/select.type';

import {
    computed,
    defineComponent
} from 'vue';

import AdStateMultiple from '../ad-state-multiple';
import NativeSelect from '../native-select';

import { useInject } from '../../use/use-context';
export default defineComponent({
    name: "ADControl",
    components: {
        NativeSelect,
        AdStateMultiple
    },
    emits: {
        'update:modelValue': null
    },
    setup() {
        const {
            currentState,
            globalProps,
            localValue,
            localOptions
        } = useInject();

        const isMultiple = computed(() => Boolean(globalProps.isMultiple));
        const disabledClass = computed(() => globalProps.isDisabled ? 'input--disabled' : null)

        const isEmptyValue = computed(() => {
            return isMultiple.value
                ? !(localValue.value as Array<TModelValue>).length
                : !localValue.value;
        });

        return {
            currentState,
            isMultiple,
            isEmptyValue,
            localValue,
            globalProps,
            localOptions,
            disabledClass
        }
    }
})
</script>

<style scoped lang="scss" src="./ad-control.scss" />