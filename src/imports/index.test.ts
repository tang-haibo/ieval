import {getResource, loadCode, ImportScript} from './index';
import http from 'https';

const option = {
  async get(url: string): Promise<string> {
    return new Promise(resolve => {
      http.get(url, {
        timeout: 30000,
      },(res) => {
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
  context: global,
};

function isString(response: ScriptsEmtry) {
  expect(typeof response).toContain('string');
  expect((response as string).length).toBeGreaterThan(0);
}

describe('[getResource]', () => {
  it('[getResource] is response 200 and text is string', async () => {
    const response = await getResource('https://www.baidu.com', option);
    isString(response);
  });
});

describe('[loadCode]', () => {
  it('[loadCode] params is string', async () => {
    const [response] = await loadCode([`function main() {}`], option);
    isString(response);
  });
  
  it('[loadCode] params is Promise', async () => {
    const [response] = await loadCode([Promise.resolve(`function main() {}`)], option);
    isString(response);
  });

  it('[loadCode] params is Uri', async () => {
    const [response] = await loadCode(['https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'], option);
    isString(response);
  });

  it('[loadCode] params is null', async () => {
    const [response] = await loadCode([null], option);
    expect(typeof response).toContain('string');
    expect(response.length).toBe(0);
  });
});


describe('[ImportScript]', () => {
  it('[ImportScript] params is Function', async () => {
    const ctx = await ImportScript([
      `function main() {
        return 0;
      }`
    ], option);
    const module = ctx.getWindow();
    expect(module.main()).toBe(0);
  });
});