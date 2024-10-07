# Meeting 2


## Attendance
Adil: Present

Olivia: Present

Nadav: Present

Aneesh: Present

Alex: Present

Joseph: Present

Yerassy: Present

## Assigning Tasks
Joseph Li: Will work on the database, thinking of using MongoDB 

Adil/Aneesh: Will work to create the Oauth, may use Firebase since it provides an easy way to handle user authentication with email/password, Google, Facebook, or phone authentication.

Olivia/Nadav: Image to text API. There are exisiting API's that exist such as Google Cloud Vision API or OCR.space API

## Things to think about
Brainstorm features and split them up amongst group members, try to start minimal, then continue to build up based on time management

# App Design Flow

## 1. Firebase Authentication Integration
- **Sign Up / Log In**: Users can create an account or log in using Firebase Authentication.

## 2. Home Screen
- **Groups Overview**: Displays a list of groups the user belongs to.
- **Create or Add Friends**: Button to create a new group or add friends.

## 3. Group Screen
- **Members List**: Displays all members in the group.
- **Past Bills**: Shows past bills within the group.
- **Add a New Bill**: Button to add a new bill.
- **Bill Splitting**: Integrates with an Image-to-Text API to split the bill automatically.
  - **Split Amounts**: Shows the calculated amount for each member.
  - **Settle Payments**: Ability to mark payments as settled.

## 4. Friends Screen
- **Search for Friends**: Users can search for friends by email or phone number.
- **Invite Friends**: Option to invite friends to the app or to groups.

## 5. Add Bill Screen
- **Capture Bill**: Use the device’s camera to take a photo of the bill.
- **Bill Processing**: Submit the photo for processing and parsing.
- **Manual Adjustment**: Users can manually adjust the parsed bill amount before splitting.

## 6. Real-Time Updates
- **Firestore Integration**: Utilize Firestore's real-time listeners to:
  - Automatically update the UI when new bills are added.
  - Reflect real-time updates to group data.





  


