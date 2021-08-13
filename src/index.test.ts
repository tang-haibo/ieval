// 本地用例测试
import {DocumentEval, EvalScript, iEval} from './index';
import request from 'request';

// 设置请求
DocumentEval.setNetwork(url => {
  return new Promise(resolve => request.get(url, (_error, _response, data) => {
    resolve(data);
  }));
});

function code() {
  return `
    function main() {
      return 10;
    }
  `;
}

function ast() {
  return {
    "type": "File",
    "start": 0,
    "end": 31,
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 3,
        "column": 1
      }
    },
    "errors": [],
    "program": {
      "type": "Program",
      "start": 0,
      "end": 31,
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 3,
          "column": 1
        }
      },
      "sourceType": "module",
      "interpreter": null,
      "body": [
        {
          "type": "FunctionDeclaration",
          "start": 0,
          "end": 31,
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 1
            }
          },
          "id": {
            "type": "Identifier",
            "start": 9,
            "end": 13,
            "loc": {
              "start": {
                "line": 1,
                "column": 9
              },
              "end": {
                "line": 1,
                "column": 13
              },
              "identifierName": "main"
            },
            "name": "main"
          },
          "generator": false,
          "async": false,
          "params": [],
          "body": {
            "type": "BlockStatement",
            "start": 16,
            "end": 31,
            "loc": {
              "start": {
                "line": 1,
                "column": 16
              },
              "end": {
                "line": 3,
                "column": 1
              }
            },
            "body": [
              {
                "type": "ReturnStatement",
                "start": 19,
                "end": 29,
                "loc": {
                  "start": {
                    "line": 2,
                    "column": 1
                  },
                  "end": {
                    "line": 2,
                    "column": 11
                  }
                },
                "argument": {
                  "type": "NumericLiteral",
                  "start": 26,
                  "end": 28,
                  "loc": {
                    "start": {
                      "line": 2,
                      "column": 8
                    },
                    "end": {
                      "line": 2,
                      "column": 10
                    }
                  },
                  "extra": {
                    "rawValue": 10,
                    "raw": "10"
                  },
                  "value": 10
                }
              }
            ],
            "directives": []
          }
        }
      ],
      "directives": []
    },
    "comments": []
  };
}

async function toBe(deval: DocumentEval) {
  const module = await deval.getWindow();
  expect(module.main()).toEqual(10);
}

describe('EvalScript', () => {
  it('EvalScript Run', () => {
    const ctx = EvalScript([code()], {});
    toBe(ctx as DocumentEval);
  });
});

describe("DocumentEval", () => {
  it('test DocumentEval loaded string', async () => {
    const dEval = new DocumentEval({});
    dEval.appendCode(code());
    await toBe(dEval);
  });
  it('test DocumentEval loaded ast', async () => {
    const dEval = new DocumentEval({});
    dEval.appendAst(ast() as any);
    await toBe(dEval);
  });

  it('test url', async () => {
    const dEval = new DocumentEval({});
    dEval.appendUrl('https://raw.githubusercontent.com/tang-haibo/ieval/master/example/main.js');
    await toBe(dEval);
  });
});

describe("iEval", () => {
  it('test eval', async () => {
    const dEval = iEval([
      code(),
      'https://raw.githubusercontent.com/tang-haibo/ieval/master/example/main.js',
      ast() as any,
    ], {});
    await toBe(dEval);
  });
  
  it('test eval null', async () => {
    iEval.setNetwork(null as any);
    expect(() => iEval(['https://raw.githubusercontent.com/tang-haibo/ieval/master/example/main.js'], {})).toThrow(Error);
  });
});