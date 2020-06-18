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
      message: "Name of Repo: ",
      type: "input",
    },
    {
      name: "description",
      message: "Description: ",
      type: "input",
    },
    {
      name: "installation",
      message: "Installation: ",
      type: "input",
    },
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
  });
