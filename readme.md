# Repository for software engineering project RUEats.

## Initial Instructions:

## Clone the Repository

- Open a terminal.
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


## Create a New Branch for every new Feature


```git checkout -b <branch_name>```

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

## Atleast 2 reviewers approval required to merge PR.