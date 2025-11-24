"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PrimaryRole = "student" | "non-student";

type RoleCard = {
  id: string;
  title: string;
  description: string;
};

const primaryRoles: RoleCard[] = [
  {
    id: "student",
    title: "Student",
    description: "Review and approve uploaded subjects before publication.",
  },
  {
    id: "non-student",
    title: "Non-Student",
    description: "Upload and manage learning materials and quizzes for all grade levels.",
  },
];

const nonStudentRoles: RoleCard[] = [
  {
    id: "content-manager",
    title: "Content Manager",
    description: "Review and approve uploaded subjects before publication.",
  },
  {
    id: "parent",
    title: "Parent",
    description: "Upload and manage learning materials and quizzes for all grade levels.",
  },
  {
    id: "administrator",
    title: "Administrator",
    description: "Review and approve uploaded subjects before publication.",
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "Review and approve uploaded subjects before publication.",
  },
];

export default function SignInPage() {
  const router = useRouter();
  const [step, setStep] = useState<"primary" | "non-student">("primary");
  const [selectedPrimaryRole, setSelectedPrimaryRole] =
    useState<PrimaryRole>("student");
  const [selectedNonStudentRole, setSelectedNonStudentRole] = useState(
    nonStudentRoles[0].id
  );

  const handleContinue = () => {
    if (step === "primary") {
      if (selectedPrimaryRole === "student") {
        router.push("/login");
      } else {
        setStep("non-student");
      }
    } else {
      const contentUrl =
        process.env.NEXT_PUBLIC_CONTENT_URL || "http://localhost:3001";
      window.location.href = `${contentUrl}/sign-in`;
    }
  };

  const handleBack = () => {
    setStep("primary");
    setSelectedPrimaryRole("student");
  };

  const currentRoles = step === "primary" ? primaryRoles : nonStudentRoles;
  const selectedRoleId =
    step === "primary" ? selectedPrimaryRole : selectedNonStudentRole;

  const title =
    step === "primary" ? "Sign In as" : "Choose a Non-Student Role to continue";

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            {step === "non-student" && (
              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-[#059669] font-semibold hover:text-[#047857]"
                style={{ fontFamily: "Andika, sans-serif" }}
              >
                ← Back
              </button>
            )}
          </div>
          <h1
            className="text-3xl font-semibold text-[#0F172A] text-center flex-1"
            style={{ fontFamily: "Andika, sans-serif" }}
          >
            {title}
          </h1>
          <div className="w-16" />
        </div>

        <div
          className={`grid gap-6 ${
            step === "primary"
              ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
          }`}
        >
          {currentRoles.map((role) => {
            const isSelected = role.id === selectedRoleId;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() =>
                  step === "primary"
                    ? setSelectedPrimaryRole(role.id as PrimaryRole)
                    : setSelectedNonStudentRole(role.id)
                }
                className={`relative rounded-[28px] transition-all duration-200 focus:outline-none ${
                  isSelected
                    ? "bg-linear-to-r from-[#1E40AF] to-[#059669] p-[2px] shadow-lg"
                    : "border border-[#E2E8F0] bg-white hover:border-[#059669]"
                }`}
              >
                <div
                  className={`rounded-[26px] bg-white h-full w-full px-8 py-10 flex flex-col items-center text-center gap-4 ${
                    isSelected ? "shadow-lg" : ""
                  }`}
                >
                  <span
                    className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                      isSelected ? "border-[#10B981]" : "border-[#D1D5DB]"
                    }`}
                  >
                    <span className="text-[#059669] text-xl">📝</span>
                  </span>
                  <div>
                    <h2
                      className="text-[22px] font-semibold text-[#111827]"
                      style={{ fontFamily: "Andika, sans-serif" }}
                    >
                      {role.title}
                    </h2>
                    <p
                      className="text-base text-[#6B7280] mt-3"
                      style={{ fontFamily: "Andika, sans-serif" }}
                    >
                      {role.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={handleContinue}
            className="px-12 h-12 rounded-full bg-[#059669] text-white font-semibold shadow-lg hover:bg-[#047857] transition-all duration-200 flex items-center justify-center"
            style={{ fontFamily: "Andika, sans-serif" }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

