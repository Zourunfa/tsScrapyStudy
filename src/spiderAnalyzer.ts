import cheerio from 'cheerio';
import fs from 'fs';
import { Analyzer } from './crowller';

interface Movie {
  title: string;
  score: string;
  publishTime: string;
}

interface MovieResult {
  time: number;
  data: Movie[];
}

interface Content {
  [propName: number]: Movie[];
}

export default class SpiderAnalyzer implements Analyzer {
  // 单例模式：只用生成对应的一个网址的爬虫分析器
  private static instance: SpiderAnalyzer;
  static getInstance() {
    if (!SpiderAnalyzer.instance) {
      SpiderAnalyzer.instance = new SpiderAnalyzer();
    }
    return SpiderAnalyzer.instance;
  }

  private getVedioInfo(html: string) {
    const $ = cheerio.load(html);
    const vedioItem = $('.el-card');
    console.log(vedioItem.length);
    const movieArr: Movie[] = [];
    vedioItem.map((index, ele) => {
      // console.log(index,ele);
      const title = $(ele).find('.m-b-sm').text().trim();

      const score = $(ele).find('.score').text().trim();

      const publishTime = $(ele).find('.m-v-sm').eq(1).text().trim();
      // console.log(title, score, publishTime);
      movieArr.push({
        title,
        score,
        publishTime,
      });
    });
    // console.log(movieArr);

    return {
      time: new Date().getTime(),
      data: movieArr,
    };
  }

  private generateJson(movieRes: MovieResult, filePath: string) {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    console.log(fileContent);

    fileContent[movieRes.time] = movieRes.data;
    console.log(filePath);

    return fileContent;
  }

  public analysis(html: string, filePath: string) {
    const movieRes = this.getVedioInfo(html);
    // console.log(movieRes);

    const fileContent = this.generateJson(movieRes, filePath);
    console.log(fileContent);

    return JSON.stringify(fileContent);
  }

  private constructor() {}
}
