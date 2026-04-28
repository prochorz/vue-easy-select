# VueEasySelect

The opinionated, batteries-included select. Renders its own dropdown via `<Teleport>` with auto-flip positioning, outside-click dismiss, and reposition on scroll/resize.

## Basic

<DemoCard description="Drop it in, pass options, done.">
<template #demo>

<VueEasySelect v-model="basicValue" name="select-basic" :options="options" placeholder="Pick a number" />

</template>
<template #source>

```vue
<script setup>
import { ref } from 'vue';
import { VueEasySelect } from 'vue-easy-select';

const value = ref('');
const options = [
    { id: '1', name: '001' },
    { id: '2', name: '002' },
    { id: '3', name: '003', disabled: true },
    { id: '4', name: '004' },
    { id: '5', name: '005' },
    { id: '6', name: '006' }
];
</script>

<template>
    <VueEasySelect
        v-model="value"
        name="select"
        :options="options"
        placeholder="Pick a number"
    />
</template>
```

</template>
</DemoCard>

## Custom arrow and item slots

<DemoCard description="Use the #arrow and #item slots to fully restyle the trigger and each option. The #item slot receives { item, isActive } — no library styling is applied to your markup, so you decide how to render checked / active / disabled state.">
<template #demo>

<VueEasySelect v-model="slotValue" name="select-slot" :options="options">
    <template #arrow="{ isOpen }">
        {{ isOpen ? "⬆️" : "⬇️" }}
    </template>
    <template #item="{ item, isActive }">
        <span :style="{ background: isActive ? '#fef3c7' : 'transparent', padding: '6px 10px', display: 'block' }">
            {{ item.disabled ? '⚪️' : !item.isChecked ? "⚫️" : "🔘️" }} {{ item.name }}
        </span>
    </template>
</VueEasySelect>

</template>
<template #source>

```vue
<VueEasySelect v-model="value" name="select" :options="options">
    <template #arrow="{ isOpen }">
        {{ isOpen ? "⬆️" : "⬇️" }}
    </template>
    <template #item="{ item, isActive }">
        <span :style="{ background: isActive ? '#fef3c7' : 'transparent', padding: '6px 10px', display: 'block' }">
            {{ item.disabled ? '⚪️' : !item.isChecked ? "⚫️" : "🔘️" }}
            {{ item.name }}
        </span>
    </template>
</VueEasySelect>
```

The scoped slot gives you:
- `item` — the option object (plus `isChecked` flag)
- `isActive` — whether keyboard / mouse cursor is currently on this row

No classes from the library are applied to your slot content — `isActive` is just data, render it however fits your design.

</template>
</DemoCard>

## Searchable

<DemoCard description="Set is-searchable to render an input inside the control when open. Filtering is client-side by default.">
<template #demo>

<VueEasySelect v-model="searchValue" name="select-search" :options="options" :is-searchable="true" search-placeholder="Type to filter" placeholder="Pick a number" />

</template>
<template #source>

```vue
<VueEasySelect
    v-model="value"
    name="select"
    :options="options"
    :is-searchable="true"
    search-placeholder="Type to filter"
    placeholder="Pick a number"
/>
```

</template>
</DemoCard>

## Clearable

<DemoCard description="Opt in with is-clearable to render a minimal × button in the control when a value is selected. The button wipes the whole modelValue (empty string for single, empty array for multi).">
<template #demo>

<VueEasySelect v-model="clearableValue" name="select-clearable" :options="options" :is-clearable="true" placeholder="Pick a number" />

</template>
<template #source>

```vue
<VueEasySelect
    v-model="value"
    name="select"
    :options="options"
    :is-clearable="true"
    placeholder="Pick a number"
/>
```

</template>
</DemoCard>

## Custom clear icon

<DemoCard description="Replace the default CSS × with any icon, component, or character via the #clear-icon slot. The surrounding button (with aria-label, @click.stop, focus logic) stays the same.">
<template #demo>

<VueEasySelect v-model="clearIconValue" name="select-clearable-icon" :options="options" :is-clearable="true" placeholder="Pick a number">
    <template #clear-icon>
        🗑️
    </template>
</VueEasySelect>

</template>
<template #source>

```vue
<VueEasySelect
    v-model="value"
    name="select"
    :options="options"
    :is-clearable="true"
>
    <template #clear-icon>
        🗑️
    </template>
</VueEasySelect>
```

</template>
</DemoCard>

