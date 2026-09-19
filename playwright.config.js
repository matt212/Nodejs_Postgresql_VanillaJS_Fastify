const { defineConfig } = require('@playwright/test');
const timestamp = new Date().toISOString()
  .replace(/T/, '_')
  .replace(/\..+/, '')
  .replace(/:/g, '-');

module.exports = defineConfig({

    testDir: './playwright/tests',

    timeout: 30000,
    retries: 4, 
    retryStrategy: 'isolated', 
    expect: {
        timeout: 30000
    },

    fullyParallel: true,

    workers: 8,

    reporter: [['html', { outputFolder: `playwright-report/report_${timestamp}` }]],

    // Common settings for ALL projects
    use: {
        baseURL: 'http://127.0.0.1:3012',

        browserName: 'chromium',

        //headless: false,
        headless: process.env.HEADED !== 'true',

        screenshot: 'only-on-failure',

        video: 'retain-on-failure',

        trace: 'on-first-retry'
    },

    projects: [

        // --------------------------------------------------
        // Authentication setup
        // --------------------------------------------------
        {
            name: 'setup',

            testDir: './playwright/auth',

            testMatch: /.*\.setup\.js/
        },

        // --------------------------------------------------
        // Employees / E2E tests
        // --------------------------------------------------
        {
            name: 'chromium',

            dependencies: ['setup'],

            use: {
                storageState: 'playwright/.auth/user.json'
            }
        }
    ]
});