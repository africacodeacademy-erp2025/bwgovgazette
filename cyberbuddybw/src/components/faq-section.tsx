import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { motion } from "framer-motion";

export const FaqSection: React.FC = () => {
  const faqs = [
    {
      question: "Do I need prior experience to start?",
      answer: "While some basic IT knowledge is helpful, our beginner paths are designed to start from the fundamentals. We provide all the necessary resources to help you build a strong foundation before advancing to more complex topics."
    },
    {
      question: "How often is the content updated?",
      answer: "We update our platform weekly with new challenges, labs, and learning materials. Our team constantly monitors the cybersecurity landscape to ensure our content reflects the latest threats and defense techniques."
    },
    {
      question: "Can I access the platform from anywhere?",
      answer: "Yes, our platform is cloud-based and accessible from anywhere with an internet connection. You'll need a modern web browser and the ability to run a virtual machine for some advanced labs."
    },
    {
      question: "Do you offer team or corporate training?",
      answer: "Absolutely! Our Enterprise plan is specifically designed for teams and organizations. We offer custom training environments, progress tracking, and team management features. Contact our sales team for a tailored solution."
    },
    {
      question: "How does the certification process work?",
      answer: "Upon completing a learning path, you'll take a practical assessment that tests your skills in a realistic environment. If successful, you'll receive a digital certificate that you can share on LinkedIn and with employers."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. We don't lock you into long-term contracts."
    }
  ];

  return (
    <section className="py-20 bg-background" id="faq">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-primary text-glow">Questions</span>
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Everything you need to know about our platform and services.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion variant="splitted">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                aria-label={faq.question} 
                title={faq.question}
                classNames={{
                  title: "text-foreground",
                  content: "text-foreground/70",
                  trigger: "bg-content1 data-[hover=true]:bg-content2",
                }}
              >
                {faq.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-foreground/70">
            Still have questions? <a href="#" className="text-primary hover:underline">Contact our support team</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};