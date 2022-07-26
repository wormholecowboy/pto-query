# pto-query
A Slack bot that queries a Google Sheet for remaining PTO

People kept bugging the ops director at my company to check a spreadsheet for how much PTO time they have left. I automated it for fun and to get better with API's and Node. I deployed it on Google Cloud App Engine.

I ran into a known bug which uses a deprecated setting as a solution. However, the solution has been removed from their cloud library. I found the updated one and corrected the thread here: https://github.com/GoogleCloudPlatform/getting-started-java/issues/281#issuecomment-1185115028

![pto-query-bot](https://user-images.githubusercontent.com/90535641/180916502-561c21aa-565f-414a-bbf0-ab229ea0f342.gif)
