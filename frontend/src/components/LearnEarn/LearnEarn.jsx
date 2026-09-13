import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  PlayCircle, 
  ArrowLeft, 
  Clock, 
  Award, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Trophy,
  Zap,
  GraduationCap
} from 'lucide-react';
import { COURSES } from './learnData';
import CertificateModal from './CertificateModal';
import './LearnEarn.css';

const LOCAL_STORAGE_XP_KEY = 'finexa_learn_xp';
const LOCAL_STORAGE_COMPLETED_KEY = 'finexa_completed_courses';

const LearnEarn = () => {
  const navigate = useNavigate();
  
  // State for user progress stored locally
  const [userXP, setUserXP] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_XP_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [completedCourseIds, setCompletedCourseIds] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_COMPLETED_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // UI state
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourse, setActiveCourse] = useState(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  
  // Reader / Quiz Modal state
  const [modalTab, setModalTab] = useState('lessons'); // 'lessons' | 'quiz'
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({}); // { [questionId]: optionIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_XP_KEY, userXP.toString());
  }, [userXP]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_COMPLETED_KEY, JSON.stringify(completedCourseIds));
  }, [completedCourseIds]);

  // Filter logic
  const filteredCourses = COURSES.filter(course => {
    const matchesLevel = selectedLevel === 'All' || course.level.toLowerCase() === selectedLevel.toLowerCase();
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  // Handler to open course modal
  const handleOpenCourse = (course) => {
    setActiveCourse(course);
    setModalTab('lessons');
    setCurrentLessonIdx(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
    setShowCelebration(false);
  };

  // Handler to select quiz option
  const handleSelectQuizOption = (questionId, optionIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  // Submit Quiz logic
  const handleSubmitQuiz = () => {
    if (!activeCourse) return;
    setQuizSubmitted(true);

    // Calculate score
    let correctCount = 0;
    activeCourse.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const isAllCorrect = correctCount === activeCourse.quiz.length;
    setQuizPassed(isAllCorrect);

    if (isAllCorrect) {
      // Award XP and complete course if not already completed
      if (!completedCourseIds.includes(activeCourse.id)) {
        const nextCompleted = [...completedCourseIds, activeCourse.id];
        setCompletedCourseIds(nextCompleted);
        setUserXP(prev => prev + activeCourse.rewardXP);
        
        // Auto trigger certificate modal if all courses finished
        if (nextCompleted.length === COURSES.length) {
          setTimeout(() => {
            setIsCertificateModalOpen(true);
          }, 1500);
        }
      }
      setShowCelebration(true);
    }
  };

  // Quick Demo Helper to complete all courses for testing
  const handleCompleteAllDemo = () => {
    const allIds = COURSES.map(c => c.id);
    setCompletedCourseIds(allIds);
    setUserXP(1350);
    setIsCertificateModalOpen(true);
  };

  // Calculate stats
  const isAllCompleted = completedCourseIds.length === COURSES.length;
  const unlockedBadges = COURSES.filter(c => completedCourseIds.includes(c.id));
  const userLevel = userXP < 200 ? 'Novice Investor' : userXP < 600 ? 'FinTech Strategist' : 'Market Titan';

  return (
    <div className="min-h-screen bg-ivory text-ink py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden dot-grid linen-noise">
      {/* Ambient Blooms matching FINEXA Theme */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-burgundy/6 blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[140px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation & Header */}
        <div className="mb-10">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-taupe hover:text-ink transition-colors text-xs font-bold uppercase tracking-widest mb-6 cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Home
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-burgundy/10 border border-burgundy/20 text-burgundy text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={14} /> Interactive Academy
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight uppercase leading-[1.1]">
                Learn <span className="text-burgundy">&</span> Earn
              </h1>
              <p className="mt-3 text-taupe text-base md:text-lg max-w-2xl font-normal leading-relaxed">
                Master financial markets through interactive modules. Complete lessons, test your knowledge with quizzes, and earn FINEXA reward points & badges.
              </p>
            </div>

            {/* User Gamified Stats Box */}
            <div className="bg-cream/90 backdrop-blur-xl border border-beige/60 rounded-3xl p-5 shadow-lg flex items-center gap-6 min-w-[320px]">
              <div className="w-14 h-14 rounded-2xl bg-burgundy flex items-center justify-center text-gold shadow-md shrink-0">
                <Trophy size={28} />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between text-xs uppercase font-extrabold tracking-wider text-taupe mb-1">
                  <span>{userLevel}</span>
                  <span className="text-burgundy font-bold">{userXP} XP</span>
                </div>
                <div className="w-full bg-beige/40 h-2.5 rounded-full overflow-hidden mb-2">
                  <div 
                    className="bg-gradient-to-r from-burgundy to-gold h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (completedCourseIds.length / COURSES.length) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-ink/70">
                  <span>{completedCourseIds.length} / {COURSES.length} Completed</span>
                  <span>{unlockedBadges.length} Badges Unlocked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ALL LESSONS COMPLETED CERTIFICATE GRADUATION BANNER */}
        {/* ========================================================================= */}
        {isAllCompleted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10 bg-gradient-to-r from-burgundy via-burgundy/90 to-amber-900 border-2 border-gold/60 rounded-3xl p-6 md:p-8 text-ivory shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gold/20 text-gold flex items-center justify-center text-3xl border border-gold/40 shrink-0 shadow-inner">
                🎓
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-gold bg-gold/20 px-3 py-1 rounded-full border border-gold/30">
                  Graduation Ready!
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-ivory mt-2">
                  All 6 Financial Modules Completed!
                </h3>
                <p className="text-ivory/80 text-xs sm:text-sm mt-1 max-w-xl">
                  You have successfully passed all course assessments. Claim and download your official FINEXA Master Certificate of Financial Mastery.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="px-6 py-4 rounded-full bg-gold text-ink font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl flex items-center gap-2 shrink-0 cursor-pointer relative z-10 hover:scale-105"
            >
              <GraduationCap size={20} /> View & Download Certificate
            </button>
          </motion.div>
        ) : (
          /* Quick Demo Button for Testing if user hasn't finished all modules yet */
          <div className="mb-10 bg-cream/70 border border-beige/60 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-taupe">
              <Award size={16} className="text-gold" />
              <span>Complete all 6 modules to unlock your official Master Certificate!</span>
            </div>
            <button
              onClick={handleCompleteAllDemo}
              className="px-4 py-1.5 rounded-full bg-burgundy/10 hover:bg-burgundy/20 text-burgundy text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-burgundy/20 shrink-0"
            >
              ⚡ Unlock Certificate (Demo)
            </button>
          </div>
        )}

        {/* Badges Showcase Bar with GenAI Badge Images */}
        {unlockedBadges.length > 0 && (
          <div className="mb-10 bg-ivory/80 backdrop-blur-md border border-beige/50 rounded-2xl p-4 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-3 overflow-x-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-taupe shrink-0 flex items-center gap-1.5">
                <Award size={14} className="text-gold" /> Unlocked Badges:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto">
                {unlockedBadges.map((c) => (
                  <div 
                    key={c.id} 
                    className="flex items-center gap-2 bg-cream border border-gold/40 px-3.5 py-1.5 rounded-full shadow-xs shrink-0"
                  >
                    {c.badgeImg ? (
                      <img src={c.badgeImg} alt={c.badge} className="w-5 h-5 object-contain" />
                    ) : (
                      <span>{c.badgeIcon}</span>
                    )}
                    <span className="text-xs font-bold text-ink">{c.badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {isAllCompleted && (
              <button
                onClick={() => setIsCertificateModalOpen(true)}
                className="text-xs font-extrabold text-burgundy hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <GraduationCap size={16} /> My Certificate
              </button>
            )}
          </div>
        )}

        {/* Filter Controls & Search */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-beige/40 pb-6">
          {/* Level Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  selectedLevel === level
                    ? 'bg-ink text-ivory shadow-md'
                    : 'bg-cream text-taupe hover:text-ink hover:bg-beige/40 border border-beige/50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-taupe w-4 h-4" />
            <input
              type="text"
              placeholder="Search topics or modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream border border-beige/60 rounded-full pl-10 pr-4 py-2 text-xs font-medium text-ink placeholder:text-taupe/60 focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const isCompleted = completedCourseIds.includes(course.id);

            return (
              <div 
                key={course.id}
                onClick={() => handleOpenCourse(course)}
                className={`bg-cream border ${course.borderClass} rounded-[32px] overflow-hidden flex flex-col hover:shadow-[0_20px_50px_rgba(58,46,37,0.12)] transition-all duration-300 transform hover:-translate-y-1.5 group cursor-pointer relative`}
              >
                {/* Header Image */}
                <div 
                  className="h-[220px] bg-cover bg-center relative overflow-hidden"
                  style={{ backgroundImage: `url(${course.image})` }}
                >
                  <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/40 transition-colors duration-300 flex items-center justify-center">
                    <PlayCircle className="w-14 h-14 text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100 drop-shadow-md" />
                  </div>

                  {/* Level Overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="bg-ivory/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-beige/40 shadow-xs">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${course.colorClass}`}>
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Completed Checkmark Badge */}
                  {isCompleted && (
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 size={14} />
                      <span>Passed</span>
                    </div>
                  )}

                  {/* Category Pill at bottom of image */}
                  <div className="absolute bottom-4 left-4 bg-ink/75 backdrop-blur-md text-ivory text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {course.category}
                  </div>
                </div>
                
                {/* Content Details */}
                <div className="p-7 flex flex-col flex-grow relative">
                  <div className="flex items-center justify-between text-taupe text-xs font-semibold uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {course.readTime}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-burgundy">
                      <Zap size={14} className="fill-burgundy" /> +{course.rewardXP} XP
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold mb-2 text-ink leading-tight group-hover:text-burgundy transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-taupe text-xs leading-relaxed flex-grow line-clamp-3 mb-6">
                    {course.description}
                  </p>

                  {/* GenAI Badge Reward Tag */}
                  <div className="bg-ivory/80 border border-beige/50 rounded-xl p-2.5 mb-6 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-taupe">Reward Badge:</span>
                    <span className="text-xs font-bold text-ink flex items-center gap-2">
                      {course.badgeImg ? (
                        <img src={course.badgeImg} alt={course.badge} className="w-6 h-6 object-contain" />
                      ) : (
                        <span>{course.badgeIcon}</span>
                      )}
                      <span>{course.badge}</span>
                    </span>
                  </div>
                  
                  {/* Action Button */}
                  <div className="mt-auto pt-2 border-t border-beige/30">
                    <button className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                      ${isCompleted 
                        ? 'bg-beige/40 text-ink border border-beige/60 hover:bg-beige/60' 
                        : `${course.bgClass} text-ivory shadow-md hover:brightness-110`}
                    `}>
                      {isCompleted ? 'Review Chapter' : 'Start Module'}
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20 bg-cream border border-beige/60 rounded-3xl p-8">
            <BookOpen className="w-12 h-12 text-taupe mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-serif font-bold text-ink mb-2">No modules found</h3>
            <p className="text-taupe text-sm">Try adjusting your level filter or search query.</p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODULE READER & QUIZ MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeCourse && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCourse(null)}
              className="fixed inset-0 bg-ink/60 backdrop-blur-md"
            />

            {/* Modal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-ivory rounded-3xl shadow-2xl border border-beige/60 overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto"
            >
              {/* Header Bar */}
              <div className="bg-cream border-b border-beige/40 px-6 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${activeCourse.bgClass} text-ivory flex items-center justify-center shadow-xs p-1.5`}>
                    {activeCourse.badgeImg ? (
                      <img src={activeCourse.badgeImg} alt={activeCourse.badge} className="w-9 h-9 object-contain" />
                    ) : (
                      <span className="text-xl">{activeCourse.badgeIcon}</span>
                    )}
                  </div>
                  <div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${activeCourse.colorClass}`}>
                      {activeCourse.level} • {activeCourse.category}
                    </span>
                    <h2 className="text-xl font-serif font-bold text-ink leading-tight">
                      {activeCourse.title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setActiveCourse(null)}
                  className="w-9 h-9 rounded-full bg-beige/30 hover:bg-beige/60 text-ink flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Tabs Switcher (Lessons vs Quiz) */}
              <div className="bg-ivory border-b border-beige/40 px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalTab('lessons')}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                      modalTab === 'lessons'
                        ? 'bg-burgundy text-ivory shadow-xs'
                        : 'text-taupe hover:text-ink hover:bg-beige/20'
                    }`}
                  >
                    <BookOpen size={14} /> Lessons ({activeCourse.lessons.length})
                  </button>

                  <button
                    onClick={() => setModalTab('quiz')}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                      modalTab === 'quiz'
                        ? 'bg-burgundy text-ivory shadow-xs'
                        : 'text-taupe hover:text-ink hover:bg-beige/20'
                    }`}
                  >
                    <HelpCircle size={14} /> Knowledge Quiz ({activeCourse.quiz.length})
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-burgundy bg-burgundy/10 px-3 py-1.5 rounded-full border border-burgundy/20">
                  <Zap size={14} className="fill-burgundy" /> +{activeCourse.rewardXP} XP
                </div>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 md:p-8 overflow-y-auto flex-grow space-y-6">
                
                {/* TAB 1: LESSONS READER */}
                {modalTab === 'lessons' && (
                  <div>
                    {/* Lesson Switcher Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-beige/40">
                      {activeCourse.lessons.map((lesson, idx) => (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLessonIdx(idx)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            currentLessonIdx === idx
                              ? 'bg-cream text-ink border-2 border-burgundy shadow-xs'
                              : 'bg-ivory text-taupe hover:text-ink border border-beige/60'
                          }`}
                        >
                          Lesson {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Active Lesson Display */}
                    {activeCourse.lessons[currentLessonIdx] && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-serif font-bold text-ink mb-1">
                            {activeCourse.lessons[currentLessonIdx].title}
                          </h3>
                          <p className="text-burgundy font-medium text-sm">
                            {activeCourse.lessons[currentLessonIdx].subtitle}
                          </p>
                        </div>

                        {/* Markdown Lesson Content */}
                        <div className="prose prose-stone max-w-none text-ink text-sm sm:text-base leading-relaxed bg-cream/60 p-6 rounded-2xl border border-beige/50 space-y-4">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {activeCourse.lessons[currentLessonIdx].content}
                          </ReactMarkdown>
                        </div>

                        {/* Key Takeaway Callout Box */}
                        <div className="bg-gold/10 border-l-4 border-gold p-4 rounded-r-2xl">
                          <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider mb-1">
                            <Sparkles size={14} /> Key Takeaway
                          </div>
                          <p className="text-ink font-semibold text-xs sm:text-sm">
                            {activeCourse.lessons[currentLessonIdx].keyTakeaway}
                          </p>
                        </div>

                        {/* Lesson Navigation Footer */}
                        <div className="pt-6 border-t border-beige/40 flex items-center justify-between">
                          <button
                            disabled={currentLessonIdx === 0}
                            onClick={() => setCurrentLessonIdx(prev => prev - 1)}
                            className="px-4 py-2 rounded-full border border-beige/60 text-xs font-bold text-ink disabled:opacity-30 disabled:cursor-not-allowed hover:bg-beige/20 flex items-center gap-1.5 cursor-pointer"
                          >
                            <ChevronLeft size={16} /> Previous Lesson
                          </button>

                          {currentLessonIdx < activeCourse.lessons.length - 1 ? (
                            <button
                              onClick={() => setCurrentLessonIdx(prev => prev + 1)}
                              className="px-5 py-2.5 rounded-full bg-ink text-ivory text-xs font-bold uppercase tracking-wider hover:bg-burgundy transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              Next Lesson <ChevronRight size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setModalTab('quiz')}
                              className="px-6 py-2.5 rounded-full bg-burgundy text-ivory text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                            >
                              Take Module Quiz <HelpCircle size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: KNOWLEDGE QUIZ */}
                {modalTab === 'quiz' && (
                  <div className="space-y-8">
                    <div className="bg-cream border border-beige/50 rounded-2xl p-5">
                      <h4 className="text-lg font-serif font-bold text-ink mb-1">Module Knowledge Assessment</h4>
                      <p className="text-taupe text-xs">
                        Answer all questions correctly to pass this module, unlock your <strong>{activeCourse.badge}</strong> badge, and claim <strong>+{activeCourse.rewardXP} XP</strong> points!
                      </p>
                    </div>

                    {/* Quiz Questions */}
                    <div className="space-y-6">
                      {activeCourse.quiz.map((q, qIdx) => {
                        const selectedOption = quizAnswers[q.id];

                        return (
                          <div key={q.id} className="bg-cream/40 border border-beige/60 rounded-2xl p-6 space-y-4">
                            <h5 className="font-bold text-sm sm:text-base text-ink flex items-start gap-2">
                              <span className="w-6 h-6 rounded-full bg-burgundy/10 text-burgundy text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                                {qIdx + 1}
                              </span>
                              <span>{q.question}</span>
                            </h5>

                            {/* Options */}
                            <div className="space-y-2.5 pl-8">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = selectedOption === optIdx;
                                const isCorrect = q.correctAnswer === optIdx;
                                
                                let optClass = 'bg-ivory border-beige/60 hover:border-burgundy/40 text-ink';
                                if (quizSubmitted) {
                                  if (isCorrect) {
                                    optClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                                  } else if (isSelected && !isCorrect) {
                                    optClass = 'bg-rose-50 border-rose-500 text-rose-950';
                                  } else {
                                    optClass = 'bg-ivory/50 border-beige/30 text-taupe/60 opacity-60';
                                  }
                                } else if (isSelected) {
                                  optClass = 'bg-cream border-burgundy text-burgundy font-bold shadow-xs';
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    disabled={quizSubmitted}
                                    onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optClass}`}
                                  >
                                    <span>{opt}</span>
                                    {quizSubmitted && isCorrect && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Explanation Feedback */}
                            {quizSubmitted && (
                              <div className={`mt-3 p-3.5 rounded-xl text-xs ${quizAnswers[q.id] === q.correctAnswer ? 'bg-emerald-100/50 text-emerald-900 border border-emerald-200' : 'bg-rose-100/50 text-rose-900 border border-rose-200'}`}>
                                <span className="font-bold">Explanation: </span>{q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quiz Footer Action */}
                    <div className="pt-6 border-t border-beige/40 flex items-center justify-between">
                      {!quizSubmitted ? (
                        <button
                          disabled={Object.keys(quizAnswers).length < activeCourse.quiz.length}
                          onClick={handleSubmitQuiz}
                          className="w-full py-3.5 rounded-full bg-burgundy text-ivory text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
                        >
                          Submit Answers & Check Score
                        </button>
                      ) : (
                        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="text-xs font-bold">
                            {quizPassed ? (
                              <span className="text-emerald-700 font-extrabold flex items-center gap-1.5 text-sm">
                                <CheckCircle2 size={18} /> Perfect Score! Module Completed (+{activeCourse.rewardXP} XP)
                              </span>
                            ) : (
                              <span className="text-rose-700 font-semibold text-xs">
                                Score incomplete. Review lessons and try again!
                              </span>
                            )}
                          </div>

                          {!quizPassed && (
                            <button
                              onClick={() => {
                                setQuizSubmitted(false);
                                setQuizAnswers({});
                              }}
                              className="px-6 py-2.5 rounded-full bg-ink text-ivory text-xs font-bold uppercase tracking-wider hover:bg-burgundy transition-colors cursor-pointer"
                            >
                              Retry Quiz
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* CELEBRATION REWARD POPUP WITH GENAI BADGE ARTWORK */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showCelebration && activeCourse && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="relative bg-ivory border-2 border-gold/60 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl z-10 overflow-hidden"
            >
              {/* Confetti Glow Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gold/20 blur-3xl pointer-events-none" />

              <div className="w-24 h-24 bg-burgundy/10 rounded-3xl mx-auto flex items-center justify-center p-3 shadow-xl mb-4 border border-gold/40 animate-bounce">
                {activeCourse.badgeImg ? (
                  <img src={activeCourse.badgeImg} alt={activeCourse.badge} className="w-18 h-18 object-contain drop-shadow-md" />
                ) : (
                  <span className="text-4xl">{activeCourse.badgeIcon}</span>
                )}
              </div>

              <span className="text-xs font-extrabold uppercase tracking-widest text-gold bg-gold/10 px-4 py-1 rounded-full border border-gold/30">
                Module Mastered!
              </span>

              <h3 className="text-3xl font-serif font-bold text-ink mt-3 mb-2">
                Congratulations!
              </h3>

              <p className="text-taupe text-xs sm:text-sm mb-6 leading-relaxed">
                You scored 100% on the <strong>{activeCourse.title}</strong> assessment!
              </p>

              <div className="bg-cream border border-beige/60 rounded-2xl p-4 mb-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-ink">
                  <span>Badge Unlocked:</span>
                  <span className="text-burgundy flex items-center gap-2">
                    {activeCourse.badgeImg && <img src={activeCourse.badgeImg} alt={activeCourse.badge} className="w-5 h-5 object-contain" />}
                    <span>{activeCourse.badge}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-ink">
                  <span>Reward Earned:</span>
                  <span className="text-gold font-extrabold flex items-center gap-1">
                    <Zap size={14} className="fill-gold" /> +{activeCourse.rewardXP} XP
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowCelebration(false);
                  setActiveCourse(null);
                  if (completedCourseIds.length === COURSES.length) {
                    setIsCertificateModalOpen(true);
                  }
                }}
                className="w-full py-3.5 rounded-full bg-burgundy text-ivory font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg cursor-pointer"
              >
                Claim Reward & Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* OFFICIAL CERTIFICATE MODAL */}
      {/* ========================================================================= */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        userXP={userXP}
      />

    </div>
  );
};

export default memo(LearnEarn);
