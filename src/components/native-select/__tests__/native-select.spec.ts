import { describe, it, expect } from 'vitest'

import NativeSelect from '../index'
import { mountWithContext } from '../../../../tests/helpers/mount-with-context'
import { makeNamedOptions, makeMixedOptions } from '../../../../tests/helpers/factories'

describe('NativeSelect', () => {
    it('renders a hidden <select> with the configured name', () => {
        const { wrapper } = mountWithContext(NativeSelect, {
            contextProps: { name: 'city', options: makeNamedOptions('A') }
        })
        const select = wrapper.find('select')
        expect(select.exists()).toBe(true)
        expect(select.attributes('name')).toBe('city')
        expect(select.attributes('style')).toContain('display: none')
    })

    it('sets the multiple attribute when isMultiple is true', () => {
        const { wrapper } = mountWithContext(NativeSelect, {
            contextProps: { name: 'cities', isMultiple: true, modelValue: [], options: makeNamedOptions('A') }
        })
        const select = wrapper.find('select').element as HTMLSelectElement
        expect(select.multiple).toBe(true)
    })

    it('sets the disabled attribute when isDisabled is true', () => {
        const { wrapper } = mountWithContext(NativeSelect, {
            contextProps: { name: 'x', isDisabled: true, options: makeNamedOptions('A') }
        })
        const select = wrapper.find('select').element as HTMLSelectElement
        expect(select.disabled).toBe(true)
    })

    it('renders one <option> per localOptions entry', () => {
        const { wrapper } = mountWithContext(NativeSelect, {
            contextProps: { name: 'x', options: makeNamedOptions('A', 'B', 'C') }
        })
        const optionEls = wrapper.findAll('option')
        expect(optionEls).toHaveLength(3)
        expect(optionEls.map(o => (o.element as HTMLOptionElement).value)).toEqual(['A', 'B', 'C'])
        expect(optionEls.map(o => o.text())).toEqual(['A', 'B', 'C'])
    })

    it('marks disabled options with the disabled attribute', () => {
        const { wrapper } = mountWithContext(NativeSelect, {
            contextProps: { name: 'x', options: makeMixedOptions() }
        })
        const optionEls = wrapper.findAll('option')
        const disabledByIdx = optionEls.map(o => (o.element as HTMLOptionElement).disabled)
        expect(disabledByIdx).toEqual([false, true, false, true, false])
    })

    it('emits update:modelValue when the native select changes', async () => {
        const { wrapper, parent } = mountWithContext(NativeSelect, {
            contextProps: { name: 'x', options: makeNamedOptions('A', 'B'), modelValue: 'A' }
        })
        const select = wrapper.find('select')
        await select.setValue('B')
        expect(parent.emitted('update:modelValue')?.[0]).toEqual(['B'])
    })
})
