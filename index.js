const puppeteer = require('puppeteer')
const R = require('ramda')
const args = process.argv.slice(2);

const run = async (link, slides) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page.setViewport({
        width: 1920,
        height: 1080
    })

    
    const fetchPage = async (slide) => {
        console.info(`Saving page: ${slide}`)
        await page.goto(`${link}/fullscreen/${slide}`)
        return await page.screenshot({path: `slides/${slide}.png`})
    }

    const printPages = async => R.times(fetchPage)

    console.info(`Downloading slides from: ${link}`)

    return printPages(14)
}

run(...args)