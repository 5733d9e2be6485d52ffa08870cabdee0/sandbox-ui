import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    fixturesFolder: false,
    screenshotsFolder: "screenshots",
    videosFolder: "videos",
    supportFile: "support/index.ts",
    baseUrl: "http://localhost:8080",
    chromeWebSecurity: false,
    reporter: "junit",
    reporterOptions: {
      mochaFile: "target/surefire-reports/TEST-it-[hash].xml",
      toConsole: false,
    },
    setupNodeEvents(on, config) {
      // replacement of former 'pluginsFile' conf
      // e2e testing node events setup code
    },
    specPattern: "integration/**/*.ts",
    viewportWidth: 1920,
    viewportHeight: 1080,
    env: {
      TEST_TYPE: "mocked",
    },
  },
});
