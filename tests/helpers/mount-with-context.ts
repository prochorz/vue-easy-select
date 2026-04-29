import { defineComponent, h, type Component } from 'vue'
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

interface Options {
    contextProps?: AnyProps
    childProps?: AnyProps
    slots?: Record<string, any>
    onSelected?: (option: any) => void
}

export interface MountedWithContext {
    wrapper: VueWrapper<any>
    ctx: ReturnType<typeof useProvide>
    parent: VueWrapper<any>
}

export function mountWithContext(child: Component, options: Options = {}): MountedWithContext {
    let captured: ReturnType<typeof useProvide> | null = null

    const Parent = defineComponent({
        components: { Child: child as any },
        props: baseProps,
        emits: ['update:modelValue', 'update:searchValue'],
        setup(props, ctx) {
            captured = useProvide(props as any, ctx as any)
            return () => h(child as any, options.childProps || {}, options.slots)
        }
    })

    const wrapper = mount(Parent, {
        props: options.contextProps || {}
    })

    return {
        wrapper: wrapper.findComponent(child as any),
        ctx: captured!,
        parent: wrapper
    }
}
