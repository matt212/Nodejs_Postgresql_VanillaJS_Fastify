const { test, expect } = require('@playwright/test');

const {
    loadEmployeesReport,
} = require('../helpers/module.filters');// Reserved for incremental extraction after baseline validation.\nmodule.exports = {};

function registerModuleSortTests({
    test,
    base,
    mod,
    validationConfig
}) {

// ============================================================
// TEST 14
// DYNAMIC COLUMN SORTING
// ============================================================

test(
    '14 - Multi-Column Sort - Dynamic fields sort ascending and descending',
    async ({ page }) => {

        await loadEmployeesReport(page,base);


        const headers =
            page.locator(
                base.locators.tableHeaders
            );


        const fieldKeys =
            await headers.evaluateAll(elements =>
                elements.map(
                    element =>
                        element.getAttribute('data-field-header')
                )
            );


        expect(fieldKeys.length)
            .toBeGreaterThan(0);


        for (const fieldKey of fieldKeys) {

            const header =
                page.locator(
                    `#basetable thead tr th[data-field-header="${fieldKey}"]`
                );


            const assertSortRequest = async (expectedOrder) => {
                const [request] = await Promise.all([
                    page.waitForRequest(request =>
                        request.url().includes('/api/searchtype/') &&
                        request.method() === 'POST'
                    ),
                    page.waitForResponse(response =>
                        response.url().includes('/api/searchtype/') &&
                        response.status() === 200
                    ),
                    header.click()
                ]);

                const payload = request.postDataJSON();

                expect(payload.sortcolumn)
                    .toBe(fieldKey);

                expect(payload.sortcolumnorder.toUpperCase())
                    .toBe(expectedOrder);
            };


            await assertSortRequest('DESC');


            await assertSortRequest('ASC');

            console.log(
                `[PASS] Dynamic column sorted ascending and descending: ${fieldKey}`
            );
        }


        await page.waitForTimeout(3000);
    }
);

test('24 - Newest and Oldest record navigation works correctly', async ({ page }) => {

    await loadEmployeesReport(page,base);

    const pagingParent = page.locator(
        base.locators.pagingParent
    );

    const pagingMenu = page.locator(
        base.locators.pagingMenu
    );

    const oldestOption = page.locator(
        base.locators.oldest
    );

    const newestOption = page.locator(
        base.locators.newest
    );

    const tableRows = page.locator(
        base.locators.tableRows
    );

    // =========================================================
    // INITIAL STATE
    // =========================================================
    // loadEmployeesReport() already loads:
    // NEWEST / DESC
    //
    // Therefore first selectable operation is:
    // NEWEST -> OLDEST
    // =========================================================

    await expect(pagingParent).toBeVisible({
        timeout: 10000
    });

    // =========================================================
    // OPEN PAGING MENU
    // =========================================================

    await pagingParent.click();

    await expect(pagingMenu).toBeVisible({
        timeout: 5000
    });

    await expect(oldestOption).toBeVisible({
        timeout: 5000
    });

    // =========================================================
    // OLDest
    //
    // Expected:
    // searchtype      -> ASC + ACTIVE
    // searchtypeCount -> POST
    // =========================================================

    const oldestSearchRequestPromise =
        page.waitForRequest(
            request => {

                if (
                    !request.url().includes(
                        base.api.search
                    ) ||
                    request.method() !== 'POST'
                ) {
                    return false;
                }

                const data = request.postDataJSON();

                return (
                    String(
                        data?.sortcolumnorder
                    ).toUpperCase() === 'ASC' &&
                    data?.recordstate === 'ACTIVE'
                );
            },
            {
                timeout: base.timing.response
            }
        );

    const oldestCountRequestPromise =
        page.waitForRequest(
            request =>
                request.url().includes(
                    base.api.count
                ) &&
                request.method() === 'POST',
            {
                timeout: base.timing.response
            }
        );

    const oldestSearchResponsePromise =
        page.waitForResponse(
            response => {

                if (
                    !response.url().includes(
                        base.api.search
                    ) ||
                    response.status() !== 200 ||
                    response.request().method() !== 'POST'
                ) {
                    return false;
                }

                const data =
                    response.request().postDataJSON();

                return (
                    String(
                        data?.sortcolumnorder
                    ).toUpperCase() === 'ASC' &&
                    data?.recordstate === 'ACTIVE'
                );
            },
            {
                timeout: base.timing.response
            }
        );

    const oldestCountResponsePromise =
        page.waitForResponse(
            response =>
                response.url().includes(
                    base.api.count
                ) &&
                response.status() === 200 &&
                response.request().method() === 'POST',
            {
                timeout: base.timing.response
            }
        );

    await oldestOption.click();

    // Wait for both API requests.
    const [
        oldestSearchRequest,
        oldestCountRequest
    ] = await Promise.all([
        oldestSearchRequestPromise,
        oldestCountRequestPromise
    ]);

    // Wait for both API responses.
    await Promise.all([
        oldestSearchResponsePromise,
        oldestCountResponsePromise
    ]);

    // Validate Oldest search request.
    const oldestSearchPayload =
        oldestSearchRequest.postDataJSON();

    expect(
        String(
            oldestSearchPayload.sortcolumnorder
        ).toUpperCase(),
        'Oldest must request ASC'
    ).toBe('ASC');

    expect(
        oldestSearchPayload.recordstate,
        'Oldest must request ACTIVE records'
    ).toBe('ACTIVE');

    // Validate count request exists.
    expect(
        oldestCountRequest.method(),
        'Oldest count API must use POST'
    ).toBe('POST');

    // =========================================================
    // WAIT FOR OLDest UI TO FINISH
    // =========================================================

    await expect(tableRows.first()).toBeVisible({
        timeout: base.timing.ui
    });

    await page.evaluate(() =>
        new Promise(resolve =>
            requestAnimationFrame(() =>
                requestAnimationFrame(resolve)
            )
        )
    );

    await expect(pagingParent).toBeVisible({
        timeout: 10000
    });

    // =========================================================
    // REOPEN PAGING MENU
    // =========================================================

    await pagingParent.click();

    await expect(pagingMenu).toBeVisible({
        timeout: 5000
    });

    await expect(newestOption).toBeVisible({
        timeout: 5000
    });

    // =========================================================
    // NEWEST
    //
    // Expected:
    // searchtype      -> DESC + ACTIVE
    // searchtypeCount -> POST
    // =========================================================

    const newestSearchRequestPromise =
        page.waitForRequest(
            request => {

                if (
                    !request.url().includes(
                        base.api.search
                    ) ||
                    request.method() !== 'POST'
                ) {
                    return false;
                }

                const data = request.postDataJSON();

                return (
                    String(
                        data?.sortcolumnorder
                    ).toUpperCase() === 'DESC' &&
                    data?.recordstate === 'ACTIVE'
                );
            },
            {
                timeout: base.timing.response
            }
        );

    const newestCountRequestPromise =
        page.waitForRequest(
            request =>
                request.url().includes(
                    base.api.count
                ) &&
                request.method() === 'POST',
            {
                timeout: base.timing.response
            }
        );

    const newestSearchResponsePromise =
        page.waitForResponse(
            response => {

                if (
                    !response.url().includes(
                        base.api.search
                    ) ||
                    response.status() !== 200 ||
                    response.request().method() !== 'POST'
                ) {
                    return false;
                }

                const data =
                    response.request().postDataJSON();

                return (
                    String(
                        data?.sortcolumnorder
                    ).toUpperCase() === 'DESC' &&
                    data?.recordstate === 'ACTIVE'
                );
            },
            {
                timeout: base.timing.response
            }
        );

    const newestCountResponsePromise =
        page.waitForResponse(
            response =>
                response.url().includes(
                    base.api.count
                ) &&
                response.status() === 200 &&
                response.request().method() === 'POST',
            {
                timeout: base.timing.response
            }
        );

    await newestOption.click();

    // Wait for both API requests.
    const [
        newestSearchRequest,
        newestCountRequest
    ] = await Promise.all([
        newestSearchRequestPromise,
        newestCountRequestPromise
    ]);

    // Wait for both API responses.
    await Promise.all([
        newestSearchResponsePromise,
        newestCountResponsePromise
    ]);

    // Validate Newest search request.
    const newestSearchPayload =
        newestSearchRequest.postDataJSON();

    expect(
        String(
            newestSearchPayload.sortcolumnorder
        ).toUpperCase(),
        'Newest must request DESC'
    ).toBe('DESC');

    expect(
        newestSearchPayload.recordstate,
        'Newest must request ACTIVE records'
    ).toBe('ACTIVE');

    // Validate count request exists.
    expect(
        newestCountRequest.method(),
        'Newest count API must use POST'
    ).toBe('POST');

    // =========================================================
    // WAIT FOR NEWEST UI TO FINISH
    // =========================================================

    await expect(tableRows.first()).toBeVisible({
        timeout: base.timing.ui
    });

    await page.evaluate(() =>
        new Promise(resolve =>
            requestAnimationFrame(() =>
                requestAnimationFrame(resolve)
            )
        )
    );

    console.log(
        'Test 25 PASS - Newest (initial) -> Oldest -> Newest verified'
    );
});



}
module.exports = {
    registerModuleSortTests
};