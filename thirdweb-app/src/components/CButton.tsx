import React from "react";

interface IProps {
  btnType: "button" | "submit";
  title: string;
  styles: string;
  handleClick?: () => void;
}

const CButton: React.FC<IProps> = ({ btnType, title, handleClick, styles }) => {
  return (
    <button
      type={btnType}
      className={`cursor-pointer font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CButton;
