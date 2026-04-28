---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "VueEasySelect"
  text: "Flexible select for Vue 3"
  tagline: Composable primitives plus a ready-to-use opinionated select. Single/multiple, searchable, slot-driven, form-friendly.
  actions:
    - theme: brand
      text: Get started
      link: /vue-easy-select
    - theme: alt
      text: Composable wrapper
      link: /vue-easy-wrapper
    - theme: alt
      text: GitHub
      link: https://github.com/pzimon/vue-easy-select

features:
  - title: No chrome by default
    details: The primitives ship zero borders, shadows, or container styling. You wrap them in whatever fits your design system instead of fighting theirs.
  - title: Every piece is a slot
    details: Arrow, option item, selected state, search icon, empty state — all overridable. State is shared via provide/inject, so primitives stay in sync no matter where they live in the DOM.
  - title: Accessible by default
    details: Keyboard navigation (Arrow/Enter/Escape/Space), ARIA combobox+listbox semantics, and a hidden native select for form submission come out of the box.
---

## Why vue-easy-select?

Off-the-shelf selects are a dead end — they ship a visual design you didn't pick and a dropdown you can't reach into. `vue-easy-select` takes the opposite stance: **minimum UI, maximum configurability**. Use [`VueEasySelect`](/vue-easy-select) when you want it to just work, or compose [`VueEasyWrapper`](/vue-easy-wrapper) with your own popper and chrome when you need full layout control.

