'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import ElementaryNavbar from '@/components/elementary/ElementaryNavbar';
import ElementarySidebar from '@/components/elementary/ElementarySidebar';
import { getKidsAssignments, KidsAssignment } from '@/lib/api/dashboard';
import { submitSolution, SubmitSolutionRequest } from '@/lib/api/assignments';
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
  const [assignment, setAssignment] = useState<KidsAssignment | null>(null);
  const [solution, setSolution] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
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
        const data = await getKidsAssignments(token);
        const foundAssignment = data.assignments.find(
          (a) => a.id.toString() === assignmentId
        );
        
        if (!foundAssignment) {
          showErrorToast('Assignment not found');
          router.push('/assignments');
          return;
        }
        
        setAssignment(foundAssignment);
      } catch (error) {
        const errorMessage = error instanceof ApiClientError
          ? error.message
          : error instanceof Error
          ? error.message
          : 'Failed to load assignment';
        showErrorToast(formatErrorMessage(errorMessage));
        router.push('/assignments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId, router]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!solution.trim() && !selectedFile) {
      showErrorToast('Please provide a solution or attach a file');
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData: SubmitSolutionRequest = {
        general_id: assignment?.id,
        solution: solution.trim() || undefined,
        attachment: selectedFile || undefined,
      };

      await submitSolution(submitData, token);
      
      showSuccessToast('🎉 Assignment submitted successfully!');
      
      // Refresh assignment data to get updated status
      const updatedData = await getKidsAssignments(token);
      const updatedAssignment = updatedData.assignments.find(
        (a) => a.id.toString() === assignmentId
      );
      if (updatedAssignment) {
        setAssignment(updatedAssignment);
      }
      
      setTimeout(() => {
        router.push('/assignments');
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof ApiClientError
        ? error.message
        : error instanceof Error
        ? error.message
        : 'Failed to submit assignment';
      showErrorToast(formatErrorMessage(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDueDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`;
    } else if (diffDays === 0) {
      return 'Due Today';
    } else if (diffDays === 1) {
      return 'Due Tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const calculateDaysUntilDue = (dueDateString: string): number => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusConfig = (status: string, daysUntilDue: number) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower === 'submitted') {
      return {
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
        icon: 'mdi:check-circle',
        label: 'Submitted',
        emoji: '✅',
      };
    }
    
    if (daysUntilDue < 0) {
      return {
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-300',
        icon: 'mdi:alert-circle',
        label: 'Overdue',
        emoji: '⚠️',
      };
    }
    
    if (daysUntilDue === 0) {
      return {
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-300',
        icon: 'mdi:clock-alert',
        label: 'Due Today',
        emoji: '⏰',
      };
    }
    
    if (daysUntilDue <= 3) {
      return {
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-300',
        icon: 'mdi:clock-outline',
        label: 'Due Soon',
        emoji: '⏳',
      };
    }
    
    return {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-300',
      icon: 'mdi:clipboard-text-outline',
      label: 'Not Submitted',
      emoji: '📝',
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  const daysUntilDue = calculateDaysUntilDue(assignment.due_at);
  const statusConfig = getStatusConfig(assignment.status, daysUntilDue);

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
                      {assignment.title}
                    </h1>
                    
                    {assignment.instructions && assignment.instructions.trim() && (
                      <div className="mb-4 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                            <Icon icon="mdi:information" className="text-white" width={20} height={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                              <span>📋</span>
                              <span>Instructions</span>
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Andika, sans-serif' }}>
                              {assignment.instructions}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${statusConfig.borderColor} ${statusConfig.bgColor} ${statusConfig.textColor} flex items-center gap-2`} style={{ fontFamily: 'Andika, sans-serif' }}>
                        <span className="text-base">{statusConfig.emoji}</span>
                        <Icon icon={statusConfig.icon} width={18} height={18} />
                        <span>{statusConfig.label}</span>
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.borderColor}`} style={{ fontFamily: 'Andika, sans-serif' }}>
                        {formatDueDate(assignment.due_at)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize" style={{ fontFamily: 'Andika, sans-serif' }}>
                        {assignment.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="sm:mx-8 mx-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-[#E5E7EB]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#7C3AED] flex items-center gap-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                    <Icon icon="mdi:file-document-edit" width={28} height={28} />
                    Your Solution
                  </h2>
                  
                  {/* Status Display */}
                  <div className={`px-4 py-2 rounded-xl ${statusConfig.bgColor} ${statusConfig.textColor} border-2 ${statusConfig.borderColor} flex items-center gap-2`}>
                    <span className="text-lg">{statusConfig.emoji}</span>
                    <Icon icon={statusConfig.icon} width={20} height={20} />
                    <span className="font-semibold text-sm" style={{ fontFamily: 'Andika, sans-serif' }}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Text Solution */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                    Write your answer here ✍️
                  </label>
                  <textarea
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Type your answer here... Be creative and show what you learned! 🌟"
                    disabled={assignment.status?.toLowerCase() === 'submitted'}
                    className={`w-full h-48 sm:h-64 p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent resize-none text-sm sm:text-base ${
                      assignment.status?.toLowerCase() === 'submitted' 
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
                        : 'border-gray-300'
                    }`}
                    style={{ fontFamily: 'Andika, sans-serif' }}
                  />
                  <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                    You can write your answer or attach a file, or both!
                  </p>
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                    Or attach a file 📎
                  </label>
                  
                  {assignment.status?.toLowerCase() === 'submitted' ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                      <Icon 
                        icon="mdi:file-check" 
                        className="mx-auto mb-3 text-gray-400" 
                        width={48} 
                        height={48} 
                      />
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'Andika, sans-serif' }}>
                        File upload is disabled. This assignment has already been submitted.
                      </p>
                    </div>
                  ) : !selectedFile ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                        dragActive
                          ? 'border-[#9333EA] bg-purple-50'
                          : 'border-gray-300 hover:border-[#9333EA] hover:bg-purple-50'
                      }`}
                    >
                      <Icon 
                        icon="mdi:cloud-upload" 
                        className="mx-auto mb-3 text-[#9333EA]" 
                        width={48} 
                        height={48} 
                      />
                      <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                        Drag and drop your file here, or
                      </p>
                      <label className="inline-block">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                          disabled={assignment.status?.toLowerCase() === 'submitted'}
                        />
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          assignment.status?.toLowerCase() === 'submitted'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#9333EA] text-white cursor-pointer hover:bg-[#7C3AED]'
                        }`} style={{ fontFamily: 'Andika, sans-serif' }}>
                          <Icon icon="mdi:file-upload" width={18} height={18} />
                          Choose File
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Andika, sans-serif' }}>
                        PDF, Word, Images, or Text files
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-green-300 bg-green-50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center shrink-0">
                          <Icon icon="mdi:file-check" className="text-green-700" width={24} height={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>
                            {fileName}
                          </p>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Andika, sans-serif' }}>
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors shrink-0"
                        aria-label="Remove file"
                      >
                        <Icon icon="mdi:close" width={18} height={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {assignment.status?.toLowerCase() === 'submitted' ? (
                    <div className="flex-1 h-12 sm:h-14 rounded-xl bg-green-100 text-green-700 font-bold text-base sm:text-lg flex items-center justify-center gap-2 border-2 border-green-300">
                      <Icon icon="mdi:check-circle" width={24} height={24} />
                      <span style={{ fontFamily: 'Andika, sans-serif' }}>Already Submitted ✅</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || (!solution.trim() && !selectedFile)}
                      className="flex-1 h-12 sm:h-14 rounded-xl text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
                        fontFamily: 'Andika, sans-serif'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size="sm" className="text-white" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Icon icon="mdi:send" width={24} height={24} />
                          <span>Submit Assignment 🚀</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  <Link
                    href="/assignments"
                    className="flex-1 sm:flex-initial sm:w-auto h-12 sm:h-14 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors px-4 sm:px-6 min-w-0 overflow-hidden"
                    style={{ fontFamily: 'Andika, sans-serif' }}
                  >
                    <Icon icon="mdi:cancel" width={18} height={18} className="shrink-0" />
                    <span className="hidden sm:inline whitespace-nowrap">Cancel</span>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

