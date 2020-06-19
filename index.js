var inquirer = require("inquirer");
var github = require("octonode");

var authenticated = false;
var gitClient;

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
      console.log(answers.create);
    });
}

main();
