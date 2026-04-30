# vue-easy-select

📖 **[Live demo & docs →](https://prochorz.github.io/vue-easy-select/)**

Flexible select component for Vue 3 — composable primitives (`VueEasyWrapper`, `VueEasyControl`, `VueEasyOptions`) plus an opinionated ready-to-use `VueEasySelect`. Supports single/multiple modes, searchable options (local & remote), custom slots for control/item/arrow, and mirrors a hidden native `<select>` for form compatibility.

## Philosophy

Off-the-shelf select components are a dead end — they ship a visual design you didn't pick and a dropdown you can't reach into. `vue-easy-select` takes the opposite stance: **minimum UI, maximum configurability**.

- **No chrome by default.** No opinionated borders, shadows, or containers around the primitives. You bring your own wrapper, bordered panel, scroll shadows — whatever fits your design system.
- **Every visible piece is a slot.** Arrow, option item, selected state, search icon, empty state — all overridable. No fighting `!important` to change an icon.
- **State is shared via a provide/inject context**, not pinned to a specific DOM layout. Put the control in a header, the options list in a drawer, or inside any third-party popper — they all stay in sync because they inject the same context.
- **Your popper, your rules.** Use `VueEasySelect` for a self-contained select, or compose `VueEasyWrapper` + `VueEasyControl` + `VueEasyOptions` with [floating-vue](https://floating-vue.starpad.dev/), Floating UI, or your own positioning — the primitives don't assume a popper exists.
- **Accessible by default.** Keyboard navigation (Arrow/Enter/Space/Escape), ARIA combobox + listbox semantics, and a hidden native `<select>` for form submission come out of the box.

## Install

```bash
npm install vue-easy-select
```

Peer dependency: `vue ^3.3.6`. Zero runtime dependencies of its own.

## Footprint & runtime

- **Size**: ~12 kB gzip / ~28 kB raw / 43.7 kB unpacked, single ESM entry, no transitive deps.
- **CSS auto-injection**: a tiny SSR-safe IIFE appends a `<style>` tag at first import — no separate stylesheet to import, no FOUC, no CSS loader required. Works inside a bundler **and** in raw `<script type="module">` setups.
- **SSR-safe**: the injection is gated by `typeof document !== 'undefined'`, so the bundle imports cleanly on the server. Vue components themselves render fine in SSR; styles attach on hydration.
- **Tree-shaking**: ships as one ESM entry, so when you import only `VueEasySelect`, bundlers can drop unused named exports. The CSS injection is a single top-level side-effect and stays in.
- **TypeScript**: full `.d.ts` bundled (`dist/index.d.ts`).

## Usage

Register globally:

```ts
import { createApp } from 'vue'
import VueEasySelect from 'vue-easy-select'

createApp(App).use(VueEasySelect).mount('#app')
```

Or import the components you need:

```ts
import { VueEasySelect, VueEasyWrapper, VueEasyControl, VueEasyOptions } from 'vue-easy-select'
```

No separate CSS import is needed — styles are inlined into the bundle and injected on first import.

### Basic

```vue
<template>
    <VueEasySelect
        v-model="value"
        :options="options"
        placeholder="Pick a city"
    />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
    { id: 'Berlin', name: 'Berlin' },
    { id: 'Tokyo', name: 'Tokyo' },
    { id: 'New York', name: 'New York' }
]
</script>
```

> Pass `name="..."` if you need a hidden native `<select>` mirror for form submission. Otherwise omit it — no extra DOM is rendered.

### Multiple + searchable

```vue
<VueEasySelect
    v-model="value"
    :options="options"
    :is-multiple="true"
    :is-searchable="true"
    search-placeholder="Search"
/>
```

### Custom popper (floating-vue)

Use the primitives directly when you need your own positioning:

```vue
<VueEasyWrapper v-model="value" :options="options">
    <Dropdown auto-size="min">
        <template #default="{ shown }">
            <VueEasyControl>
                <template #arrow>{{ shown ? '⬆️' : '⬇️' }}</template>
            </VueEasyControl>
        </template>
        <template #popper="{ hide }">
            <VueEasyOptions @selected="hide" />
        </template>
    </Dropdown>
</VueEasyWrapper>
```

## Props (`componentProps`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | `''` | Name of the hidden native `<select>` mirror. When set, a hidden `<select>` is rendered for form submission and assistive tech. Leave empty if you don't need it (e.g. filters, standalone widgets). |
| `options` | `Array<any>` | `[]` | Options — object array or plain `string[]` |
| `keyField` | `string` | `'id'` | Object field used as option value |
| `nameField` | `string` | `'name'` | Object field used as visible label |
| `disabledField` | `string` | `'disabled'` | Object field marking an option as disabled |
| `placeholder` | `string` | `''` | Placeholder when nothing is selected |
| `isDisabled` | `boolean` | `false` | Disable the whole control |
| `isSearchable` | `boolean` | `false` | Enable search input |
| `isClearable` | `boolean` | `false` | Render a clear (×) button in the control when a value is selected |
| `isRemoteSearch` | `boolean` | `false` | Don't filter options locally — consumer controls `options` |
| `searchValue` | `string` | `''` | v-model-able search value |
| `searchPlaceholder` | `string` | `''` | Placeholder for search input |
| `searchPosition` | `string` | `'control'` | Where to render the search input. One of `'control'` or `'options'`. |

### Mode-specific

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `isMultiple` | `boolean` | `false` | Switch to multiple mode — `modelValue` becomes `Array` |
| `isAllowEmpty` | `boolean` | `false` | (single mode) Allow deselecting the current value by clicking it |

## License

MIT
