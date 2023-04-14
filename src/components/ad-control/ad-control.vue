<template>
  <div
    ref="refContent"
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
    ref,
    watch,
    computed,
    defineComponent
} from 'vue';

import NativeSelect from '../native-select';
import AdStateMultiple from '../ad-state-multiple';

import { useInject } from '../../use/use-context';
import useResizeObserver from '../../use/use-resize-observer';

export default defineComponent({
    name: "ADControl",
    components: {
        NativeSelect,
        AdStateMultiple
    },
    emits: {
        'update:modelValue': null
    },
    setup(_, { emit }) {
        const {
            currentState,
            globalProps,
            localValue,
            localOptions
        } = useInject();

        const refContent = ref();

        const { height } = useResizeObserver(refContent);

        const isMultiple = computed(() => Boolean(globalProps.isMultiple));
        const disabledClass = computed(() => globalProps.isDisabled ? 'input--disabled' : null)

        const isEmptyValue = computed(() => {
            return isMultiple.value
                ? !(localValue.value as Array<TModelValue>).length
                : !localValue.value;
        });

        function resizeHandler() {
            emit('@resize');
        }

        watch(height, resizeHandler)

        return {
            refContent,
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