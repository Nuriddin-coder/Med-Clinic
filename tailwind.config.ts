/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    safelist: ["h-[370px]", "lg:h-[360px]"],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		screens: {
  			xl: '1360px'
  		},
  		colors: {
  			blackColor: '#222222',
  			prm: '#3D1BBA',
  			Primary_app: '#872AFF',
  			Dark_background: '#242B3A',
  			Bodytext_color: '#5c616e',
  			Secondary: '#F2F2FE',
  			Light_background: '#FAFAFA',
  			Navbar_Color: '#545b67',
  			Input_border: '#E6E6E6',
  			clr_f9f9: '#F9F9F9',
  			Clr_efef: '#EFEFEF',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			default: '#F9FAFB',
  			footer: '#072134',
  			icon: '#154060',
  			'pink-badge': '#F64459',
  			ClrECF1: '#ECF1F1',
  			Clrfafa: '#FAFAFA',
  			ClrEEE: '#EEE',
  			Clr1212: '#121212',
  			Clr5BA7: '#5BA73A',
  			Clr8888: '#888888',
  			Clr9E9E: '#9E9EAA',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			inter: [
  				'Inter',
  				'sans-serif'
  			],
  			manrope: [
  				'Manrope',
  				'sans-serif'
  			],
  			spaceGrotesk: [
  				'Space Grotesk',
  				'sans-serif'
  			]
  		},
  		gridTemplateColumns: {
  			galeria: 'repeat(auto-fit, minmax(200px, 1fr))',
  			benifits: 'repeat(auto-fit, minmax(318px, 1fr))'
  		},
  		boxShadow: {
  			newsBtnShadow: '0px 8px 60px 11px rgba(255, 255, 255, 0.75)',
  			cardShadow: '0 20px 54px 0 rgba(169, 169, 169, 0.12)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},
  	screens: {
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1280px',
  		'2xl': '1536px',
  		bigDesktop: '1600px'
  	},
  	container: {
  		center: true,
  		padding: '1rem',
  		screens: {
  			xl: '1360px'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate")
],
  corePlugins: {
    container: false,
  },
};
