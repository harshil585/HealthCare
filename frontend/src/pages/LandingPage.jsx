import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  UserCheck, 
  Bot, 
  Activity, 
  FileText, 
  Search, 
  LayoutDashboard, 
  Video,
  Quote as QuoteIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quotes = [
    {
      text: "It is health that is real wealth and not pieces of gold and silver.",
      author: "Mahatma Gandhi"
    },
    {
      text: "Take care of your body. It’s the only place you have to live.",
      author: "Jim Rohn"
    },
    {
      text: "Wherever the art of medicine is loved, there is also a love of humanity.",
      author: "Hippocrates"
    }
  ];

  const features = [
    {
      icon: <Calendar size={24} />,
      title: "Smart Appointment Booking",
      desc: "Instant scheduling with real-time slot synchronization."
    },
    {
      icon: <UserCheck size={24} />,
      title: "Verified Doctors",
      desc: "Connect with certified medical professionals in your area."
    },
    {
      icon: <Bot size={24} />,
      title: "AI-Powered Assistance",
      desc: "Intelligent symptom analysis and health guidance."
    },
    {
      icon: <Activity size={24} />,
      title: "Real-Time Management",
      desc: "Track and update your appointments on the go."
    },
    {
      icon: <FileText size={24} />,
      title: "Secure Patient Records",
      desc: "Encrypted storage for your entire medical history."
    },
    {
      icon: <Search size={24} />,
      title: "Hospital Discovery",
      desc: "Locate and explore top-rated healthcare facilities."
    },
    {
      icon: <LayoutDashboard size={24} />,
      title: "Modern Dashboard",
      desc: "A clean, intuitive interface for all your health needs."
    },
    {
      icon: <Video size={24} />,
      title: "Online Consultation",
      desc: "High-definition video care from the comfort of home."
    }
  ];

  return (
    <div className="landing-page">
      {/* 1. Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1 className="hero-title">Your Health,<br/><span className="text-accent">Our Priority.</span></h1>
            <p className="hero-subtext">
              Connecting patients with trusted healthcare services through a modern and intelligent healthcare platform.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-premium">Get Started</Link>
              <Link to="/login" className="btn btn-outline">Sign In</Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hero-image-wrapper"
          >
            <img 
              src="/hero-illustration.png" 
              alt="Premium Healthcare" 
              className="hero-illustration"
            />
            <div className="soft-glow"></div>
          </motion.div>
        </div>
      </section>

      {/* 2. Inspirational Quotes Section */}
      <section className="quotes-section">
        <div className="container">
          <div className="section-header text-center">
            <QuoteIcon className="quote-main-icon mx-auto" size={40} />
          </div>
          <div className="quote-grid">
            {quotes.map((q, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="quote-card glass-card"
              >
                <p className="quote-text">{q.text}</p>
                <p className="quote-author">— {q.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header text-center mb-20">
            <h2 className="section-title">Platform Features</h2>
            <p className="section-subtitle">Intelligent tools designed for a seamless care experience.</p>
          </div>
          
          <div className="features-grid">
            {features.map((f, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="feature-card"
              >
                <div className="feature-icon-wrapper">
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="landing-footer py-12">
        <div className="container text-center">
          <p className="footer-logo">HealthCare+</p>
          <p className="footer-tagline">Compassionate Care Begins Here.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
