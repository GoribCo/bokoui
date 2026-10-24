const base = require('./app.json');

// GitHub Pages serves the web export under /bokoui/expo-layouts (EXPO_BASE_URL is set in CI; unset for local dev).
module.exports = () => ({
  ...base.expo,
  experiments: {
    ...base.expo.experiments,
    ...(process.env.EXPO_BASE_URL && { baseUrl: process.env.EXPO_BASE_URL }),
  },
});
