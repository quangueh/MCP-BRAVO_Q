# Onboarding Flow

## Overview

First-time user experience guiding users from installation to first successful generation. Target: 5 steps, under 5 minutes.

---

## Flow Diagram

```
+-----------+     +-----------+     +-----------+     +-----------+     +-----------+
|   Step 1  |---->|   Step 2  |---->|   Step 3  |---->|   Step 4  |---->|   Step 5  |
|  Welcome  |     |    DB     |     |  Select   |     | Generate  |     |  Preview  |
|  Screen   |     |Connection |     |  Layout   |     |  Output   |     |  Results  |
+-----------+     +-----------+     +-----------+     +-----------+     +-----------+
                       |                                                   |
                       v                                                   v
                  [Skip Button]                                      [Complete]
                  -> Offline Mode                                    -> Dashboard
```

---

## Step 1: Welcome Screen

**Purpose:** Introduce the app and set expectations.

**Content:**
- App logo and name: "Bravo Layout Generator"
- Tagline: "Generate SQL, XML, and layouts from Bravo database schemas"
- Brief feature list (3 bullets)
- "Get Started" button
- "Skip Setup" link (enters offline mode)

**Duration:** 5 seconds (user reads and clicks)

---

## Step 2: Database Connection

**Purpose:** Connect to the Bravo SQL Server database.

**Fields:**
- Server: text input (default: localhost)
- Port: number input (default: 1433)
- User: text input (default: sa)
- Password: password input
- Database: dropdown (populated after test)

**Actions:**
- "Test Connection" button
- "Next" button (enabled after successful test)
- "Skip" link (enters offline mode with cached data)

**States:**
- Testing: spinner + "Connecting..." text
- Success: green checkmark + "Connected to [database]"
- Error: red X + error message + "Retry" button

**Duration:** 30 seconds typical

---

## Step 3: First Layout Selection

**Purpose:** Select a layout to generate as a demo.

**Content:**
- Simplified layout browser (search + list)
- Pre-filtered to show top 5 most popular layouts
- Each row shows: Name, Type, Column count
- "Select" button on each row

**Hint:** "Select any layout to see how generation works"

**Duration:** 30 seconds typical

---

## Step 4: First Generation

**Purpose:** Generate output for the selected layout.

**Content:**
- Selected layout name shown
- Pre-selected output types: SQL Tables, DataSource XML, Layout XML
- "Generate" button (large, primary)
- Progress bar during generation

**Hint:** "We pre-selected common output types. You can customize later."

**Duration:** 10 seconds typical

---

## Step 5: Preview Results

**Purpose:** Show the generated output to demonstrate value.

**Content:**
- Tabbed preview (SQL, DataSource XML, Layout XML)
- Syntax-highlighted code
- Success banner: "Your first layout has been generated!"
- "Copy" and "Download" buttons
- "Go to Dashboard" button
- "Generate Another" button

**Duration:** 30 seconds typical

---

## Fallback: Offline Mode

When database connection is skipped or fails:

- App enters offline mode
- Uses cached layout data (if available)
- Generation features disabled
- Banner: "Offline Mode - Connect to database to enable generation"
- Settings accessible for connection retry

---

## Completion

After Step 5:
- User is redirected to Dashboard
- Onboarding flag set to complete in config
- Dashboard shows "Welcome" message for first session
- Subsequent launches go directly to Dashboard
