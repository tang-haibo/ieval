import {getResource, ImportScript} from './index';
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

// 对应的ast对象
const initAst = {
  "type": "Program",
  "body": [
    {
      "type": "FunctionDeclaration",
      "id": {
        "type": "Identifier","name": "main"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "name": "c"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "body": [
          {
            "type": "VariableDeclaration",
            
            
            "declarations": [
              {
                "type": "VariableDeclarator",
                
                
                "id": {
                  "type": "Identifier",
                  
                  
                  "name": "a"
                },
                "init": {
                  "type": "Literal",
                  
                  
                  "value": 1,
                  "raw": "1"
                }
              }
            ],
            "kind": "var"
          },
          {
            "type": "VariableDeclaration",
            
            
            "declarations": [
              {
                "type": "VariableDeclarator",
                
                
                "id": {
                  "type": "Identifier",
                  
                  
                  "name": "b"
                },
                "init": {
                  "type": "Literal",
                  
                  
                  "value": 2,
                  "raw": "2"
                }
              }
            ],
            "kind": "var"
          },
          {
            "type": "ReturnStatement",
            
            
            "argument": {
              "type": "BinaryExpression",
              
              
              "left": {
                "type": "BinaryExpression",
                
                
                "left": {
                  "type": "Identifier",
                  
                  
                  "name": "a"
                },
                "operator": "+",
                "right": {
                  "type": "Identifier",
                  
                  
                  "name": "b"
                }
              },
              "operator": "+",
              "right": {
                "type": "Identifier",
                
                
                "name": "c"
              }
            }
          }
        ]
      }
    }
  ],
  "sourceType": "script"
};

// 本地代码测试
const code = `
  function main(c) {
    var a = 1;
    var b = 2;
    return a + b + c;
  }
`;

// 请求是否异常
describe('[getResource]', () => {
  it('[getResource] is response 200 and text is string', async () => {
    const response = await getResource('http://www.baidu.com', option);
    expect(typeof response).toContain('string');
    expect(response.length).toBeGreaterThan(0);
  });
});

// 格式化是否异常
describe('[ImportScript]', () => {
  it('[ImportScript] load local code is string to Ast', async () => {
    // 本地代码测试
    const code = `
      function main(c) {
        var a = 1;
        var b = 2;
        return a + b + c;
      }
    `;
    const [localAst] = await ImportScript([code], option);
    expect(localAst).toMatchObject(initAst);
  });

  it('[ImportScript] load local ast is string to Ast', async () => {
    const [localAst] = await ImportScript([initAst], option);
    expect(localAst).toMatchObject(initAst);
  });

  it('[ImportScript] load Promise code is string to Ast', async () => {
    const [localAst] = await ImportScript([
      // promise 对象加载
      new Promise(resolve => {
        setTimeout(() => {
          resolve(code);
        }, 200);
      })
    ], option);
    expect(localAst).toMatchObject(initAst);
  });

  it('[ImportScript] load null is string to Ast', async () => {
    const [localAst] = await ImportScript([null], option);
    expect(localAst).toMatchObject({});
  });
  
});

// 远程载入