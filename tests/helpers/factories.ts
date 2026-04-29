export function makeOptions(n = 3) {
    return Array.from({ length: n }, (_, i) => ({
        id: `id-${i}`,
        name: `Name ${i}`
    }))
}

export function makeNamedOptions(...names: string[]) {
    return names.map(name => ({ id: name, name }))
}

export function makeMixedOptions() {
    return [
        { id: 'a', name: 'Alpha' },
        { id: 'b', name: 'Beta', disabled: true },
        { id: 'c', name: 'Gamma' },
        { id: 'd', name: 'Delta', disabled: true },
        { id: 'e', name: 'Epsilon' }
    ]
}

export function makeAllDisabledOptions() {
    return [
        { id: 'a', name: 'A', disabled: true },
        { id: 'b', name: 'B', disabled: true }
    ]
}
