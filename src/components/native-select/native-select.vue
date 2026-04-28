<template>
    <select
            v-show="false"
            v-model="localValue"
            :name="globalProps.name"
            :multiple="globalProps.isMultiple"
            :disabled="globalProps.isDisabled"
    >
        <option
                v-for="option in localOptions"
                :key="option.key"
                :value="option[globalProps.keyField]"
                :disabled="option.isDisabled"
        >
            {{ option[globalProps.nameField] }}
        </option>
    </select>
</template>

<script setup lang="ts">
import { useInject } from "../../use/use-context";

defineOptions({ name: 'NativeSelect' });

const { globalProps, localValue, localOptions } = useInject();
</script>