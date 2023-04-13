# Markdown Extension Examples

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## Markdown Content

<ADSelect v-model="localValue" name="select" :options="options" :is-multiple="true">

</ADSelect>

```vue{11-18}
<script setup>
   import { Dropdown } from 'floating-vue';
</script>

<template>
    <ADSelect
        v-model="localValue"
        :options="options"
        :is-multiple="true"
        name="select"
    />
</template>
```
<script>
import { ref } from 'vue';
export default {
    setup() {
        const localValue = ref([]);

        const options = Array(20).fill(null).map((_, id) => ({ id, name: `name_${id}` }));

        return {
            options,
            localValue
        };
    }
}
</script>