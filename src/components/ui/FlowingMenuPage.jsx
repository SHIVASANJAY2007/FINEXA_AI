import React from 'react';
import { useNavigate } from 'react-router-dom';
import FlowingMenu from './FlowingMenu';
import { ArrowLeft } from 'lucide-react';

const MENU_ITEMS = [
  { 
      link: '/explore', 
      text: 'Explore', 
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
      textColor: '#3A2E25',
      marqueeBgColor: '#224D4B',
      marqueeTextColor: '#FDF6ED'
  },
  { 
      link: '/learn', 
      text: 'Learn Earn', 
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
      textColor: '#3A2E25',
      marqueeBgColor: '#6B1E2B',
      marqueeTextColor: '#FDF6ED'
  },
  { 
      link: '/chatbot', 
      text: 'Chatbot', 
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80',
      textColor: '#3A2E25',
      marqueeBgColor: '#C9A227',
      marqueeTextColor: '#3A2E25'
  }
];

const FlowingMenuPage = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 w-screen h-screen z-50 flex flex-col justify-center bg-[#FDF6ED] overflow-hidden">
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-[100]">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-xs font-semibold text-[#3A2E25] hover:text-burgundy transition-colors cursor-pointer bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#3A2E25]/10 shadow-sm"
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>
            </div>

            <div className="w-full">
                <FlowingMenu 
                    items={MENU_ITEMS}
                    bgColor="transparent"
                    textColor="#3A2E25"
                    marqueeBgColor="#6B1E2B"
                    marqueeTextColor="#FDF6ED"
                    borderColor="rgba(58,46,37,0.15)"
                />
            </div>
        </div>
    );
};

export default FlowingMenuPage;
