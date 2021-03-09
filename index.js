var config_file_name = 'config.json';
if (process.argv[2]) {
  if (process.argv[2] != null){
  	 config_file_name = process.argv[2];
   }
}
var cfg = require('./' + config_file_name);

// const puppeteer = require('puppeteer')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const toped = require('./module/toped')
const bukalapak = require('./module/bukalapak')
const utils = require('./module/utils')

console.log('\x1b[30m');
console.log('\x1b[43m******************************************************');
console.log('****** Marketplace Scraping Beta , Fmanda - 2021 *****');
console.log('**** Supported Marketplace : Tokopedia, Bukalapak  ***');
console.log('******************************************************');
console.log('\x1b[0m');
console.log('Your Config.json : ');
console.log(JSON.stringify(cfg));


try {
	(async () => {
    console.log('Starting...');
    await sleep(2000);

    console.log('');

		const browser = await puppeteer.launch({
			headless: false,  /*userDataDir: newchromeprofile,executablePath: chromepath*/
      args:['--proxy-server=' + cfg.argproxy]
		})
		const page = await browser.newPage()
		await page.setViewport({ width: 0, height: 0 });

    utils.log('Get your proxy here : https://free-proxy-list.net/')
    utils.log('Checking your Public IP Address');
    await page.goto( 'http://whatismyipaddress.com/', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);

    //return;

    var i = 1;
    while (true){
      utils.log('Looping : ' + i.toString());
      i++;
  		for (var product of cfg.products){

        if (cfg.tokopedia == true){
          await toped.doSearch(page, product);
        }

        if (cfg.bukalapak == true){
          await bukalapak.doSearch(page, product);
        }

        await page.waitForTimeout(10000);
  		}
    }
	})()
} catch (err) {
	console.error(err)
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
