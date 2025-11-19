
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import ElementaryNavbar from '@/components/elementary/ElementaryNavbar';
import ElementarySidebar from '@/components/elementary/ElementarySidebar';
import { getGames, getGameById, Game } from '@/lib/api/games';
import { ApiClientError } from '@/lib/api/client';
import { showErrorToast, formatErrorMessage } from '@/lib/toast';
import Spinner from '@/components/ui/Spinner';

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBgColor: string;
  buttonColor: string;
  image?: string;
  instructions?: string;
}

const getGameTypeConfig = (type: string): { icon: string; iconBgColor: string; buttonColor: string } => {
  const typeUpper = type.toUpperCase();
  if (typeUpper.includes('WORD') || typeUpper.includes('PUZZLE')) {
    return {
      icon: 'mdi:alphabetical-variant',
      iconBgColor: 'bg-pink-100',
      buttonColor: 'bg-pink-500 hover:bg-pink-600',
    };
  }
  if (typeUpper.includes('NUMBER') || typeUpper.includes('MATH')) {
    return {
      icon: 'mdi:calculator',
      iconBgColor: 'bg-blue-100',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
    };
  }
  if (typeUpper.includes('SHAPE')) {
    return {
      icon: 'mdi:shape',
      iconBgColor: 'bg-green-100',
      buttonColor: 'bg-green-500 hover:bg-green-600',
    };
  }
  if (typeUpper.includes('COLOR')) {
    return {
      icon: 'mdi:palette',
      iconBgColor: 'bg-purple-100',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
    };
  }
  if (typeUpper.includes('ANIMAL') || typeUpper.includes('SOUND')) {
    return {
      icon: 'mdi:volume-high',
      iconBgColor: 'bg-orange-100',
      buttonColor: 'bg-orange-500 hover:bg-orange-600',
    };
  }
  if (typeUpper.includes('MEMORY') || typeUpper.includes('CARD')) {
    return {
      icon: 'mdi:cards',
      iconBgColor: 'bg-pink-100',
      buttonColor: 'bg-pink-500 hover:bg-pink-600',
    };
  }
  if (typeUpper.includes('ABC') || typeUpper.includes('ALPHABET')) {
    return {
      icon: 'mdi:alphabetical',
      iconBgColor: 'bg-blue-100',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
    };
  }
  return {
    icon: 'mdi:gamepad-variant',
    iconBgColor: 'bg-gray-100',
    buttonColor: 'bg-gray-500 hover:bg-gray-600',
  };
};

const mapGameToCard = (game: Game): GameCard => {
  const config = getGameTypeConfig(game.type);
  return {
    id: game.id.toString(),
    title: game.name,
    description: game.description || 'Have fun playing!',
    icon: config.icon,
    iconBgColor: config.iconBgColor,
    buttonColor: config.buttonColor,
    image: game.image || undefined,
    instructions: game.instructions,
  };
};

