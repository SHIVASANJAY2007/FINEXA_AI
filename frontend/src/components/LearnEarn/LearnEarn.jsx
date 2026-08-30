import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, TrendingUp, Shield, BarChart2, DollarSign, ArrowLeft, Clock } from 'lucide-react';
import './LearnEarn.css';

const CHAPTERS = [
  {
    id: 1,
    title: 'Foundations of Finance',
    description: 'Master the basics of money management, budgeting, and compound interest.',
    icon: <DollarSign className="w-8 h-8" />,
    level: 'Beginner',
    readTime: '15 min',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    colorClass: 'text-burgundy',
    bgClass: 'bg-burgundy',
    borderClass: 'border-burgundy/30'
  },
  {
    id: 2,
    title: 'Intro to Stock Markets',
    description: 'Understand how shares, dividends, and market indices actually work.',
    icon: <BarChart2 className="w-8 h-8" />,
    level: 'Beginner',
    readTime: '20 min',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
    colorClass: 'text-teal',
    bgClass: 'bg-teal',
    borderClass: 'border-teal/30'
  },
  {
    id: 3,
    title: 'Technical Analysis',
    description: 'Learn how to read charts, candlestick patterns, and volume indicators.',
    icon: <TrendingUp className="w-8 h-8" />,
    level: 'Intermediate',
    readTime: '30 min',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80',
    colorClass: 'text-terracotta',
    bgClass: 'bg-terracotta',
    borderClass: 'border-terracotta/30'
  },
  {
    id: 4,
    title: 'Risk Management',
    description: 'Protect your capital with stop-losses, diversification, and position sizing.',
    icon: <Shield className="w-8 h-8" />,
    level: 'Intermediate',
    readTime: '25 min',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&q=80',
    colorClass: 'text-gold',
    bgClass: 'bg-gold',
    borderClass: 'border-gold/30'
  }
];

const LearnEarn = () => {
  const navigate = useNavigate();
  const [activeChapter, setActiveChapter] = useState(null);

  return (
    <div className="min-h-screen bg-ivory text-ink py-20 px-6 md:px-12 relative overflow-hidden dot-grid linen-noise">
      {/* Ambient Blooms matching Landing Page */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-burgundy/6 blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/4 blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-taupe hover:text-ink transition-colors text-sm font-semibold uppercase tracking-wider mb-8 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight uppercase leading-[1.1]">
            Learn <span className="text-burgundy">&</span> Earn
          </h1>
          <p className="mt-4 text-taupe text-lg max-w-2xl font-normal leading-relaxed">
            Master the financial markets through bite-sized, interactive chapters. Equip yourself with the knowledge to make agentic wealth decisions.
          </p>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {CHAPTERS.map((chapter) => (
            <div 
              key={chapter.id}
              className={`bg-cream border ${chapter.borderClass} rounded-[32px] overflow-hidden flex flex-col hover:shadow-[0_20px_50px_rgba(58,46,37,0.1)] transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer`}
              onMouseEnter={() => setActiveChapter(chapter.id)}
              onMouseLeave={() => setActiveChapter(null)}
            >
              {/* Image Section */}
              <div 
                className="h-[240px] bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url(${chapter.image})` }}
              >
                <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/40 transition-colors duration-300 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100" />
                </div>
                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 bg-ivory/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-beige/40">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest ${chapter.colorClass}`}>
                    {chapter.level}
                  </span>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-8 flex flex-col flex-grow relative">
                <div className="flex items-center gap-2 text-taupe text-xs font-semibold uppercase tracking-widest mb-4">
                  <Clock size={14} />
                  <span>{chapter.readTime}</span>
                </div>
                
                <h3 className="text-2xl font-serif font-bold mb-3 text-ink leading-tight">
                  {chapter.title}
                </h3>
                
                <p className="text-taupe text-sm leading-relaxed flex-grow">
                  {chapter.description}
                </p>
                
                <div className="mt-8 pt-6 border-t border-beige/40">
                  <button className={`w-full py-4 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                    ${activeChapter === chapter.id ? `${chapter.bgClass} text-ivory shadow-lg` : 'bg-transparent text-ink border border-beige hover:border-ink'}
                  `}>
                    Start Chapter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(LearnEarn);
