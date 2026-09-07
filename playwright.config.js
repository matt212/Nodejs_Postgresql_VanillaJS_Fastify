const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({

    testDir: './playwright/tests',

    timeout: 30000,

    expect: {
        timeout: 10000
    },

    fullyParallel: false,

    workers: 1,

    reporter: 'html',

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