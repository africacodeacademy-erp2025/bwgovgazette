import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, DollarSign, Clock, FileText, Download, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
interface TenderDetails {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  publishDate: string;
  closingDate: string;
  estimatedValue: string;
  location: string;
  requirements: string[];
  contactInfo: {
    department: string;
    officer: string;
    email: string;
    phone: string;
  };
}
const botswanaTenders: Record<string, TenderDetails> = {
  '1': {
    id: '1',
    title: 'Construction of Gaborone-Francistown Highway Bridge',
    description: 'Infrastructure development project for bridge construction',
    fullDescription: 'The Government of Botswana through the Ministry of Transport and Communications invites sealed bids from qualified contractors for the construction of a new highway bridge connecting Gaborone and Francistown. This major infrastructure project aims to improve transportation efficiency and reduce travel time between the two cities.',
    category: 'Infrastructure',
    publishDate: '2024-01-15',
    closingDate: '2024-03-15',
    estimatedValue: 'BWP 85,000,000',
    location: 'Gaborone - Francistown Highway, Botswana',
    requirements: ['Valid contractor registration with Botswana Public Procurement and Asset Disposal Board (PPADB)', 'Minimum 10 years experience in highway bridge construction', 'ISO 9001:2015 Quality Management System certification', 'Valid tax clearance certificate from Botswana Unified Revenue Service (BURS)', 'Environmental impact assessment compliance'],
    contactInfo: {
      department: 'Ministry of Transport and Communications',
      officer: 'Eng. Thabo Mokoena',
      email: 'tmokoena@gov.bw',
      phone: '+267 318 4400'
    }
  },
  '2': {
    id: '2',
    title: 'Supply of Medical Equipment to Princess Marina Hospital',
    description: 'Procurement of advanced medical equipment and devices',
    fullDescription: 'The Ministry of Health and Wellness, Government of Botswana, invites competitive bids for the supply and installation of advanced medical equipment to Princess Marina Hospital in Gaborone. This procurement includes MRI machines, CT scanners, dialysis equipment, and other critical medical devices to enhance healthcare delivery.',
    category: 'Healthcare',
    publishDate: '2024-01-12',
    closingDate: '2024-02-28',
    estimatedValue: 'BWP 45,000,000',
    location: 'Princess Marina Hospital, Gaborone',
    requirements: ['Authorized dealer/distributor certificate from equipment manufacturer', 'ISO 13485 Medical Device Quality Management System', 'Valid import license from Botswana Medicines Regulatory Authority (BoMRA)', 'After-sales support and maintenance agreement', 'Training program for hospital staff included'],
    contactInfo: {
      department: 'Ministry of Health and Wellness',
      officer: 'Dr. Keabetswe Segwabe',
      email: 'ksegwabe@gov.bw',
      phone: '+267 395 3000'
    }
  },
  '3': {
    id: '3',
    title: 'Modernization of Public Transportation Fleet',
    description: 'Procurement of modern buses for public transport system',
    fullDescription: 'The Botswana Government through the Ministry of Transport and Communications seeks to modernize the public transportation system by procuring eco-friendly, modern buses. This tender covers the supply of 150 buses with modern amenities including air conditioning, GPS tracking, and accessibility features for persons with disabilities.',
    category: 'Transport',
    publishDate: '2024-01-10',
    closingDate: '2024-04-10',
    estimatedValue: 'BWP 120,000,000',
    location: 'Major routes across Botswana',
    requirements: ['Euro 6 emission standards compliance', 'Minimum 5-year comprehensive warranty', 'Local assembly or significant local content preferred', 'Driver training program inclusion', 'GPS fleet management system integration'],
    contactInfo: {
      department: 'Ministry of Transport and Communications',
      officer: 'Mr. Kabelo Motsumi',
      email: 'kmotsumi@gov.bw',
      phone: '+267 318 4500'
    }
  }
};
function TenderView() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [tender, setTender] = useState<TenderDetails | null>(null);
  const [showSimulationAlert, setShowSimulationAlert] = useState(true);
  useEffect(() => {
    if (id && botswanaTenders[id]) {
      setTender(botswanaTenders[id]);
    }
  }, [id]);
  useEffect(() => {
    // Show simulation popup on component mount
    if (showSimulationAlert) {
      toast({
        title: "⚠️ Simulation Mode",
        description: "This is a demonstration tender system. All data shown is simulated for educational purposes.",
        duration: 8000
      });
    }
  }, [showSimulationAlert]);
  if (!tender) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tender Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested tender could not be found.</p>
          <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background text-foreground">
      {/* Simulation Alert Banner */}
      {showSimulationAlert && <motion.div initial={{
      opacity: 0,
      y: -50
    }} animate={{
      opacity: 1,
      y: 0
    }} className="border-l-4 border-yellow-400 p-4 bg-white rounded-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-black">
                <strong className="bg-teal-200">Simulation Mode:</strong> This is a demonstration of the Botswana Government tender system. All data is simulated.
              </p>
            </div>
            <button onClick={() => setShowSimulationAlert(false)} className="text-yellow-600 hover:text-yellow-800">
              ×
            </button>
          </div>
        </motion.div>}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gazettes
          </Link>
          
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">
            {tender.category}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{tender.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Published: {tender.publishDate}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Closes: {tender.closingDate}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {tender.location}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tender Details */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-2xl font-semibold mb-4">Project Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {tender.fullDescription}
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
              <ul className="space-y-3">
                {tender.requirements.map((requirement, index) => <li key={index} className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded-full mt-1 mr-3 shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <span className="text-muted-foreground">{requirement}</span>
                  </li>)}
              </ul>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="space-y-6">
            {/* Estimated Value */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center mb-3">
                <DollarSign className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Estimated Value</h3>
              </div>
              <p className="text-2xl font-bold text-primary">{tender.estimatedValue}</p>
            </div>

            {/* Contact Information */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Department</p>
                  <p className="text-muted-foreground">{tender.contactInfo.department}</p>
                </div>
                <div>
                  <p className="font-medium">Contact Officer</p>
                  <p className="text-muted-foreground">{tender.contactInfo.officer}</p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-primary">{tender.contactInfo.email}</p>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">{tender.contactInfo.phone}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="space-y-3">
                <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download Tender Document
                </button>
                <button className="w-full border border-border py-3 rounded-lg hover:bg-accent transition-colors flex items-center justify-center">
                  <FileText className="h-4 w-4 mr-2" />
                  View Specifications
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>;
}
export default TenderView;