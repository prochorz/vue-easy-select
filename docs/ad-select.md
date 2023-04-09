# Markdown Extension Examples

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## Markdown Content

<ADSelect
    v-model="localValue"
    name="select"
    :options="options"
    :is-disabled="false"
>

</ADSelect>
<br />
<ADSelect
    v-model="localValue"
    name="select"
    :options="options"
    :is-disabled="false"
>
    <template #arrow="{ isOpen }">
        {{ isOpen ? "⬆️" : "⬇️" }}
    </template>
</ADSelect>

```vue{11-18}

```

<script>
import { ref } from 'vue';
export default {
    setup() {
        const localValue = ref('2');

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