export default function GamesPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleMenuClose = () => setIsMobileMenuOpen(false);
  const [selectedGame, setSelectedGame] = useState<GameCard | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [showGamePlay, setShowGamePlay] = useState(false);
  const [currentGameDetails, setCurrentGameDetails] = useState<Game | null>(null);
  const [games, setGames] = useState<GameCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGameDataLoading, setIsGameDataLoading] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [answerKey, setAnswerKey] = useState<string>('');
  const [slots, setSlots] = useState<(string|null)[]>([]);
  const [pool, setPool] = useState<string[]>([]);
  const [basePool, setBasePool] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showHintPrompt, setShowHintPrompt] = useState(false);
  const [hasUsedHint, setHasUsedHint] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [checkModalMessage, setCheckModalMessage] = useState('');
  const hintButtonRef = useRef<HTMLButtonElement | null>(null);
  const checkButtonRef = useRef<HTMLButtonElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playDragSound = () => {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = audioCtxRef.current || new AudioContextClass();
    if (!audioCtxRef.current) {
      audioCtxRef.current = ctx;
    }
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  };

  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
        return;
      }

      setIsLoading(true);
      try {
        const gamesData = await getGames(token);
        const mappedGames = gamesData.map(mapGameToCard);
        setGames(mappedGames);
      } catch (error) {
        const errorMessage = error instanceof ApiClientError
          ? error.message
          : error instanceof Error
          ? error.message
          : 'Failed to load games';
        showErrorToast(formatErrorMessage(errorMessage));
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [router]);

  useEffect(() => {
    if (!showGamePlay || hasUsedHint || isGameDataLoading || !currentGameDetails?.hint) {
      setShowHintPrompt(false);
      return;
    }
    if (slots.every((slot) => slot)) {
      setShowHintPrompt(false);
      return;
    }
    const timer = window.setTimeout(() => setShowHintPrompt(true), 12000);
    return () => window.clearTimeout(timer);
  }, [showGamePlay, hasUsedHint, isGameDataLoading, currentGameDetails, slots]);

  useEffect(() => {
    if (!showGamePlay || !answerKey || hasChecked) return;
    if (slots.every(Boolean) && slots.length === answerKey.length) {
      const attempt = slots.join('');
      if (attempt === answerKey) {
        setHasChecked(true);
        setShowCelebration(true);
        setShowCheckModal(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F472B6', '#FBBF24', '#60A5FA', '#34D399', '#A78BFA'],
        });
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#F472B6', '#FBBF24', '#60A5FA', '#34D399', '#A78BFA'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#F472B6', '#FBBF24', '#60A5FA', '#34D399', '#A78BFA'],
        });
        window.setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  }, [slots, answerKey, showGamePlay, hasChecked]);

  const handleGameClick = (game: GameCard) => {
    setSelectedGame(game);
    setShowGame(true);
    setShowGamePlay(false);
    setCurrentGameDetails(null);
    setAnswerKey('');
    setSlots([]);
    setPool([]);
    setBasePool([]);
    setShowDescriptionModal(false);
    setShowCelebration(false);
    setShowHintPrompt(false);
    setHasUsedHint(false);
    setHasChecked(false);
    setShowHintModal(false);
    setShowCheckModal(false);
  };

  const normalizeAnswer = (answer: string) => answer.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  const generatePoolFromAnswer = (answer: string) => {
    const letters = answer.split('');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const extrasCount = Math.max(3, Math.min(6, Math.ceil(answer.length / 2) || 3));
    for (let i = 0; i < extrasCount; i += 1) {
      const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
      letters.push(randomChar);
    }
    for (let i = letters.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
  };

  const initializeGameBoard = (answer: string) => {
    const normalized = normalizeAnswer(answer || '');
    const safeAnswer = normalized || 'FUN';
    setAnswerKey(safeAnswer);
    setSlots(Array(safeAnswer.length).fill(null));
    const poolLetters = generatePoolFromAnswer(safeAnswer);
    setPool(poolLetters);
    setBasePool(poolLetters);
  };

  const handleStartGame = async () => {
    if (!selectedGame) return;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }
    setShowDescriptionModal(false);
    setShowHintPrompt(false);
    setHasChecked(false);
    setShowHintModal(false);
    setShowCheckModal(false);
    setIsGameDataLoading(true);
    try {
      const details = await getGameById(selectedGame.id, token);
      setCurrentGameDetails(details);
      initializeGameBoard(details.correct_answer || details.name);
      setShowGamePlay(true);
    } catch (error) {
      const errorMessage = error instanceof ApiClientError
        ? error.message
        : error instanceof Error
        ? error.message
        : 'Failed to load game details';
      showErrorToast(formatErrorMessage(errorMessage));
    } finally {
      setIsGameDataLoading(false);
    }
  };

  const handleBackToList = () => {
    setShowGame(false);
    setShowGamePlay(false);
    setSelectedGame(null);
    setCurrentGameDetails(null);
    setAnswerKey('');
    setSlots([]);
    setPool([]);
    setBasePool([]);
    setShowDescriptionModal(false);
    setShowCelebration(false);
    setShowHintPrompt(false);
    setHasUsedHint(false);
    setHasChecked(false);
    setShowHintModal(false);
    setShowCheckModal(false);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, letter: string, from: 'pool' | number) => {
    e.dataTransfer.setData('application/letter', JSON.stringify({ letter, from }));
    e.dataTransfer.effectAllowed = 'move';
    playDragSound();
  };

  const handleDropOnSlot = (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/letter');
    if (!data) return;
    const { letter, from } = JSON.parse(data) as { letter: string; from: 'pool' | number };
    if (slots[slotIndex]) return;
    const nextSlots = [...slots];
    if (from === 'pool') {
      nextSlots[slotIndex] = letter;
      setSlots(nextSlots);
      setPool((prev) => {
        const idx = prev.indexOf(letter);
        if (idx >= 0) {
          const copy = [...prev];
          copy.splice(idx, 1);
          return copy;
        }
        return prev;
      });
      playDragSound();
      setShowCheckModal(false);
    } else {
      const prevIndex = from as number;
      const movingLetter = nextSlots[prevIndex];
      if (!movingLetter) return;
      nextSlots[prevIndex] = null;
      nextSlots[slotIndex] = movingLetter;
      setSlots(nextSlots);
      playDragSound();
      setShowCheckModal(false);
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
        playDragSound();
        setShowCheckModal(false);
      }
    }
  };

  const handleSlotClick = (index: number) => {
    const letter = slots[index];
    if (!letter) return;
    const nextSlots = [...slots];
    nextSlots[index] = null;
    setSlots(nextSlots);
    setPool((prev) => [...prev, letter]);
    setShowCheckModal(false);
  };

  const handleClear = () => {
    if (!answerKey) return;
    setSlots(Array(answerKey.length).fill(null));
    setPool([...basePool]);
    setHasChecked(false);
    setShowCheckModal(false);
  };

  const handleHintClick = () => {
    if (isGameDataLoading) return;
    setHasUsedHint(true);
    setShowHintPrompt(false);
    setShowHintModal(true);
  };

  const handleCheckWord = () => {
    if (!answerKey || !currentGameDetails) return;
    setCheckModalMessage(`Correct answer: ${currentGameDetails.correct_answer || answerKey}`);
    setShowCheckModal(true);
  };

  const isCorrect = answerKey.length > 0 && slots.every(Boolean) && slots.join('') === answerKey;
  const progressPercent = answerKey.length
    ? Math.round((slots.filter(Boolean).length / answerKey.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ElementaryNavbar onMenuToggle={handleMenuToggle} />
      <div className="flex">
        <ElementarySidebar activeItem="games" isMobileMenuOpen={isMobileMenuOpen} onMobileMenuClose={handleMenuClose} />

        <main className="flex-1 bg-linear-to-br from-[#DBEAFE] via-[#F0FDF4] to-[#CFFAFE] sm:pl-[280px] lg:pl-[320px]">
          <div className="p-4 lg:p-8">
            {/* Heading */}
            <div className="bg-white/60 rounded-xl shadow-md px-4 sm:px-6 py-4 sm:py-5 sm:ml-8 sm:mr-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <div>
                <div className="text-[20px] sm:text-[22px] lg:text-[24px] font-semibold text-[#7C3AED]">Fun & Games!</div>
                <div className="text-[14px] sm:text-[15px] text-[#4B5563] mt-1">Test what you learned with fun games and quizzes!</div>
              </div>
            </div>

            {/* Games content */}
            <div className="sm:ml-8 sm:mr-8 mt-6">
                {!showGame ? (
                  games.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                      {games.map((game) => (
                      <div
                        key={game.id}
                        className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer"
                        onClick={() => handleGameClick(game)}
                      >
                        <div className="relative h-32 sm:h-36 lg:h-40 bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 overflow-hidden">
                          {game.image ? (
                            <Image
                              src={game.image}
                              alt={game.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className={`w-16 h-16 rounded-full ${game.iconBgColor} flex items-center justify-center`}>
                                <Icon icon={game.icon} className="text-gray-700" width={32} height={32} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-4 sm:p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-full ${game.iconBgColor} flex items-center justify-center shrink-0 mt-0.5`}>
                              <Icon icon={game.icon} className="text-gray-700" width={20} height={20} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#111827] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {game.title}
                              </h3>
                              <p className="text-[12px] sm:text-[13px] text-[#6B7280]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {game.description}
                              </p>
                            </div>
                      </div>
                        <button
                          type="button"
                            className={`w-full ${game.buttonColor} text-white text-[13px] sm:text-[14px] font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm`}
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGameClick(game);
                            }}
                          >
                            Play Now!
                            <Icon icon="mdi:play" width={16} height={16} />
                        </button>
                        </div>
                      </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/70 rounded-2xl shadow-md px-6 py-12 text-center">
                      <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        No games available at the moment.
                      </p>
                  </div>
                  )
                ) : !showGamePlay ? (
                  <div className="bg-white/70 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] px-4 sm:px-6 py-6 sm:py-10 border-2" style={{ borderColor: '#FACC15' }}>
                    <div className="text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <div className="text-[24px] sm:text-[28px] lg:text-[34px] font-extrabold text-[#7C3AED]">
                        Let's Play {selectedGame?.title || 'Game'}!
                      </div>
                      <div className="text-[14px] sm:text-[16px] text-[#4B5563] mt-2">
                        {selectedGame?.instructions || selectedGame?.description || 'Look at the picture and spell the word correctly!'}
                      </div>
                      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                          type="button"
                          onClick={handleStartGame}
                          disabled={isGameDataLoading}
                          className="h-12 px-6 rounded-full text-white flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          style={{ background: 'linear-gradient(90deg, #10B981, #3B82F6)' }}
                        >
                          {isGameDataLoading ? (
                            <>
                              <Icon icon="mdi:loading" className="animate-spin" width={20} height={20} />
                              Loading...
                            </>
                          ) : (
                            <>
                          <Icon icon="mdi:play-circle" width={20} height={20} />
                          Start Game
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="h-12 px-6 rounded-full text-white flex items-center gap-2 shadow-md cursor-pointer"
                          style={{ background: 'linear-gradient(90deg, #FDBA74, #F97316)' }}
                          onClick={() => setShowDescriptionModal(true)}
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
                        <button 
                          className="h-10 px-4 rounded-full text-white text-sm flex items-center gap-2 cursor-pointer" 
                          style={{ background: 'linear-gradient(90deg, #FB923C, #F97316)' }} 
                          onClick={handleBackToList}
                        >
                          <Icon icon="mdi:arrow-left" /> Back to List
                        </button>
                        <div className="text-center sm:text-left flex items-center gap-2 justify-center">
                          <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#7C3AED]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {selectedGame?.title || 'Let\'s Play!'}
                          </h2>
                          {(currentGameDetails?.description || selectedGame?.description) && (
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center"
                              onClick={() => setShowDescriptionModal(true)}
                              aria-label="Show description"
                            >
                              <Icon icon="mdi:information-outline" />
                            </button>
                          )}
                        </div>
                        <button className="h-10 px-4 rounded-full text-white text-sm flex items-center gap-2 cursor-pointer" style={{ background: 'linear-gradient(90deg, #22C55E, #3B82F6)' }}>
                          Next <Icon icon="mdi:arrow-right" />
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-2xl w-full max-w-3xl p-4 sm:p-6 shadow-inner">
                        {isGameDataLoading ? (
                          <div className="w-full flex justify-center py-12">
                            <Spinner size="lg" />
                          </div>
                        ) : (
                        <div className="flex flex-col items-center w-full">
                          <div className="mb-4">
                            {currentGameDetails?.image ? (
                            <div className="w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] rounded-xl overflow-hidden shadow">
                                <Image
                                  src={currentGameDetails.image}
                                  alt={currentGameDetails.name || 'game'}
                                  width={140}
                                  height={140}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ) : (
                              <div className="w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] rounded-xl shadow bg-gray-200 flex items-center justify-center">
                                <Icon icon="mdi:image-off-outline" className="text-gray-500" width={32} height={32} />
                              </div>
                            )}
                            </div>
                          <div className="text-[15px] sm:text-[16px] text-[#111827] mb-3 text-center">
                            {currentGameDetails?.instructions || selectedGame?.instructions || 'Spell the word!'}
                          </div>

                          {/* Drop slots */}
                          <div className="w-full flex items-center justify-center gap-2 sm:gap-3 mb-6 flex-wrap">
                            {slots.map((s, idx) => (
                              <div
                                key={idx}
                                onDrop={(e) => handleDropOnSlot(e, idx)}
                                onDragOver={handleAllowDrop}
                                onClick={() => handleSlotClick(idx)}
                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-[16px] sm:text-[18px] font-semibold ${s ? 'bg-white shadow' : 'bg-white border border-dashed border-[#E5E7EB]'}`}
                                style={s ? { border: '2px solid transparent', background: 'linear-gradient(#FFFFFF,#FFFFFF) padding-box, linear-gradient(90deg, #22C55E, #3B82F6) border-box' } : undefined}
                                title={s ? 'Tap to send back to the letter pool' : 'Drop a letter here'}
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
                            className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6 min-h-[72px] w-full border-2 border-dashed border-transparent hover:border-[#C7D2FE] rounded-2xl bg-white/60 transition px-4 py-2"
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

                          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                            <button
                              onClick={handleClear}
                              className="h-10 px-5 rounded-full text-white text-sm flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
                              style={{ background: 'linear-gradient(90deg, #FB923C, #F97316)' }}
                            >
                              <Icon icon="mdi:refresh" /> Clear
                            </button>
                            <div className="relative w-full sm:w-auto">
                              {showCheckModal && (
                                <div
                                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-xl shadow-lg p-4 max-w-xs w-64 z-50 border border-gray-200"
                                  style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="text-sm font-semibold text-[#16A34A]">Great Job!</h4>
                                    <button
                                      type="button"
                                      className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs"
                                      onClick={() => setShowCheckModal(false)}
                                    >
                                      <Icon icon="mdi:close" width={14} height={14} />
                                    </button>
                                  </div>
                                  <p className="text-xs text-[#4B5563]">{checkModalMessage}</p>
                                </div>
                              )}
                              <button
                                ref={checkButtonRef}
                                onClick={handleCheckWord}
                                disabled={isGameDataLoading || !answerKey}
                                className="h-10 px-5 rounded-full text-white text-sm flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center disabled:opacity-60"
                                style={{ background: 'linear-gradient(90deg, #22C55E, #16A34A)' }}
                              >
                              <Icon icon="mdi:check-circle" /> Check Word
                            </button>
                            </div>
                            <div className="relative w-full sm:w-auto">
                              {showHintPrompt && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-[#7C3AED] text-xs font-semibold px-3 py-1 rounded-full shadow animate-bounce whitespace-nowrap z-10">
                                  Need help? Try a hint!
                                </div>
                              )}
                              {showHintModal && (
                                <div
                                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-xl shadow-lg p-4 max-w-xs w-64 z-50 border border-gray-200"
                                  style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="text-sm font-semibold text-[#7C3AED]">Hint</h4>
                                    <button
                                      type="button"
                                      className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs"
                                      onClick={() => setShowHintModal(false)}
                                    >
                                      <Icon icon="mdi:close" width={14} height={14} />
                                    </button>
                                  </div>
                                  <p className="text-xs text-[#4B5563]">
                                    {currentGameDetails?.hint || currentGameDetails?.instructions || selectedGame?.instructions || 'Keep trying!'}
                                  </p>
                                </div>
                              )}
                              <button
                                ref={hintButtonRef}
                                type="button"
                                disabled={isGameDataLoading || (!currentGameDetails?.hint && !selectedGame?.instructions)}
                                onClick={handleHintClick}
                                className="h-10 px-5 rounded-full text-white text-sm flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center disabled:opacity-60"
                                style={{ background: 'linear-gradient(90deg, #60A5FA, #2563EB)' }}
                              >
                              <Icon icon="mdi:lightbulb-on-outline" /> Hint
                            </button>
                            </div>
                          </div>
                        </div>
                        )}
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
          </div>
        </main>
      </div>
      {showDescriptionModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[#111827]">About this game</h3>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
                onClick={() => setShowDescriptionModal(false)}
              >
                <Icon icon="mdi:close" />
              </button>
            </div>
            <p className="text-sm text-[#4B5563]">
              {currentGameDetails?.description || selectedGame?.description || 'Have fun learning with interactive games!'}
            </p>
          </div>
        </div>
      )}
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="relative">
            <div className="bg-white/95 rounded-3xl px-10 py-8 text-center shadow-2xl animate-pulse" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-xl font-bold text-[#7C3AED]">Fantastic!</p>
              <p className="text-sm text-[#4B5563] mt-1">You spelled it perfectly! 🌟</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

