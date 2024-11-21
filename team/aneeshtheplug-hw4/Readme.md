# HW04 - Progress Bar Component for Bill Splitter App

## Overview
- This contribution adds a **Progress Bar Component** to the Bill Splitter App, which allows users to visually track how much of the bill has been paid. The progress bar dynamically updates based on the total amount paid versus the total bill amount, providing an intuitive way to monitor payment completion
- Initially, to track who had paid who once a bill was created, we had an outstanding amount that would appear the top of each bill and have a status button for everyone assigned on the bill which showed if they had paid or not. If they had paid, there would be a paid sign undernearth their name, otherwise there would be a button above their name that said mark as paid
- While this was nice, I wanted to add a more visual way to display these changes since it would be easier for the user to understand be less of an overload of a text than before

---

## Changes
- For every bill that is made, there is a now a small green progress bar below the date the bill was created which shows the percentage of a bill that has been paid
- The bar also shows how much of the bill has been numerically just to give the person who created the bill an indicator of how much of it has been paid overall
- The progress bar updates anytime the amount of the bil paid changes

## Folder Structure
- To track the changes that were made to this file, you can navigate to the tabs/PaymentStatusBar.js to understand the functionality for how the payment status bar was made and how it gets updated based on how much of the bill remainds outstanding realtive to the inital amount
- I rendered this component in the tabs/BillDetailsScreen.js file  and appears right below the date the bill is created in the box that is is contained within to ensure that it blends in with the current UI to provide a pleasing visual to an invidvidual
- The changes on the app can be tracked in the before and after folders above which show how the progress bar works for both methods of adding a bill whether it is manual or through scanning a receipt

