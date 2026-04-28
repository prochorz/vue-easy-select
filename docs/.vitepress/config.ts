import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VueEasySelect",
  description: "Flexible select component for Vue 3",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'VueEasySelect', link: '/vue-easy-select' }
    ],

    sidebar: [
      {
        text: 'Components',
        items: [
          { text: 'VueEasySelect', link: '/vue-easy-select' },
          { text: 'VueEasySelect (multiple)', link: '/vue-easy-multiple-select' },
          { text: 'VueEasyWrapper', link: '/vue-easy-wrapper' }
        ]
      }
    ]
  }
})
