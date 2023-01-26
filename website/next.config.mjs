import nextMDX from '@next/mdx'
import { remarkPlugins } from './mdx/remark.mjs'
import { rehypePlugins } from './mdx/rehype.mjs'
import { recmaPlugins } from './mdx/recma.mjs'

const withMDX = nextMDX({
  extension: /\.(md|mdx)?$/,
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx', 'md'],
  experimental: {
    scrollRestoration: true,
  },
  async redirects() {
    return [
      {
        source: '/docs/:path*.html',
        destination: '/docs/:path*',
        // TODO enable permanent redirect when all pages are migrated
        permanent: false,
        // permanent: true,
      },
    ]
  },
}

export default withMDX(nextConfig)
