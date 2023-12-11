# Repository for software engineering project RUEats.

![RUEats_logo](https://github.com/567-Software-Engineering/RUEats/assets/48671736/b5d85245-aa09-4490-a8d9-635f0a6e61da)


## Initial Instructions:

## Clone the Repository

- Open a terminal
- Navigate to the directory where you want to clone the repository.
- Run the following command:

```git clone <repository_url>```

- Replace <repository_url> with the URL of your Git repository. This will create a new directory with the same name as the repository and download the code into that directory.

## Navigate into the Repository

- Run the following command:

```cd <repository_name>```

- Replace <repository_name> with the name of your repository.

## Pull the Latest Changes

- Before you start working on a new feature, make sure you have the latest changes from the remote repository. Run:

```git pull origin main```

# Setting up the Application locally for running and testing.

## Prerequisites
Install Node.js and npm.
- Download and install Node.js from https://nodejs.org/en/download
- Downlaod and install npm following the documentation https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

## Update environment variable

Update all the environment variables provided in the application documentation:
```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
GOOGLE_API_KEY=your_google_cloud_api_key
PAYMENT_SECRET_KEY = payment_key
EMAIL_USER=official_email
EMAIL_PASS=official_email_passkey
```

## Installation Steps
Open a terminal in the project directory.

Run:
- ```npm install```
After all dependencies are installed run:
- ```npm run devStart``` or ```node app.js```

RUEats should be up and running on the localhost 3000 port.
Home page url: ```http://localhost:3000/home```

# Developer Instructions

## Create a New Branch for every new Feature


- ```git checkout -b <branch_name>```

- Branch name pattern ```feature-<featureName>```

- Replace <branch_name> with the name of your new branch.

## Make Changes

- You can now start making changes for your new feature.
Commit Your Changes

- Once you’ve made some changes, stage them for commit by running:

```git add .```

### P.S do not include ```package-lock.json```

- Then, commit your changes by running:

```git commit -m "<commit_message>"```

Replace <commit_message> with a brief description of your changes.

## Push Your Changes

- Finally, push your changes to the remote repository by running:

```git push origin <branch_name>```

## Open a Pull Request

Go to your repository on GitHub.

- Click on ‘Pull requests’.

- Click on ‘New pull request’.

- Select your branch from the ‘compare’ dropdown.

- Review your changes and click on ‘Create pull request’.

## Atleast 1 reviewers approval required to merge PR.


## Creating Database queries.
- Your Database queries can be placed inside ```RUEatsRepository.js```
- Each new query/ operation can be a new method inside ```class RUEatsRepository``` eg. ```function getRestaurant(id)``` which can take necessary arguments, run queries with that input and return output.
