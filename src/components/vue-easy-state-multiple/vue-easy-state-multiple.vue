<template>
    <div class="vue-easy-state-multiple">
        <div
            v-for="option in currentState"
            :key="option[globalProps.keyField]"
            class="vue-easy-state-multiple__item"
            @click.stop
        >
        <span>
            {{ option[globalProps.nameField] }}
        </span>
            <div
                class="vue-easy-state-multiple__cross"
                @click="selectHandler(option)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useInject } from '../../use/use-context';

defineOptions({ name: 'VueEasyStateMultiple' });

const {
    globalProps,
    currentState,
    selectHandler
} = useInject();
</script>

<style scoped lang="scss" src="./vue-easy-state-multiple.scss" />
