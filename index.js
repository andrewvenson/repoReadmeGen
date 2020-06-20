var inquirer = require("inquirer");
var github = require("octonode");

var authenticated = false;
var gitClient;
var readmeObj = {
  toc: ["Installation", "Usage", "License", "Contributing", "Tests"],
  installstep: [],
};

let main = async function () {
  let { username, password } = await inquirer.prompt([
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
  ]);

  let client = github.client({
    username: username,
    password: password,
  });

  gitClient = client;

  setAuthentication(gitClient);
};

// set authentication
function setAuthentication(client) {
  client.get("/user", {}, function (err, status, body, headers) {
    if (!err) {
      authenticated = true;
      console.log("authenticated");
      initialPrompts();
    } else {
      authenticated = false;
      console.log("Invalid credentials");
      main();
    }
  });
}

// modify existing repo or create new repo with readme
function initialPrompts() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "create",
        choices: [
          "Create new Repo with Readme",
          "Modify Existing Repo's Readme",
        ],
        message: "Choose: ",
      },
    ])
    .then((answers) => {
      if (answers.create === "Create new Repo with Readme") {
        newRepoPrompts();
      } else {
        console.log("modifying existing readme");
      }
    });
}

function newRepoPrompts() {
  inquirer
    .prompt([
      {
        name: "reponame",
        type: "input",
        message: "Repo name: ",
      },
      {
        name: "description",
        type: "input",
        message: "Description: ",
      },
      {
        name: "installation",
        type: "list",
        message: "Would you like to add installation steps?",
        choices: ["Yes", "No"],
      },
    ])
    .then((answers) => {
      readmeObj.reponame = answers.reponame;
      readmeObj.description = answers.description;

      if (answers.installation === "Yes") {
        installationSteps();
      } else {
        console.log("go to usage");
      }
    });
}

function installationSteps() {
  inquirer
    .prompt([
      {
        name: "installationstep",
        type: "list",
        message: "Step type: ",
        choices: ["Add installation step", "Add installation code snippet"],
      },
    ])
    .then((answers) => {
      if (answers.installationstep === "Add installation step") {
        inquirer
          .prompt([
            {
              name: "installstep",
              type: "input",
              message: "Enter step: ",
            },
            {
              name: "continue",
              type: "list",
              message:
                "Would you like to continue adding to installation steps?",
              choices: ["Yes", "No"],
            },
          ])
          .then((answer) => {
            if (answer.continue === "Yes") {
              readmeObj.installstep.push({ textstep: answer.installstep });
              installationSteps();
            } else {
              readmeObj.installstep.push({ textstep: answer.installstep });

              usage();
            }
          });
      } else {
        inquirer
          .prompt([
            {
              name: "codestep",
              type: "input",
              message: "Enter step: ",
            },
            {
              name: "continue",
              type: "list",
              message:
                "Would you like to continue adding to installation steps?",
              choices: ["Yes", "No"],
            },
          ])
          .then((answer) => {
            if (answer.continue === "Yes") {
              readmeObj.installstep.push({ codestep: answer.codestep });
              installationSteps();
            } else {
              readmeObj.installstep.push({ codestep: answer.codestep });
              usage();
            }
          });
      }
    });
}

function usage() {
  console.log(readmeObj);
  console.log("adding usage");
}

main();
