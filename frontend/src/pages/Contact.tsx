import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: '',
    budget: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will contact you soon.');
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Contact N&H Real Estate</h1>
          <p className="tagline">Let's Discuss Your Real Estate Goals</p>
          <p>
            Get in touch with our expert team for personalized real estate solutions
            across Qatar, the Gulf, MENA, and Europe.
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="section section-light">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info">
              <h3>Get in Touch</h3>

              <div className="contact-item">
                <div className="contact-icon">🏢</div>
                <div>
                  <h4>Head Office</h4>
                  <p>Doha, Qatar</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>+974 XXXX XXXX</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>info@nhrealestate.qa</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🌐</div>
                <div>
                  <h4>Website</h4>
                  <p>www.nhrealestate.qa</p>
                </div>
              </div>

              {/* <div style={{ marginTop: '2rem' }}>
                <h4 style={{ color: 'var(--luxury-burgundy)', marginBottom: '1rem' }}>Regional Offices</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>🇸🇦 Riyadh, Saudi Arabia</li>
                  <li style={{ marginBottom: '0.5rem' }}>🇪🇬 Cairo, Egypt</li>
                  <li style={{ marginBottom: '0.5rem' }}>🇦🇪 Dubai, UAE</li>
                  <li style={{ marginBottom: '0.5rem' }}>🇫🇷 Paris, France</li>
                  <li style={{ marginBottom: '0.5rem' }}>🇲🇦 Casablanca, Morocco</li>
                  <li style={{ marginBottom: '0.5rem' }}>🇴🇲 Muscat, Oman</li>
                  <li style={{ marginBottom: '0.5rem' }}>🇹🇷 Istanbul, Turkey</li>
                </ul>
              </div> */}
            </div>

            {/* Contact Form */}
            <div className="contact-form">
              <h3 style={{ color: 'var(--luxury-burgundy)', marginBottom: '1.5rem' }}>Send us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="propertyType">Property Interest</label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '1rem', border: '2px solid var(--border-light)', borderRadius: '6px', fontSize: '1rem' }}
                  >
                    <option value="">Select Property Type</option>
                    <option value="residential-sale">Residential - Sale</option>
                    <option value="residential-rent">Residential - Rent</option>
                    <option value="commercial-sale">Commercial - Sale</option>
                    <option value="commercial-rent">Commercial - Rent</option>
                    <option value="investment">Investment Opportunities</option>
                    <option value="development">Development Projects</option>
                    <option value="property-management">Property Management</option>
                    <option value="other">Other Services</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="budget">Budget Range</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '1rem', border: '2px solid var(--border-light)', borderRadius: '6px', fontSize: '1rem' }}
                  >
                    <option value="">Select Budget Range</option>
                    <option value="under-500k">Under $500K</option>
                    <option value="500k-1m">$500K - $1M</option>
                    <option value="1m-2m">$1M - $2M</option>
                    <option value="2m-5m">$2M - $5M</option>
                    <option value="5m-10m">$5M - $10M</option>
                    <option value="over-10m">Over $10M</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief subject of your inquiry"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Please provide details about your real estate needs, preferred locations, timeline, and any specific requirements..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
