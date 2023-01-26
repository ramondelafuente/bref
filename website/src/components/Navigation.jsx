import { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'

import { Button } from '@/components/Button'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'

function useInitialValue(value, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({ href, children }) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

function NavLink({ href, tag, active, title, isAnchorLink = false, children }) {
  return (
    <Link
      href={href}
      title={title}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}

function VisibleSectionHighlight({ group, pathname }) {
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    useIsInsideMobileNavigation()
  )

  let isPresent = useIsPresent()
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      (section) => section.id === visibleSections[0]
    )
  )
  let itemHeight = remToPx(2)
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight
  let top =
    group.links.findIndex((link) => link.href === pathname) * itemHeight +
    firstVisibleSectionIndex * itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({ group, pathname }) {
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  let activePageIndex = group.links.findIndex((link) => link.href === pathname)
  let top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-blue-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({ group, className }) {
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [router, sections] = useInitialValue(
    [useRouter(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation
  )

  let isActiveGroup =
    group.links.findIndex((link) => link.href === router.pathname) !== -1

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={router.pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={router.pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} title={link.description} active={link.href === router.pathname}>
                {link.title}
              </NavLink>
              <AnimatePresence mode="popLayout" initial={false}>
                {link.href === router.pathname && sections.length > 0 && (
                  <motion.ul
                    role="list"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                  >
                    {sections.map((section) => (
                      <li key={section.id}>
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export const navigation = [
  {
    title: 'Getting started',
    links: [
      { title: 'What is Bref and serverless?', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'First steps', href: '/docs/first-steps' },
      { title: 'Introduction to PHP runtimes', href: '/docs/runtimes' },
    ],
  },
  {
    title: 'Bref for web apps',
    links: [
      { title: 'Web apps on AWS Lambda', href: '/docs/runtimes/http' },
      { title: 'Website assets', href: '/docs/websites' },
      { title: 'Console commands', href: '/docs/runtimes/console' },
      { title: 'Cron commands', href: '/docs/web-apps/cron', description: 'CLI cron tasks' },
      { title: 'Local development', href: '/docs/web-apps/local-development' },
      { title: 'Docker', href: '/docs/web-apps/docker' },
    ],
  },
  {
    title: 'Frameworks',
    links: [
      { title: 'Laravel', href: '/docs/frameworks/laravel', description: 'Learn how to deploy serverless Laravel applications' },
      { title: 'Symfony', href: '/docs/frameworks/symfony', description: 'Learn how to deploy serverless Symfony applications' },
    ],
  },
  {
    title: 'Bref for event-driven functions',
    links: [
      { title: 'PHP functions on AWS Lambda', href: '/docs/runtimes/function' },
      { title: 'Typed handlers', href: '/docs/function/handlers' },
      { title: 'Local development', href: '/docs/function/local-development' },
      { title: 'Cron functions', href: '/docs/function/cron' },
    ],
  },
  {
    title: 'Workflow',
    links: [
      { title: 'Deployment', href: '/docs/deploy' },
    ],
  },
  {
    title: 'Environment',
    links: [
      { title: 'serverless.yml', href: '/docs/environment/serverless-yml', description: 'Configure your application with the serverless.yml file' },
      { title: 'PHP', href: '/docs/environment/php', description: 'Configuring PHP versions and options with Bref' },
      { title: 'Environment variables', href: '/docs/environment/variables', description: 'Configuring environment variables with Bref' },
      { title: 'Logs', href: '/docs/environment/logs', description: 'Managing logs with Bref on AWS Lambda' },
      { title: 'Storage', href: '/docs/environment/storage', description: 'Storing files and data with Bref on AWS Lambda' },
      { title: 'Databases', href: '/docs/environment/database', description: 'Using a database with PHP on AWS Lambda' },
      { title: 'Custom domains', href: '/docs/environment/custom-domains' },
      { title: 'Performance', href: '/docs/environment/performances', description: 'Performance tuning and optimizations' },
    ],
  },
  {
    title: 'Learning',
    links: [
      { title: 'Course', href: 'https://serverless-visually-explained.com/?ref=bref-menu', description: 'Serverless Visually Explained' },
      { title: 'Community', href: '/docs/community', description: 'Where to learn and exchange about Bref' },
      { title: 'Case studies', href: '/docs/case-studies', description: 'A collection of case studies of serverless PHP applications built using Bref' },
    ],
  },
  {
    title: 'Ecosystem',
    links: [
      { title: 'GitHub', href: 'https://github.com/brefphp', description: 'Bref on GitHub' },
      { title: 'Twitter', href: 'https://twitter.com/brefphp', description: 'Bref on Twitter' },
      { title: 'Bref Dashboard', href: 'https://dashboard.bref.sh/?ref=bref', description: 'Bref Dashboard' },
    ],
  },
]

export function Navigation(props) {
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/" title="Bref - Serverless PHP made simple">Home</TopLevelNavItem>
        <TopLevelNavItem href="/docs" title="Bref documentation for serverless PHP applications">Documentation</TopLevelNavItem>
        <TopLevelNavItem href="/docs/news" title="Bref news">News</TopLevelNavItem>
        <TopLevelNavItem href="https://github.com/brefphp/bref" title="Bref on GitHub">
          <svg className="fill-current inline opacity-50 w-4 h-4 -mt-1 mr-2" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 20 20"><title>GitHub</title>
            <path
                d="M10 0a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 10 0"></path>
          </svg>
          GitHub
        </TopLevelNavItem>
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 && 'md:mt-0'}
          />
        ))}
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button href="#" variant="filled" className="w-full">
            Sign in
          </Button>
        </li>
      </ul>
    </nav>
  )
}
