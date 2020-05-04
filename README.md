# Example Github app
This project is a GitHub App running on Glitch. It's purpose is to provide a
breakdown of how many commits the User pushes per week. Although commit numbers can be found on GitHub itself,
this app gathers them into one place and provides a breakdown of commits per day.

It works by connecting to GitHub and receiving push webhooks from GitHub.

# Setup
In order to get the commit tracker working, you will need to have a GitHub account.

The first step is to create a new GitHub app. if you are signed in to GitHub, 
You can create a new app by [following this link](https://github.com/settings/apps) . 
Click **`New GitHub App`** to get started.

![Create a new GitHub app](https://cdn.glitch.com/5e118cda-8296-4fd1-9d97-bc1b5e16f057%2Fnew_app_screen.jpg?v=1588621842323)

Your app will have to have a unique name in order for it to be created. Fill in the fields for
**Homepage URL**, **User authorization callback URL**, and **Webhook URL** with links to your new Glitch App.
You can always edit these later if you forget what they are.

![Make sure to fill in the Webhooks Fields](https://cdn.glitch.com/5e118cda-8296-4fd1-9d97-bc1b5e16f057%2Fwebhook%20setup.png?v=1588621848936)

In the permissions section, the only permissions that are required for this app to work are 
**Repository** \ **Contents** -> **Access: Read-only**. 

![Allow read-only access to repository contents](https://cdn.glitch.com/5e118cda-8296-4fd1-9d97-bc1b5e16f057%2Fpermission_setup.jpg?v=1588621845701)

Then scroll down and under **Subscribe to Events**, check the box
for Push hooks. This will allow your app to receive webhooks whenever a user pushes a repository.

![Subscribe to push events](https://cdn.glitch.com/5e118cda-8296-4fd1-9d97-bc1b5e16f057%2Fevent_subscriptions_setup.jpg?v=1588621838329)

If necessary, create a private key for your app.

## Webhook secret
The next step is to create a webhook secret with which you can verify webhooks are from GitHub.
You can do this by running the following command in the terminal.
```bash
ruby -rsecurerandom -e 'puts SecureRandom.hex(20)'
```
If you don't have ruby on your computer, you can run the command in the terminal provided
by Glitch. Simply click on **Tools** \ **Terminal**.

Alternatively, if you have another method for generating a secret which you prefer you can use that instead.
Once you've generated your secret, make sure to paste it into a variable named `WEBHOOK_SECRET` in `.env` as well as the 
**Webhook Secret** form on the app page.

## Running
If you've configured everything correctly, you should be able to receive webhooks right away. Commit and push
to a repo, and you should be good to go.

You can view the generated report by going to `<your-glitch-app>.glitch.me/report/<your-github-username>`.

# Storage
This app is not designed to handle large numbers of users without significant modification.
It stores all of its data in a json file in the `.data` folder. You can inspect the contents
of the file by running the following command in the terminal:
```bash
cat .data/storage.json
```
