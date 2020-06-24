var inquirer = require("inquirer");
var github = require("octonode");
var fs = require("fs");

var authenticated = false;
var gitClient;
var readmeObj = {
  reponame: "",
  description: "",
  installstep: [],
  contributing: [],
  license: "",
  codeusage: [],
  tests: [],
  email: "",
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

function newRepoPrompts() {
  inquirer
    .prompt([
      {
        name: "reponame",
        type: "input",
        message: "Repo name: ",
        default: "Enter Repo Name Here",
      },
      {
        name: "description",
        type: "input",
        message: "Description: ",
        default: "Enter Description Here",
      },
    ])
    .then((answers) => {
      readmeObj.reponame = answers.reponame;
      readmeObj.description = answers.description;

      installationSteps();
    });
}

function installationSteps() {
  inquirer
    .prompt([
      {
        name: "installationstep",
        type: "list",
        message: "Installation steps = Choose step type: ",
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
              default: "Enter Installation Step Here",
            },
            {
              name: "continue",
              type: "list",
              message: "More installation steps?",
              choices: ["Yes", "No"],
            },
          ])
          .then((answer) => {
            readmeObj.installstep.push({ textstep: answer.installstep });
            if (answer.continue === "Yes") {
              installationSteps();
            } else {
              usage();
            }
          });
      } else if (answers.installationstep === "Code") {
        inquirer
          .prompt([
            {
              name: "codestep",
              type: "input",
              message: "Enter code: ",
              default: "Enter Installation Code Here",
            },
            {
              name: "continue",
              type: "list",
              message: "Add installation step?",
              choices: ["Yes", "No"],
            },
          ])
          .then((answer) => {
            readmeObj.installstep.push({ codestep: answer.codestep });
            if (answer.continue === "Yes") {
              installationSteps();
            } else {
              usage();
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
        message: "Enter Usage code: ",
        default: "Enter Usage Code Here",
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
        default: "Enter License Here",
      },
    ])
    .then((answers) => {
      readmeObj.license = answers.license;
      contrib();
    });
}

function contrib() {
  inquirer
    .prompt([
      {
        name: "contrib",
        type: "input",
        message: "Contributer - Github username: ",
        default: gitClient.token.username,
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
          inquirer
            .prompt([
              {
                name: "contribagain",
                type: "list",
                message: "Add another contributer?",
                choices: ["Yes", "No"],
              },
            ])
            .then((answers) => {
              if (answers.contribagain === "Yes") {
                contrib();
              } else {
                badges();
              }
            });
        }
      });
    });
}

function badges() {
  inquirer
    .prompt([
      {
        name: "label",
        type: "input",
        message: "Badge - Badge Label: ",
        default: "<LABEL>",
      },
      {
        name: "message",
        type: "input",
        message: "Badge - Badge Message: ",
        default: "<MESSAGE>",
      },
      {
        name: "color",
        type: "input",
        message: "Badge - Badge Color: ",
        default: "<COLOR>",
      },
    ])
    .then((answers) => {
      readmeObj.badges.push(
        `<img src="https://img.shields.io/badge/${answers.label}-${answers.message}-${answers.color}" alt="${answers.label}" />`
      );
      inquirer
        .prompt([
          {
            name: "anotherbadge",
            type: "list",
            message: "Add another Badge?",
            choices: ["Yes", "No"],
          },
        ])
        .then((answers) => {
          if (answers.anotherbadge === "Yes") {
            badges();
          } else {
            tests();
          }
        });
    });
}

function tests() {
  inquirer
    .prompt([
      {
        name: "codeline",
        type: "input",
        message: "Enter Test code: ",
        default: "Enter Test Code Here",
      },
      {
        name: "continue",
        type: "list",
        message: "Add another test?",
        choices: ["Yes", "No"],
      },
    ])
    .then((answer) => {
      readmeObj.tests.push({ codestep: answer.codeline });
      if (answer.continue === "Yes") {
        tests();
      } else {
        inquirer
          .prompt([
            {
              name: "email",
              type: "input",
              message: "Enter email address for contact method:",
            },
          ])
          .then((answer) => {
            readmeObj.email = answer.email;
            final();
          });
      }
    });
}

function final() {
  console.log(readmeObj);
  inquirer
    .prompt([
      {
        name: "correct",
        type: "list",
        message: "Does your README data look correct?",
        choices: ["Yes", "No"],
      },
    ])
    .then((answers) => {
      if (answers.correct === "Yes") {
        readmeLocation();
      } else {
        inquirer
          .prompt([
            {
              name: "redo",
              type: "list",
              message: "Would you like to redo README?",
              choices: ["Yes", "No"],
            },
          ])
          .then((answers) => {
            if (answers.redo === "Yes") {
              readmeObj.reponame = "";
              readmeObj.description = "";
              readmeObj.installstep = [];
              readmeObj.license = "";
              readmeObj.tests = [];
              readmeObj.badges = [];
              readmeObj.email = "";
              readmeObj.contributing = [];
              readmeObj.codeusage = [];
              newRepoPrompts();
            } else {
              readmeLocation();
            }
          });
      }
    });
}

function readmeLocation() {
  inquirer
    .prompt([
      {
        name: "location",
        type: "list",
        message: "Where would you like to write your README.md",
        choices: [
          "Just write it locally",
          `Create a new REPO named <${readmeObj.reponame}> with current README data`,
        ],
      },
    ])
    .then((answers) => {
      if (answers.location === "Just write it locally") {
        createReadme("local");
      } else {
        createReadme("github");
      }
    });
}

function createReadme(location) {
  var readme = `# ${readmeObj.reponame}
  
${readmeObj.description}
  
## Table of Contents
  
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)
  
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
  
${readmeObj.badges
  .map((badge) => {
    return badge + "\n";
  })
  .join("")}
  
## Contributing
${readmeObj.contributing
  .map((contributer) => {
    return "[//]: contributor-faces\n" + contributer + "\n";
  })
  .join("")}
  
## Tests
${"```"}
${readmeObj.tests
  .map((use) => {
    return use.codestep + "\n";
  })
  .join("")}
${"```"}
  
## Questions

If you have any questions about the repo, open an issue or contact directly @ ${
    readmeObj.email
  }
`;

  fs.writeFile("README.md", readme, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("README.md created successfully");
    }
  });

  if (location === "github") {
    let ghme = gitClient.me();

    ghme.repo(
      {
        name: readmeObj.reponame,
        description: readmeObj.description,
      },
      (err, data, headers) => {
        if (err) {
          console.log("there was an error creating your repo");
        } else {
          console.log(`REPO: <${readmeObj.reponame}> created successfully`);

          var ghrepo = gitClient.repo(
            `${gitClient.token.username}/${readmeObj.reponame}`
          );
          ghrepo.createContents(
            "README.md",
            "initial creation of readme",
            readme,
            (err, data, headers) => {
              if (err) {
                console.log(
                  `There was an error commiting your REAME.md to the REPO: <${readmeObj.reponame}>`
                );
              } else {
                console.log(
                  `README successfully commited to REPO: <${readmeObj.reponame}>`
                );
              }
            }
          );
        }
      }
    );
  }
}

main();
