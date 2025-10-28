import { Icon } from '@iconify/react';

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  course: string;
  status: 'urgent' | 'due-soon' | 'upcoming';
  icon: string;
}

interface AssignmentsDueSectionProps {
  assignments?: Assignment[];
}

export function AssignmentsDueSection({
  assignments = [
    {
      id: '1',
      title: 'Math Assignment #5',
      dueDate: 'Due tomorrow',
      course: 'Advanced Mathematics',
      status: 'urgent',
      icon: 'mdi:exclamation'
    },
    {
      id: '2',
      title: 'Essay: Modern Literature',
      dueDate: 'Due in 3 days',
      course: 'English Literature',
      status: 'due-soon',
      icon: 'mdi:file-document-outline'
    },
    {
      id: '3',
      title: 'Lab Report: Chemical Reactions',
      dueDate: 'Due next week',
      course: 'Physics & Chemistry',
      status: 'upcoming',
      icon: 'mdi:flask'
    }
  ]
}: AssignmentsDueSectionProps) {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'urgent':
        return {
          cardBg: 'bg-red-50',
          iconBg: 'bg-red-50',
          iconColor: 'text-red-600',
          button: 'bg-red-500 hover:bg-red-600 text-white',
          buttonText: 'Urgent'
        };
      case 'due-soon':
        return {
          cardBg: 'bg-yellow-50',
          iconBg: 'bg-yellow-50',
          iconColor: 'text-yellow-600',
          button: 'bg-yellow-500 hover:bg-yellow-600 text-white',
          buttonText: 'Due Soon'
        };
      case 'upcoming':
        return {
          cardBg: 'bg-gray-50',
          iconBg: 'bg-gray-50',
          iconColor: 'text-gray-600',
          button: 'bg-gray-200 text-gray-500',
          buttonText: ''
        };
      default:
        return {
          cardBg: 'bg-gray-50',
          iconBg: 'bg-gray-50',
          iconColor: 'text-gray-600',
          button: 'bg-gray-200 text-gray-500',
          buttonText: ''
        };
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Assignments Due
        </h2>
        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View all
        </a>
      </div>
      
      <div className="space-y-4">
        {assignments.map((assignment) => {
          const statusClasses = getStatusClasses(assignment.status);
          return (
            <div key={assignment.id} className={`flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow ${statusClasses.cardBg}`}>
              <div className={`w-12 h-12 ${statusClasses.iconBg} rounded-lg flex items-center justify-center mr-4`}>
                <Icon icon={assignment.icon} className={`w-6 h-6 ${statusClasses.iconColor}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {assignment.title}
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {assignment.dueDate} • {assignment.course}
                </p>
              </div>
              
              {statusClasses.buttonText && (
                <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusClasses.button}`}>
                  {statusClasses.buttonText}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
