# Markdown Extension Examples

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## Markdown Content

<ADWrapper v-model="localValue" name="select" :options="options" :is-multiple="true">
    <VDropdown auto-size="min">
        <ADControl />
        <template #popper>
            <ADOptions />
        </template>
    </VDropdown>
</ADWrapper>

```vue{11-18}
<script setup>
   import { Dropdown } from 'floating-vue';
</script>

<template>
    <ADWrapper
        v-model="localValue"
        :options="options"
        :is-multiple="true"
        name="select"
    >
        <Dropdown auto-size="min">
            <ADControl />
            <template #popper>
                <ADOptions />
            </template>
        </Dropdown>
    </ADWrapper>
</template>
```
<script>
import { ref } from 'vue';
export default {
    setup() {
        const localValue = ref([]);

        const options = [
            { id: '1', name: '001' },
            { id: '2', name: '002' },
            { id: '3', name: '003', disabled: true },
            { id: '4', name: '004' },
            { id: '5', name: '005' },
            { id: '6', name: '006' },
        ];

        return {
            options,
            localValue
        };
    }
}
</script>