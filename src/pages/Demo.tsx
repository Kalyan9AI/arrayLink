import React from 'react';
import Navbar from '../components/Navbar';

const Demo: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080B14] text-gray-100">
      <Navbar onBookDemo={() => {}} />
      <div className="pt-20 h-[calc(100vh-5rem)]">
        <iframe
          title="Sales Agent Demo"
          src="https://sales-agent-c3f5ecevdefjcafc.canadacentral-01.azurewebsites.net/"
          className="w-full h-full border-0"
          allow="microphone; clipboard-read; clipboard-write; autoplay"
        />
      </div>
    </div>
  );
};

export default Demo; 