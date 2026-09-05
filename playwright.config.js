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

    use: {
        baseURL: 'http://127.0.0.1:3012',

        browserName: 'chromium',

        headless: false,

        screenshot: 'only-on-failure',

        video: 'retain-on-failure',

        trace: 'on-first-retry'
    }

});