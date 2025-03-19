import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  PresentationChartLineIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Customer Management',
    description: 'Efficiently manage and organize your customer database with ease.',
    icon: UserGroupIcon,
    color: 'blue',
    link: '/customers'
  },
  {
    name: 'Lead Tracking',
    description: 'Track and nurture leads through your sales pipeline.',
    icon: ChartBarIcon,
    color: 'yellow',
    link: '/customers?status=lead'
  },
  {
    name: 'Interaction History',
    description: 'Keep detailed records of all customer interactions and communications.',
    icon: ChatBubbleBottomCenterTextIcon,
    color: 'green',
    link: '/customers'
  },
  {
    name: 'Real-time Updates',
    description: 'Stay up-to-date with real-time customer data and analytics.',
    icon: ClockIcon,
    color: 'purple',
    link: '/dashboard'
  },
  {
    name: 'Performance Metrics',
    description: 'Track key performance indicators and business growth.',
    icon: ArrowTrendingUpIcon,
    color: 'pink',
    link: '/dashboard'
  },
  {
    name: 'Customer Insights',
    description: 'Gain valuable insights into customer behavior and preferences.',
    icon: PresentationChartLineIcon,
    color: 'indigo',
    link: '/customers'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-50"></div>
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Streamline Your Customer <br className="hidden sm:block" />
              <span className="text-primary-600">Relationships</span>
            </motion.h1>
            <motion.p 
              className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage your customer relationships effectively with our powerful and intuitive CRM system.
            </motion.p>
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link 
                to="/dashboard" 
                className="btn-primary inline-flex items-center justify-center text-base px-6 py-3 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300"
              >
                View Dashboard
                <ArrowTrendingUpIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/customers" 
                className="btn-secondary inline-flex items-center justify-center text-base px-6 py-3 hover:bg-gray-100 transition-all duration-300"
              >
                Manage Customers
                <UserGroupIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Everything you need to manage your customers
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Powerful features to help you grow your business
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Link 
                to={feature.link}
                className="block h-full"
              >
                <div className="relative card h-full group p-6 sm:p-8 bg-white hover:bg-gray-50 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-${feature.color}-100 inline-flex shrink-0`}>
                      <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                        {feature.name}
                      </h3>
                      <p className="mt-2 text-gray-600">
                        {feature.description}
                      </p>
                      <div className="mt-4 inline-flex items-center text-primary-600 text-sm font-medium">
                        Learn more
                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="bg-gradient-to-b from-primary-50 to-white py-16 sm:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why choose our CRM?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Designed to help you succeed
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-white p-8 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-primary-600 mb-4">Simple</div>
              <p className="text-gray-600">Intuitive interface that makes customer management effortless</p>
            </div>
            <div className="card bg-white p-8 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-primary-600 mb-4">Fast</div>
              <p className="text-gray-600">Real-time updates and lightning-quick performance</p>
            </div>
            <div className="card bg-white p-8 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-primary-600 mb-4">Secure</div>
              <p className="text-gray-600">Enterprise-grade security for your customer data</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home; 