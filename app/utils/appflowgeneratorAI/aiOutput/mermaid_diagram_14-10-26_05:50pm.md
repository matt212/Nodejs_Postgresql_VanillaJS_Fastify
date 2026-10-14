```mermaid
graph TD
    %% ========================================================================
    %% PHASE 1: IDENTITY & ACCESS CURATION
    %% ========================================================================
    subgraph phase_01_a [Identity & Access Curation]
        entrance_1["Step 1.1: User Account Registration"]
        check_1{"Step 1.2: IAM Identity Verification"}
        remediation_1["Step 1.3: Remediate Credentials"]
    end

    subgraph phase_01_b [Identity & Access Curation]
        alt_1["Step 1.4: Admin Initiated Account"]
        degraded_1["Step 1.5: Token Refresh"]
        exit_1["Step 1.6: Authenticated Session Token"]
    end

    %% PHASE 1 LINKS
    entrance_1 --> check_1
    check_1 -- "On Verification Failure" --> remediation_1
    remediation_1 --> exit_1
    check_1 -- "On Verification Success" --> exit_1
    alt_1 --> exit_1
    degraded_1 --> exit_1

    exit_1 --> entrance_2

    %% ========================================================================
    %% PHASE 2: LOCATION & ZONE VALIDATION
    %% ========================================================================
    subgraph phase_02_a [Location & Zone Validation]
        entrance_2["Step 2.1: Geolocation Request"]
        check_2{"Step 2.2: Service Area Validation"}
        remediation_2["Step 2.3: Update Profile Address"]
    end

    subgraph phase_02_b [Location & Zone Validation]
        alt_2["Step 2.4: Cached Location Profile"]
        degraded_2["Step 2.5: Nearest Outlet Mapping"]
        exit_2["Step 2.6: Confirmed Delivery Pin"]
    end

    entrance_2 --> check_2
    check_2 -- "On Service Area Fail" --> remediation_2
    remediation_2 --> exit_2
    check_2 -- "On Service Area Success" --> exit_2
    alt_2 --> exit_2
    degraded_2 --> exit_2

    exit_2 --> entrance_3

    %% ========================================================================
    %% PHASE 3: PRODUCT SELECTION & INVENTORY RESERVATION
    %% ========================================================================
    subgraph phase_03_a [Product Selection & Inventory Reservation]
        entrance_3["Step 3.1: Cart Item Selection"]
        check_3{"Step 3.2: Real-Time Inventory Check"}
        remediation_3["Step 3.3: Remove Item from Cart"]
    end

    subgraph phase_03_b [Product Selection & Inventory Reservation]
        alt_3["Step 3.4: Default Stock Profile"]
        degraded_3["Step 3.5: Substitute Item Suggestion"]
        exit_3["Step 3.6: Updated Cart State"]
    end

    entrance_3 --> check_3
    check_3 -- "On Stock Unavailable" --> remediation_3
    remediation_3 --> exit_3
    check_3 -- "On Stock Available" --> exit_3
    alt_3 --> exit_3
    degraded_3 --> exit_3

    exit_3 --> entrance_4

    %% ========================================================================
    %% PHASE 4: LOGISTICS ALLOCATION & SLOT ASSIGNMENT
    %% ========================================================================
    subgraph phase_04_a [Logistics Allocation & Slot Assignment]
        entrance_4["Step 4.1: Delivery Slot Request"]
        check_4{"Step 4.2: Courier Availability Check"}
        remediation_4["Step 4.3: Adjust Time Window"]
    end

    subgraph phase_04_b [Logistics Allocation & Slot Assignment]
        alt_4["Step 4.4: Automated Slot Profile"]
        degraded_4["Step 4.5: Extended Window Allocation"]
        exit_4["Step 4.6: Assigned Timestamps"]
    end

    entrance_4 --> check_4
    check_4 -- "On No Courier Avail" --> remediation_4
    remediation_4 --> exit_4
    check_4 -- "On Courier Avail" --> exit_4
    alt_4 --> exit_4
    degraded_4 --> exit_4

    exit_4 --> entrance_5

    %% ========================================================================
    %% PHASE 5: TRANSACTION COMMIT & FINALIZATION
    %% ========================================================================
    subgraph phase_05_a [Transaction Commit & Finalization]
        entrance_5["Step 5.1: Order Header Submission"]
        check_5{"Step 5.2: Payment Authorization"}
        remediation_5["Step 5.3: Payment Method Update"]
    end

    subgraph phase_05_b [Transaction Commit & Finalization]
        alt_5["Step 5.4: Loyalty Points Deduction"]
        degraded_5["Step 5.5: Partial Payment Hold"]
        exit_5["Step 5.6: Final Order Receipt"]
    end

    entrance_5 --> check_5
    check_5 -- "On Payment Fail" --> remediation_5
    remediation_5 --> exit_5
    check_5 -- "On Payment Success" --> exit_5
    alt_5 --> exit_5
    degraded_5 --> exit_5

    exit_5 --> global_failure

    %% ========================================================================
    %% GLOBAL FAILURE & EXCEPTION HANDLING (CLOSURE)
    %% ========================================================================
    subgraph global_failure [Global Exception & Closure]
        hard_fail_1["Step 9.1: Hard Fail: Auth Revoked"]
        hard_cancel_1["Step 9.2: Hard Cancel: No Courier"]
        hard_cancel_2["Step 9.3: Hard Cancel: Payment Declined"]
        stock_release_1["Step 9.4: Release Reserved Stock"]
        session_close_1["Step 9.5: Session Termination"]
    end

    %% CROSS-BOUNDARY EXCEPTION ROUTING
    check_1 -- "-. Hard Fail: Identity Suspended" -.-> hard_fail_1
    check_2 -- "-. Hard Cancel: Zone Change" -.-> hard_cancel_1
    check_3 -- "-. Hard Cancel: Out of Stock" -.-> hard_cancel_1
    check_5 -- "-. Hard Cancel: Payment Declined" -.-> hard_cancel_2
    remediation_1 --> session_close_1
    remediation_2 --> session_close_1
    remediation_3 --> stock_release_1
    remediation_4 --> stock_release_1
    remediation_5 --> stock_release_1

    %% ========================================================================
    %% END OF DIAGRAM
    %% ========================================================================
    exit_5 -- "On Transaction Complete" --> session_close_1
```