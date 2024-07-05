const { Command } = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");
const { RouterCrawl } = require("./RouterCrawl");

const program = new Command();
program.version("1.0.0");

program
  .command("crawl")
  .description("Start crawling a website and find all routes")
  .action(async () => {
    console.log(
      chalk.green(figlet.textSync("Route Crawl", { horizontalLayout: "full" }))
    );

    const routerCrawl = new RouterCrawl();
    await routerCrawl.start();
  });

program.parse(process.argv);
