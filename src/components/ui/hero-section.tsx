'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { cn } from '@/lib/utils';
import { Menu, X, FileText } from 'lucide-react';
export function HeroSection() {
  const navigate = useNavigate();
  return <>
            <HeroHeader />
            <main className="overflow-x-hidden">
                <section>
                    <div className="pb-8 pt-8 md:pb-12 lg:pb-16 lg:pt-24">
                        <div className="relative mx-auto max-w-5xl px-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                <div className="text-center lg:text-left">
                                    <h1 className="max-w-xl text-balance text-3xl font-medium md:text-4xl lg:text-5xl">Your Trusted Source for <span className="text-primary">Official Gazettes</span> & Public Notices</h1>
                                    <p className="mt-4 max-w-xl text-pretty text-base md:text-lg">Search, read, and download the latest publications — anytime, anywhere.</p>

                                    <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                        <Button size="default" className="px-4 text-sm">
                                            <span className="text-nowrap">Browse Gazettes</span>
                                        </Button>
                                        <Button key={2} size="default" variant="ghost" className="px-4 text-sm" onClick={() => navigate('/subscription')}>
                                            <span className="text-nowrap">Subscribe for Alerts</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="order-first lg:order-last">
                                    <img className="pointer-events-none w-full h-48 sm:h-64 lg:h-80 object-cover invert dark:mix-blend-lighten dark:invert-0" src="https://ik.imagekit.io/lrigu76hy/tailark/abstract-bg.jpg?updatedAt=1745733473768" alt="Abstract Object" height="4000" width="3000" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-white border-t py-8">
                    <div className="mx-auto max-w-5xl px-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">Trusted by Thousands</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Join thousands of users who rely on our platform for official document access
                            </p>
                            <div className="grid grid-cols-2 gap-8 text-center max-w-sm mx-auto">
                                <div>
                                    <div className="text-2xl font-bold text-primary">0K+</div>
                                    <div className="text-sm text-muted-foreground">Documents</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary">K+</div>
                                    <div className="text-sm text-muted-foreground">Users</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
            </main>
        </>;
}
const menuItems = [{
  name: 'Browse',
  href: '#'
}, {
  name: 'Categories',
  href: '#'
}, {
  name: 'About',
  href: '#'
}, {
  name: 'Contact',
  href: '#'
}];
const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const navigate = useNavigate();
  return <header>
            <nav data-state={menuState && 'active'} className="group bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl">
                <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <a href="/" aria-label="home" className="flex items-center space-x-2">
                                <FileText className="h-8 w-8 text-primary" />
                                <span className="text-2xl font-bold">govgazette</span>
                            </a>

                            <button onClick={() => setMenuState(!menuState)} aria-label={menuState == true ? 'Close Menu' : 'Open Menu'} className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => <li key={index}>
                                            <a href={item.href} className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </a>
                                        </li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => <li key={index}>
                                            <a href={item.href} className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </a>
                                        </li>)}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                                    <span>Login</span>
                                </Button>
                                <Button size="sm" onClick={() => navigate('/signup')}>
                                    <span>Sign Up</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>;
};