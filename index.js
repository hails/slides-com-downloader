const puppeteer = require('puppeteer')
const R = require('ramda')
const Promise = require('bluebird')
const args = process.argv.slice(2) || process.exit(1)

const run = async (link, totalSlides) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']})
    const slides = R.range(0, Number(totalSlides))

    const downloadSlide = async (slide) => {
        const page = await browser.newPage()

        console.info(`Downloading slide: #${slide} of ${totalSlides - 1}`)

        await page.setViewport({
            width: 1920,
            height: 1080
        })
        await page.goto(`${link}/fullscreen#/${slide}`, {waitUntil: 'networkidle0'})
        await page.screenshot({path: `./slides/${slide}.png`})
        return await page.close()
    }

    console.info(`Downloading slides from: ${link}`)

    return Promise.resolve(slides)
        .map(downloadSlide)
        .then(browser.close)
        .catch()
}


run(...args)