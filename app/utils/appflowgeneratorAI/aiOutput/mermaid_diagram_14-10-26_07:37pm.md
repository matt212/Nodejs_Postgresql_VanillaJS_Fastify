```mermaid
graph TD
    subgraph phase_01_a [Discovery & Curation Layer]
        phase_01_a_entrance["Step 1.0: User Account Registration & Identity Verification"]
        phase_01_a_task_1["Step 1.1: IAM Security Officer Validates Credentials"]
        phase_01_a_task_2["Step 1.2: Session Token Issued"]
    end
    subgraph phase_01_b [Discovery & Curation Layer]
        phase_01_b_alternate["Step 1.1: Admin Initiated Account Creation"]
        phase_01_b_degraded["Step 1.2: Manual Review Pending"]
        phase_01_b_exit["Step 1.3: Authenticated User Context Established"]
    end
    phase_01_a_entrance --> "Step 1.0: Identity Verification" --> phase_01_a_task_1
    phase_01_a_task_1 -- "Step 1.1: Policy Validated" --> phase_01_a_task_2
    phase_01_a_task_2 --> phase_01_b_alternate
    phase_01_b_alternate --> phase_01_b_degraded
    phase_01_b_degraded --> phase_01_b_exit
    phase_01_b_exit --> phase_02_a

    subgraph phase_02_a [Zone Validation & Cart Assembly]
        phase_02_a_entrance["Step 2.0: Geolocation Request & Service Area Mapping"]
        phase_02_a_task_1["Step 2.1: Store Associate Validates Stock Zones"]
        phase_02_a_decision_1{"Step 2.2: Zone Validated?"}
    end
    subgraph phase_02_b [Zone Validation & Cart Assembly]
        phase_02_b_alternate["Step 2.1: Alternate Store Routing"]
        phase_02_b_degraded["Step 2.2: Sub-Service Area Detected"]
        phase_02_b_exit["Step 2.3: Delivery Pin Confirmed & Fee Applied"]
    end
    phase_01_b_exit --> phase_02_a_entrance
    phase_02_a_entrance --> "Step 2.0: Zone Mapping" --> phase_02_a_task_1
    phase_02_a_task_1 -- "Step 2.2: Zone Validated" --> phase_02_a_decision_1
    phase_02_a_decision_1 -- "Step 2.2: Success" --> phase_02_a_task_2["Step 2.3: Cart Item Created with Real-Time Stock"]
    phase_02_a_decision_1 -- "Step 2.2: Fail" --> phase_02_b_alternate
    phase_02_b_alternate --> phase_02_b_degraded
    phase_02_b_degraded --> phase_02_b_exit
    phase_02_b_exit --> phase_03_a

    subgraph phase_03_a [Logistics Slot Allocation]
        phase_03_a_entrance["Step 3.0: Delivery Slot Request Initiated"]
        phase_03_a_task_1["Step 3.1: Logistics Dispatcher Checks Availability"]
        phase_03_a_decision_2{"Step 3.2: Slot Allocated?"}
    end
    subgraph phase_03_b [Logistics Slot Allocation]
        phase_03_b_alternate["Step 3.1: Alternative Time Window"]
        phase_03_b_degraded["Step 3.2: Next Available Slot"]
        phase_03_b_exit["Step 3.3: Assigned Pickup/Delivery Timestamps"]
    end
    phase_02_b_exit --> phase_03_a_entrance
    phase_03_a_entrance --> "Step 3.0: Slot Request" --> phase_03_a_task_1
    phase_03_a_task_1 -- "Step 3.2: Allocated" --> phase_03_a_decision_2
    phase_03_a_decision_2 -- "Step 3.2: Success" --> phase_03_a_task_2["Step 3.3: Timestamps Assigned"]
    phase_03_a_decision_2 -- "Step 3.2: Fail" --> phase_03_b_alternate
    phase_03_b_alternate --> phase_03_b_degraded
    phase_03_b_degraded --> phase_03_b_exit
    phase_03_b_exit --> phase_04_a

    subgraph phase_04_a [Order Finalization & Payment Processing]
        phase_04_a_entrance["Step 4.0: Order Header & Line Item Submission"]
        phase_04_a_task_1["Step 4.1: Inventory Reservation Logic"]
        phase_04_a_decision_3{"Step 4.2: Payment Authorized?"}
        phase_04_a_task_2["Step 4.3: Unique Order ID & Receipt Generated"]
    end
    subgraph phase_04_b [Order Finalization & Payment Processing]
        phase_04_b_alternate["Step 4.1: Partial Authorization"]
        phase_04_b_degraded["Step 4.2: Payment Decline / Manual Review"]
        phase_04_b_exit["Step 4.3: Order Receipt Issued"]
    end
    phase_03_b_exit --> phase_04_a_entrance
    phase_04_a_entrance --> "Step 4.0: Order Submission" --> phase_04_a_task_1
    phase_04_a_task_1 -- "Step 4.3: Stock Reserved" --> phase_04_a_decision_3
    phase_04_a_decision_3 -- "Step 4.2: Success" --> phase_04_a_task_2
    phase_04_a_decision_3 -- "Step 4.2: Fail" --> phase_04_b_alternate
    phase_04_b_alternate --> phase_04_b_degraded
    phase_04_b_degraded --> phase_04_b_exit
    phase_04_b_exit --> phase_05_a

    subgraph phase_05_a [Fulfillment & Handover Execution]
        phase_05_a_entrance["Step 5.0: Courier Assignment & Route Optimization"]
        phase_05_a_task_1["Step 5.1: Store Associate Prepares Pickup Manifest"]
        phase_05_a_task_2["Step 5.2: Handover Receipt & Quality Check"]
    end
    subgraph phase_05_b [Fulfillment & Handover Execution]
        phase_05_b_alternate["Step 5.1: Self-Service Dropoff"]
        phase_05_b_degraded["Step 5.2: Missed Handover Retry"]
        phase_05_b_exit["Step 5.3: Delivered Status & Final Capture"]
    end
    phase_04_b_exit --> phase_05_a_entrance
    phase_05_a_entrance --> "Step 5.0: Assignment" --> phase_05_a_task_1
    phase_05_a_task_1 -- "Step 5.2: Items Ready" --> phase_05_a_task_2
    phase_05_a_task_2 -- "Step 5.3: Verified" --> phase_05_b_alternate
    phase_05_b_alternate --> phase_05_b_degraded
    phase_05_b_degraded --> phase_05_b_exit
    phase_05_b_exit --> phase_final

    subgraph phase_final [Global Exception Routing & Closure]
        phase_final_hard_fail["Step X.1: Hard Fail: Financial Dispute"]
        phase_final_hard_cancel["Step X.2: Hard Cancel: Resource Shortfall"]
        phase_final_closure["Step X.3: System Closure Termination"]
    end
    phase_05_b_exit --> "Step 5.3: Success" --> phase_final_closure
    phase_04_a_decision_3 -- "Step 4.2: Exception" --> phase_final_hard_fail
    phase_03_a_decision_2 -- "Step 3.2: Exception" --> phase_final_hard_cancel
    phase_final_hard_fail -. "Hard Fail: Reason" .-> phase_final_closure
    phase_final_hard_cancel -. "Hard Cancel: Reason" .-> phase_final_closure
    phase_final_closure --> "End of Lifecycle"

    style phase_01_a_entrance fill:#f9f,stroke:#333,stroke-width:2px
    style phase_01_b_exit fill:#bbf,stroke:#333,stroke-width:2px
    style phase_02_a_entrance fill:#f9f,stroke:#333,stroke-width:2px
    style phase_02_b_exit fill:#bbf,stroke:#333,stroke-width:2px
    style phase_03_a_entrance fill:#f9f,stroke:#333,stroke-width:2px
    style phase_03_b_exit fill:#bbf,stroke:#333,stroke-width:2px
    style phase_04_a_entrance fill:#f9f,stroke:#333,stroke-width:2px
    style phase_04_b_exit fill:#bbf,stroke:#333,stroke-width:2px
    style phase_05_a_entrance fill:#f9f,stroke:#333,stroke-width:2px
    style phase_05_b_exit fill:#bbf,stroke:#333,stroke-width:2px
```