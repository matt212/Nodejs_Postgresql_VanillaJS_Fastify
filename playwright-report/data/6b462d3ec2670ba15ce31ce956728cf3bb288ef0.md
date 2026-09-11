# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: employees.spec.js >> 16 - CRUD - Create Employee using validationmap
- Location: playwright/tests/employees.spec.js:1628:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#basetable tbody tr').filter({ hasText: 'AAAAAAAAAA' }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('#basetable tbody tr').filter({ hasText: 'AAAAAAAAAA' }).first() with timeout 10000ms
  - waiting for locator('#basetable tbody tr').filter({ hasText: 'AAAAAAAAAA' }).first()

```

```yaml
- banner:
  - link "MAL":
    - /url: index2.html
  - navigation:
    - button " Toggle navigation"
    - list:
      - listitem
      - listitem:
        - checkbox
- complementary:
  - list:
    - listitem:
      - link "":
        - /url: "#"
    - listitem:
      - link "":
        - /url: "#"
    - listitem:
      - link "":
        - /url: pages/widgets.html
    - listitem:
      - link "":
        - /url: "#"
    - listitem:
      - link "":
        - /url: "#"
    - listitem:
      - link "":
        - /url: "#"
    - listitem:
      - link "":
        - /url: "#"
    - listitem:
      - link "":
        - /url: pages/calendar.html
    - listitem:
      - link "":
        - /url: pages/mailbox/mailbox.html
    - listitem:
      - link "":
        - /url: "#"
    - listitem:
      - link "":
        - /url: "#"
    - listitem:
      - link "":
        - /url: https://adminlte.io/docs
    - listitem:
      - link "":
        - /url: "#"
    - listitem:
      - link "":
        - /url: "#"
    - listitem:
      - link "":
        - /url: "#"
- heading "Control Bar" [level=3]
- button ""
- textbox: 1982-08-07 - 2026-09-06
- text:   
- combobox "× Created Date"
- heading "Filter Bar" [level=3]
- button ""
- heading "Reporting Bar" [level=3]
- button ""
- list:
  - listitem:
    - link [expanded]:
      - /url: "#revenue-chart"
      - img: 
  - listitem:
    - link:
      - /url: "#sales-chart"
      - img: 
  - listitem:  Reporting Content
- button "0–20 of 2088339" [expanded]
- spinbutton: "20"
- table:
  - rowgroup:
    - row "Check all First Name Last Name Gender Birth Date":
      - columnheader "Check all":
        - checkbox "Check all"
        - text: Check all
      - columnheader "First Name"
      - columnheader "Last Name"
      - columnheader "Gender"
      - columnheader "Birth Date"
  - rowgroup:
    - row "omniman red F 02 Jan 2020 edit":
      - cell:
        - checkbox
      - cell "omniman"
      - cell "red"
      - cell "F"
      - cell "02 Jan 2020"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Xinglin Morrin F 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Xinglin"
      - cell "Morrin"
      - cell "F"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Xinglin Morrin M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Xinglin"
      - cell "Morrin"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Ortrud Binding M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Ortrud"
      - cell "Binding"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Gennady Thiran M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Gennady"
      - cell "Thiran"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Goh Demke F 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Goh"
      - cell "Demke"
      - cell "F"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Taegyun Zschoche M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Taegyun"
      - cell "Zschoche"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Sugwoo Muniz M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Sugwoo"
      - cell "Muniz"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Haldun Peek F 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Haldun"
      - cell "Peek"
      - cell "F"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Tsz England F 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Tsz"
      - cell "England"
      - cell "F"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Gererd Plesums M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Gererd"
      - cell "Plesums"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Prasadram Dusink M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Prasadram"
      - cell "Dusink"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Basem Ashish M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Basem"
      - cell "Ashish"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Lenore Schieder M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Lenore"
      - cell "Schieder"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Francesca Covnot M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Francesca"
      - cell "Covnot"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Aiman Vecchi M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Aiman"
      - cell "Vecchi"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Mechthild Luft M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Mechthild"
      - cell "Luft"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Goh Ermel F 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Goh"
      - cell "Ermel"
      - cell "F"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Dzung Candan M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Dzung"
      - cell "Candan"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
    - row "Mabry Berstel M 11 Jan 2018 edit":
      - cell:
        - checkbox
      - cell "Mabry"
      - cell "Berstel"
      - cell "M"
      - cell "11 Jan 2018"
      - cell "edit":
        - link "edit":
          - /url: javascript:void(0);
- list:
  - listitem:
    - link "«":
      - /url: javascript:void(0);
  - listitem:
    - link "1":
      - /url: javascript:void(0);
  - listitem:
    - link "2":
      - /url: javascript:void(0);
  - listitem:
    - link "3":
      - /url: javascript:void(0);
  - listitem:
    - link "4":
      - /url: javascript:void(0);
  - listitem:
    - link "5":
      - /url: javascript:void(0);
  - listitem:
    - link "»":
      - /url: javascript:void(0);
