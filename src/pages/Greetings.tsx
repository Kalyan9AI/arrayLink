import React from 'react';
import Navbar from '../components/Navbar';

const Greetings: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080B14] text-gray-100">
      <Navbar onBookDemo={() => {}} />
      <div className="pt-20 h-[calc(100vh-5rem)]">
        <iframe
          title="Greeting Quotes Generator"
          src="https://greenting-generator-d5ardxabcjaxc8a2.canadacentral-01.azurewebsites.net/"
          className="w-full h-full border-0"
          allow="clipboard-read; clipboard-write; autoplay"
        />
      </div>
    </div>
  );
};

export default Greetings;


