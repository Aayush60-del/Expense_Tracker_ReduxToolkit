import React, { useState } from 'react';
import CountUp from "react-countup";
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { guestLogin } from '../features/Auth/AuthSlice';
import { Button } from '../components/ui/button';
import yes_again from "../app/yes_again.mp4";
import {
  Wallet,
  BarChart3,
  Shield,
  ArrowRight,
  Target,
  CheckCircle2,
  DollarSign,
  Smartphone,
  Star,
  ChevronDown,
  PlayCircle
} from 'lucide-react';


export default function LandingPage() {
  const features = [
    {
      icon: <Wallet className="h-6 w-6 text-blue-600" />,
      title: "Smart Dashboard",
      description: "Get a clear overview of your income, expenses, and savings in real-time."
    },
    {
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      title: "Easy Transactions",
      description: "Add, edit, and categorize transactions in just a few seconds."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-orange-600" />,
      title: "Insightful Reports",
      description: "Visualize your spending patterns with beautiful charts and reports."
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "Secure & Private",
      description: "Your data is safe with us. We use top-notch security to protect your privacy."
    },
    {
      icon: <Smartphone className="h-6 w-6 text-pink-600" />,
      title: "Mobile Friendly",
      description: "Access your finances anytime, anywhere on any device."
    },
    {
      icon: <Target className="h-6 w-6 text-red-600" />,
      title: "Save More",
      description: "Track your savings rate and achieve your financial goals faster."
    }
  ];

  const testimonials = [
    {
      name: "Ravi Kumar",
      role: "Software Developer",
      text: "Expense Tracker has completely changed the way I manage my finances. It's simple, beautiful, and super powerful!",
      avatar: "https://i.pravatar.cc/150?u=ravi"
    },
    {
      name: "Priya Sharma",
      role: "Marketing Manager",
      text: "The dashboard and reports help me understand my spending patterns so I can save more every month.",
      avatar: "https://i.pravatar.cc/150?u=priya"
    },
    {
      name: "Amit Verma",
      role: "Business Owner",
      text: "Best expense tracker I've used so far. The mobile experience is seamless and very intuitive.",
      avatar: "https://i.pravatar.cc/150?u=amit"
    }
  ];

  const faqs = [
    {
      question: "Is my data secure?",
      answer: "Yes! We use bank-level encryption and never share your data with third parties. Your privacy is our top priority."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, you can export all your transactions and reports in CSV or PDF format from the settings menu."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "We offer a 7-day free trial for both Pro and Premium plans so you can test all the advanced features."
    },
    {
      question: "Can I use it on my mobile device?",
      answer: "Absolutely! Our platform is fully responsive and works beautifully on smartphones and tablets. You can also download our native mobile app."
    }
  ];

  const [openFaq, setOpenFaq] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGuestMode = () => {
    dispatch(guestLogin());
    navigate("/");
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900">ExpenseTracker</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Features</button>
            <button onClick={() => scrollToSection('dashboard-preview')} className="hover:text-blue-600 transition-colors">Dashboard</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-blue-600 transition-colors">Testimonials</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-blue-600 transition-colors">FAQ</button>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="font-semibold text-slate-600 hover:text-blue-600 hidden sm:flex">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-md shadow-blue-200">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            Smart. Simple. Secure.
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto"
          >
            Take Control of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Your Finances</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Track income, manage expenses, and build better financial habits with our modern expense tracker. Simple to use, powerful in every way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 w-full">
                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={handleGuestMode}
              className="h-14 px-8 text-lg rounded-full w-full sm:w-auto font-semibold border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
            >
              Try Guest Mode
            </Button>
          </motion.div>

          <motion.div
            id="dashboard-preview"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-20 relative mx-auto max-w-6xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10 bottom-0 h-0" />

            <video
              className="rounded-2xl shadow-2xl border border-slate-200 object-cover w-full"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={yes_again} type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Trusted by thousands of users</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Using text placeholders since actual logos aren't available */}
            <h3 className="text-2xl font-bold text-slate-800">Google</h3>
            <h3 className="text-2xl font-bold text-slate-800">Microsoft</h3>
            <h3 className="text-2xl font-bold text-slate-800">airbnb</h3>
            <h3 className="text-2xl font-bold text-slate-800">amazon</h3>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-3">Why Choose Us</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Everything You Need to Succeed</h3>
            <p className="mt-4 text-lg text-slate-600">Powerful features to help you manage your money smarter and faster.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 shadow-inner border border-slate-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Promo Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-blue-600 rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden shadow-2xl shadow-blue-200">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>

            <div className="lg:w-1/2 relative z-10 text-center lg:text-left mb-12 lg:mb-0">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                Manage Your Money <br /> <span className="text-yellow-400">On the Go</span>
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                Our mobile-friendly design ensures you can track your expenses, add transactions, and view reports anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Button className="bg-slate-900 hover:bg-black text-white h-14 px-6 rounded-xl w-full sm:w-auto">
                  <span className="flex flex-col items-start ml-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-300">Download on the</span>
                    <span className="text-sm font-bold -mt-1">App Store</span>
                  </span>
                </Button>
                <Button className="bg-white hover:bg-slate-100 text-slate-900 h-14 px-6 rounded-xl w-full sm:w-auto shadow-lg">
                  <span className="flex flex-col items-start ml-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">GET IT ON</span>
                    <span className="text-sm font-bold -mt-1">Google Play</span>
                  </span>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative z-10 flex justify-center">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="w-64 h-96 bg-white rounded-[2.5rem] shadow-2xl p-2 border-8 border-slate-800 rotate-12 transform-gpu">
                  <div className="w-full h-full bg-slate-50 rounded-[2rem] overflow-hidden flex flex-col">
                    <div className="h-12 bg-blue-600 flex items-center justify-center text-white font-bold text-sm">Dashboard</div>
                    <div className="p-4 flex-1 space-y-4">
                      <div className="h-24 bg-white rounded-xl shadow-sm border border-slate-100 p-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 mb-2"></div>
                        <div className="h-3 w-16 bg-slate-200 rounded mb-1"></div>
                        <div className="h-4 w-24 bg-slate-300 rounded"></div>
                      </div>
                      <div className="h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center px-3">
                        <div className="w-6 h-6 rounded-full bg-red-100 mr-3"></div>
                        <div className="h-3 w-20 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

            <div className="space-y-2">
              <h4 className="text-4xl font-extrabold text-blue-600">
                2000+
              </h4>
              <p className="text-slate-600 font-medium">Happy Users</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-4xl font-extrabold text-green-600">
                50000+
              </h4>
              <p className="text-slate-600 font-medium">Transactions Added</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-4xl font-extrabold text-orange-500">
                50000+
              </h4>
              <p className="text-slate-600 font-medium">Money Tracked</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-4xl font-extrabold text-purple-600">
                99.9%
              </h4>
              <p className="text-slate-600 font-medium">Uptime & Secure</p>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-3">Testimonials</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">What Our Users Say</h3>
            <p className="mt-4 text-lg text-slate-600">Join thousands of happy users who are taking control of their finances.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm relative"
              >
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-slate-700 leading-relaxed mb-8 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full ring-2 ring-blue-100" />
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-3">Pricing</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Choose the Plan That's Right for You</h3>
            <p className="mt-4 text-lg text-slate-600">Start for free and upgrade anytime to unlock more features.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-slate-900 mb-2">Free</h4>
                <p className="text-slate-500 mb-6">Perfect for getting started</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-slate-500 font-medium">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-slate-700 gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Unlimited Transactions</li>
                <li className="flex items-center text-slate-700 gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Basic Reports</li>
                <li className="flex items-center text-slate-700 gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Up to 3 Categories</li>
                <li className="flex items-center text-slate-700 gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Community Support</li>
              </ul>
              <Button variant="outline" className="w-full rounded-full h-12 font-bold border-slate-300">Get Started</Button>
            </div>

            {/* Pro Tier */}
            <div className="bg-blue-600 rounded-3xl p-8 shadow-2xl shadow-blue-200 transform md:-translate-y-4 flex flex-col relative overflow-hidden text-white">
              <div className="absolute top-0 inset-x-0 h-1 bg-yellow-400"></div>
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Most Popular</div>
              <div className="mb-8">
                <h4 className="text-2xl font-bold mb-2">Pro</h4>
                <p className="text-blue-200 mb-6">Best for personal use</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">₹199</span>
                  <span className="text-blue-200 font-medium">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-200" /> Everything in Free</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-200" /> Advanced Reports</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-200" /> Unlimited Categories</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-200" /> Priority Support</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-200" /> Export Data</li>
              </ul>
              <Button className="w-full rounded-full h-12 font-bold bg-white text-blue-600 hover:bg-slate-100">Start 7-Day Free Trial</Button>
            </div>

            {/* Premium Tier */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-slate-900 mb-2">Premium</h4>
                <p className="text-slate-500 mb-6">For advanced users</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-slate-900">₹399</span>
                  <span className="text-slate-500 font-medium">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center text-slate-700 gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Everything in Pro</li>
                <li className="flex items-center text-slate-700 gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Custom Reports</li>
                <li className="flex items-center text-slate-700 gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Multi-currency Support</li>
                <li className="flex items-center text-slate-700 gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Account Sharing</li>
                <li className="flex items-center text-slate-700 gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Dedicated Support</li>
              </ul>
              <Button variant="outline" className="w-full rounded-full h-12 font-bold border-slate-300">Start 7-Day Free Trial</Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-3">FAQ</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === index ? 'border-blue-600 ring-1 ring-blue-600' : 'border-slate-200'}`}
              >
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-slate-900 hover:bg-slate-50 focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 text-slate-600"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to Take Control of Your Finances?</h2>
          <p className="text-blue-100 text-lg mb-10">Join thousands of smart users who are building a better financial future.</p>
          <Link to="/signup">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-blue-600 hover:bg-slate-100 shadow-xl shadow-blue-800">
              Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                E
              </div>
              <span className="text-xl font-bold text-white">Expense Tracker</span>
            </div>
            <p className="max-w-sm">Smart, simple, and secure expense tracking for a better financial life.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-blue-400 transition-colors">Features</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-blue-400 transition-colors">Pricing</button></li>
              <li><button onClick={() => scrollToSection('faq')} className="hover:text-blue-400 transition-colors">FAQ</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-sm">
          <p>© 2026 Expense Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}