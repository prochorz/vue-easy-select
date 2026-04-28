# VueEasyWrapper

For full control over positioning, compose `VueEasyWrapper` with `VueEasyControl` and `VueEasyOptions` and bring your own popper (e.g. [floating-vue](https://floating-vue.starpad.dev/)).

## With floating-vue

<DemoCard description="Let floating-vue handle positioning; VueEasyWrapper just shares state between the trigger and the options list. Wrap the control and the popper in your own containers — the library doesn't ship any chrome.">
<template #demo>

<ClientOnly>
    <VueEasyWrapper v-model="floatingValue" name="select-floating" :options="options" placeholder="Pick something">
        <VDropdown auto-size="min">
            <template #default="{ shown }">
                <div class="floating-trigger-demo">
                    <VueEasyControl :is-open="shown">
                        <template #arrow>
                            {{ shown ? "⬆️" : "⬇️" }}
                        </template>
                    </VueEasyControl>
                </div>
            </template>
            <template #popper="{ hide }">
                <div class="floating-popper-demo">
                    <VueEasyOptions @selected="hide" />
                </div>
            </template>
        </VDropdown>
    </VueEasyWrapper>
</ClientOnly>

</template>
<template #source>

```vue
<script setup>
import { ref } from 'vue';
import { Dropdown } from 'floating-vue';
import { VueEasyWrapper, VueEasyControl, VueEasyOptions } from 'vue-easy-select';

const value = ref('');
const options = [ /* ... */ ];
</script>

<template>
    <VueEasyWrapper v-model="value" :options="options" name="select" placeholder="Pick something">
        <Dropdown auto-size="min">
            <template #default="{ shown }">
                <div class="trigger">
                    <VueEasyControl :is-open="shown">
                        <template #arrow>
                            {{ shown ? "⬆️" : "⬇️" }}
                        </template>
                    </VueEasyControl>
                </div>
            </template>
            <template #popper="{ hide }">
                <div class="popper">
                    <VueEasyOptions @selected="hide" />
                </div>
            </template>
        </Dropdown>
    </VueEasyWrapper>
</template>

<style scoped>
.trigger {
    max-width: 280px;
    border: 1px solid #e1e5e8;
    border-radius: 6px;
    background: #fff;
}
.popper {
    min-width: 200px;
    border: 1px solid #e1e5e8;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
```

</template>
</DemoCard>

## Without a popper (inline)

<DemoCard description="Skip the popper entirely and render the options list inline below the control. The library ships zero container styling — bring your own wrapper, border, and separators to fit your design.">
<template #demo>

<div class="inline-wrapper-demo">
    <VueEasyWrapper v-model="inlineValue" :is-allow-empty="true" name="select-inline" :options="options" placeholder="Pick something">
        <VueEasyControl>
            <template #arrow>🔻</template>
        </VueEasyControl>
        <div class="inline-wrapper-demo__divider" />
        <VueEasyOptions>
            <template #item="{ item }">
               {{ item.disabled ? '⚪️' : !item.isChecked ? "⚫️" : "🔘️" }} {{ item.name }}
            </template>
        </VueEasyOptions>
    </VueEasyWrapper>
</div>

</template>
<template #source>

```vue
<script setup>
import { ref } from 'vue';
import { VueEasyWrapper, VueEasyControl, VueEasyOptions } from 'vue-easy-select';

const value = ref('');
const options = [ /* ... */ ];
</script>

<template>
    <div class="inline-wrapper">
        <VueEasyWrapper
            v-model="value"
            :is-allow-empty="true"
            :options="options"
            name="select"
            placeholder="Pick something"
        >
            <VueEasyControl>
                <template #arrow>🔻</template>
            </VueEasyControl>
            <div class="inline-wrapper__divider" />
            <VueEasyOptions>
                <template #item="{ item }">
                    {{ item.disabled ? '⚪️' : !item.isChecked ? "⚫️" : "🔘️" }}
                    {{ item.name }}
                </template>
            </VueEasyOptions>
        </VueEasyWrapper>
    </div>
</template>

<style scoped>
.inline-wrapper {
    max-width: 280px;
    border: 1px solid #e1e5e8;
    border-radius: 6px;
    background: #fff;
    overflow: hidden;
}
.inline-wrapper__divider {
    height: 1px;
    background: #e1e5e8;
}
</style>
```

</template>
</DemoCard>

<style>
.floating-trigger-demo {
    max-width: 280px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    background: var(--vp-c-bg);
}
.floating-popper-demo {
    min-width: 200px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    background: var(--vp-c-bg);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    overflow: hidden;
}
.inline-wrapper-demo {
    max-width: 280px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    background: var(--vp-c-bg);
    overflow: hidden;
}
.inline-wrapper-demo__divider {
    height: 1px;
    background: var(--vp-c-divider);
}
</style>

<script setup>
import { ref } from 'vue';

const options = [
    { id: '1', name: '001' },
    { id: '2', name: '002' },
    { id: '3', name: '003', disabled: true },
    { id: '4', name: '004' },
    { id: '5', name: '005' },
    { id: '6', name: '006' }
];

const floatingValue = ref('2');
const inlineValue = ref('');
</script>
