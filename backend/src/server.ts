import puppeteer from 'puppeteer';
import express from 'express';
import cors from 'cors'
import dataArray, {TdataArray} from './data';

const app = express();
const router = express.Router()

app.use(cors())
app.use(express.json())

const port = process.env.HOST_PORT || 8000;

app.post('/api', (req:express.Request, res:express.Response) => {
  const {url} = req.body;
  console.log(url);
  (async () => {
    let contentToSearch:string[]

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    
    try {
      await page.goto(url, {timeout: 0});
  
      let lang:string = await page.evaluate(() => {
        return document.getElementsByTagName('html')[0].getAttribute('lang')?.slice(0, 2).toUpperCase() || '';
      })

      if(dataArray.hasOwnProperty(lang)) {
        contentToSearch = dataArray[lang as keyof TdataArray ]
        const hrefs = await page.evaluate(() => {
          return Array.from(document.getElementsByTagName('a'), (a) => a.href);
        });
  

        for(let i=0; i<hrefs.length-1; i++) {
          let eachUrl = hrefs[i];
          await page.goto(eachUrl, {timeout: 0});
          let textcontent = await page.evaluate(() => {
            return document.documentElement.innerText;
          })

          let foundText = contentToSearch.find((text:string) => textcontent.includes(text))
          if(foundText) {
            let foundedUrl = eachUrl 
            await browser.close();
            res.status(200).json({data:foundText, foundedUrl:foundedUrl})
            return
          }
          
        }
      }
    
      await browser.close();
      res.status(404).json({data:true, foundedUrl:false})
  }
  catch(err) {
    await browser.close();
    console.log(err)
    res.status(400).json({data:true, foundedUrl:false})
  }


  })();

})

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
