import React from "react";

const MenuItem = ({ className, active, icon, iconStyle, title, onClick }) => {
  console.log(active, title)
	return (
		<div
			className={`flex items-center gap-3 hover:bg-menuBackground cursor-pointer px-3 py-2 rounded-sm transition-all duration-200 ${className} ${active ? "bg-menuBackground" : ""} `}
			onClick={onClick}>
			<i className={`${iconStyle}`}>{icon}</i>
			<span>{title}</span>
		</div>
	);
};

export default MenuItem;
