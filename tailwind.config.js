/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		minHeight: {
  			page: 'calc(100vh - 197px)'
  		},
  		colors: {
  			'dark-purple': 'rgb(36, 0, 38)',
  			'border-line': 'rgba(230, 231, 236, 1)',
  			'sub-text': 'rgba(136, 149, 167, 1)',
  			'text-grey': 'rgb(74, 74, 74)',
  			'text-grey-1': 'rgb(75, 75, 75)',
  			'text-grey-2': 'rgb(102, 112, 133)',
  			'text-grey-3': 'rgb(109, 119, 134)',
  			'dashboard-bg': 'rgb(243, 244, 252)',
  			'card-stat-bg': 'rgb(250, 250, 250)',
  			'tabs-bg': 'rgb(245, 248, 250)',
  			'light-purple': 'rgba(36, 0, 38, 0.1)',
  			'at-purple': 'rgb(159, 24, 232)',
  			'at-white': 'rgb(255, 255, 255)',
  			'at-black': 'rgb(0, 0, 0)',
  			'black-2': 'rgb(20, 20, 20)',
  			'hero-background': 'rgba(18, 18, 24, 0.7)',
  			'image-background': 'rgba(199, 201, 206, 0.28)',
  			'at-dark': 'rgb(31, 35, 46)',
  			'dark-purple-2': 'rgba(36, 0, 38, 0.07)',
  			'at-grey': 'rgb(170, 172, 175)',
  			'grey-text': 'rgb(140, 140, 140)',
  			'at-text': 'rgb(61, 66, 82)',
  			'at-ash': 'rgb(170, 172, 175)',
  			'dark-blue': 'rgb(55, 0, 60)',
  			'dark-blue2': 'rgb(36, 0, 38)',
  			'dark-blue3': 'rgba(55, 0, 60, 0.24)',
  			'dark-blue-shadow': 'rgba(55, 0, 60, 0.3)',
  			'light-background': 'rgb(207, 194, 208)',
  			'at-inactive': 'rgb(222, 194, 194)',
  			'inactive-text': 'rgb(171, 9, 35)',
  			'at-active': 'rgb(214, 230, 218)',
  			'active-text': 'rgb(27, 114, 50)',
  			'at-background': 'rgb(243, 244, 252)',
  			'at-background-1': 'rgb(170, 172, 175)',
  			'th-background': 'rgb(249, 250, 251)',
  			'flat-grey1': 'rgb(229, 229, 229)',
  			'flat-grey2': 'rgb(149, 149, 149)',
  			'flat-grey3': 'rgb(212, 218, 231)',
  			'element-hover': 'rgba(0, 0, 0, 0.04)',
  			'at-green': 'rgb(1, 166, 111)',
  			'at-red': 'rgb(255, 0, 0)',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		maskImage: {
  			'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
}
