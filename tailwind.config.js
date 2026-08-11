/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        cream:    { 50:'#FDFBF6', 100:'#F8F2E8', 200:'#EFE3D1', 300:'#E1D2B7' },
        taupe:    { 100:'#DED4C8', 200:'#C9BCAC', 300:'#B0A190', 400:'#8E7F6E', 500:'#6E6153' },
        wine: { 50:'#F6ECEC', 300:'#B5717C', 500:'#93303D', 600:'#7E232D', 700:'#6B1B26', 900:'#3A0D16' },
        gold:     { 300:'#E3CD9F', 400:'#D4B87C', 500:'#C9A96A', 600:'#A98A4E' },
        mauve:    { 500:'#8B5D73', 600:'#7A4E63', 700:'#6B4055' },
        dustyblue:{ 500:'#6B76A8', 600:'#5C6796', 700:'#4D5884' },
        ink:      { 500:'#3A342D', 700:'#242019', 900:'#14110D' }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif']
      },
      letterSpacing: { widest2: '0.28em' },
      boxShadow: {
        soft:  '0 4px 24px -6px rgba(36,32,25,.10)',
        lift:  '0 22px 50px -18px rgba(36,32,25,.30)',
        glass: '0 8px 40px -12px rgba(8,37,28,.45)'
      },
      keyframes: {
        fadeUp:  { '0%':{opacity:'0',transform:'translateY(24px)'}, '100%':{opacity:'1',transform:'translateY(0)'} },
        slowZoom:{ '0%':{transform:'scale(1.06)'}, '100%':{transform:'scale(1.16)'} },
        marquee: { '0%':{transform:'translateX(0)'}, '100%':{transform:'translateX(-50%)'} }
      },
      animation: {
        fadeUp: 'fadeUp .8s cubic-bezier(.16,1,.3,1) forwards',
        slowZoom: 'slowZoom 22s ease-in-out infinite alternate',
        marquee: 'marquee 38s linear infinite'
      }
    }
  },
  plugins: [],
}
