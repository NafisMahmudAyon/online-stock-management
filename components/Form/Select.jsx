import React from "react";

const Select = ({
	className = "", // Optional class for customization
	labelStyle = "", // Optional label style
	label = "", // Label text
	onChange, // Change handler
	inputStyle = "", // Input field styles
	required = false, // Required field indicator
	value = "", // Input value
	placeholder = "", // Placeholder
	type = "text", // Input type (default to text)
	id, // Input field ID
  children
}) => {
	return (
		<div
			className={`w-full bg-itemBackground px-6 py-3 rounded-[4px] ${className}`}>
			{label && (
				<label
					htmlFor={id}
					className={`block text-sm font-medium text-mainColor ${labelStyle}`}>
					{label}
					{required && <span className="text-red-500">*</span>}{" "}
					{/* Show asterisk for required fields */}
				</label>
			)}
			<select
				id={id} // Using dynamic ID
				type={type} // Dynamic input type
				value={value} // Input value from props
				onChange={onChange} // Change handler
				placeholder={placeholder}
				className={`mt-2 block w-full px-3 py-2 border-b text-mainColor border-infoColor hover:border-actionColor active:border-actionColor focus:border-actionColor bg-buttonBackground outline-0 rounded-md ${inputStyle}`}
				required={required} // Dynamically set required
			>
        {children}
      </select>
		</div>
	);
};

export default Select;
