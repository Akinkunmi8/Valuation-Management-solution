import clsx from "clsx";
import { FiCheck } from "react-icons/fi";

import type { Step } from "./types";

type StepperProps = {
  steps: Step[];
  currentStep: number;
};

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="mb-10 w-full">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;

          return (
            <div
              key={step.id}
              className="relative flex flex-1 flex-col items-center text-center"
            >
              {/* 
                CONNECTOR LINE
                Extends from center of this step to center of the next.
              */}
              {index !== steps.length - 1 && (
                <div className="absolute top-5 left-[50%] right-[-50%] h-0.5 -translate-y-1/2 z-0 px-5">
                  <div
                    className={clsx(
                      "h-full w-full transition-colors duration-300",
                      completed ? "bg-primary" : "bg-slate-200"
                    )}
                  />
                </div>
              )}

              {/* STEP CIRCLE */}
              <div
                className={clsx(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",

                  completed &&
                    "border-primary bg-primary text-white shadow-md shadow-primary/25",

                  active &&
                    "border-primary bg-white text-primary ring-4 ring-primary/10",

                  !completed &&
                    !active &&
                    "border-slate-300 bg-white text-slate-400"
                )}
              >
                {completed ? <FiCheck size={16} /> : index + 1}
              </div>

              {/* LABELS */}
              <div className="mt-3">
                <p className="text-sm font-semibold text-slate-900">
                  {step.title}
                </p>

                {step.description && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;