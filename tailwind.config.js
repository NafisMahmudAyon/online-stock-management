/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		colors: {
			rootBackground: "#202020",
			itemBackground: "#323232",
			mainColor: "#faf4f4",
			infoColor: "#b0b0b0",
			menuBackground: "#2D2D2D",
			buttonBackground: "#373737",
			actionColor: "#6FC4D5",
		},
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
		},
	},
	plugins: [],
};


