import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'

import { mountContext } from '../../../tests/helpers/mount-context'
import {
    makeNamedOptions,
    makeMixedOptions,
    makeAllDisabledOptions
} from '../../../tests/helpers/factories'

describe('useProvide / context', () => {
    describe('localValue', () => {
        it('getter returns props.modelValue', () => {
            const { ctx } = mountContext({ modelValue: 'foo' })
            expect(ctx.localValue.value).toBe('foo')
        })

        it('setter emits update:modelValue', () => {
            const { wrapper, ctx } = mountContext({ modelValue: '' })
            ctx.localValue.value = 'bar'
            expect(wrapper.emitted('update:modelValue')).toEqual([['bar']])
        })
    })

    describe('localSearch', () => {
        it('returns props.searchValue when provided', () => {
            const { ctx } = mountContext({ searchValue: 'hello' })
            expect(ctx.localSearch.value).toBe('hello')
        })

        it('falls back to internal ref when searchValue is empty', async () => {
            const { ctx } = mountContext({ searchValue: '' })
            ctx.localSearch.value = 'typed'
            await nextTick()
            expect(ctx.localSearch.value).toBe('typed')
        })

        it('setter emits update:searchValue', () => {
            const { wrapper, ctx } = mountContext({ searchValue: '' })
            ctx.localSearch.value = 'q'
            expect(wrapper.emitted('update:searchValue')).toEqual([['q']])
        })
    })

    describe('normalizeOptions', () => {
        it('passes object arrays through', () => {
            const options = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]
            const { ctx } = mountContext({ options })
            expect(ctx.normalizeOptions.value).toEqual(options)
        })

        it('normalizes string[] to {id,name} using default fields', () => {
            const { ctx } = mountContext({ options: ['x', 'y'] })
            expect(ctx.normalizeOptions.value).toEqual([
                { id: 'x', name: 'x' },
                { id: 'y', name: 'y' }
            ])
        })

        it('honors custom keyField/nameField when normalizing strings', () => {
            const { ctx } = mountContext({
                options: ['a', 'b'],
                keyField: 'value',
                nameField: 'label'
            })
            expect(ctx.normalizeOptions.value).toEqual([
                { value: 'a', label: 'a' },
                { value: 'b', label: 'b' }
            ])
        })
    })

    describe('localOptions', () => {
        it('attaches a composed `key` field', () => {
            const { ctx } = mountContext({ options: makeNamedOptions('Alpha') })
            expect(ctx.localOptions.value[0].key).toBe('Alpha_Alpha')
        })

        it('marks isChecked for the selected single value', () => {
            const { ctx } = mountContext({
                options: makeNamedOptions('A', 'B'),
                modelValue: 'B'
            })
            expect(ctx.localOptions.value.map(o => o.isChecked)).toEqual([false, true])
        })

        it('marks isChecked for each value in multiple mode', () => {
            const { ctx } = mountContext({
                options: makeNamedOptions('A', 'B', 'C'),
                isMultiple: true,
                modelValue: ['A', 'C']
            })
            expect(ctx.localOptions.value.map(o => o.isChecked)).toEqual([true, false, true])
        })

        it('propagates per-option disabled flag', () => {
            const { ctx } = mountContext({ options: makeMixedOptions() })
            expect(ctx.localOptions.value.map(o => o.disabled)).toEqual([false, true, false, true, false])
        })

        it('forces every option disabled when global isDisabled is true', () => {
            const { ctx } = mountContext({
                options: makeNamedOptions('A', 'B'),
                isDisabled: true
            })
            expect(ctx.localOptions.value.every(o => o.disabled === true)).toBe(true)
        })

        it('filters case-insensitively by nameField when not isRemoteSearch', () => {
            const { ctx } = mountContext({
                options: makeNamedOptions('Apple', 'Banana', 'avocado')
            })
            ctx.localSearch.value = 'a'
            expect(ctx.localOptions.value.map(o => o.name)).toEqual(['Apple', 'Banana', 'avocado'])
            ctx.localSearch.value = 'AP'
            expect(ctx.localOptions.value.map(o => o.name)).toEqual(['Apple'])
        })

        it('does NOT filter when isRemoteSearch is true', () => {
            const { ctx } = mountContext({
                options: makeNamedOptions('Apple', 'Banana'),
                isRemoteSearch: true
            })
            ctx.localSearch.value = 'zzz'
            expect(ctx.localOptions.value).toHaveLength(2)
        })

        it('produces distinct keys for duplicate keyField with different nameField', () => {
            const { ctx } = mountContext({
                options: [
                    { id: 'x', name: 'One' },
                    { id: 'x', name: 'Two' }
                ]
            })
            const keys = ctx.localOptions.value.map(o => o.key)
            expect(new Set(keys).size).toBe(2)
        })
    })

    describe('currentState', () => {
        it('returns the matching option in single mode', () => {
            const options = makeNamedOptions('A', 'B')
            const { ctx } = mountContext({ options, modelValue: 'B' })
            expect(ctx.currentState.value).toEqual(options[1])
        })

        it('returns undefined in single mode when nothing matches', () => {
            const { ctx } = mountContext({
                options: makeNamedOptions('A'),
                modelValue: 'Z'
            })
            expect(ctx.currentState.value).toBeUndefined()
        })

        it('returns the array of matching options in multiple mode', () => {
            const options = makeNamedOptions('A', 'B', 'C')
            const { ctx } = mountContext({
                options,
                isMultiple: true,
                modelValue: ['A', 'C']
            })
            expect(ctx.currentState.value).toEqual([options[0], options[2]])
        })

        it('returns [] in multiple mode when nothing selected', () => {
            const { ctx } = mountContext({
                options: makeNamedOptions('A'),
                isMultiple: true,
                modelValue: []
            })
            expect(ctx.currentState.value).toEqual([])
        })
    })

    describe('selectHandler — single mode', () => {
        it('emits a new value on first selection', () => {
            const { wrapper, ctx } = mountContext({
                options: makeNamedOptions('A', 'B'),
                modelValue: ''
            })
            ctx.selectHandler(ctx.localOptions.value[1])
            expect(wrapper.emitted('update:modelValue')).toEqual([['B']])
        })

        it('with isAllowEmpty:false re-emits the same value when clicking the selected one', () => {
            const { wrapper, ctx } = mountContext({
                options: makeNamedOptions('A', 'B'),
                modelValue: 'A'
            })
            ctx.selectHandler(ctx.localOptions.value[0])
            expect(wrapper.emitted('update:modelValue')).toEqual([['A']])
        })

        it('with isAllowEmpty:true emits empty string when clicking the selected one', () => {
            const { wrapper, ctx } = mountContext({
                options: makeNamedOptions('A'),
                modelValue: 'A',
                isAllowEmpty: true
            })
            ctx.selectHandler(ctx.localOptions.value[0])
            expect(wrapper.emitted('update:modelValue')).toEqual([['']])
        })

        it('does nothing when option is disabled', () => {
            const { wrapper, ctx } = mountContext({
                options: makeMixedOptions(),
                modelValue: ''
            })
            ctx.selectHandler(ctx.localOptions.value[1])
            expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        })
    })

    describe('selectHandler — multiple mode', () => {
        it('appends a new value', () => {
            const { wrapper, ctx } = mountContext({
                options: makeNamedOptions('A', 'B'),
                isMultiple: true,
                modelValue: ['A']
            })
            ctx.selectHandler(ctx.localOptions.value[1])
            expect(wrapper.emitted('update:modelValue')).toEqual([[['A', 'B']]])
        })

        it('removes an existing value', () => {
            const { wrapper, ctx } = mountContext({
                options: makeNamedOptions('A', 'B', 'C'),
                isMultiple: true,
                modelValue: ['A', 'B', 'C']
            })
            ctx.selectHandler(ctx.localOptions.value[1])
            expect(wrapper.emitted('update:modelValue')).toEqual([[['A', 'C']]])
        })

        it('does nothing when option is disabled', () => {
            const { wrapper, ctx } = mountContext({
                options: makeMixedOptions(),
                isMultiple: true,
                modelValue: []
            })
            ctx.selectHandler(ctx.localOptions.value[1])
            expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        })
    })

    describe('checkSelectedValue', () => {
        it('returns equality in single mode', () => {
            const { ctx } = mountContext({ modelValue: 'A' })
            expect(ctx.checkSelectedValue('A')).toBe(true)
            expect(ctx.checkSelectedValue('B')).toBe(false)
        })

        it('returns includes in multiple mode', () => {
            const { ctx } = mountContext({ isMultiple: true, modelValue: ['A', 'C'] })
            expect(ctx.checkSelectedValue('A')).toBe(true)
            expect(ctx.checkSelectedValue('B')).toBe(false)
            expect(ctx.checkSelectedValue('C')).toBe(true)
        })
    })

    describe('clearValue', () => {
        it('emits empty string in single mode', () => {
            const { wrapper, ctx } = mountContext({ modelValue: 'A' })
            ctx.clearValue()
            expect(wrapper.emitted('update:modelValue')).toEqual([['']])
        })

        it('emits empty array in multiple mode', () => {
            const { wrapper, ctx } = mountContext({ isMultiple: true, modelValue: ['A'] })
            ctx.clearValue()
            expect(wrapper.emitted('update:modelValue')).toEqual([[[]]])
        })

        it('does nothing when isDisabled', () => {
            const { wrapper, ctx } = mountContext({ isDisabled: true, modelValue: 'A' })
            ctx.clearValue()
            expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        })
    })

    describe('activeIndex helpers', () => {
        it('starts at -1', () => {
            const { ctx } = mountContext({ options: makeNamedOptions('A', 'B') })
            expect(ctx.activeIndex.value).toBe(-1)
        })

        it('setActiveIndex updates the value', () => {
            const { ctx } = mountContext({ options: makeNamedOptions('A', 'B') })
            ctx.setActiveIndex(1)
            expect(ctx.activeIndex.value).toBe(1)
        })

        it('resetActive sets it back to -1', () => {
            const { ctx } = mountContext({ options: makeNamedOptions('A', 'B') })
            ctx.setActiveIndex(1)
            ctx.resetActive()
            expect(ctx.activeIndex.value).toBe(-1)
        })
    })

    describe('moveActive', () => {
        it('does nothing when options list is empty', () => {
            const { ctx } = mountContext({ options: [] })
            ctx.moveActive(1)
            expect(ctx.activeIndex.value).toBe(-1)
        })

        it('starting at -1 with delta=1 lands on first enabled', () => {
            const { ctx } = mountContext({ options: makeMixedOptions() })
            ctx.moveActive(1)
            expect(ctx.activeIndex.value).toBe(0)
        })

        it('wraps from last to first when going forward', () => {
            const { ctx } = mountContext({ options: makeNamedOptions('A', 'B', 'C') })
            ctx.setActiveIndex(2)
            ctx.moveActive(1)
            expect(ctx.activeIndex.value).toBe(0)
        })

        it('wraps from first to last when going backward', () => {
            const { ctx } = mountContext({ options: makeNamedOptions('A', 'B', 'C') })
            ctx.setActiveIndex(0)
            ctx.moveActive(-1)
            expect(ctx.activeIndex.value).toBe(2)
        })

        it('skips disabled options when moving forward', () => {
            const { ctx } = mountContext({ options: makeMixedOptions() })
            ctx.setActiveIndex(0)
            ctx.moveActive(1)
            expect(ctx.activeIndex.value).toBe(2)
        })

        it('skips disabled options when moving backward', () => {
            const { ctx } = mountContext({ options: makeMixedOptions() })
            ctx.setActiveIndex(2)
            ctx.moveActive(-1)
            expect(ctx.activeIndex.value).toBe(0)
        })

        it('leaves activeIndex unchanged when every option is disabled', () => {
            const { ctx } = mountContext({ options: makeAllDisabledOptions() })
            ctx.setActiveIndex(-1)
            ctx.moveActive(1)
            expect(ctx.activeIndex.value).toBe(-1)
        })
    })

    describe('selectActive', () => {
        it('selects the option at activeIndex', () => {
            const { wrapper, ctx } = mountContext({
                options: makeNamedOptions('A', 'B'),
                modelValue: ''
            })
            ctx.setActiveIndex(1)
            ctx.selectActive()
            expect(wrapper.emitted('update:modelValue')).toEqual([['B']])
        })

        it('does nothing when activeIndex points at a disabled option', () => {
            const { wrapper, ctx } = mountContext({
                options: makeMixedOptions(),
                modelValue: ''
            })
            ctx.setActiveIndex(1)
            ctx.selectActive()
            expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        })

        it('does nothing when activeIndex is -1', () => {
            const { wrapper, ctx } = mountContext({
                options: makeNamedOptions('A'),
                modelValue: ''
            })
            ctx.selectActive()
            expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        })
    })

    describe('listId / getOptionId', () => {
        it('listId starts with vue-easy-select-', () => {
            const { ctx } = mountContext({})
            expect(ctx.listId).toMatch(/^vue-easy-select-/)
        })

        it('every useProvide call gets a unique listId', () => {
            const a = mountContext({})
            const b = mountContext({})
            expect(a.ctx.listId).not.toBe(b.ctx.listId)
        })

        it('getOptionId composes from listId and index', () => {
            const { ctx } = mountContext({})
            expect(ctx.getOptionId(3)).toBe(`${ctx.listId}-option-3`)
        })
    })
})
