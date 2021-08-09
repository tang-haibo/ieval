import {getResource} from '../index';
import http from 'http';

const option = {
  async get(url: string): Promise<string> {
    return new Promise(resolve => {
      http.get(url, (res) => {
        const { statusCode } = res;
        if(statusCode !== 200) {
          console.error(`${url} response load error!`);
          res.resume();
          resolve('');
          return;
        }
        let rawData: string = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          resolve(rawData);
        });
      });
    });
  },
  context: {},
};

// 请求是否异常
describe('[getResource]', () => {
  it('[getResource] is response 200 and text is string', async () => {
    const response = await getResource('http://www.baidu.com', option);
    expect(typeof response).toContain('string');
    expect(response.length).toBeGreaterThan(0);
  });
});