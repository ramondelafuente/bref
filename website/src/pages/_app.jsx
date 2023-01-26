import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'

import { DocsLayout } from '@/components/layouts/DocsLayout'
import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'

import '@/styles/tailwind.css'
import 'focus-visible'
import { Layout } from '@/components/layouts/Layout';

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('hashChangeStart', onRouteChange)
Router.events.on('routeChangeComplete', onRouteChange)
Router.events.on('routeChangeError', onRouteChange)

export default function App({ Component, pageProps }) {
  let router = useRouter()

  let isDocumentation = router.pathname.startsWith('/docs');

  return (
    <>
      <Head>
        {router.pathname === '/' ? (
          <title>Bref - Serverless PHP made simple</title>
        ) : (
          <title>{`${pageProps.title} - Bref`}</title>
        )}
        <meta name="description" content={pageProps.description ?? pageProps.introduction ?? ''} />
      </Head>
      <MDXProvider components={mdxComponents}>
          {isDocumentation ? (
              <DocsLayout {...pageProps}>
                  <Component {...pageProps} />
              </DocsLayout>
          ) : (
              <Layout {...pageProps}>
                  <Component {...pageProps} />
              </Layout>
          )}
      </MDXProvider>
    </>
  )
}
