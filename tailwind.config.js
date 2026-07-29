/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#e7c9ff",
        "inverse-surface": "#e0e3e5",
        "on-error-container": "#ffdad6",
        "on-surface": "#e0e3e5",
        "primary-fixed-dim": "#deb7ff",
        "on-tertiary-fixed-variant": "#534600",
        "secondary-fixed": "#e2dfff",
        "primary-fixed": "#f0dbff",
        "surface-container-highest": "#323537",
        "inverse-primary": "#754b9d",
        "surface-variant": "#323537",
        "error": "#ffb4ab",
        "surface-container-lowest": "#0b0f10",
        "on-background": "#e0e3e5",
        "secondary-container": "#3e3c8f",
        "primary-container": "#d4a5ff",
        "outline": "#978e9b",
        "secondary": "#c3c0ff",
        "surface-container-high": "#272a2c",
        "on-tertiary-container": "#564800",
        "on-primary": "#44196b",
        "surface-tint": "#deb7ff",
        "surface-bright": "#363a3b",
        "on-error": "#690005",
        "tertiary-fixed-dim": "#dcc66e",
        "background": "#101415",
        "on-secondary": "#272377",
        "on-tertiary": "#3a3000",
        "tertiary-fixed": "#f9e287",
        "inverse-on-surface": "#2d3133",
        "surface-dim": "#101415",
        "surface-container-low": "#191c1e",
        "surface-container": "#1d2022",
        "on-tertiary-fixed": "#221b00",
        "on-surface-variant": "#cec3d1",
        "on-primary-container": "#5e3586",
        "secondary-fixed-dim": "#c3c0ff",
        "error-container": "#93000a",
        "on-secondary-fixed-variant": "#3e3c8f",
        "tertiary-container": "#cdb861",
        "on-primary-fixed": "#2c0050",
        "on-primary-fixed-variant": "#5c3283",
        "tertiary": "#ead47a",
        "on-secondary-container": "#afadff",
        "on-secondary-fixed": "#100563",
        "outline-variant": "#4b4450",
        "surface": "#101415"
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      spacing: {
        "container-padding": "40px",
        "gutter": "24px",
        "section-margin": "64px",
        "base": "8px",
        "card-gap": "24px"
      },
      fontFamily: {
        "display-lg": ["Epilogue", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-lg-mobile": ["Epilogue", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-md": ["Epilogue", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }],
        "display-lg-mobile": ["32px", { "lineHeight": "1.2", "fontWeight": "700" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "label-sm": ["12px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "600" }]
      }
    },
  },
  plugins: [],
}

