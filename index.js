/*jshint esversion:6 */

const puppeteer = require('puppeteer');
const R = require('ramda');
const fs = require('fs');

let args = process.argv.slice(2) || process.exit(1)

const run = async(link, totalSlides) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const slides = R.range(0, Number(totalSlides));

    const downloadSlide = async(slide) => {
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        await page.setViewport({
            width: 1920,
            height: 1080
        });


        await page.goto(`${link}/fullscreen#/${slide + 1}`, { waitUntil: 'networkidle0' });

        console.info(`Downloading slide: #${slide + 1} of ${totalSlides}`);
        await page.screenshot({ path: `slides/${slide + 1}.png` });
        return page.close();
    };


    console.info(`Downloading slides from: ${link}`);

    return Promise.all(slides.map(downloadSlide));
};

const checkDownloadFolder = async() => {
    if (!fs.existsSync('slides/')) {
        fs.mkdirSync('slides/');
    }
};


checkDownloadFolder()

run(...args)
    .then(() => console.log('Done!'))
    .then(() => process.exit(0))
    .catch(console.error);