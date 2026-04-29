import { defineComponent, h } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'

import { useProvide } from '../../src/use/use-context'

type AnyProps = Record<string, any>

const baseProps = {
    modelValue: { type: null, default: undefined as any },
    searchValue: { type: String, default: '' },
    options: { type: Array as any, default: () => [] },
    keyField: { type: String, default: 'id' },
    nameField: { type: String, default: 'name' },
    disabledField: { type: String, default: 'disabled' },
    isDisabled: { type: Boolean, default: false },
    isMultiple: { type: Boolean, default: false },
    isAllowEmpty: { type: Boolean, default: false },
    isRemoteSearch: { type: Boolean, default: false },
    isSearchable: { type: Boolean, default: false },
    searchPosition: { type: String, default: 'control' },
    placeholder: { type: String, default: '' },
    name: { type: String, default: '' },
    isClearable: { type: Boolean, default: false },
    searchPlaceholder: { type: String, default: '' }
}

type Captured = ReturnType<typeof useProvide>

export interface MountedContext {
    wrapper: VueWrapper<any>
    ctx: Captured
}

export function mountContext(props: AnyProps = {}): MountedContext {
    let captured: Captured | null = null

    const Comp = defineComponent({
        props: baseProps,
        emits: ['update:modelValue', 'update:searchValue'],
        setup(p, ctx) {
            captured = useProvide(p as any, ctx as any)
            return () => h('div')
        }
    })

    const wrapper = mount(Comp, { props })
    return { wrapper, ctx: captured! }
}
