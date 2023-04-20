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

<script>
import { useInject } from "../../use/use-context";

export default {
    name: "NativeSelect",
    setup() {
        const { globalProps, localValue, localOptions } = useInject();

        return {
            localValue,
            globalProps,
            localOptions
        };
    }
}
</script>