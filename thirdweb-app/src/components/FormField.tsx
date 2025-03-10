import React from "react";

interface IProps {
  labelName: string;
  placeholder: string;
  inputType?: string;
  isTextArea?: boolean;
  value: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}
const FormField: React.FC<IProps> = ({
  labelName,
  handleChange,
  inputType,
  placeholder,
  value,
  isTextArea,
}) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
          {labelName}
        </span>
      )}
      {isTextArea ? (
        <textarea
          required
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a4a43] bg-transparent font-epilogue text-white text-[14px] leading-[22px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      ) : (
        <input
          required
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a4a43] bg-transparent font-epilogue text-white text-[14px] leading-[22px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      )}
    </label>
  );
};

export default FormField;
