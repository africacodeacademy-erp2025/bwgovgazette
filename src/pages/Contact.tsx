"use client";

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function Contact() {
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-4 py-12 flex-col items-start">
          <div>
            <Badge>Contact Us</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
              Get in Touch
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              We’d love to hear from you. Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-10 pt-12 w-full">
            {/* Contact Form */}
            <div className="w-full md:w-1/2">
              <form className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first-name" className="sr-only">First Name</label>
                    <Input id="first-name" placeholder="First Name" />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="sr-only">Last Name</label>
                    <Input id="last-name" placeholder="Last Name" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <Input id="email" type="email" placeholder="Email" />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <Textarea id="message" placeholder="Message" rows={5} />
                </div>
                <Button type="submit">Send Message</Button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="w-full md:w-1/2 flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold">Email</h3>
                  <p className="text-muted-foreground">support@govgazette.example</p>
                  <p className="text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold">Phone</h3>
                  <p className="text-muted-foreground">+1 (000) 123-4567</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm CAT</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold">Office</h3>
                  <p className="text-muted-foreground">Gaborone, Botswana</p>
                  <p className="text-sm text-muted-foreground">Our team is fully remote.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
