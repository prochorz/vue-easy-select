<template>
  <div
    ref="refContent"
    :class="[disabledClass]"
    class="ad-control"
  >
      <div class="input__content">
          <span v-if="isEmptyValue">
              {{ placeholder }}
          </span>
          <template v-else>
              <slot name="state" :state="currentState">
                  <AdStateMultiple v-if="isMultiple" />
                  <template v-else>
                    <span>
                      {{ localValueName }}
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
    toRefs,
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
        '@resize': null,
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

        const { placeholder, isSearchable } = toRefs(globalProps);
        const isMultiple = computed(() => Boolean(globalProps.isMultiple));

        const disabledClass = computed(() => globalProps.isDisabled ? 'input--disabled' : null)

        const isEmptyValue = computed(() => {
            if (isMultiple.value) {
                return !(localValue.value as Array<TModelValue>).length;
            }

            return localOptions.value.every(item => item[globalProps.keyField] !== localValue.value)
        });

        const localValueName = computed(() => {
            return localOptions.value.find(item => item[globalProps.keyField] === localValue.value)?.[globalProps.nameField]
        });

        function resizeHandler() {
            emit('@resize');
        }

        watch(height, resizeHandler)

        return {
            refContent,
            currentState,
            placeholder,
            isMultiple,
            isEmptyValue,
            localValue,
            globalProps,
            localOptions,
            disabledClass,
            localValueName
        }
    }
})
</script>

<style scoped lang="scss" src="./ad-control.scss" />