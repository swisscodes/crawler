import puppeteer from 'puppeteer';

class Web {
    browser:any
    async browserPage() {
        return new Promise((resolve, reject) => {
            (async () => {
                
                try {
                    this.browser = await puppeteer.launch();
                    resolve(this.browser)
                }
                catch(err) {
                    reject(err)
                }
            })

            
        })
    }
}