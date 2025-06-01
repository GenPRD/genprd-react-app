const StatusProgressBar = ({ label, count, total, color = "bg-gray-400" }) => {
  const percentage = Math.round((count / (total || 1)) * 100);
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-semibold text-gray-800">{count}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`${color} h-full rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatusProgressBar;