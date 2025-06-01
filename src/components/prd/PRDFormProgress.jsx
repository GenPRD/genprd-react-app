const PRDFormProgress = ({ progressSteps, currentStep }) => {
  // Compute step completion percentage
  const getCompletionPercentage = () => {
    return (currentStep / progressSteps.length) * 100;
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-900">{progressSteps[currentStep-1].name}</h2>
        <span className="text-sm text-gray-600">
          Step {currentStep} of {progressSteps.length} &middot; {Math.round(getCompletionPercentage())}% Complete
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{progressSteps[currentStep-1].description}</p>
      
      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gray-900 transition-all duration-300 ease-out"
          style={{ width: `${getCompletionPercentage()}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PRDFormProgress;