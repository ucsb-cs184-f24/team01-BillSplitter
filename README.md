# team1
Bill Splitter Application built using Expo and React Native. The app will allow users to easily split bills and expenses with other users by forming groups for specific expenses, and keep track of what they owe each person.

# Tech Stack: 
- ReactNative 
- Firebase authentication
- API
- Expo
- Firebase db

# Plan for project: 
- **Joseph Li, Adil, and Aneesh** will work on a Firebase project to do user authentication (via email/password, Google, Facebook, or phone). **Liv and Nadav** will find and implement the Image-to-Text API for receipt scanning to get the data from images. And **Alex and Yerassyl** will work on the design tasks, contributing to feature development and integration across the project (Yera - navigation). 

# User roles: 
1. Participant
Goal:
- To manage and settle shared expenses within any group context (friends, housemates, or a company).
Permissions:
- Create and join groups (e.g., for dinner with friends, household expenses, or company events).
- Add, edit, and view shared bills.
- Assign individual or group shares of expenses.
- Track balances and payments (who owes whom).
- Settle bills by sending or receiving payments.
- Invite others to join groups or contribute to a shared expense.
- View payment history and current balances.
Example Use Cases:
- Friends: Splitting dinner bills or travel expenses.
- Housemates: Sharing rent, utilities, or groceries.
- Company/Group: Handling shared expenses for events or group purchases.

# Setup 
## Enviroment
see: https://reactnative.dev/docs/set-up-your-environment for more in-depth guide
* clone repo
* brew install node
* brew install watchman
* install x code from app store(for ios simulator, idk probaly can get the simulator without xcode but thats how I did it)
* npm install -g expo-cli
* to run on iphone: download expo go
## Running the app
* cd better-bill-splitter
* yarn install 
* yarn start
* to run on iphone: scan qr code with camera app and openup in expo go have to be on the same wifi as computer
