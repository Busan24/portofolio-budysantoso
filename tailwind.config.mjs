/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // Using class-based dark mode
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
	container: {
		center: true,
		padding: "15px",
	},
	screens: {
		sm: '640px',
		md: '768px',
		lg: '960px',
		xl: '1200px',
	},
	fontFamily: {
		primary: "var(--font-jetbrainsMono)",
	},
  	extend: {
  		colors: {
  			primary: "#1c1c22",
			accent: {
				DEFAULT: "#03b5fc",
				hover: "#00a6e8",
			},
			light: {
				bg: "#f8f9fa",
				card: "#ffffff",
				text: "#1a1a1a",
				muted: "#6c757d",
				border: "#dee2e6",
			}
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
