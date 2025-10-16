const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should create a function named logUser that takes one parameter username', async function() {
      const result = await page.evaluate(() => {
        return logUser('bob');
      });

      expect(result).toBeUndefined();
  });

  it('should log user: ${username} to the console when logUser is called', async function() {
    var stdout = '';
    
    page.on('console', message => {stdout += message.text()});
      
    await page.evaluate(() => {
      logUser('bob');
    });
      
    expect(stdout).toEqual('user: bob');
  });

  it('should not return a value when logUser is called', async function() {
      const result = await page.evaluate(() => {
        return logUser('bob');
      });

      expect(result).toBeUndefined();
  });
});

