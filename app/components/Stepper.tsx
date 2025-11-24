"use client";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepChange?: (index: number) => void;
  errorSteps?: number[];
}

export function Stepper({
  steps,
  currentStep,
  onStepChange,
  errorSteps = [],
}: StepperProps) {
  return (
    <div className="w-full overflow-x-auto pb-3 mb-6 border-b">
      <div className="flex items-center gap-6 min-w-max px-2">
        {steps.map((label, index) => {
          const isActive = index === currentStep;
          const hasError = errorSteps.includes(index);
          const isCompleted = index < currentStep;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onStepChange && onStepChange(index)}
              className={`
                flex flex-col items-center justify-start
                transition-all duration-200 cursor-pointer
                whitespace-nowrap px-2
                ${
                  isActive
                    ? "text-blue-700"
                    : hasError
                    ? "text-red-600"
                    : isCompleted
                    ? "text-green-700"
                    : "text-slate-600"
                }
              `}
            >
              {/* NÖMRƏ BADGE */}
              <span
                className={`
                  flex items-center justify-center rounded-full w-10 h-10 text-sm font-semibold mb-1
                  transition-all
                  ${
                    hasError
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : isActive
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : isCompleted
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-slate-100 text-slate-600 border border-slate-300"
                  }
                `}
              >
                {index + 1}
              </span>

              {/* STEP TITLE */}
              <span className="text-md max-w-[250px] mt-5 mb-5 text-center leading-tight">
                {label}
              </span>

              {/* ALT XƏTT */}
              <span
                className={`
                  block mt-1 w-full h-[2px] rounded 
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600"
                      : hasError
                      ? "bg-red-500"
                      : isCompleted
                      ? "bg-green-500"
                      : "bg-transparent"
                  }
                `}
              ></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}