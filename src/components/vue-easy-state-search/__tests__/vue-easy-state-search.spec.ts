import { describe, it, expect } from 'vitest'

import VueEasyStateSearch from '../index'
import { mountWithContext } from '../../../../tests/helpers/mount-with-context'

describe('VueEasyStateSearch', () => {
    it('renders an input bound to localSearch', async () => {
        const { wrapper, parent } = mountWithContext(VueEasyStateSearch, {})
        const input = wrapper.find('input')
        await input.setValue('hello')
        expect(parent.emitted('update:searchValue')?.[0]).toEqual(['hello'])
    })

    it('shows the configured placeholder', () => {
        const { wrapper } = mountWithContext(VueEasyStateSearch, {
            contextProps: { searchPlaceholder: 'Find...' }
        })
        expect(wrapper.find('input').attributes('placeholder')).toBe('Find...')
    })

    it('renders the default magnifier when no #search-icon slot is provided', () => {
        const { wrapper } = mountWithContext(VueEasyStateSearch, {})
        expect(wrapper.find('.vue-easy-state-search__mglass').exists()).toBe(true)
    })

    it('uses the #search-icon slot when provided', () => {
        const { wrapper } = mountWithContext(VueEasyStateSearch, {
            slots: { 'search-icon': () => 'CUSTOM' }
        })
        expect(wrapper.text()).toContain('CUSTOM')
        expect(wrapper.find('.vue-easy-state-search__mglass').exists()).toBe(false)
    })
})
