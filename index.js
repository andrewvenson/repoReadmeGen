var inquirer = require("inquirer");
var github = require("octonode");
var fs = require("fs");

var authenticated = false;
var gitClient;
var readmeObj = {
  reponame: "",
  description: "",
  installstep: [],
  usage: [],
  contributing: [],
  license: "",
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
        usage();
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
        choices: ["Text", "Code"],
      },
    ])
    .then((answers) => {
      if (answers.installationstep === "Text") {
        inquirer
          .prompt([
            {
              name: "installstep",
              type: "input",
              message: "Enter text: ",
            },
            {
              name: "continue",
              type: "list",
              message: "More installation steps?",
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
              message: "Enter code: ",
            },
            {
              name: "continue",
              type: "list",
              message: "More installation steps?",
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
  final();
}

function contrib() {}

function final() {
  var readme = `    
  # ${readmeObj.reponame}
  
  ${readmeObj.description}

  1. [Installation](#installation)
  2. [Usage](#usage)
  3. [License](#license)
  4. [Contributing](#contributing)
  5. [Tests](#tests)

  ## Installation
  
  ##Usage

  ##License

  ##Contributing

  ##Tests
  
  `;

  fs.writeFile("README.md", readme, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("successful");
    }
  });
}

main();
