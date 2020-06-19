let inquirer = require("inquirer");

var gitInfo = {};

let asyncPrompt = async function () {
  var user;
  var pass;

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

  user = username;
  pass = password;

  while (user !== "andrewvenson" && pass !== "Hooper33!@") {
    console.log("Invalid credentials, please try again");
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
    user = username;
    pass = password;
  }

  console.log("valid credentials", user, pass);
  console.log(user, pass);
};

asyncPrompt();

// inquirer
//   .prompt([
//     /* Pass your questions in here */
// {
//   name: "username",
//   message: "Github Username: ",
//   type: "input",
// },
// {
//   name: "password",
//   message: "Github Password: ",
//   type: "password",
// },
// {
//   name: "repotype",
//   message: "Choose one: ",
//   choices: function () {
//     return [
//       "Create a new repo with Readme",
//       "Re-create existing repo's Readme",
//     ];
//   },
//   type: "list",
// },
//   ])
//   .then((answers) => {
//     gitInfo = answers;
//     if (answers.repotype === "Create a new repo with Readme") {
//       let toContent = null;
//       while (toContent != "done") {
//         return inquirer.prompt([
//           {
//             name: "reponame",
//             message: "Enter new repo name: ",
//             type: "input",
//           },
//           {
//             name: "description",
//             message: "Description: ",
//             type: "input",
//           },
//           {
//             name: "toc",
//             message: "Table of Contents: ",
//             type: "input",
//           },
//         ]);
//       }
//     } else {
//       return inquirer.prompt([
//         {
//           name: "reponame",
//           message: "Enter existing repo name: ",
//           type: "input",
//         },
//       ]);
//     }
//   })
//   .then((answers) => {
//     // Use user feedback for... whatever!!
//     appendResults(answers);
//   });

function appendResults(answers) {
  gitInfo.reponame = answers.reponame;
  gitInfo.description = answers.description;
  gitInfo.toc = answers.toc;
  gitInfo.install = answers.install;
  gitInfo.usage = answers.usage;
  gitInfo.lic = answers.lic;
  gitInfo.contrib = answers.contrib;
  gitInfo.tests = answers.tests;
  console.log(gitInfo);
}
