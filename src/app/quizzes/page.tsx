
'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import ElementaryNavbar from '@/components/elementary/ElementaryNavbar';
import ElementarySidebar from '@/components/elementary/ElementarySidebar';

export default function QuizzesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleMenuClose = () => setIsMobileMenuOpen(false);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'games'>('quizzes');
  const [showGame, setShowGame] = useState(false);
  const targetWord = 'CAT';
  const initialLetters = ['X','B','M','C','A','T'];
  const [slots, setSlots] = useState<(string|null)[]>(Array(targetWord.length).fill(null));
  const [pool, setPool] = useState<string[]>(initialLetters);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, letter: string, from: 'pool' | number) => {
    e.dataTransfer.setData('application/letter', JSON.stringify({ letter, from }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropOnSlot = (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/letter');
    if (!data) return;
    const { letter, from } = JSON.parse(data) as { letter: string; from: 'pool' | number };
    if (slots[slotIndex]) return;
    const nextSlots = [...slots];
    nextSlots[slotIndex] = letter;
    setSlots(nextSlots);
    if (from === 'pool') {
      setPool((prev) => {
        const idx = prev.indexOf(letter);
        if (idx >= 0) {
          const copy = [...prev];
          copy.splice(idx, 1);
          return copy;
        }
        return prev;
      });
    } else {
      const prevIndex = from as number;
      // moving from one slot to another
      const cleared = [...slots];
      cleared[prevIndex] = null;
      setSlots(cleared);
    }
  };

  const handleAllowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDropBackToPool = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/letter');
    if (!data) return;
    const { letter, from } = JSON.parse(data) as { letter: string; from: 'pool' | number };
    if (from !== 'pool') {
      const fromIndex = from as number;
      const nextSlots = [...slots];
      if (nextSlots[fromIndex] === letter) {
        nextSlots[fromIndex] = null;
        setSlots(nextSlots);
        setPool((prev) => [...prev, letter]);
      }
    }
  };

  const handleClear = () => {
    setSlots(Array(targetWord.length).fill(null));
    setPool(initialLetters);
  };

  const isCorrect = slots.join('') === targetWord;
  const progressPercent = Math.round((slots.filter(Boolean).length / targetWord.length) * 100);

  const cards = [
    {
      title: 'Math Magic',
      subtitle: 'Learn addition and subtraction with fun!',
      count: '10 Questions',
      color: { border: '#F59E0B', pill: '#FDBA74', button: ['#F59E0B', '#F97316'] },
      icon: 'mdi:plus',
    },
    {
      title: 'Reading Rainbow',
      subtitle: 'Practice reading with colorful stories!',
      count: '8 Questions',
      color: { border: '#10B981', pill: '#86EFAC', button: ['#10B981', '#34D399'] },
      icon: 'mdi:book-open-variant',
    },
    {
      title: 'World Explorer',
      subtitle: 'Discover amazing places and animals!',
      count: '12 Questions',
      color: { border: '#3B82F6', pill: '#93C5FD', button: ['#3B82F6', '#2563EB'] },
      icon: 'mdi:earth',
    },
    {
      title: 'Color Master',
      subtitle: 'Learn colors, shapes, and patterns!',
      count: '6 Questions',
      color: { border: '#F472B6', pill: '#FBCFE8', button: ['#F472B6', '#EC4899'] },
      icon: 'mdi:palette',
    },
    {
      title: 'Music Notes',
      subtitle: 'Sing along and learn about sounds!',
      count: '7 Questions',
      color: { border: '#8B5CF6', pill: '#DDD6FE', button: ['#8B5CF6', '#7C3AED'] },
      icon: 'mdi:music',
    },
    {
      title: 'Space Adventure',
      subtitle: 'Blast off to learn about planets!',
      count: '9 Questions',
      color: { border: '#EAB308', pill: '#FDE68A', button: ['#F59E0B', '#EAB308'] },
      icon: 'mdi:rocket',
    },
  ];

  return (
    <div className="min-h-screen">
      <ElementaryNavbar onMenuToggle={handleMenuToggle} />
      <div className="flex">
        <ElementarySidebar activeItem="quizzes" isMobileMenuOpen={isMobileMenuOpen} onMobileMenuClose={handleMenuClose} />

        <main className="flex-1 bg-linear-to-br from-[#DBEAFE] via-[#F0FDF4] to-[#CFFAFE] sm:pl-[280px] lg:pl-[320px]">
          <div className="p-4 lg:p-8">
            {/* Heading and toggle */}
            <div className="bg-white/60 rounded-xl shadow-md px-4 sm:px-6 py-4 sm:py-5 sm:ml-8 sm:mr-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <div>
                <div className="text-[20px] sm:text-[22px] lg:text-[24px] font-semibold text-[#7C3AED]">Games & Quizzes!</div>
                <div className="text-[14px] sm:text-[15px] text-[#4B5563] mt-1">Test what you learned with fun games and quizzes!</div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('quizzes')}
                  className={`h-10 rounded-full px-5 flex items-center gap-2 shadow-sm cursor-pointer ${
                    activeTab === 'quizzes' ? 'text-white' : 'bg-white text-[#111827]'
                  }`}
                  style={activeTab === 'quizzes' ? { background: 'linear-gradient(90deg, #72D2FF 0%, #1D94D4 100%)' } : undefined}
                >
                  <Icon icon="mdi:chat-question-outline" />
                  <span className="text-[14px]">Quizzes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('games')}
                  className={`h-10 rounded-full px-5 flex items-center gap-2 shadow-sm cursor-pointer ${
                    activeTab === 'games' ? 'bg-[#60A5FA] text-white' : 'bg-[#E5E7EB] text-[#111827]'
                  }`}
                >
                  <Icon icon="mdi:gamepad-variant" />
                  <span className="text-[14px]">Games</span>
                </button>
              </div>
            </div>

            {activeTab === 'quizzes' ? (
              // Quizzes grid
              <div className="sm:ml-8 sm:mr-8 mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {cards.map((c) => (
                  <div
                    key={c.title}
                    className="bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] p-4 sm:p-6 relative"
                    style={{ border: `2px solid ${c.color.border}` }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: c.color.border, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <Icon icon={c.icon} className="text-white" width={24} height={24} />
                      </div>
                      <div className="text-[18px] sm:text-[20px] font-semibold text-[#2563EB]">{c.title}</div>
                      <div className="text-[13px] sm:text-[14px] text-[#6B7280] mt-1">{c.subtitle}</div>

                      <div className="mt-4 w-full space-y-3 sm:space-y-4">
                        <span
                          className="inline-block text-[11px] sm:text-[12px] px-3 py-1 rounded-full"
                          style={{ backgroundColor: c.color.pill, color: '#1F2937' }}
                        >
                          {c.count}
                        </span>
                        <button
                          type="button"
                          className="w-full h-10 sm:h-11 text-white text-[13px] sm:text-[14px] px-4 rounded-full flex items-center justify-center gap-2 cursor-pointer"
                          style={{ background: `linear-gradient(90deg, ${c.color.button[0]}, ${c.color.button[1]})` }}
                        >
                          Start Quiz! <Icon icon="mdi:arrow-right" width={16} height={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Games hero banner
              <div className="sm:ml-8 sm:mr-8 mt-6">
                {!showGame ? (
                  <div className="bg-white/70 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] px-4 sm:px-6 py-6 sm:py-10 border-2" style={{ borderColor: '#FACC15' }}>
                    <div className="text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <div className="text-[24px] sm:text-[28px] lg:text-[34px] font-extrabold text-[#7C3AED]">Let's Play Word Game!</div>
                      <div className="text-[14px] sm:text-[16px] text-[#4B5563] mt-2">Look at the picture and spell the word correctly!</div>
                      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => setShowGame(true)}
                          className="h-12 px-6 rounded-full text-white flex items-center gap-2 shadow-md cursor-pointer"
                          style={{ background: 'linear-gradient(90deg, #10B981, #3B82F6)' }}
                        >
                          <Icon icon="mdi:play-circle" width={20} height={20} />
                          Start Game
                        </button>
                        <button
                          type="button"
                          className="h-12 px-6 rounded-full text-white flex items-center gap-2 shadow-md cursor-pointer"
                          style={{ background: 'linear-gradient(90deg, #FDBA74, #F97316)' }}
                        >
                          <Icon icon="mdi:help-circle" width={20} height={20} />
                          How to Play
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                  <div className="bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-4 sm:p-6 border" style={{ borderColor: '#E5E7EB' }}>
                    <div className="flex flex-col items-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between mb-4">
                        <button className="h-10 px-4 rounded-full text-white text-sm flex items-center gap-2 cursor-pointer" style={{ background: 'linear-gradient(90deg, #FB923C, #F97316)' }} onClick={() => { setShowGame(false); handleClear(); }}>
                          <Icon icon="mdi:arrow-left" /> Back to List
                        </button>
                        <button className="h-10 px-4 rounded-full text-white text-sm flex items-center gap-2 cursor-pointer" style={{ background: 'linear-gradient(90deg, #22C55E, #3B82F6)' }}>
                          Next <Icon icon="mdi:arrow-right" />
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-2xl w-full max-w-3xl p-4 sm:p-6 shadow-inner">
                        <div className="flex flex-col items-center">
                          <div className="mb-4">
                            <div className="w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] rounded-xl overflow-hidden shadow">
                              <Image src="/cat.png" alt="cat" width={140} height={140} className="object-cover w-full h-full" />
                            </div>
                          </div>
                          <div className="text-[15px] sm:text-[16px] text-[#111827] mb-3">Spell the word!</div>

                          {/* Drop slots */}
                          <div className="flex items-center gap-2 sm:gap-3 mb-6">
                            {slots.map((s, idx) => (
                              <div
                                key={idx}
                                onDrop={(e) => handleDropOnSlot(e, idx)}
                                onDragOver={handleAllowDrop}
                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-[16px] sm:text-[18px] font-semibold ${s ? 'bg-white shadow' : 'bg-white border border-dashed border-[#E5E7EB]'}`}
                                style={s ? { border: '2px solid transparent', background: 'linear-gradient(#FFFFFF,#FFFFFF) padding-box, linear-gradient(90deg, #22C55E, #3B82F6) border-box' } : undefined}
                              >
                                {s && (
                                  <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, s, idx)}
                                    className="w-full h-full flex items-center justify-center rounded-xl"
                                  >
                                    {s}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="text-[13px] sm:text-[14px] text-[#4B5563] mb-3">Choose the letters:</div>

                          {/* Pool */}
                          <div
                            className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6"
                            onDrop={handleDropBackToPool}
                            onDragOver={handleAllowDrop}
                          >
                            {pool.map((ch, i) => (
                              <div
                                key={`${ch}-${i}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, ch, 'pool')}
                                className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl flex items-center justify-center text-[16px] sm:text-[18px] font-semibold border border-[#E5E7EB] shadow-sm"
                              >
                                {ch}
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-4">
                            <button onClick={handleClear} className="h-10 px-5 rounded-full text-white text-sm flex items-center gap-2 cursor-pointer" style={{ background: 'linear-gradient(90deg, #FB923C, #F97316)' }}>
                              <Icon icon="mdi:refresh" /> Clear
                            </button>
                            <button disabled={!slots.every(Boolean)} className={`h-10 px-5 rounded-full text-white text-sm flex items-center gap-2 cursor-pointer ${isCorrect ? 'opacity-100' : ''}`} style={{ background: 'linear-gradient(90deg, #22C55E, #16A34A)' }}>
                              <Icon icon="mdi:check-circle" /> Check Word
                            </button>
                            <button className="h-10 px-5 rounded-full text-white text-sm flex items-center gap-2 cursor-pointer" style={{ background: 'linear-gradient(90deg, #60A5FA, #2563EB)' }}>
                              <Icon icon="mdi:lightbulb-on-outline" /> Hint
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Progress section */}
                  <div className="mt-6 bg-white/70 rounded-2xl shadow p-4">
                    <div className="text-[14px] text-[#111827] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Progress</div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-3 rounded-full"
                        style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #22C55E, #3B82F6)' }}
                      />
                    </div>
                  </div>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


