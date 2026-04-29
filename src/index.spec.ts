import { describe, it, expect, vi } from 'vitest'

import lib, {
    install,
    VueEasyControl,
    VueEasyOptions,
    VueEasyWrapper,
    VueEasySelect
} from './index'

describe('public API', () => {
    it('exports the four public components', () => {
        expect(VueEasyControl).toBeTruthy()
        expect(VueEasyOptions).toBeTruthy()
        expect(VueEasyWrapper).toBeTruthy()
        expect(VueEasySelect).toBeTruthy()
    })

    it('exposes install as both a named export and the default export', () => {
        expect(install).toBeTypeOf('function')
        expect(lib.install).toBe(install)
    })

    it('install(app) registers all four components globally', () => {
        const calls: Array<[string, unknown]> = []
        const app = {
            component: (name: string, comp: unknown) => {
                calls.push([name, comp])
            }
        } as any
        install(app)
        const names = calls.map(([n]) => n).sort()
        expect(names).toEqual([
            'VueEasyControl',
            'VueEasyOptions',
            'VueEasySelect',
            'VueEasyWrapper'
        ])
        const map = Object.fromEntries(calls)
        expect(map.VueEasyControl).toBe(VueEasyControl)
        expect(map.VueEasyOptions).toBe(VueEasyOptions)
        expect(map.VueEasyWrapper).toBe(VueEasyWrapper)
        expect(map.VueEasySelect).toBe(VueEasySelect)
    })
})
