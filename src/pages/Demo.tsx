import React from 'react';
import Navbar from '../components/Navbar';

const Demo: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080B14] text-gray-100">
      <Navbar onBookDemo={() => {}} />
      <div className="pt-28 max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">Demo</h1>
        <p className="text-blue-100/80 text-lg mb-8">
          This is a placeholder Demo page. You can customize this content as needed.
        </p>
        <a
          href="https://sales-agent-c3f5ecevdefjcafc.canadacentral-01.azurewebsites.net/"
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Live Demo
        </a>
      </div>
    </div>
  );
};

export default Demo; 