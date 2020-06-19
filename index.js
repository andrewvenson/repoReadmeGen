var inquirer = require("inquirer");
var github = require("octonode");

var authenticated = false;

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
  asyncClient(client);
};

function asyncClient(client) {
  client.get("/user", {}, function (err, status, body, headers) {
    if (!err) {
      authenticated = true;
      console.log("authenticated");
    } else {
      authenticated = false;
      console.log("Invalid credentials");
      main();
    }
  });
}

main();
