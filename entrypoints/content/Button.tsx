import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  title: string;
  variant?: "primary" | "outline";
}

const Button = (props: ButtonProps) => {
  const { title, icon, variant, ...rest } = props;
  return (
    <button
      {...rest}
      className={`flex items-center gap-2 px-5 py-1  rounded-lg ${
        variant === "outline"
          ? "text-gray-500 border-2 border-gray-500  bg-transparent"
          : "text-white  bg-blue-500"
      } ${rest.className ?? ""} `}
    >
      <span>
        <img src={icon} className="w-6 h-6" />
      </span>
      {title}
    </button>
  );
};

export default Button;
