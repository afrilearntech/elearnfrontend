'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import ElementaryNavbar from '@/components/elementary/ElementaryNavbar';
import ElementarySidebar from '@/components/elementary/ElementarySidebar';
import { getKidsAssessments, KidsAssessment } from '@/lib/api/dashboard';
import { 
  submitSolution, 
  SubmitSolutionRequest,
  getAssessmentQuestions,
  AssessmentQuestionsResponse,
  AssessmentQuestion
} from '@/lib/api/assignments';
import { ApiClientError } from '@/lib/api/client';
import { showErrorToast, showSuccessToast, formatErrorMessage } from '@/lib/toast';
import Spinner from '@/components/ui/Spinner';

export default function AssignmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.id as string;
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<KidsAssessment | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentQuestionsResponse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!assignmentId) {
        router.push('/assignments');
        return;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
        return;
      }

      setIsLoading(true);
      try {
        const data = await getKidsAssessments(token);
        const foundAssessment = data.assessments.find(
          (a) => a.id.toString() === assignmentId
        );
        
        if (!foundAssessment) {
          showErrorToast('Assessment not found');
          router.push('/assignments');
          return;
        }
        
        setAssessment(foundAssessment);
        
        setIsLoadingQuestions(true);
        try {
          const params: { general_id?: number; lesson_id?: number } = {};
          if (foundAssessment.type === 'general') {
            params.general_id = foundAssessment.id;
          } else {
            params.lesson_id = foundAssessment.id;
          }
          
          const questionsData = await getAssessmentQuestions(params, token);
          setAssessmentData(questionsData);
        } catch (error) {
          console.error('Failed to load questions:', error);
        } finally {
          setIsLoadingQuestions(false);
        }
      } catch (error) {
        const errorMessage = error instanceof ApiClientError
          ? error.message
          : error instanceof Error
          ? error.message
          : 'Failed to load assessment';
        showErrorToast(formatErrorMessage(errorMessage));
        router.push('/assignments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [assignmentId, router]);


  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (assessmentData && currentQuestionIndex < assessmentData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!assessmentData) return;

    const unansweredQuestions = assessmentData.questions.filter(
      q => !answers[q.id] || answers[q.id].trim() === ''
    );

    if (unansweredQuestions.length > 0) {
      showErrorToast(`Please answer all ${assessmentData.questions.length} questions! 🎯`);
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedSolution = assessmentData.questions
        .map((q, index) => {
          const questionText = q.question.trim();
          const answerText = answers[q.id] || '';
          return `question${index + 1}: ${answerText}`;
        })
        .join(' ');

      const submitData: SubmitSolutionRequest = {
        ...(assessment?.type === 'general' ? { general_id: assessment.id } : {}),
        ...(assessment?.type === 'lesson' ? { lesson_id: assessment.id } : {}),
        solution: formattedSolution,
      };

      await submitSolution(submitData, token);
      showSuccessToast('🎉 Assessment submitted successfully! Great job! ⭐');
      setTimeout(() => {
        router.push('/assignments');
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof ApiClientError
        ? error.message
        : error instanceof Error
        ? error.message
        : 'Failed to submit assessment';
      showErrorToast(formatErrorMessage(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  const currentQuestion = assessmentData?.questions[currentQuestionIndex];
  const totalQuestions = assessmentData?.questions.length || 0;
  const answeredCount = Object.keys(answers).length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen">
      <ElementaryNavbar onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className="flex">
        <ElementarySidebar 
          activeItem="resources" 
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={() => setIsMobileMenuOpen(false)} 
        />
        
        <main className="flex-1 bg-linear-to-br from-[#DBEAFE] via-[#F0FDF4] to-[#CFFAFE] sm:pl-[280px] lg:pl-[320px] overflow-x-hidden">
          <div className="p-4 lg:p-8 max-w-full">
            {/* Header */}
            <div className="sm:mx-8 mx-4 mb-6">
              <Link 
                href="/assignments"
                className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] mb-4 transition-colors"
                style={{ fontFamily: 'Andika, sans-serif' }}
              >
                <Icon icon="mdi:arrow-left" width={20} height={20} />
                <span className="text-sm font-medium">Back to Assignments</span>
              </Link>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#E5E7EB]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#9333EA] mb-4" style={{ fontFamily: 'Andika, sans-serif' }}>
                      {assessmentData?.assessment.title || assessment.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize" style={{ fontFamily: 'Andika, sans-serif' }}>
                        {assessment.type}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700" style={{ fontFamily: 'Andika, sans-serif' }}>
                        {assessment.marks} marks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isLoadingQuestions ? (
              <div className="sm:mx-8 mx-4">
                <div className="bg-white rounded-2xl shadow-lg p-12 border-2 border-[#E5E7EB] flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              </div>
            ) : assessmentData && assessmentData.questions.length > 0 ? (
              <div className="sm:mx-8 mx-4">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-[#E5E7EB]">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#9333EA] to-[#3B82F6] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md" style={{ fontFamily: 'Andika, sans-serif' }}>
                          {currentQuestionIndex + 1}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Andika, sans-serif' }}>
                            Question {currentQuestionIndex + 1} of {totalQuestions}
                          </p>
                          <p className="text-xs text-gray-500" style={{ fontFamily: 'Andika, sans-serif' }}>
                            {answeredCount} answered
                          </p>
                        </div>
                      </div>
                      {answers[currentQuestion?.id || 0] && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Icon icon="mdi:check-circle" width={24} height={24} />
                          <span className="text-sm font-medium" style={{ fontFamily: 'Andika, sans-serif' }}>Answered</span>
                        </div>
                      )}
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
                      <div
                        className="h-full bg-gradient-to-r from-[#9333EA] to-[#3B82F6] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {currentQuestion && (
                    <div className="mb-8">
                      <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                        <div className="flex items-start gap-3 mb-4">
                          <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700 border border-gray-300 capitalize" style={{ fontFamily: 'Andika, sans-serif' }}>
                            {currentQuestion.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-relaxed" style={{ fontFamily: 'Andika, sans-serif' }}>
                          {currentQuestion.question}
                        </h2>
                      </div>

                      <div className="space-y-4">
                        {currentQuestion.type === 'MULTIPLE_CHOICE' && currentQuestion.options ? (
                          currentQuestion.options.map((option) => {
                            const isSelected = answers[currentQuestion.id] === option.value;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => handleAnswerChange(currentQuestion.id, option.value)}
                                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-[#9333EA] to-[#3B82F6] text-white border-[#9333EA] shadow-lg scale-[1.02]'
                                    : 'bg-white text-gray-900 border-gray-300 hover:border-[#9333EA] hover:bg-purple-50 hover:shadow-md'
                                }`}
                                style={{ fontFamily: 'Andika, sans-serif' }}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                    isSelected ? 'border-white bg-white' : 'border-gray-400 bg-white'
                                  }`}>
                                    {isSelected && (
                                      <Icon icon="mdi:check" width={20} height={20} className="text-[#9333EA]" />
                                    )}
                                  </div>
                                  <span className="text-base sm:text-lg font-medium flex-1">{option.value}</span>
                                </div>
                              </button>
                            );
                          })
                        ) : currentQuestion.type === 'TRUE_FALSE' ? (
                          <div className="grid grid-cols-2 gap-4">
                            {['True', 'False'].map((option) => {
                              const isSelected = answers[currentQuestion.id]?.toLowerCase() === option.toLowerCase();
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleAnswerChange(currentQuestion.id, option)}
                                  className={`p-6 rounded-xl border-2 transition-all font-semibold ${
                                    isSelected
                                      ? 'bg-gradient-to-r from-[#9333EA] to-[#3B82F6] text-white border-[#9333EA] shadow-lg scale-[1.02]'
                                      : 'bg-white text-gray-900 border-gray-300 hover:border-[#9333EA] hover:bg-purple-50 hover:shadow-md'
                                  }`}
                                  style={{ fontFamily: 'Andika, sans-serif' }}
                                >
                                  <div className="flex items-center justify-center gap-3">
                                    {isSelected && <Icon icon="mdi:check-circle" width={24} height={24} />}
                                    <span className="text-lg sm:text-xl">{option}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : currentQuestion.type === 'FILL_IN_THE_BLANK' && currentQuestion.options ? (
                          <div className="space-y-3">
                            {currentQuestion.options.map((option) => {
                              const isSelected = answers[currentQuestion.id] === option.value;
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => handleAnswerChange(currentQuestion.id, option.value)}
                                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                                    isSelected
                                      ? 'bg-gradient-to-r from-[#9333EA] to-[#3B82F6] text-white border-[#9333EA] shadow-lg scale-[1.02]'
                                      : 'bg-white text-gray-900 border-gray-300 hover:border-[#9333EA] hover:bg-purple-50 hover:shadow-md'
                                  }`}
                                  style={{ fontFamily: 'Andika, sans-serif' }}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                      isSelected ? 'border-white bg-white' : 'border-gray-400 bg-white'
                                    }`}>
                                      {isSelected && (
                                        <Icon icon="mdi:check" width={20} height={20} className="text-[#9333EA]" />
                                      )}
                                    </div>
                                    <span className="text-base sm:text-lg font-medium flex-1">{option.value}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : currentQuestion.type === 'SHORT_ANSWER' ? (
                          <input
                            type="text"
                            value={answers[currentQuestion.id] || ''}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-[#9333EA] text-base sm:text-lg"
                            style={{ fontFamily: 'Andika, sans-serif' }}
                          />
                        ) : currentQuestion.type === 'ESSAY' ? (
                          <textarea
                            value={answers[currentQuestion.id] || ''}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                            placeholder="Write your answer here... Be creative! ✍️"
                            rows={6}
                            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-[#9333EA] text-base sm:text-lg resize-none"
                            style={{ fontFamily: 'Andika, sans-serif' }}
                          />
                        ) : null}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-6 border-t-2 border-gray-200">
                    <button
                      type="button"
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold flex items-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: 'Andika, sans-serif' }}
                    >
                      <Icon icon="mdi:arrow-left" width={20} height={20} />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {assessmentData.questions.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCurrentQuestionIndex(index)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                            index === currentQuestionIndex
                              ? 'bg-gradient-to-r from-[#9333EA] to-[#3B82F6] text-white shadow-md scale-110'
                              : answers[assessmentData.questions[index].id]
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                          style={{ fontFamily: 'Andika, sans-serif' }}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    {currentQuestionIndex < totalQuestions - 1 ? (
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9333EA] to-[#3B82F6] text-white font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
                        style={{ fontFamily: 'Andika, sans-serif' }}
                      >
                        <span>Next</span>
                        <Icon icon="mdi:arrow-right" width={20} height={20} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmitAssessment}
                        disabled={isSubmitting || answeredCount !== totalQuestions}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white font-bold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: 'Andika, sans-serif' }}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner size="sm" className="text-white" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Icon icon="mdi:send" width={20} height={20} />
                            <span>Submit Assessment 🚀</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : assessmentData && assessmentData.questions.length === 0 ? (
              <div className="sm:mx-8 mx-4">
                <div className="bg-white rounded-2xl shadow-lg p-12 border-2 border-yellow-200 text-center">
                  <Icon icon="mdi:information" width={64} height={64} className="mx-auto text-yellow-600 mb-4" />
                  <p className="text-lg font-medium text-gray-700" style={{ fontFamily: 'Andika, sans-serif' }}>
                    No questions available for this assessment yet.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

