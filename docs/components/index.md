# ADvancedWrapperSelect

`InputText` is a cool component. Here's how to use it...

<ADvancedWrapperSelect v-model="localValue" :name="name" :options="options">
    <MInput />
    <MDropdown />
</ADvancedWrapperSelect>

<ADvancedWrapperSelect v-model="localValue2" :is-disabled="false" :is-allow-empty="true" :name="name2" :options="options">
    <MInput />
    <MDropdown>
        <template #item="{ item }">
           {{ item.disabled ? '⬜️' : item.isChecked ? "🔲" : "⬛️" }} {{ item.name }}
        </template>
    </MDropdown>
</ADvancedWrapperSelect>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const localValue = ref('');
        const localValue2 = ref('');
        const name = ref(String(0));
        const name2 = ref(String(10));
        const options = [
            { id: '1', name: '001' },
            { id: '2', name: '002' },
            { id: '3', name: '003', disabled: true },
            { id: '4', name: '004' },
            { id: '5', name: '005' },
            { id: '6', name: '006' },
        ];
        setInterval(() => {
            name.value = String(Number(name.value) + 1);
            name2.value = String(Number(name2.value) + 1);
        }, 500);
        return {
            name,
            name2,
            options,
            localValue,
            localValue2
        };
    }
}
</script>