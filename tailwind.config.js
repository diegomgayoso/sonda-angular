/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'edital-default': "url('/edital-icon.svg')",
        'edital-active': "url('/edital-icon-active.svg')",
        'atest-default': "url('/atestado-icon.svg')",
        'atest-active': "url('/atestado-icon-active.svg')",
        'chatbot-default': "url('/chatbot-icon.svg')",
        'chatbot-disabled': "url('/chatbot-icon-disabled.svg')",
      }
    },
  },
  plugins: [],
}
