# TODO: overview system architecture diagram and associated explanation.

# Section summarizing important team decisions since the start of the project:
## Authentication Platform: 
Chose Firebase Authentication for email/password and OAuth login due to its ease of integration. Implemented by Joseph, Adil, and Aneesh.
## Receipt Scanning: 
Implemented the Veryfi OCR API for receipt scanning after evaluation by Olivia and Nadav.
## Database: 
Selected Firestore for real-time updates, with MongoDB as a backup. Joseph designed the schema for users, groups, bills, and items.
## MVP Scope: 
Focused on core features like manual bill entry, itemized splitting, friend management, and Firebase login to deliver a functional prototype.
## Bill Splitting Logic: 
Prioritized itemized splitting, with plans to add percentage and tax/tip splitting in future iterations.
## Frontend Design: Developed a simple, intuitive UI using React Native. 
Alex and Yerassyl worked on navigation and tab-based layouts.
## Task Management: 
Used GitHub Kanban for task tracking, ensuring transparency and role clarity.

# User Experience (UX) considerations.
## Simplicity: 
Intuitive design, focused on minimal clicks for core tasks like adding bills or splitting payments. 
## TODO: elaborate

# High-Level User Flow
## Sign Up/Login:
Users sign up or log in via Firebase Authentication.
Authentication options include email/password or third-party providers.
## Home Screen:
Displays user groups and recent activities.
Quick access to creating or managing bills and adding friends.
## Add Bill:
Users manually enter bill details or upload receipt picture (using Veryfi OCR for automatic processing).
Items can be assigned to specific users for splitting.
## Split and Settle:
Calculates each member's share, including taxes and tips.
Users can mark payments as settled or send reminders.
## Friend Management:
Allows adding/removing friends via email or invite link.
Shows pending friend requests.
## Settings: 
Used to show past bills, manage friends, see app version, and sign out of the account. 
