let inquirer = require("inquirer");
inquirer
  .prompt([
    /* Pass your questions in here */
    {
      name: "username",
      message: "Github Username: ",
      type: "input",
    },
    {
      name: "password",
      message: "Github Password: ",
      type: "password",
    },
    {
      name: "repo",
      message: "Choose one: ",
      choices: function () {
        return [
          "Create a new repo with Readme",
          "Re-create existing repo's Readme",
        ];
      },
      type: "list",
    },
  ])
  .then((answers) => {
    if (answers.repo === "Create a new repo with Readme") {
      return inquirer.prommpt([
        {
          name: "repoName",
          message: "Enter new repo name: ",
          type: "input",
        },
      ]);
    } else {
      return inquirer.prompt([
        {
          name: "repoName",
          message: "Enter existing repo name: ",
          type: "input",
        },
      ]);
    }
  })
  .then((answers) => {
    // Use user feedback for... whatever!!
  });
