import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store/store';
import Home from './pages/Home';
import About from './pages/About';
import Properties from './pages/Properties';
import Services from './pages/Services';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import './i18n';

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <Suspense fallback={<div className="loading-screen">Loading...</div>}>
          <Router>
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/property/:id" element={<PropertyDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
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
