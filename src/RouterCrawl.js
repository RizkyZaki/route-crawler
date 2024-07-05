const puppeteer = require("puppeteer");
const chalk = require("chalk");

class RouterCrawl {
  constructor() {
    this.url = "";
    this.routes = new Set();
  }

  async start() {
    this.url = await this.promptForURL();

    if (!this.url) {
      console.log(chalk.red("URL not provided. Exiting..."));
      return;
    }

    console.log(chalk.yellow("Crawling started. Please wait..."));

    await this.crawl([this.url]);

    console.log(chalk.green(`Total routes found: ${this.routes.size}`));
    this.printRoutes();
  }

  async promptForURL() {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      readline.question("Paste URL of website: ", (url) => {
        readline.close();
        resolve(url.trim());
      });
    });
  }

  async crawl(urls) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      while (urls.length > 0) {
        const currentUrl = urls.pop();
        if (this.routes.has(currentUrl)) continue;

        try {
          await page.goto(currentUrl, { waitUntil: "networkidle2" });
          this.routes.add(currentUrl);

          const links = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll("a"));
            return anchors
              .map((anchor) => anchor.href.split("#")[0])
              .filter((href) => {
                return href.startsWith("http") || href.startsWith("https");
              });
          });

          links.forEach((link) => {
            if (!this.routes.has(link)) {
              urls.push(link);
            }
          });
        } catch (error) {
          console.error(
            chalk.red(`Error crawling ${currentUrl}: ${error.message}`)
          );
        }
      }
    } finally {
      await browser.close();
    }
  }

  printRoutes() {
    console.log(chalk.green(`Routes found on ${this.url}:`));
    this.routes.forEach((route) => console.log(chalk.blue(route)));
  }
}

module.exports = { RouterCrawl };
