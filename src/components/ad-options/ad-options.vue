<template>
    <div class="ad-options">
        <div v-if="!optionsList.length">
            empty
        </div>
        <ul class="ad-options__list">
            <li
                v-for="(item, index) in optionsList"
                :key="item.key"
                role="option"
                class="dropdown__item"
                @click="clickHandler(item)"
            >
                <slot
                    :item="localOptions[index]"
                    name="item"
                >
                    <div
                        :class="item.additionalClass"
                        class="dropdown__item-inner"
                    >
                        {{ item[globalProps.nameField] }}
                    </div>
                </slot>
            </li>
        </ul>
    </div>
</template>

<script>
import { computed, ref } from 'vue';

import { useInject } from '../../use/use-context';
export default {
    name: "ADOptions",
    emits: {
        '@selected': null
    },
    setup(_, { emit }) {
        const {
            globalProps,
            localOptions,
            selectHandler
        } = useInject();

        const optionsList = computed(() => {
            return localOptions.value.map(option => {
                const checkedClass = option.isChecked ? 'dropdown__item-inner--checked' : null;
                const disabledClass = option[globalProps.disabledField] ? 'dropdown__item-inner--disabled' : null;
                return {
                    ...option,
                    additionalClass: [checkedClass, disabledClass]
                }
            })
        });

        function clickHandler(option) {
            selectHandler(option);

            if (!option[globalProps.disabledField]) {
                emit('@selected', option);
            }
        }

        return {
            optionsList,
            globalProps,
            localOptions,
            clickHandler
        };
    }
}
</script>

<style scoped lang="scss" src="./ad-options.scss" />