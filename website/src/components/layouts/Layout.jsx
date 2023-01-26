import Link from 'next/link'
import { motion } from 'framer-motion'

import { Footer } from '@/components/Footer'
import { DocsHeader } from '@/components/DocsHeader'
import { Logo } from '@/components/Logo'
import { Navigation } from '@/components/Navigation'
import { Prose } from '@/components/Prose'
import { SectionProvider } from '@/components/SectionProvider'
import { Header } from '@/components/Header';

export function Layout({ children, sections = [] }) {
  return (
    <SectionProvider sections={sections}>
      <div className="max-w-4xl mx-auto">
        <motion.header
          layoutScroll
          className="fixed inset-y-0 left-0 z-40 contents px-6 pt-4 pb-8 dark:border-white/10 lg:block"
        >
          <Header />
        </motion.header>
        <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
          <main className="py-16">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SectionProvider>
  )
}
