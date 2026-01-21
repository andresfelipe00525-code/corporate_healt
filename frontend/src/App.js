import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import { ClipboardCheck, Stethoscope, FileCheck, Monitor, HeartPulse, GraduationCap, Menu, X, Phone, MapPin, Mail, Clock, ChevronDown, Check } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Icon mapping
const iconMap = {
  "clipboard-check": ClipboardCheck,
  "stethoscope": Stethoscope,
  "file-check": FileCheck,
  "monitor": Monitor,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
};

// Service images
const serviceImages = [
  "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1631815590016-ebce183022ce?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
  "https://images.pexels.com/photos/7563580/pexels-photo-7563580.jpeg?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1516841273335-e39b37888115?w=400&h=300&fit=crop",
  "https://images.pexels.com/photos/4421494/pexels-photo-4421494.jpeg?w=400&h=300&fit=crop",
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [services, setServices] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API}/services`);
        setServices(response.data);
      } catch (e) {
        console.error("Error fetching services:", e);
        // Fallback services
        setServices([
          { id: "1", title: "Medical Evaluations", description: "Occupational medical examinations to monitor the health of your workers.", icon: "clipboard-check" },
          { id: "2", title: "Occupational Exams", description: "Specialized tests to detect workplace risks and occupational diseases.", icon: "stethoscope" },
          { id: "3", title: "Work Certificates", description: "Issuance of work aptitude certificates to comply with regulations.", icon: "file-check" },
          { id: "4", title: "Online Platform", description: "Consult and download certificates from our web portal.", icon: "monitor" },
          { id: "5", title: "Health Programs", description: "Comprehensive health and wellness programs for your workforce.", icon: "heart-pulse" },
          { id: "6", title: "Safety Training", description: "Training and education on workplace safety and health protocols.", icon: "graduation-cap" },
        ]);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API}/contact`, formData);
      setSubmitStatus({ type: "success", message: response.data.message });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Error sending message. Please try again." });
    }
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" data-testid="corporate-health-app">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50" data-testid="header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3" data-testid="logo">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <HeartPulse className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">Corporate Health</h1>
                <p className="text-xs text-blue-600">Occupational Safety</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" data-testid="desktop-nav">
              <button onClick={() => scrollToSection("home")} className="text-gray-700 hover:text-blue-600 transition font-medium">Home</button>
              <button onClick={() => scrollToSection("about")} className="text-gray-700 hover:text-blue-600 transition font-medium">About Us</button>
              <button onClick={() => scrollToSection("services")} className="text-gray-700 hover:text-blue-600 transition font-medium">Services</button>
              <button onClick={() => scrollToSection("hours")} className="text-gray-700 hover:text-blue-600 transition font-medium">Hours</button>
              <button onClick={() => scrollToSection("contact")} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-600/30">
                Contact
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} data-testid="mobile-menu-btn">
              {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <nav className="md:hidden py-4 border-t" data-testid="mobile-nav">
              <div className="flex flex-col space-y-3">
                <button onClick={() => scrollToSection("home")} className="text-gray-700 hover:text-blue-600 transition py-2">Home</button>
                <button onClick={() => scrollToSection("about")} className="text-gray-700 hover:text-blue-600 transition py-2">About Us</button>
                <button onClick={() => scrollToSection("services")} className="text-gray-700 hover:text-blue-600 transition py-2">Services</button>
                <button onClick={() => scrollToSection("hours")} className="text-gray-700 hover:text-blue-600 transition py-2">Hours</button>
                <button onClick={() => scrollToSection("contact")} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">Contact</button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 relative overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-700/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516841273335-e39b37888115?w=1920&h=1080&fit=crop')] bg-cover bg-center"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Occupational Safety & Health
              </h2>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                We protect the health of your workers with reliable, fast, and certified occupational medical services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => scrollToSection("services")}
                  className="bg-white text-blue-700 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition shadow-xl flex items-center justify-center gap-2"
                  data-testid="download-certificates-btn"
                >
                  <FileCheck className="w-5 h-5" />
                  Download Certificates
                </button>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition flex items-center justify-center gap-2"
                  data-testid="contact-us-btn"
                >
                  Contact Us
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=500&fit=crop" 
                alt="Healthcare Professional" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f0f9ff"/>
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-blue-50" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">About Corporate Health</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are a leading provider of occupational health services, dedicated to ensuring the safety and well-being of your workforce.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-blue-900 mb-3">Certified Services</h4>
              <p className="text-gray-600">All our services meet the highest standards and regulatory requirements.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-blue-900 mb-3">Fast Results</h4>
              <p className="text-gray-600">Quick turnaround times without compromising quality or accuracy.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartPulse className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-blue-900 mb-3">Expert Care</h4>
              <p className="text-gray-600">Experienced medical professionals dedicated to your team's health.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-blue-300"></div>
              <span className="text-blue-600 font-medium">What We Offer</span>
              <div className="h-px w-16 bg-blue-300"></div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-blue-900">Our Services</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || ClipboardCheck;
              return (
                <div 
                  key={service.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group border border-gray-100"
                  data-testid={`service-card-${service.id}`}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={serviceImages[index % serviceImages.length]} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-bold text-blue-900">{service.title}</h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hours Section */}
      <section id="hours" className="py-20 bg-gradient-to-br from-blue-600 to-blue-800" data-testid="hours-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Business Hours</h3>
            <p className="text-blue-100 text-lg">We're here to serve you</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6" />
                <h4 className="text-xl font-bold">Weekdays</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold">7:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6" />
                <h4 className="text-xl font-bold">Weekends</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold">8:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50" data-testid="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Company Info */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                    <HeartPulse className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-900">Corporate Health</h3>
                    <p className="text-blue-600">Your Health Partner</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 234-5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Address</h4>
                    <p className="text-gray-600">123 Health Street, Suite 100</p>
                    <p className="text-gray-600">Medical District, MD 12345</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Email</h4>
                    <p className="text-gray-600">info@corporatehealth.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 shadow-2xl" data-testid="contact-form">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Us</h3>
              
              {submitStatus && (
                <div className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                    data-testid="contact-email-input"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                    required
                    data-testid="contact-message-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="contact-submit-btn"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <HeartPulse className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Corporate Health</h3>
                  <p className="text-blue-300 text-sm">Occupational Safety & Health</p>
                </div>
              </div>
              <p className="text-blue-200 mt-4 max-w-md">
                Protecting the health of your workforce with reliable, fast, and certified occupational medical services.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-200">
                <li><button onClick={() => scrollToSection("home")} className="hover:text-white transition">Home</button></li>
                <li><button onClick={() => scrollToSection("about")} className="hover:text-white transition">About Us</button></li>
                <li><button onClick={() => scrollToSection("services")} className="hover:text-white transition">Services</button></li>
                <li><button onClick={() => scrollToSection("contact")} className="hover:text-white transition">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-blue-200">
                <li>Medical Evaluations</li>
                <li>Occupational Exams</li>
                <li>Work Certificates</li>
                <li>Online Platform</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300">
            <p>&copy; {new Date().getFullYear()} Corporate Health. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
