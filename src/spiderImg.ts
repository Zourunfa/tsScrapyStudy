import cheerio from 'cheerio';
import fs from 'fs';
import { Analyzer } from './crowller';

interface imgLimit {
  title: string;
  imgSrc: any;
}

export default class SpiderImg implements Analyzer {
  // 单例模式：只用生成对应的一个网址的爬虫分析器
  private static instance: SpiderImg;
  static getInstance() {
    if (!SpiderImg.instance) {
      SpiderImg.instance = new SpiderImg();
    }
    return SpiderImg.instance;
  }

  private getVedioInfo(html: string) {
    const $ = cheerio.load(html);
    const vedioItem = $('.el-card');
    console.log(vedioItem.length);
    const imgSrcArr: imgLimit[] = [];
    vedioItem.map((index, ele) => {
      const title = $(ele).find('.m-b-sm').text().trim();

      const imgSrc = $(ele).find('.cover').attr('src');
      console.log(title, imgSrc);
      imgSrcArr.push({
        title,
        imgSrc,
      });

      imgSrcArr.push(imgSrc);
    });

    return imgSrcArr;
  }

  private generateJson(res: any, filePath: string) {
    let fileContent = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    console.log(fileContent);

    // console.log(1111);
    return fileContent;
  }
  analysis(html: string, filePath: string) {
    const res = this.getVedioInfo(html);

    const fileContent = this.generateJson(res, filePath);

    return JSON.stringify(fileContent);
  }
}
