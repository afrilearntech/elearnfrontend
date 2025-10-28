import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LearningJourneyBanner } from '@/components/courses/LearningJourneyBanner';
import { QuickStatsCards } from '@/components/courses/QuickStatsCards';
import { MyCoursesSection } from '@/components/courses/MyCoursesSection';
import { AssignmentsDueSection } from '@/components/courses/AssignmentsDueSection';

export default function CoursesPage() {
  const user = {
    name: 'Sarah Johnson',
    role: 'Student',
    profileImage: '/profile.jpg'
  };

  const notifications = 3;
  const messages = 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user}
        notifications={notifications}
        messages={messages}
        activeLink="courses"
      />
      
      <main className="container mx-auto px-4 py-8">
        <LearningJourneyBanner />
        
        <div className="mt-8">
          <QuickStatsCards />
        </div>
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MyCoursesSection />
          <AssignmentsDueSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
