import React from "react";

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentStep === index + 1 ? "bg-yellow-500 text-black" : "bg-gray-300 text-gray-600"
            } font-semibold`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 w-8 ${
                currentStep > index + 1 ? "bg-yellow-500" : "bg-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
