# Markdown Extension Examples

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## Markdown Content

<ADWrapper v-model="localValue" name="select" :options="options">
    <VDropdown auto-size="min">
        <template #default="{ shown }">
            <ADControl>
                <template #arrow>
                    {{ shown ? "⬆️" : "⬇️" }}
                </template>
            </ADControl>
        </template>
        <template #popper="{ hide }">
            <ADOptions @@selected="hide" />
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
        name="select"
    >
        <Dropdown auto-size="min">
            <template #default="{ shown }">
                <ADControl>
                  <template #arrow>
                    {{ shown ? "⬆️" : "⬇️" }}
                  </template>
                </ADControl>
            </template>
            <template #popper="{ hide }">
                <ADOptions @@selected="hide" />
            </template>
        </Dropdown>
    </ADWrapper>
</template>
```

<ADWrapper v-model="localValue2" :is-disabled="false" :is-allow-empty="true" name="select" :options="options">
    <ADControl>
        <template #arrow>
            🔻
        </template>
    </ADControl>
    <ADOptions>
        <template #item="{ item }">
           {{ item.disabled ? '⚪️' : !item.isChecked ? "⚫️" : "🔘️" }} {{ item.name }}
        </template>
    </ADOptions>
</ADWrapper>

```vue
<ADWrapper
    v-model="localValue"
    :is-disabled="false"
    :is-allow-empty="true"
    :options="options"
    name="select"
>
    <ADControl>
      <template #arrow>
        🔻
      </template>
    </ADControl>
    <ADOptions>
        <template #item="{ item }">
            {{ item.disabled ? '⚪️' : !item.isChecked ? "⚫️" : "🔘️" }}
            {{ item.name }}
        </template>
    </ADOptions>
</ADWrapper>
```

<script>
import { ref } from 'vue';
export default {
    setup() {
        const localValue = ref('2');
        const localValue2 = ref('');

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
            localValue,
            localValue2
        };
    }
}
</script>

## Syntax Highlighting

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features like line-highlighting:

**Input**

````
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
