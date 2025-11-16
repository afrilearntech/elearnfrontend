'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { studentLogin } from '@/lib/api/auth';
import { ApiClientError } from '@/lib/api/client';
import Spinner from '@/components/ui/Spinner';
import { showSuccessToast, showErrorToast, formatErrorMessage } from '@/lib/toast';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email address or username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await studentLogin({
        identifier: formData.identifier,
        password: formData.password,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        if (response.student) {
          const gradeMatch = response.student.grade.match(/\d+/);
          const gradeNumber = gradeMatch ? parseInt(gradeMatch[0]) : null;
          
          if (gradeNumber) {
            localStorage.setItem('user_grade', gradeNumber.toString());
            
            const user = { ...response.user, grade: gradeNumber };
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
      }

      showSuccessToast('🎉 Login successful! Redirecting...');
      
      setTimeout(() => {
        let gradeNumber: number | null = null;
        
        if (response.student?.grade) {
          const gradeMatch = response.student.grade.match(/\d+/);
          gradeNumber = gradeMatch ? parseInt(gradeMatch[0]) : null;
        }
        
        if (!gradeNumber) {
          const storedGrade = localStorage.getItem('user_grade');
          if (storedGrade) {
            gradeNumber = parseInt(storedGrade);
          }
        }
        
        if (gradeNumber && gradeNumber >= 1 && gradeNumber <= 4) {
          router.push('/dashboard/elementary');
        } else {
          router.push('/dashboard');
        }
      }, 1500);
    } catch (error: unknown) {
      if (error instanceof ApiClientError) {
        if (error.errors) {
          const fieldErrors: Record<string, string> = {};
          Object.keys(error.errors).forEach((key) => {
            const errorMessages = error.errors![key];
            if (errorMessages && errorMessages.length > 0) {
              fieldErrors[key] = errorMessages[0];
            }
          });
          setErrors(fieldErrors);
          
          const errorCount = Object.keys(fieldErrors).length;
          if (errorCount > 0) {
            showErrorToast(
              errorCount === 1 
                ? 'Please check the highlighted field and try again.'
                : `Please check the ${errorCount} highlighted fields and try again.`
            );
          }
        } else {
          const friendlyMessage = formatErrorMessage(error.message || 'Invalid credentials. Please try again.');
          showErrorToast(friendlyMessage);
        }
      } else {
        showErrorToast('An unexpected error occurred. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-linear-to-r from-[#1E40AF] to-[#059669] p-6 text-white text-center">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Student
          </h1>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Welcome message and logo */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Welcome back! Please enter your details
            </p>
            <div className="flex justify-center mb-6">
              <Image
                src="/moe.png"
                alt="Ministry of Education Logo"
                width={80}
                height={80}
                className="rounded-full"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Account Login
            </h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email/Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Email Address or Username
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleInputChange}
                placeholder="Email Address or Username"
                className={`w-full h-[50px] px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.identifier ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  autoComplete="off"
                  className={`w-full h-[50px] px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <Icon 
                    icon={showPassword ? 'material-symbols:visibility-off' : 'material-symbols:visibility'} 
                    className="w-5 h-5" 
                  />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm text-gray-600 hover:text-blue-600" 
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[50px] bg-linear-to-r from-[#059669] to-[#059669] text-white font-semibold rounded-lg flex items-center justify-center gap-3 hover:from-[#047857] hover:to-[#047857] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  <span>Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-base text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No account?{' '}
              <Link 
                href="/profile-setup" 
                className="text-lg font-semibold text-blue-600 hover:text-blue-700 underline"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

