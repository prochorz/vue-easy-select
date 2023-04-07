import { defineUserConfig, defaultTheme } from 'vuepress'

export default defineUserConfig({
    lang: 'en-US',
    title: 'Hello VuePress',
    description: 'Just playing around',
    theme: defaultTheme({
        navbar: [
            // NavbarItem
            {
                text: 'Foo',
                link: '/foo/',
            },
            // NavbarGroup
            {
                text: 'Group',
                children: ['/group/foo.md', '/group/bar.md'],
            },
            // string - page file path
            '/bar/README.md',
        ],
    }),
})