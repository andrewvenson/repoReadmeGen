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
  codeusage: [],
  tests: [],
  badges: [],
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
      newRepoPrompts();
    } else {
      authenticated = false;
      console.log("Invalid credentials");
      main();
    }
  });
}

// modify existing repo or create new repo with readme

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
              message: "Add installation step?",
              choices: ["Yes", "No"],
            },
          ])
          .then((answer) => {
            if (answer.continue === "Yes") {
              readmeObj.installstep.push({ codestep: answer.codestep });
              installationSteps();
            } else {
              readmeObj.installstep.push({ codestep: answer.codestep });
              inquirer
                .prompt([
                  {
                    name: "usageconfirm",
                    message: "Would you like to add Usage?",
                    type: "list",
                    choices: ["Yes", "No"],
                  },
                ])
                .then((answers) => {
                  if (answers.usageconfirm === "Yes") {
                    usage();
                  } else {
                    License();
                  }
                });
            }
          });
      }
    });
}

function usage() {
  inquirer
    .prompt([
      {
        name: "codeline",
        type: "input",
        message: "Enter code: ",
      },
      {
        name: "continue",
        type: "list",
        message: "More Usage code?",
        choices: ["Yes", "No"],
      },
    ])
    .then((answer) => {
      if (answer.continue === "Yes") {
        readmeObj.codeusage.push({ codestep: answer.codeline });
        usage();
      } else {
        readmeObj.codeusage.push({ codestep: answer.codeline });
        license();
      }
    });
}

function license() {
  inquirer
    .prompt([
      {
        name: "license",
        message: "Enter License: ",
        type: "input",
      },
      {
        name: "contrib",
        message: "Would you like to add any contributers?",
        type: "list",
        choices: ["Yes", "No"],
      },
    ])
    .then((answers) => {
      readmeObj.license = answers.license;
      if (answers.contrib === "Yes") {
        contrib();
      } else {
        badges();
      }
    });
}

function contrib() {
  inquirer
    .prompt([
      {
        name: "contrib",
        type: "input",
        message: "Contributer - Github username: ",
      },
      {
        name: "contribagain",
        type: "list",
        message: "Add another contributer?",
        choices: ["Yes", "No"],
      },
    ])
    .then((answers) => {
      var ghuser = gitClient.user(answers.contrib);
      ghuser.info((err, data, headers) => {
        if (err) {
          console.log("invalid github username | please enter again");
          contrib();
        } else {
          readmeObj.contributing
            .push(`<a href="https://github.com/${answers.contrib}"><img src="${data.avatar_url}" title="${answers.contrib}" width="80" height="80"></a>
          `);
        }
      });
      if (answers.contribagain === "Yes") {
        contrib();
      } else {
        inquirer
          .prompt([
            {
              name: "badges",
              type: "list",
              message: "Would you like to add any badges?",
              choices: ["Yes", "No"],
            },
          ])
          .then((answers) => {
            if (answers.badge === "Yes") {
              badges();
            } else {
              tests();
            }
          });
      }
    });
}

function badges() {
  final();
}

function tests() {
  final();
}

function final() {
  var readme = `# ${readmeObj.reponame}
  
${readmeObj.description}


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)

## Installation

${readmeObj.installstep
  .map((step) => {
    if (step.codestep) {
      return "```bash\n" + step.codestep + "\n```" + "\n\n";
    } else {
      return step.textstep + "\n\n";
    }
  })
  .join("")}
  
## Usage

${"```"}
${readmeObj.codeusage
  .map((use) => {
    return use.codestep + "\n";
  })
  .join("")}
${"```"}

## License

${readmeObj.license}

## Badges

## Contributing
${readmeObj.contributing
  .map((contributer) => {
    return "[//]: contributor-faces\n" + contributer + "\n";
  })
  .join("")}


## Tests


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
