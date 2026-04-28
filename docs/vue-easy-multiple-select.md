# VueEasySelect (multiple)

Pass `is-multiple` and an array `modelValue` to switch to multi-select. Selected options render as removable chips in the control.

## Basic multiple

<DemoCard description="Tap the cross on a chip to remove a selection. Nothing special on the consumer side — just set is-multiple.">
<template #demo>

<VueEasySelect v-model="plainValue" name="select-multi" :options="options" :is-multiple="true" placeholder="Pick some names" />

</template>
<template #source>

```vue
<script setup>
import { ref } from 'vue';
import { VueEasySelect } from 'vue-easy-select';

const value = ref([]);
const options = Array(20).fill(null).map((_, id) => ({ id, name: `name_${id}` }));
</script>

<template>
    <VueEasySelect
        v-model="value"
        name="select"
        :options="options"
        :is-multiple="true"
        placeholder="Pick some names"
    />
</template>
```

</template>
</DemoCard>

## Multiple + searchable

<DemoCard description="Combine is-multiple with is-searchable for typical tag-picker UX.">
<template #demo>

<VueEasySelect v-model="searchValue" name="select-multi-search" :options="options" :is-multiple="true" :is-searchable="true" search-placeholder="Type to filter" placeholder="Pick some names" />

</template>
<template #source>

```vue
<VueEasySelect
    v-model="value"
    name="select"
    :options="options"
    :is-multiple="true"
    :is-searchable="true"
    search-placeholder="Type to filter"
    placeholder="Pick some names"
/>
```

</template>
</DemoCard>

## Multiple + search inside dropdown

<DemoCard description="In multi mode, search-position='options' is usually the better UX — the chips stay visible in the control while you filter the dropdown.">
<template #demo>

<VueEasySelect v-model="dropdownSearchValue" name="select-multi-dropdown-search" :options="options" :is-multiple="true" :is-searchable="true" search-position="options" search-placeholder="Type to filter" placeholder="Pick some names" />

</template>
<template #source>

```vue
<VueEasySelect
    v-model="value"
    name="select"
    :options="options"
    :is-multiple="true"
    :is-searchable="true"
    search-position="options"
    search-placeholder="Type to filter"
    placeholder="Pick some names"
/>
```

</template>
</DemoCard>

## Clearable multiple

<DemoCard description="is-clearable works the same in multi mode — the × button wipes all selected chips in one click. Only renders when there's at least one selection.">
<template #demo>

<VueEasySelect v-model="clearableValue" name="select-multi-clearable" :options="options" :is-multiple="true" :is-clearable="true" placeholder="Pick some names" />

</template>
<template #source>

```vue
<script setup>
import { ref } from 'vue';
import { VueEasySelect } from 'vue-easy-select';

const value = ref(['0', '1', '2']); // pre-selected, shows the clear button right away
const options = Array(20).fill(null).map((_, id) => ({ id, name: `name_${id}` }));
</script>

<template>
    <VueEasySelect
        v-model="value"
        name="select"
        :options="options"
        :is-multiple="true"
        :is-clearable="true"
        placeholder="Pick some names"
    />
</template>
```

</template>
</DemoCard>

<script setup>
import { ref } from 'vue';

const options = Array(20).fill(null).map((_, id) => ({ id, name: `name_${id}` }));

const plainValue = ref([]);
const searchValue = ref([]);
const dropdownSearchValue = ref([0, 1]);
const clearableValue = ref([0, 1, 2]);
</script>