```

# Test source

```ts
  1710 |         // Record State
  1711 |         // ----------------------------------------------------
  1712 | 
  1713 |    const recordStateInput = page.locator('#cltrlrecordstate');
  1714 | 
  1715 | const recordStateControl = page.locator(
  1716 |     'xpath=/html/body/div[3]/div/div/div[2]/div[1]/form/div/div[5]/div/div/label/div'
  1717 | );
  1718 | 
  1719 | await expect(recordStateControl).toBeVisible();
  1720 | 
  1721 | // Click only if currently unchecked
  1722 | if (!(await recordStateInput.isChecked())) {
  1723 |     await recordStateControl.click();
  1724 | }
  1725 | 
  1726 | await expect(recordStateInput).toBeChecked();
  1727 | 
  1728 | createdValues.recordstate = true;
  1729 | 
  1730 | 
  1731 | // ----------------------------------------------------
  1732 | // Save
  1733 | // ----------------------------------------------------
  1734 | 
  1735 | const submitButton = page.locator('#btnmodalsub');
  1736 | 
  1737 | await expect(submitButton).toBeVisible();
  1738 | await expect(submitButton).toBeEnabled();
  1739 | 
  1740 | 
  1741 |         console.log(
  1742 |             '[CRUD CREATE] Submit button is enabled'
  1743 |         );
  1744 | 
  1745 | 
  1746 |         // ----------------------------------------------------
  1747 |         // CREATE API
  1748 |         // ----------------------------------------------------
  1749 | 
  1750 |         const createResponsePromise =
  1751 |             page.waitForResponse(response =>
  1752 |                 response.url().includes(
  1753 |                     '/employees/api/create/'
  1754 |                 ) &&
  1755 |                 response.status() >= 200 &&
  1756 |                 response.status() < 300
  1757 |             );
  1758 | const searchTypeResponsePromise =
  1759 |     page.waitForResponse(response =>
  1760 |         response.url().includes('/employees/api/searchtype/') &&
  1761 |         response.status() >= 200 &&
  1762 |         response.status() < 300
  1763 |     );
  1764 | 
  1765 | 
  1766 |         await submitButton.click();
  1767 | 
  1768 | 
  1769 |         const createResponse =
  1770 |             await createResponsePromise;
  1771 | const searchTypeResponse = await searchTypeResponsePromise;
  1772 | 
  1773 |         console.log(
  1774 |             '[CRUD CREATE] Employee create API completed:',
  1775 |             createResponse.status()
  1776 |         );
  1777 | 
  1778 | console.log(
  1779 |     `[CRUD CREATE] SearchType API completed: ${searchTypeResponse.status()}`
  1780 | );
  1781 |         // ----------------------------------------------------
  1782 |         // Wait for report refresh
  1783 |         // ----------------------------------------------------
  1784 | 
  1785 |         await expect(
  1786 |             page.locator('#basetable')
  1787 |         ).toBeVisible();
  1788 | 
  1789 | 
  1790 |         // ----------------------------------------------------
  1791 |         // Find newly created employee
  1792 |         //
  1793 |         // Use first_name as the unique anchor.
  1794 |         // ----------------------------------------------------
  1795 | 
  1796 |         const createdFirstName =
  1797 |             createdValues.first_name;
  1798 | 
  1799 | 
  1800 |         const createdRow =
  1801 |             page.locator(
  1802 |                 '#basetable tbody tr'
  1803 |             ).filter({
  1804 |                 hasText: createdFirstName
  1805 |             }).first();
  1806 | 
  1807 | 
  1808 |         await expect(
  1809 |             createdRow
> 1810 |         ).toBeVisible();
       |           ^ Error: expect(locator).toBeVisible() failed
  1811 | 
  1812 | 
  1813 |         console.log(
  1814 |             `[CRUD VERIFY] Created employee row found: ${createdFirstName}`
  1815 |         );
  1816 | 
  1817 | 
  1818 |         // ----------------------------------------------------
  1819 |         // Verify created values dynamically
  1820 |         // ----------------------------------------------------
  1821 | 
  1822 |         for (const field of validationConfig.validationmap) {
  1823 | 
  1824 |             const {
  1825 |                 inputname
  1826 |             } = field;
  1827 | 
  1828 | 
  1829 |             const expectedValue =
  1830 |                 createdValues[inputname];
  1831 | 
  1832 | 
  1833 |             // ------------------------------------------------
  1834 |             // Find table column dynamically
  1835 |             // ------------------------------------------------
  1836 | 
  1837 |             const header =
  1838 |                 page.locator(
  1839 |                     `#basetable thead tr th[data-field-header="${inputname}"]`
  1840 |                 );
  1841 | 
  1842 | 
  1843 |             await expect(header)
  1844 |                 .toBeVisible();
  1845 | 
  1846 | 
  1847 |             const columnIndex =
  1848 |                 await header.evaluate(
  1849 |                     element => element.cellIndex
  1850 |                 );
  1851 | 
  1852 | 
  1853 |             // ------------------------------------------------
  1854 |             // Existing table has first non-data TD
  1855 |             // ------------------------------------------------
  1856 | 
  1857 |             const cell =
  1858 |                 createdRow
  1859 |                     .locator('td')
  1860 |                     .nth(columnIndex + 1);
  1861 | 
  1862 | 
  1863 |             const actualValue =
  1864 |                 (await cell.textContent())
  1865 |                     .trim();
  1866 | 
  1867 | 
  1868 |             console.log(
  1869 |                 `[CRUD VERIFY] ${inputname} | Expected: "${expectedValue}" | Actual: "${actualValue}"`
  1870 |             );
  1871 | 
  1872 | 
  1873 |             // ------------------------------------------------
  1874 |             // Verify
  1875 |             // ------------------------------------------------
  1876 | 
  1877 |             expect(
  1878 |                 actualValue
  1879 |             ).toBe(
  1880 |                 expectedValue
  1881 |             );
  1882 |         }
  1883 | 
  1884 | 
  1885 |         console.log(
  1886 |             '[PASS] CRUD Create - Employee created and verified successfully'
  1887 |         );
  1888 |     }
  1889 | );
  1890 | 
  1891 | 
  1892 | 
  1893 | 
  1894 | 
  1895 | 
  1896 | 
```