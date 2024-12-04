import React, { useState } from "react";

export const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className="absolute z-10 px-3 py-2 text-sm text-white 
                      bg-gray-900 dark:bg-[#1f2937] rounded-lg shadow-lg 
                      -top-full left-1/2 transform -translate-x-1/2 -translate-y-2
                      animate-fadeIn whitespace-nowrap"
        >
          {content}
          <div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2
                        border-4 border-transparent border-t-gray-900
                        dark:border-t-[#1f2937]"
          />
        </div>
      )}
    </div>
  );
};
