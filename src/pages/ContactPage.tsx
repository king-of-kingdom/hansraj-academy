import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Youtube, Facebook, Instagram, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create WhatsApp message
    const message = `
*New Contact Form Submission*
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject}
Message: ${formData.message}
    `.trim();
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/917903421482?text=${encodeURIComponent(message)}`, '_blank');
    
    toast.success('Redirecting to WhatsApp...');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      value: 'Hansrajpur Ekma, Saran (Bihar)',
      link: null
    },
    {
      icon: Phone,
      title: 'Phone / WhatsApp',
      value: '+91 79034 21482',
      link: 'tel:+917903421482'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'hansrajeducations@gmail.com',
      link: 'mailto:hansrajeducations@gmail.com'
    }
  ];

  const socialLinks = [
    { icon: Youtube, name: 'YouTube', url: 'https://www.youtube.com/@TheHansrajAcademy', color: 'bg-red-600 hover:bg-red-700' },
    { icon: Facebook, name: 'Facebook', url: 'https://www.facebook.com/', color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: Instagram, name: 'Instagram', url: 'https://www.instagram.com/', color: 'bg-pink-600 hover:bg-pink-700' },
    { icon: Linkedin, name: 'LinkedIn', url: 'https://www.linkedin.com/', color: 'bg-blue-700 hover:bg-blue-800' },
    { icon: Twitter, name: 'Twitter', url: 'https://x.com/', color: 'bg-gray-800 hover:bg-gray-900' },
  ];

  const faqs = [
    {
      q: 'What language are the courses in?',
      a: 'All courses are in Hindi. We explain in simple Hinglish (Hindi + English).'
    },
    {
      q: 'Do I get a Certificate?',
      a: 'Yes! You get a Certificate after completing the course and passing the test.'
    },
    {
      q: 'How do I make payment?',
      a: 'Pay via UPI (GPay, PhonePe, Paytm) and submit the Transaction ID. We will verify and unlock your course.'
    },
    {
      q: 'Do I get lifetime access?',
      a: 'Yes! Once you pay, you get lifetime access to the course.'
    },
    {
      q: 'How do I clear my doubts?',
      a: 'Message us on WhatsApp or ask in the course Discussion Forum.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white">Contact Us</h1>
          <p className="text-white/80 mt-2">हमसे संपर्क करें - We're here to help!</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="font-bold text-gray-900">{info.title}</h3>
                {info.link ? (
                  <a href={info.link} className="text-indigo-600 hover:underline mt-1 block">
                    {info.value}
                  </a>
                ) : (
                  <p className="text-gray-600 mt-1">{info.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="Course Inquiry">Course Inquiry</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Write your message here..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send via WhatsApp
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">Or contact directly:</p>
                <a 
                  href="https://wa.me/917903421482"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Now
                </a>
              </div>
            </div>

            {/* FAQ & Social */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">💬 Quick Support</h3>
                <p className="text-white/80 mb-4">
                  Message us on WhatsApp - We'll reply as soon as possible!
                </p>
                <a 
                  href="https://wa.me/917903421482"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  +91 79034 21482
                </a>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center space-x-2 ${social.color} text-white py-3 rounded-lg transition`}
                    >
                      <social.icon className="w-5 h-5" />
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-semibold text-gray-900">{faq.q}</h4>
                      <p className="text-gray-600 text-sm mt-1">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Our Location</h2>
            <p className="text-gray-600">Hansrajpur Ekma, Saran (Bihar)</p>
          </div>
          
          <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
              <p className="text-gray-600">Hansrajpur Ekma</p>
              <p className="text-gray-600">District Saran, Bihar</p>
              <p className="text-gray-600">India</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to Start Learning?</h2>
          <p className="text-white/80 mt-2">Join thousands of students who are already learning with us!</p>
          <a 
            href="/courses"
            className="inline-block mt-6 bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Browse Courses
          </a>
        </div>
      </section>
    </div>
  );
}
