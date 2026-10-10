import React from 'react';
import { Link } from 'react-router';
import { VideoBackground } from '../components/VideoBackground';

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-900">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/gd_illustration_bg.jpg")' }}
      >
        <div className="absolute inset-0 bg-stone-950/60" />
      </div>
      
      <nav className="absolute top-0 left-0 w-full p-6 z-10 drop-shadow-md">
        <div className="max-w-7xl mx-auto">
          <span className="font-serif text-white text-xl tracking-wide">GD Arena</span>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto mt-12 animate-fade-in-up">
        <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight drop-shadow-xl">
          The discussion room is ready.
        </h1>
        
        <p className="font-sans text-lg md:text-xl text-stone-200 max-w-xl mb-12 leading-relaxed drop-shadow-lg font-medium">
          <span className="underline decoration-wavy decoration-amber-cta decoration-[3px] underline-offset-8">
            Practice group discussions with a full panel. Speak up, get challenged, walk out sharper.
          </span>
        </p>

        <div className="flex flex-col items-center">
          <Link
            to="/setup"
            className="bg-amber-cta hover:bg-amber-cta-hover text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-xl transition-all duration-200"
          >
            Enter the Room &rarr;
          </Link>
          <span className="text-stone-300 text-sm mt-4 font-sans drop-shadow-md">
            You'll be practising with simulated participants
          </span>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
