"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Eye, Check, FileText, Calendar, Users, Bell, Menu, X, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard, CardBody, CardDescription, CardTitle, CardVisual, Visual3 } from '@/components/ui/animated-card-chart';
import { FloatingAdminButton } from '@/components/ui/floating-admin-button';
import { Footerdemo } from '@/components/ui/footer-section';
import { SearchResults } from '@/components/SearchResults';
import { useSearch } from '@/hooks/useSearch';
import { Pricing } from '@/components/ui/pricing-section-with-comparison';
interface GazetteCard {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
}
const featuredGazettes: GazetteCard[] = [{
  id: '1',
  title: 'Construction of Gaborone-Francistown Highway Bridge',
  date: '2024-01-15',
  description: 'Major infrastructure tender for highway bridge construction connecting Botswana\'s two largest cities.',
  category: 'Infrastructure'
}, {
  id: '2',
  title: 'Supply of Medical Equipment to Princess Marina Hospital',
  date: '2024-01-12',
  description: 'Procurement tender for advanced medical equipment and devices to enhance healthcare delivery in Botswana.',
  category: 'Healthcare'
}, {
  id: '3',
  title: 'Modernization of Public Transportation Fleet',
  date: '2024-01-10',
  description: 'Botswana Government tender for procurement of modern, eco-friendly buses for public transport system.',
  category: 'Transport'
}, {
  id: '4',
  title: 'Solar Power Plant Development - Kalahari Region',
  date: '2024-01-08',
  description: 'Renewable energy project tender for solar power plant construction in Botswana\'s Kalahari region.',
  category: 'Energy'
}, {
  id: '5',
  title: 'Digital Education Infrastructure Upgrade',
  date: '2024-01-05',
  description: 'Technology procurement tender for digital learning infrastructure across Botswana schools.',
  category: 'Education'
}, {
  id: '6',
  title: 'Water Treatment Facility - Maun District',
  date: '2024-01-03',
  description: 'Water infrastructure development tender for new treatment facility serving Maun and surrounding areas.',
  category: 'Water & Sanitation'
}];
const benefits = ['Fast Access — no more waiting for printed copies', 'Searchable PDFs — OCR-enabled for text search', 'Secure & Verified documents', '24/7 availability'];
const howItWorksSteps = [{
  icon: Search,
  title: 'Search or browse gazettes',
  description: 'Find the documents you need quickly'
}, {
  icon: Eye,
  title: 'View online or download',
  description: 'Access content in your preferred format'
}, {
  icon: Bell,
  title: 'Subscribe for instant updates',
  description: 'Never miss important notices'
}];
function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Latest');
  const heroRef = useRef<HTMLElement>(null);
  const { results, loading, error, search, clearResults } = useSearch();
  const [planChoice, setPlanChoice] = useState<string | null>(null);

  const handleViewTender = (id: string) => {
    navigate(`/tender/${id}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      search(searchQuery);
    } else {
      clearResults();
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        heroRef.current.style.transform = `translateY(${rate}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setPlanChoice(localStorage.getItem('plan_choice'));
  }, []);
  const filteredGazettes = featuredGazettes.filter(gazette => {
    const matchesSearch = gazette.title.toLowerCase().includes(searchQuery.toLowerCase()) || gazette.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'Latest') return matchesSearch;
    if (activeFilter === 'This Month') {
      const gazetteDate = new Date(gazette.date);
      const currentDate = new Date();
      return matchesSearch && gazetteDate.getMonth() === currentDate.getMonth();
    }
    if (activeFilter === 'Categories') return matchesSearch;
    return matchesSearch;
  });
  const isSubscriber = planChoice === 'subscriber';
  return <div className="min-h-screen bg-background text-foreground">
      <HeroSection />

      {/* Search & Filters */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="max-w-4xl mx-auto">
            <div className="bg-background rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Search gazettes by title, content, or category (e.g., 'tax', 'business license')" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background" 
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {['Latest', 'This Month', 'Categories'].map(filter => <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-6 py-2 rounded-full transition-colors ${activeFilter === filter ? 'bg-primary text-primary-foreground' : 'bg-background border border-border hover:bg-accent'}`}>
                  {filter}
                </button>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Results or Featured Gazettes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {searchQuery ? (
            // Show search results when there's a search query
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }} 
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Search Results</h2>
                <p className="text-muted-foreground text-lg">Official gazette search with full-text matching</p>
              </motion.div>
              <SearchResults 
                results={results} 
                loading={loading} 
                error={error} 
                query={searchQuery} 
              />
            </div>
          ) : (
            // Show featured gazettes when no search query
            <div>
              <motion.div initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6
              }} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Gazettes</h2>
                <p className="text-muted-foreground text-lg">Latest official publications and notices</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGazettes.map((gazette, index) => (
                  <motion.div 
                    key={gazette.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6, delay: index * 0.1 }} 
                    className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {gazette.category}
                      </span>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {gazette.date}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-3 line-clamp-2">{gazette.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{gazette.description}</p>
                    
                    {isSubscriber ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewTender(gazette.id)}
                          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          View Gazette
                        </button>
                        <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm">
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Simple steps to access official documents</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.2
          }} className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Step {index + 1}</h3>
                <h4 className="font-medium mb-2">{step.title}</h4>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <Pricing />

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose govgazette?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => <motion.div key={index} initial={{
                opacity: 0,
                x: -20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} transition={{
                duration: 0.6,
                delay: index * 0.1
              }} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1 rounded-full mt-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </motion.div>)}
              </div>
            </motion.div>

          <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }} className="flex justify-center">
              <AnimatedCard>
                <CardVisual>
                  <Visual3 mainColor="hsl(var(--primary))" secondaryColor="hsl(var(--accent))" />
                </CardVisual>
                <CardBody>
                  <CardTitle>Why Choose Us?</CardTitle>
                  <CardDescription>
                    Reliable, fast, and comprehensive document access
                  </CardDescription>
                </CardBody>
              </AnimatedCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay ahead — never miss an important notice.
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Subscribe to our alerts and get notified instantly when new gazettes are published.
            </p>
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="bg-primary-foreground text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-foreground/90 transition-colors">
              Subscribe Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footerdemo />

      {/* Floating Admin Button */}
      <FloatingAdminButton />
    </div>;
}
export default Index;