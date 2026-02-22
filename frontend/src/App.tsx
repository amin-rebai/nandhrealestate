import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store/store';
import Home from './pages/Home';
import About from './pages/About';
import Properties from './pages/Properties';
import InternationalProperties from './pages/InternationalProperties';
import Agents from './pages/Agents';
import Services from './pages/Services';
import OurServices from './pages/OurServices';
import OurProcess from './pages/OurProcess';
import OurPartners from './pages/OurPartners';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import FAQ from './pages/FAQ';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './App.css';
import './i18n/index';

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <Suspense fallback={<div className="loading-screen">Loading...</div>}>
          <Router>
            <ScrollToTop />
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/international-properties" element={<InternationalProperties />} />
                  <Route path="/agents" element={<Agents />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/our-services" element={<OurServices />} />
                  <Route path="/our-process" element={<OurProcess />} />
                  <Route path="/our-partners" element={<OurPartners />} />
                  <Route path="/property/:id" element={<PropertyDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  {/* <Route path="/faq" element={<FAQ />} /> */}
              </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </Suspense>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
