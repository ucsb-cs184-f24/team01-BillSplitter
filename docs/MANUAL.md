# Purpose
The purpose of our product is to help people split shared expenses, whether that be groceries or recurring expenses such as rent or utilities. The goal is to make it easier for people to manage costs equitably and transparently.

# Intended Audience
Our target audience is wide-ranging, from college students living together to general friends or even strangers. It includes anyone who shops or spends money in groups and wants an easy way to figure out who owes what for expenses.

# Features

## Friends Feature
In our app, you can find friends by searching by email address and sending a friend request. If they accept it, you can begin adding them to bills, which will automatically notify them to pay their share of an expense and track whether they have paid it or not. All the friends you add will be documented under the **Friends** tab.

## Bill Scanning
You can upload a photo of a bill, and using the **Veryfi OCR API** for image-to-text processing, the receipt will be automatically scanned, and its items extracted individually. Each item, along with its corresponding price, will be stored in the app, ready to be assigned to anyone you choose.

For example, I uploaded a Costco receipt, and the app successfully split it into individual items, such as rice bowls, yogurt, strawberries, and more, along with their prices. From there, I can assign each item to myself or any of my friends on the app.

## Manually Assign
If a user wants to split a bill manually, they can fill out the details regarding the bill and create a custom split among their friends. 

For instance, I created a bill for dinner that totaled $55. I was able to input the title of the expense, the category it fell under, and the amount. From there, I could describe the expense to give more clarity about what we were paying for. Finally, I had the option to split the bill equally or create a custom split.

## Payment Tracking
Once a bill is created and friends are added to it, the bill appears on the app's homepage. You can click on it to view detailed information, including the outstanding balance and who has or hasn’t paid. 

- If someone hasn’t paid, a **dark gray "Mark as Paid" button** will appear under their name. 
- If they have paid, a **green "Paid" label** will be displayed instead.

This feature simplifies tracking payments, making it easy for the bill creator to see who has paid and follow up with those who haven’t.

## Past Bills
The app includes a feature to view the history of all past bills. Users can categorize them as bills they’ve sent or bills received from friends. This helps keep track of:
- People who have paid or haven’t paid if significant time has passed.
- Confirmation of whether the user has paid their share of a bill.
