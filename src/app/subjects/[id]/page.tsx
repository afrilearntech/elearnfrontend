'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import ElementaryNavbar from '@/components/elementary/ElementaryNavbar';
import ElementarySidebar from '@/components/elementary/ElementarySidebar';
import { getLessonById, LessonDetail, markLessonTaken } from '@/lib/api/lessons';
import { ApiClientError } from '@/lib/api/client';
import { showErrorToast, formatErrorMessage } from '@/lib/toast';
import Spinner from '@/components/ui/Spinner';

function VideoThumbnail({ 
  thumbnail, 
  fallbackSrc, 
  alt 
}: { 
  thumbnail: string | null | undefined; 
  fallbackSrc: string; 
  alt: string;
}) {
  const [useFallback, setUseFallback] = useState(!thumbnail);

  if (!thumbnail) {
    return <Image src={fallbackSrc} alt={alt} fill className="object-cover" />;
  }

  if (useFallback) {
    return <Image src={fallbackSrc} alt={alt} fill className="object-cover" />;
  }

  return (
    <Image 
      src={thumbnail} 
      alt={alt} 
      fill 
      className="object-cover"
      onError={() => setUseFallback(true)}
    />
  );
}

export default function SubjectLessonDetail() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params?.id as string;
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleMenuClose = () => setIsMobileMenuOpen(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [hasRecordedProgress, setHasRecordedProgress] = useState(false);
  const [isRecordingProgress, setIsRecordingProgress] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const fallbackVideoSources = [
    '/__mocks__/Addition using sets.mp4',
    '/__mocks__/Addition using sets 2.mp4',
    '/__mocks__/Adjectives 2.mp4',
    '/__mocks__/Dis Joint Sets 2.mp4',
  ];
  
  const fallbackThumbnail = '/grade3.png';
  
  const videoSrc = lesson?.resource || fallbackVideoSources[0];
  
  const thumbnailSrc = lesson?.thumbnail || fallbackThumbnail;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id) {
          setStudentId(parsedUser.id);
        }
      } catch (error) {
        console.error('Failed to parse user from storage', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!lessonId) {
        router.push('/subjects');
        return;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
        return;
      }
      setAuthToken(token);

      setIsLoading(true);
      try {
        const lessonData = await getLessonById(lessonId, token);
        setLesson(lessonData);
      } catch (error) {
        const errorMessage = error instanceof ApiClientError
          ? error.message
          : error instanceof Error
          ? error.message
          : 'Failed to load lesson';
        showErrorToast(formatErrorMessage(errorMessage));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonData();
  }, [lessonId, router]);

  const handleVideoProgress = async () => {
    if (
      !lesson ||
      hasRecordedProgress ||
      isRecordingProgress ||
      !studentId ||
      !authToken ||
      !videoRef.current
    ) {
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement.duration || videoElement.duration === Infinity) {
      return;
    }

    const progress = videoElement.currentTime / videoElement.duration;
    if (progress >= 0.5) {
      try {
        setIsRecordingProgress(true);
        await markLessonTaken(
          {
            student: studentId,
            lesson: lesson.id,
          },
          authToken,
        );
        setHasRecordedProgress(true);
      } catch (error) {
        const errorMessage = error instanceof ApiClientError
          ? error.message
          : error instanceof Error
          ? error.message
          : 'Failed to record lesson progress';
        showErrorToast(formatErrorMessage(errorMessage));
      } finally {
        setIsRecordingProgress(false);
      }
    }
  };

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
        <ElementarySidebar activeItem="subjects" isMobileMenuOpen={isMobileMenuOpen} onMobileMenuClose={handleMenuClose} />

        <main className="flex-1 bg-linear-to-br from-[#DBEAFE] via-[#F0FDF4] to-[#CFFAFE] sm:pl-[280px] lg:pl-[320px]">
          <div className="p-4 lg:p-8">
            {/* Header progress card */}
            <div className="bg-white/60 rounded-xl shadow-md px-4 sm:px-6 py-4 sm:mx-8 mx-4 h-auto lg:h-[187px] flex flex-col justify-between border" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-[55px] h-[60px] rounded-lg bg-linear-to-r from-[#3B82F6] to-[#10B981] flex items-center justify-center">
                    <Image src="/settings.png" alt="settings" width={27} height={32} />
                  </div>
                  <div>
                    <h2 className="text-[25px] font-normal text-[#9333EA]" style={{ fontFamily: 'Andika, sans-serif' }}>
                      {lesson?.title || 'Loading Lesson...'}
                    </h2>
                    <p className="text-[15px] font-normal text-[#4B5563]" style={{ fontFamily: 'Andika, sans-serif' }}>
                      {lesson?.duration_minutes ? `Duration: ${lesson.duration_minutes} minutes` : 'Lesson Details'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {lesson?.status && (
                    <span className={`inline-flex items-center justify-center px-3 h-[34px] rounded-full text-[14px] ${
                      lesson.status === 'APPROVED' 
                        ? 'bg-[#10B981]/20 text-[#10B981]' 
                        : 'bg-yellow-500/20 text-yellow-600'
                    }`} style={{ fontFamily: 'Andika, sans-serif' }}>
                      {lesson.status}
                    </span>
                  )}
                  <Link href="/subjects" className="w-[164px] h-[40px] rounded-full bg-[#F97316] text-white text-[14px] flex items-center justify-center gap-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                    <Icon icon="mdi:arrow-left" width={18} height={18} />
                    Back to Subjects
                  </Link>
                </div>
              </div>
              {lesson?.duration_minutes && (
              <div className="mt-3">
                <div className="h-[13px] w-full bg-gray-200 rounded-full">
                    <div className="h-[13px] rounded-full bg-linear-to-r from-[#10B981] to-[#3B82F6]" style={{ width: '100%' }}></div>
                  </div>
                  <div className="text-[12px] text-[#4B5563] mt-1 text-center" style={{ fontFamily: 'Andika, sans-serif' }}>
                    Lesson Duration: {lesson.duration_minutes} minutes
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 mt-6 sm:mx-8 mx-4">
              {/* Main video/content */}
              <div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="px-6 py-3 bg-linear-to-r from-[#EC4899] to-[#6366F1] text-white" style={{ fontFamily: 'Andika, sans-serif' }}>
                    <div className="text-[16px] font-semibold">Watch & Learn!</div>
                    <div className="text-[12px] opacity-90">Get ready for an exciting lesson!</div>
                  </div>
                  <div className="relative h-[220px] sm:h-[320px] lg:h-[460px] w-full bg-gray-100">
                    {isVideoOpen ? (
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src={videoSrc}
                        controls
                        autoPlay
                        onTimeUpdate={handleVideoProgress}
                        onError={(e) => {
                          // If API video fails, try fallback
                          const currentSrc = (e.target as HTMLVideoElement).src;
                          if (lesson?.resource && currentSrc === lesson.resource) {
                            // API video failed, switch to fallback
                            const fallbackVideo = fallbackVideoSources[0];
                            (e.target as HTMLVideoElement).src = fallbackVideo;
                          }
                        }}
                      />
                    ) : (
                      <>
                        <VideoThumbnail 
                          thumbnail={lesson?.thumbnail} 
                          fallbackSrc={fallbackThumbnail}
                          alt={lesson?.title || 'Lesson thumbnail'}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setIsVideoOpen(true)}
                            className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F59E0B]"
                            aria-label="Play video"
                          >
                            <Icon icon="mdi:play" width={28} height={28} className="text-[#F59E0B]" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-[15px] sm:text-[16px] font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                      {lesson?.title || 'Lesson Content'}
                    </h3>
                    <p className="text-[12px] sm:text-[13px] text-gray-700" style={{ fontFamily: 'Andika, sans-serif' }}>
                      {lesson?.description || 'No description available for this lesson.'}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <button className="flex-1 h-10 rounded-lg bg-linear-to-r from-[#10B981] to-[#3B82F6] text-white text-xs sm:text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                        <Icon icon="mdi:chevron-right-circle" /> Next Lesson
                      </button>
                      <button className="flex-1 h-10 rounded-lg bg-linear-to-r from-[#FB923C] to-[#EF4444] text-white text-xs sm:text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                        <Icon icon="mdi:clipboard-text" /> Try Quiz
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right sidebar widgets */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="mdi:trophy" className="text-[#F59E0B]" />
                    <h4 className="text-[14px] font-semibold text-gray-900" style={{ fontFamily: 'Andika, sans-serif' }}>Your Badges</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['Video Master','Quiz Whiz','Fast Learner'].map((b, i) => (
                      <div key={b} className="bg-gray-50 rounded-lg h-16 flex flex-col items-center justify-center">
                        <div className={`w-8 h-8 rounded-full ${i===0?'bg-[#F59E0B]':i===1?'bg-[#3B82F6]':'bg-[#8B5CF6]'} flex items-center justify-center text-white`}>
                          <Icon icon={i===0?'mdi:star':'mdi:crown'} width={16} height={16} />
                        </div>
                        <span className="text-[10px] mt-1" style={{ fontFamily: 'Andika, sans-serif' }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4">
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Andika, sans-serif' }}>This Week</h4>
                  <div className="text-[10px] text-gray-600 mb-1" style={{ fontFamily: 'Andika, sans-serif' }}>Lessons Completed <span className="float-right">5/8</span></div>
                  <div className="h-2 bg-gray-200 rounded-full mb-2">
                    <div className="h-2 rounded-full bg-[#3B82F6]" style={{ width: '62%' }}></div>
                  </div>
                  <div className="text-[10px] text-gray-600 mb-1" style={{ fontFamily: 'Andika, sans-serif' }}>Quiz Score <span className="float-right">92%</span></div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 rounded-full bg-[#EF4444]" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4">
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Andika, sans-serif' }}>Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full h-10 rounded-lg bg-[#F472B6] text-white text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                      <Icon icon="mdi:content-save" /> Save for Later
                    </button>
                    <button className="w-full h-10 rounded-lg bg-[#3B82F6] text-white text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                      <Icon icon="mdi:share" /> Share with Friends
                    </button>
                    <button className="w-full h-10 rounded-lg bg-[#8B5CF6] text-white text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                      <Icon icon="mdi:help-circle" /> Ask for Help
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


