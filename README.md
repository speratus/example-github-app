# Speratus' Commit Tracker
Speratus' Commit Tracker is a GitHub App running on Glitch. It's purpose is to provide a
breakdown of how many commits the User pushes per week. Although commit numbers can be found on GitHub itself,
this app gathers them into one place and provides a breakdown of commits per day.

It works by connecting to GitHub and receiving push webhooks from GitHub.

# Setup
In order to get the commit tracker working, you will need to have a GitHub account.

The first step is to create a new GitHub app. You can create a new app by [going here](https://github.com/settings/apps) if 
you are signed in to GitHub. Click **`New GitHub App`** to get started.

Your app will have to have a unique name in order for it to be created. Fill in the fields for
**Homepage URL**, **User authorization callback URL**, and **Webhook URL** with links to your new Glitch App.
You can always edit these later if you forget what they are.

In the permissions section, the only permissions that are required for this app to work are 
**Repository** / **Contents** -> **Access: Read-only**. Then scroll down and under **Subscribe to Events**, check the box
for Push hooks. This will allow your app to receive webhooks whenever a user pushes a repository.

If necessary, create a private key for your app.

## Webhook secret
The next step is to create a webhook secret with which you can verify webhooks are from GitHub.
You can do this by running 

# Storage

## Made by [Glitch](https://glitch.com/)

\ ゜ o ゜)ノ
