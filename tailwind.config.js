module.exports = {
  important: true,
  content: [
    './apps/*.liquid',
    './layout/*.liquid',
    './templates/**/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './src/js/components/*.vue',
    './src/scss/**/*.scss'
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '100%',
        '2xl': '1440px'
      }
    },
    extend: {
      borderRadius: {
        DEFAULT: '4px'
      },
      colors: {
        primary: '#000000',
        'light-background': '#EEEEEE',
        body: '#000000',
        'body-secondary': '#666666',
        sale: '#e01717',
        border: '#333333',
        error: '#dc3545',
        success: '#198754',
        info: '#0d6efd'
      },
      fontFamily: {
        display: 'Assistant, sans-serif',
        body: 'Assistant, sans-serif',
        icon: 'icomoon'
      },
      height: {
        header: '66px'
      },
      backgroundImage: {
        'select-arrow': 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'black\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
        'checkbox-checked': 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")',
        'checkbox-indeterminate': 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 16 16\'%3e%3cpath stroke=\'white\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M4 8h8\'/%3e%3c/svg%3e")',
        'radio-checked': 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3ccircle cx=\'8\' cy=\'8\' r=\'3\'/%3e%3c/svg%3e")'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')({ className: 'rte' }) // https://tailwindcss.com/docs/typography-plugin
  ]
  // safelist: [ // Uncomment to debug purgeCSS related styling issues
  //   {
  //     pattern: /./
  //   },
  // ]
}
