// src/components/Spinner.jsx
const Spinner = ({ progress }) => {
  return (
    <div className="flex justify-center items-center p-1">
      <div className="relative w-10 h-10">
        {/* Circular Progress Bar */}
        <div
          className="absolute w-full h-full rounded-full border-2 border-red-700"
          style={{
            background: `conic-gradient(#eeeee4 ${
              progress * 3.6
            }deg, transparent 0deg)`,
          }}
        ></div>
        {/* Percentage Text */}
        <div className="absolute inset-0 flex justify-center items-center text-xs p-1 font-bold text-red-700">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default Spinner;
