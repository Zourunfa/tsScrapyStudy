// const superagent = require('superagent')
import superagent from 'superagent';
import { isThisTypeNode } from 'typescript';
import path from 'path';
import fs from 'fs';

import SpiderAnalysis from './spiderAnalyzer';
import SpiderAnalyzer from './spiderAnalyzer';
// import SpiderImg from './spiderImg';

export interface Analyzer {
  analysis: (html: string, filePath: string) => string;
}

class Crowller {
  private filePath = path.resolve(__dirname, '../data/movie.json');

  private async getRawHtml() {
    const res = await superagent.get(this.url);
    return res.text;
  }

  private async initSpider() {
    //
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analysis(html, this.filePath);
    this.writeFile(fileContent);
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }
  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpider();
  }
}
const url = `https://ssr1.scrape.center/`;

// const analyzer = new SpiderAnalysis();
const analyzer = SpiderAnalyzer.getInstance();
// const analyzer = SpiderImg.getInstance();
new Crowller(url, analyzer);
