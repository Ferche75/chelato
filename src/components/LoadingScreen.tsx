import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: Props) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 800);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: 'linear-gradient(135deg, #e8dcc8 0%, #d4a7a7 50%, #663a7c 100%)' }}
    >
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full animate-float"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(212,167,167,0.6) 0%, rgba(212,167,167,0) 70%)',
            top: '10%',
            left: '20%',
            animationDelay: '0s',
            animationDuration: '4s',
          }}
        />
        <div
          className="absolute rounded-full animate-float"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(102,58,124,0.4) 0%, rgba(102,58,124,0) 70%)',
            top: '50%',
            right: '15%',
            animationDelay: '1s',
            animationDuration: '5s',
          }}
        />
        <div
          className="absolute rounded-full animate-float"
          style={{
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(198,125,111,0.5) 0%, rgba(198,125,111,0) 70%)',
            bottom: '15%',
            left: '40%',
            animationDelay: '2s',
            animationDuration: '3.5s',
          }}
        />
        <div
          className="absolute rounded-full animate-float"
          style={{
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(245,240,232,0.5) 0%, rgba(245,240,232,0) 70%)',
            top: '25%',
            right: '30%',
            animationDelay: '0.5s',
            animationDuration: '4.5s',
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 text-center">
        <img
          src="/logo-white.png"
          alt="Chelato"
          className={`w-48 h-auto mx-auto mb-6 transition-all duration-1000 ${
            fadeOut ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
          }`}
          style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 40px rgba(255,255,255,0.3))' }}
        />
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-white"
              style={{
                animation: `bounceIn 0.6s ease-out ${i * 0.2}s infinite alternate`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
        <p className="mt-4 text-white/70 text-sm tracking-widest uppercase font-body">
          Helado Artesanal
        </p>
      </div>
    </div>
  );
}
