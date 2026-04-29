import { describe, it, expect } from 'vitest'

import VueEasyStateMultiple from '../index'
import { mountWithContext } from '../../../../tests/helpers/mount-with-context'
import { makeNamedOptions } from '../../../../tests/helpers/factories'

describe('VueEasyStateMultiple', () => {
    it('renders a chip per item in currentState', () => {
        const { wrapper } = mountWithContext(VueEasyStateMultiple, {
            contextProps: {
                isMultiple: true,
                modelValue: ['A', 'C'],
                options: makeNamedOptions('A', 'B', 'C')
            }
        })
        const chips = wrapper.findAll('.vue-easy-state-multiple__item')
        expect(chips).toHaveLength(2)
        expect(chips[0].text()).toContain('A')
        expect(chips[1].text()).toContain('C')
    })

    it('renders nothing when nothing is selected', () => {
        const { wrapper } = mountWithContext(VueEasyStateMultiple, {
            contextProps: { isMultiple: true, modelValue: [], options: makeNamedOptions('A') }
        })
        expect(wrapper.findAll('.vue-easy-state-multiple__item')).toHaveLength(0)
    })

    it('clicking the cross deselects that item', async () => {
        const { wrapper, parent } = mountWithContext(VueEasyStateMultiple, {
            contextProps: {
                isMultiple: true,
                modelValue: ['A', 'B'],
                options: makeNamedOptions('A', 'B')
            }
        })
        const cross = wrapper.findAll('.vue-easy-state-multiple__cross')[0]
        await cross.trigger('click')
        expect(parent.emitted('update:modelValue')?.[0]).toEqual([['B']])
    })
})
