```mermaid
graph TD
    %% PHASE 0: DISCOVERY & CURATION LAYER
    subgraph discovery_layer["Phase 0: Discovery & Curation"]
        entrance_0["Step 0.1: System Access Request"]
        exit_0["Step 0.2: Discovery Phase Complete"]
        
        entrance_0 -- "Initial System Boot Sequence" --> discovery_node_01["Step 0.3: Identity Registry Scan"]
        discovery_node_01 -- "Auth Token Verification" --> discovery_node_02["Step 0.4: Zone Availability Cache Load"]
        discovery_node_02 -- "Service Area Validation" --> exit_0
    end
    
    %% PHASE 1: USER ACQUISITION & GEOLOCATION
    subgraph phase_01["Phase 1: User Acquisition & Geolocation"]
        entrance_1["Step 1.1: Onboard User Account"]
        exit_1["Step 1.2: Location Validation Ready"]
        
        entrance_1 --> "Profile Initialization" --> user_node_01["Step 1.3: Create Authenticated Session"]
        user_node_01 --> "Identity Verification" --> iam_node_01["Step 1.4: IAM Security Officer Audit"]
        iam_node_01 --> "Credentials Validated" --> user_node_02["Step 1.5: User Context Established"]
        
        exit_1 -.-> "On Exception Trigger" --> global_failure_hub["Phase 6: System Disruption Hub"]
        user_node_02 --> "Submit GPS Coordinates" --> geo_node_01["Step 1.6: Request Geolocation Service"]
        geo_node_01 --> "Delivery Zone Mapping" --> geo_node_02["Step 1.7: Confirm Delivery Pin & Fee"]
        geo_node_02 --> exit_1
    end
    
    %% PHASE 2: CATALOG SELECTION & SLOTTING
    subgraph phase_02["Phase 2: Catalog Selection & Slotting"]
        entrance_2["Step 2.1: Browse Product Catalog"]
        exit_2["Step 2.2: Cart Ready for Checkout"]
        
        entrance_2 --> "Product Selection" --> cart_node_01["Step 2.3: Create Cart Item"]
        cart_node_01 --> "Real-Time Inventory Check" --> stock_node_01["Step 2.4: Verify Merchant Inventory Stock"]
        stock_node_01 --> "Stock Confirmation" --> cart_node_02["Step 2.5: Update Cart State"]
        cart_node_02 --> "Time Window Request" --> slot_node_01["Step 2.6: Request Delivery Slot"]
        slot_node_01 --> "Dispatcher Availability Logic" --> slot_node_02["Step 2.7: Allocate Time Window"]
        slot_node_02 --> "Timestamp Assignment" --> exit_2
    end
    
    %% PHASE 3: TRANSACTION & ORDER CREATION
    subgraph phase_03["Phase 3: Transaction & Order Creation"]
        entrance_3["Step 3.1: Initiate Order Finalization"]
        exit_3["Step 3.2: Order Authorized"]
        
        entrance_3 --> "Compile Header & Lines" --> order_node_01["Step 3.3: Create Order Header"]
        order_node_01 --> "Line Level Reservation" --> line_node_01["Step 3.4: Reserve Stock Hold"]
        line_node_01 --> "Payment Gateway Submission" --> payment_node_01["Step 3.5: Process Payment Transaction"]
        payment_node_01 --> "Fund Transfer Logic" --> payment_node_02["Step 3.6: Generate Digital Invoice"]
        payment_node_02 --> "Authorization Check" --> auth_node_01["Step 3.7: Verify Authorized Status"]
        auth_node_01 --> "Create Final Order Document" --> exit_3
    end
    
    %% PHASE 4: LOGISTICS & FULFILLMENT
    subgraph phase_04["Phase 4: Logistics & Fulfillment"]
        entrance_4["Step 4.1: Dispatch Manifest"]
        exit_4["Step 4.2: Handover Verification"]
        
        entrance_4 --> "Generate Pickup List" --> manifest_node_01["Step 4.3: Create Pickup Manifest"]
        manifest_node_01 --> "Store Task Generation" --> associate_node_01["Step 4.4: Store Associate Task Start"]
        associate_node_01 --> "Physical Item Scanning" --> associate_node_02["Step 4.5: Verify Line Item Specifications"]
        associate_node_02 --> "Batch Stock Deduction" --> stock_node_02["Step 4.6: Update Stock Status Flags"]
        stock_node_02 --> "Courier Assignment" --> courier_node_01["Step 4.7: Assign Active Courier"]
        courier_node_01 --> "Route Optimization" --> courier_node_02["Step 4.8: Update Real-Time Location"]
        courier_node_02 --> "Arrival Notification" --> exit_4
    end
    
    %% PHASE 5: SETTLEMENT & CLOSURE
    subgraph phase_05["Phase 5: Settlement & Closure"]
        entrance_5["Step 5.1: Finalize Handover"]
        exit_5["Step 5.2: System Closure Complete"]
        
        entrance_5 --> "Submit Digital Signature" --> receipt_node_01["Step 5.3: Create Handover Receipt"]
        receipt_node_01 --> "Quality Check Verification" --> quality_node_01["Step 5.4: Validate Item Count"]
        quality_node_01 --> "Payment Capture" --> final_payment_node_01["Step 5.5: Capture Final Payment"]
        final_payment_node_01 --> "Ledger Update" --> ledger_node_01["Step 5.6: Update Loyalty Points"]
        ledger_node_01 --> "Invoice Finalization" --> exit_5
    end
    
    %% PHASE 6: EXCEPTION HANDLING & ROLLBACK
    subgraph phase_06["Phase 6: Exception Handling & Rollback"]
        entrance_6["Step 6.1: Exception Triggered"]
        exit_6["Step 6.2: System Shutdown"]
        
        entrance_6 --> "Identify Failure Type" --> fail_route_01["Step 6.3: Route to Compensation Logic"]
        fail_route_01 --> "Initiate Reversal Process" --> rollback_node_01["Step 6.4: Reverse Transaction/Stock"]
        rollback_node_01 --> "Release Inventory Hold" --> release_node_01["Step 6.5: Release Stock Availability"]
        release_node_01 --> "Generate Dispute Record" --> dispute_node_01["Step 6.6: Create Security Incident Report"]
        dispute_node_01 --> "Terminate Session" --> exit_6
    end

    %% INTER-PHASE CONNECTIONS (EXIT TO ENTRANCE)
    exit_0 --> entrance_1
    exit_1 --> entrance_2
    exit_2 --> entrance_3
    exit_3 --> entrance_4
    exit_4 --> entrance_5

    %% CROSS-BOUNDARY EXCEPTION ROUTING
    user_node_02 -- "On Cancellation Request" --> entrance_6
    geo_node_02 -- "On Zone Invalid" --> entrance_6
    stock_node_01 -- "On Stock Out" --> entrance_6
    payment_node_01 -- "On Payment Declined" --> entrance_6
    auth_node_01 -- "On Authorization Failure" --> entrance_6
    courier_node_02 -- "On Courier Deviation" --> entrance_6
    receipt_node_01 -- "On Handover Refusal" --> entrance_6

    exit_5 -.-> "Post-Transaction Notification" --> user_node_01
    release_node_01 -.-> "Inventory Alert" --> stock_node_02
    dispute_node_01 -.-> "Audit Trail Log" --> iam_node_01
```