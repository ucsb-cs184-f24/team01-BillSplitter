# team1
A bill-splitting app built using Expo and React Native. The app simplifies the process of sharing expenses by allowing users to split bills, form groups for specific expenses, and track payments among friends.

# Features
## Friends Feature
Search for friends by email address and send a friend request. Once accepted, you can add them to bills and track whether they’ve paid their share. View all friends in the Friends tab.
## Bill Scanning
Upload a photo of a bill, and the Veryfi OCR API will process it automatically. Extracts individual items with prices, which can then be assigned to yourself or your friends.
## Manual Bill Splitting
Create bills manually by entering details such as title, category, and amount. Split bills equally or assign custom amounts for each participant.
## Payment Tracking
View detailed bill information, including outstanding balances and payment statuses. Mark payments as settled with a "Mark as Paid" button or see a green "Paid" label for completed payments.
## Past Bills
View the history of all split bills, categorized as sent or received. Use it to confirm payments or track overdue balances.

# Setup 
## Environment
see: https://reactnative.dev/docs/set-up-your-environment for more in-depth guide
* 1. clone repo:
  > git clone https://github.com/your-repo-name/better-bill-splitter.git](https://github.com/ucsb-cs184-f24/team01-BillSplitter.git
* 2. Install dependencies:
  > brew install node
  > brew install watchman
* 3. For iOS: Install Xcode from the App Store for the iOS simulator.
* 4. Install Expo CLI:
  > npm install -g expo-cli
* 5. For running on an iPhone: download the Expo Go app
## Running the app
* 1. Navigate to the project directory:
  > cd better-bill-splitter
* 2. Install project dependencies:
  > yarn install 
* 3. Start the development server:
  > yarn start
* 4. To run on iPhone: Scan the QR code displayed in the terminal with your phone's camera. Open the app in Expo Go (ensure your phone and computer are on the same Wi-Fi network).

# Design Overview:
[Frontend (React Native)]
        ↓
[Backend (Firebase)]
        ↓
[Database (Firestore)]
        ↓
[Third-Party API (Veryfi OCR)]

# Important Team Decisions
## Authentication: 
Chose Firebase Authentication for email/password and OAuth login due to ease of integration.
## Receipt Scanning: 
Implemented the Veryfi OCR API for accurate receipt processing.
## Database: 
Selected Firestore for its real-time capabilities.
## MVP Scope: 
Focused on manual bill entry, itemized splitting, friend management, and Firebase login.
## Task Management: 
Used GitHub Kanban to track progress and ensure clear task ownership.

# High-Level User Flow
1. Sign Up/Login: Authenticate using Firebase (email/password or third-party providers).
2. Home Screen: Displays groups and recent activities. Provides access to create or manage bills and add friends.
3. Add Bill: Upload receipts for automatic item extraction or manually input bill details.
4. Split and Settle: Assign amounts to participants, calculate shares, and mark payments as completed.
5. Friend Management: Add/remove friends and view pending requests.
6. Settings: Access past bills, manage friends, check app version, or log out.
