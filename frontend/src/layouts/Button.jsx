import React from "react";

const Button = (props) => {
  return (
    <div>
      <button
        className="px-6 py-1 border-2 border-white bg-[#a2b6e5] hover:text-[#4e66b6] transition-all rounded-full"
        onClick={props.onClick} // Add this line to trigger onClick
      >
        {props.title}
      </button>
    </div>
  );
};

export default Button;