## Search inside the dropdown

<DemoCard description="By default the search input replaces the control's content when is-searchable is on. Set search-position='options' to render it as a sticky header inside the dropdown instead — the control shows the current selection while you filter.">
<template #demo>

<VueEasySelect v-model="optSearchValue" name="select-opt-search" :options="options" :is-searchable="true" search-position="options" search-placeholder="Type to filter" placeholder="Pick a number" />

</template>
<template #source>

```vue
<VueEasySelect
    v-model="value"
    name="select"
    :options="options"
    :is-searchable="true"
    search-position="options"
    search-placeholder="Type to filter"
    placeholder="Pick a number"
/>
```

</template>
</DemoCard>

## Custom search icon

<DemoCard description="Override the default CSS magnifier with your own icon via the #search-icon slot.">
<template #demo>

<VueEasySelect v-model="iconValue" name="select-search-icon" :options="options" :is-searchable="true" search-placeholder="Type to filter" placeholder="Pick a number">
    <template #search-icon>
        🔎
    </template>
</VueEasySelect>

</template>
<template #source>

```vue
<VueEasySelect
    v-model="value"
    name="select"
    :options="options"
    :is-searchable="true"
    search-placeholder="Type to filter"
>
    <template #search-icon>
        🔎
    </template>
</VueEasySelect>
```

</template>
</DemoCard>

## Remote search

<DemoCard description="Set is-remote-search='true' to disable the built-in client-side filter. The component then just forwards the search text via v-model:search-value — you fetch the matching options yourself and assign them to :options.">
<template #demo>

<VueEasySelect
    v-model="remoteValue"
    v-model:search-value="remoteQuery"
    name="select-remote"
    :options="remoteOptions"
    :is-searchable="true"
    :is-remote-search="true"
    search-placeholder="Type to search fruits"
    placeholder="Pick a fruit"
/>

</template>
<template #source>

```vue
<script setup>
import { ref, watch } from 'vue';
import { VueEasySelect } from 'vue-easy-select';

const value = ref('');
const query = ref('');
const options = ref([]);

watch(query, async (q) => {
    if (!q) { options.value = []; return; }
    const res = await fetch(`/api/fruits?q=${encodeURIComponent(q)}`);
    options.value = await res.json();
});
</script>

<template>
    <VueEasySelect
        v-model="value"
        v-model:search-value="query"
        name="select"
        :options="options"
        :is-searchable="true"
        :is-remote-search="true"
        search-placeholder="Type to search fruits"
    />
</template>
```

</template>
</DemoCard>

## Keyboard

The control is focusable (`tabindex="0"`, `role="combobox"`).

| Key | Action |
| --- | --- |
| `ArrowDown` / `ArrowUp` | Open dropdown / move active option |
| `Enter` | Open, or select active option (closes in single mode) |
| `Space` | Toggle open |
| `Escape` | Close dropdown |

<script setup>
import { ref, watch } from 'vue';

const options = [
    { id: '1', name: '001' },
    { id: '2', name: '002' },
    { id: '3', name: '003', disabled: true },
    { id: '4', name: '004' },
    { id: '5', name: '005' },
    { id: '6', name: '006' }
];

const basicValue = ref('');
const slotValue = ref('2');
const searchValue = ref('');
const iconValue = ref('');
const clearableValue = ref('2');
const clearIconValue = ref('2');
const optSearchValue = ref('2');

// fake "remote" dataset + fake async fetch
const remoteValue = ref('');
const remoteQuery = ref('');
const remoteOptions = ref([]);
const FRUITS = [
    { id: 'apple',   name: 'Apple' },
    { id: 'apricot', name: 'Apricot' },
    { id: 'banana',  name: 'Banana' },
    { id: 'cherry',  name: 'Cherry' },
    { id: 'grape',   name: 'Grape' },
    { id: 'kiwi',    name: 'Kiwi' },
    { id: 'mango',   name: 'Mango' },
    { id: 'melon',   name: 'Melon' },
    { id: 'orange',  name: 'Orange' },
    { id: 'peach',   name: 'Peach' },
    { id: 'pear',    name: 'Pear' }
];
watch(remoteQuery, (q) => {
    if (!q) { remoteOptions.value = []; return; }
    const needle = q.toLowerCase();
    setTimeout(() => {
        remoteOptions.value = FRUITS.filter(f => f.name.toLowerCase().includes(needle));
    }, 150);
});
</script>
