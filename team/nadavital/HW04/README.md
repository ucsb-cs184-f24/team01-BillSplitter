# Nadav Avital HW04 Contribution

## App branding
- One of the things that was missing in our app is consistency with branding. We didn't have the app name displayed anywhere before and no consistent colors
- Now, in the sign in and sign up page the app name and slogan are reflected
- In addition, we have chosen two purple colors to be the main colors throughout our app - 6C47FF for the main one and F5F1FF for the background
- Specific changes include:
  * Change the sign in and sign up screen to have the app name and slogan and color
  * Changed the tab navigators to have the app color
  * Changed title across all pages to have that color
  * Changed icons throughout the whole app to have that color
  * Changed colors on the add screens to match the app color

These Changes are reflected in the following files
- App.js
- in tabs folder:
  - HomeScreen.js
  - AddBillScreen.js
  - ManualAddScreen.js
  - AddWithPictureScreen.js
  - SettingsScreen.js
- as well as styles throughout the app

## Navigation Simplification
- One of the pieces of feedback that we got in the MVP is that there is a lot of things you can get done on the app, and it should be easier to find them
- The main app functionality is adding a bill, but previously there were two ways to get that done - via a tab or a button on the home screen
- Clicking on the different add bill buttons brought you to different pages, so we decided to simplify that
- Now, the add bill tab is removed in favor of a prominent button on the main home screen. This means that the add bill functionality will be front and center where users
spend the majority of their time in the app, and we have removed redundencies by having the functionality only in one place

Affected files:
- App.js
- tabs/HomeScreen.js
