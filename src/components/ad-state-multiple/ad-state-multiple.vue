<template>
    <div class="ad-state-multiple">
        <div
            v-for="option in currentState"
            :key="option[globalProps.keyField]"
            class="state-multiple__item"
            @click.stop
        >
        <span>
            {{ option[globalProps.nameField] }}
        </span>
            <div
                class="state-multiple__cross"
                @click="selectHandler(option)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { useInject } from '../../use/use-context';
export default {
    name: 'AdStateMultiple',
    setup() {
        const {
            globalProps,
            currentState,
            selectHandler
        } = useInject();

        return {
            currentState,
            globalProps,
            selectHandler
        };
    }
}
</script>

<style scoped lang="scss" src="./ad-state-multiple.scss" />