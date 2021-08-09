/**
 * @author Jrainlau
 * @desc 节点处理器，处理AST当中的节点
 */
import {Signal} from '../signal';
import {MemberValue} from '../value'; 

 export const es5: {[key: string]: any} = {
   Program (nodeIterator: any) {
     for (const node of nodeIterator.node.body) {
       nodeIterator.traverse(node)
     }
   },
   VariableDeclaration (nodeIterator: any) {
     const kind = nodeIterator.node.kind
     for (const declaration of nodeIterator.node.declarations) {
       const { name } = declaration.id
       const value = declaration.init ? nodeIterator.traverse(declaration.init) : undefined
       // 在作用域当中定义变量
       if (nodeIterator.scope.type === 'block' && kind === 'var') {
         nodeIterator.scope.parentScope.declare(name, value, kind)
       } else {
         nodeIterator.scope.declare(name, value, kind)
       }
     }
   },
   Identifier (nodeIterator: any) {
     if (nodeIterator.node.name === 'undefined') {
       return undefined
     }
     return nodeIterator.scope.get(nodeIterator.node.name).value
   },
   Literal (nodeIterator: any) {
     return nodeIterator.node.value
   },
 
   ExpressionStatement (nodeIterator: any) {
     return nodeIterator.traverse(nodeIterator.node.expression)
   },
   CallExpression (nodeIterator: any) {
     const func = nodeIterator.traverse(nodeIterator.node.callee)
     const args = nodeIterator.node.arguments.map((arg: any) => nodeIterator.traverse(arg))
 
     let value
     if (nodeIterator.node.callee.type === 'MemberExpression') {
       value = nodeIterator.traverse(nodeIterator.node.callee.object)
     }
     return func.apply(value, args)
   },
   MemberExpression (nodeIterator: any) {
     const obj = nodeIterator.traverse(nodeIterator.node.object)
     const name = nodeIterator.node.property.name
     return obj[name]
   },
   ObjectExpression (nodeIterator: any) {
     const obj: {[key: string]: any} = {}
     for (const prop of nodeIterator.node.properties) {
       let key
       if (prop.key.type === 'Literal') {
         key = `${prop.key.value}`
       } else if (prop.key.type === 'Identifier') {
         key = prop.key.name
       } else {
         throw new Error(`canjs: [ObjectExpression] Unsupported property key type "${prop.key.type}"`)
       }
       obj[key] = nodeIterator.traverse(prop.value)
     }
     return obj
   },
   ArrayExpression (nodeIterator: any) {
     return nodeIterator.node.elements.map((ele: any) => nodeIterator.traverse(ele))
   },
 
   BlockStatement (nodeIterator: any) {
     let scope = nodeIterator.createScope('block')
 
     // 处理块级节点内的每一个节点
     for (const node of nodeIterator.node.body) {
       if (node.type === 'FunctionDeclaration') {
         nodeIterator.traverse(node, { scope })
       } else if (node.type === 'VariableDeclaration' && node.kind === 'var') {
         for (const declaration of node.declarations) {
           if (declaration.init) {
             scope.declare(declaration.id.name, nodeIterator.traverse(declaration.init, { scope }), node.kind)
           } else {
             scope.declare(declaration.id.name, undefined, node.kind)
           }
         }
       }
     }
 
     // 提取关键字（return, break, continue）
     for (const node of nodeIterator.node.body) {
       if (node.type === 'FunctionDeclaration') {
         continue
       }
       const signal = nodeIterator.traverse(node, { scope })
       if (Signal.isSignal(signal)) {
         return signal
       }
     }
   },
   FunctionDeclaration (nodeIterator: any) {
     const fn = es5.FunctionExpression(nodeIterator)
     nodeIterator.scope.varDeclare(nodeIterator.node.id.name, fn)
     return fn    
   },
   FunctionExpression (nodeIterator: any) {
     const node = nodeIterator.node
     /**
      * 1、定义函数需要先为其定义一个函数作用域，且允许继承父级作用域
      * 2、注册`this`, `arguments`和形参到作用域的变量空间
      * 3、检查return关键字
      * 4、定义函数名和长度
      */
     const fn = function (...args: any[]) {
       const scope = nodeIterator.createScope('function')
       // @ts-ignore:next-line
       scope.constDeclare('this', this)
       scope.constDeclare('arguments', args)
       node.params.forEach((param: any, index: any) => {
         const name = param.name
         scope.varDeclare(name, args[index])
       })
 
       const signal = nodeIterator.traverse(node.body, { scope })
       if (Signal.isReturn(signal)) {
         return signal.value
       }
     }
 
     Object.defineProperties(fn, {
       name: { value: node.id ? node.id.name : '' },
       length: { value: node.params.length }
     })
 
     return fn;
   },
   ThisExpression (nodeIterator: any) {
     const value = nodeIterator.scope.get('this')
     return value ? value.value : null
   },
   NewExpression (nodeIterator: any) {
     const func = nodeIterator.traverse(nodeIterator.node.callee)
     const args = nodeIterator.node.arguments.map((arg: any) => nodeIterator.traverse(arg))
     return new (func.bind(null, ...args))
   },
 
   UpdateExpression (nodeIterator: any) {
     const { operator, prefix } = nodeIterator.node
     const { name } = nodeIterator.node.argument
     let val = nodeIterator.scope.get(name).value
 
     operator === "++" ? nodeIterator.scope.set(name, val + 1) : nodeIterator.scope.set(name, val - 1)
 
     if (operator === "++" && prefix) {
       return ++val
     } else if (operator === "++" && !prefix) {
       return val++
     } else if (operator === "--" && prefix) {
       return --val
     } else {
       return val--
     }
   },
   AssignmentExpressionOperatortraverseMap: {
     '=': (value: any, v: any) => value instanceof MemberValue ? value.obj[value.prop] = v : value.value = v,
     '+=': (value: any, v: any) => value instanceof MemberValue ? value.obj[value.prop] += v : value.value += v,
     '-=': (value: any, v: any) => value instanceof MemberValue ? value.obj[value.prop] -= v : value.value -= v,
     '*=': (value: any, v: any) => value instanceof MemberValue ? value.obj[value.prop] *= v : value.value *= v,
     '/=': (value: any, v: any) => value instanceof MemberValue ? value.obj[value.prop] /= v : value.value /= v,
     '%=': (value: any, v: any) => value instanceof MemberValue ? value.obj[value.prop] %= v : value.value %= v,
     '**=': () => { throw new Error('canjs: es5 doen\'t supports operator "**=') },
     '<<=': (value: any, v: any) => value instanceof MemberValue ? value.obj[value.prop] <<= v : value.value <<= v,
     '>>=': (value: any, v: any) => value instanceof MemberValue ? value.obj[value.prop] >>= v : value.value >>= v,
     '>>>=': (value: any, v: any) => value instanceof MemberValue ? value.obj[value.prop] >>>= v : value.value >>>= v,
     '|=': (value: any, v: any) => value instanceof MemberValue ? value.obj[value.prop] |= v : value.value |= v,
     '^=': (value: any, v: any) => value instanceof MemberValue ? value.obj[value.prop] ^= v : value.value ^= v,
     '&=': (value: any, v: any) => value instanceof MemberValue ? value.obj[value.prop] &= v : value.value &= v
   },
   AssignmentExpression (nodeIterator: any) {
     const node = nodeIterator.node
     const value = getIdentifierOrMemberExpressionValue(node.left, nodeIterator)
     return es5.AssignmentExpressionOperatortraverseMap[node.operator](value, nodeIterator.traverse(node.right))
   },
   UnaryExpressionOperatortraverseMap: {
     '-': (nodeIterator: any) => -nodeIterator.traverse(nodeIterator.node.argument),
     '+': (nodeIterator: any) => +nodeIterator.traverse(nodeIterator.node.argument),
     '!': (nodeIterator: any) => !nodeIterator.traverse(nodeIterator.node.argument),
     '~': (nodeIterator: any) => ~nodeIterator.traverse(nodeIterator.node.argument),
     'typeof': (nodeIterator: any) => {
       if (nodeIterator.node.argument.type === 'Identifier') {
         try {
           const value = nodeIterator.scope.get(nodeIterator.node.argument.name)
           return value ? typeof value.value : 'undefined'
         } catch (err) {
           if (err.message === `${nodeIterator.node.argument.name} is not defined`) {
             return 'undefined'
           } else {
             throw err
           }
         }
       } else {
         return typeof nodeIterator.traverse(nodeIterator.node.argument)
       }
     },
     'void': (nodeIterator: any) => void nodeIterator.traverse(nodeIterator.node.argument),
     'delete': (nodeIterator: any) => {
       const argument = nodeIterator.node.argument
       if (argument.type === 'MemberExpression') {
         const obj = nodeIterator.traverse(argument.object)
         const name = getPropertyName(argument, nodeIterator)
         return delete obj[name]
       } else if (argument.type === 'Identifier') {
         return false
       } else if (argument.type === 'Literal') {
         return true
       }
     }
   },
   UnaryExpression (nodeIterator: any) {
     return es5.UnaryExpressionOperatortraverseMap[nodeIterator.node.operator](nodeIterator)
   },
   BinaryExpressionOperatortraverseMap: {
     '==': (a: any, b: any) => a == b,
     '!=': (a: any, b: any) => a != b,
     '===': (a: any, b: any) => a === b,
     '!==': (a: any, b: any) => a !== b,
     '<': (a: any, b: any) => a < b,
     '<=': (a: any, b: any) => a <= b,
     '>': (a: any, b: any) => a > b,
     '>=': (a: any, b: any) => a >= b,
     '<<': (a: any, b: any) => a << b,
     '>>': (a: any, b: any) => a >> b,
     '>>>': (a: any, b: any) => a >>> b,
     '+': (a: any, b: any) => a + b,
     '-': (a: any, b: any) => a - b,
     '*': (a: any, b: any) => a * b,
     '/': (a: any, b: any) => a / b,
     '%': (a: any, b: any) => a % b,
     '**': (a: any, b: any) => { throw new Error('canjs: es5 doesn\'t supports operator "**"') },
     '|': (a: any, b: any) => a | b,
     '^': (a: any, b: any) => a ^ b,
     '&': (a: any, b: any) => a & b,
     'in': (a: any, b: any) => a in b,
     'instanceof': (a: any, b: any) => a instanceof b
   },
   BinaryExpression (nodeIterator: any) {
     const a = nodeIterator.traverse(nodeIterator.node.left)
     const b = nodeIterator.traverse(nodeIterator.node.right)
     return es5.BinaryExpressionOperatortraverseMap[nodeIterator.node.operator](a, b)
   },
   LogicalExpressionOperatortraverseMap: {
     '||': (a: any, b: any) => a || b,
     '&&': (a: any, b: any) => a && b
   },
   LogicalExpression (nodeIterator: any) {
     const a = nodeIterator.traverse(nodeIterator.node.left)
     if (a) {
       if (nodeIterator.node.operator == '||') {
         return true;
       }
     }
     else if (nodeIterator.node.operator == '&&') {
       return false;
     }
     
     const b = nodeIterator.traverse(nodeIterator.node.right)
     return es5.LogicalExpressionOperatortraverseMap[nodeIterator.node.operator](a, b)
   },
 
   ForStatement (nodeIterator: any) {
     const node = nodeIterator.node
     let scope = nodeIterator.scope
     if (node.init && node.init.type === 'VariableDeclaration' && node.init.kind !== 'var') {
       scope = nodeIterator.createScope('block')
     }
 
     for (
       node.init && nodeIterator.traverse(node.init, { scope });
       node.test ? nodeIterator.traverse(node.test, { scope }) : true;
       node.update && nodeIterator.traverse(node.update, { scope })
     ) {
       const signal = nodeIterator.traverse(node.body, { scope })
       
       if (Signal.isBreak(signal)) {
         break
       } else if (Signal.isContinue(signal)) {
         continue
       } else if (Signal.isReturn(signal)) {
         return signal
       }
     }
   },
   ForInStatement (nodeIterator: any) {
     const { left, right, body } = nodeIterator.node
     let scope = nodeIterator.scope
 
     let value
     if (left.type === 'VariableDeclaration') {
       const id = left.declarations[0].id
       value = scope.declare(id.name, undefined, left.kind)
     } else if (left.type === 'Identifier') {
       value = scope.get(left.name, true)
     } else {
       throw new Error(`canjs: [ForInStatement] Unsupported left type "${left.type}"`)
     }
 
     for (const key in nodeIterator.traverse(right)) {
       value.value = key
       const signal = nodeIterator.traverse(body, { scope })
 
       if (Signal.isBreak(signal)) {
         break
       } else if (Signal.isContinue(signal)) {
         continue
       } else if (Signal.isReturn(signal)) {
         return signal
       }
     }
   },
   WhileStatement (nodeIterator: any) {
     while (nodeIterator.traverse(nodeIterator.node.test)) {
       const signal = nodeIterator.traverse(nodeIterator.node.body)
       
       if (Signal.isBreak(signal)) {
         break
       } else if (Signal.isContinue(signal)) {
         continue
       } else if (Signal.isReturn(signal)) {
         return signal
       }
     }
   },
   DoWhileStatement (nodeIterator: any) {
     do {
       const signal = nodeIterator.traverse(nodeIterator.node.body)
       
       if (Signal.isBreak(signal)) {
         break
       } else if (Signal.isContinue(signal)) {
         continue
       } else if (Signal.isReturn(signal)) {
         return signal
       }
     } while (nodeIterator.traverse(nodeIterator.node.test))
   },
 
   ReturnStatement (nodeIterator: any) {
     let value
     if (nodeIterator.node.argument) {
       value = nodeIterator.traverse(nodeIterator.node.argument)
     }
     return Signal.Return(value)
   },
   BreakStatement (nodeIterator: any) {
     let label
     if (nodeIterator.node.label) {
       label = nodeIterator.node.label.name
     }
     return Signal.Break(label)
   },
   ContinueStatement (nodeIterator: any) {
     let label
     if (nodeIterator.node.label) {
       label = nodeIterator.node.label.name
     }
     return Signal.Continue(label)
   },
 
   IfStatement (nodeIterator: any) {
     if (nodeIterator.traverse(nodeIterator.node.test)) {
       return nodeIterator.traverse(nodeIterator.node.consequent)
     } else if (nodeIterator.node.alternate) {
       return nodeIterator.traverse(nodeIterator.node.alternate)
     }
   },
   SwitchStatement (nodeIterator: any) {
     const discriminant = nodeIterator.traverse(nodeIterator.node.discriminant)
     
     for (const theCase of nodeIterator.node.cases) {
       if (!theCase.test || discriminant === nodeIterator.traverse(theCase.test)) {
         const signal = nodeIterator.traverse(theCase)
 
         if (Signal.isBreak(signal)) {
           break
         } else if (Signal.isContinue(signal)) {
           continue
         } else if (Signal.isReturn(signal)) {
           return signal
         }
       }
     }
   },
   SwitchCase (nodeIterator: any) {
     for (const node of nodeIterator.node.consequent) {
       const signal = nodeIterator.traverse(node)
       if (Signal.isSignal(signal)) {
         return signal
       }
     }
   },
   ConditionalExpression (nodeIterator: any) {
     return nodeIterator.traverse(nodeIterator.node.test)
       ? nodeIterator.traverse(nodeIterator.node.consequent)
       : nodeIterator.traverse(nodeIterator.node.alternate)
   },
 
   ThrowStatement(nodeIterator: any) {
     throw nodeIterator.traverse(nodeIterator.node.argument)
   },
   TryStatement(nodeIterator: any) {
     const { block, handler, finalizer } = nodeIterator.node
     try {
       return nodeIterator.traverse(block)
     } catch (err) {
       if (handler) {
         const param = handler.param
         const scope = nodeIterator.createScope('block')
         scope.letDeclare(param.name, err)
         return nodeIterator.traverse(handler, { scope })
       }
       throw err
     } finally {
       if (finalizer) {
         return nodeIterator.traverse(finalizer)
       }
     }
   },
   CatchClause(nodeIterator: any) {
     return nodeIterator.traverse(nodeIterator.node.body);
   }
 }
 
 function getPropertyName (node: any, nodeIterator: any) {
   if (node.computed) {
     return nodeIterator.traverse(node.property)
   } else {
     return node.property.name
   }
 }
 
 function getIdentifierOrMemberExpressionValue(node: any, nodeIterator: any) {
   if (node.type === 'Identifier') {
     return nodeIterator.scope.get(node.name)
   } else if (node.type === 'MemberExpression') {
     const obj = nodeIterator.traverse(node.object)
     const name = getPropertyName(node, nodeIterator)
     return new MemberValue(obj, name)
   } else {
     throw new Error(`canjs: Not support to get value of node type "${node.type}"`)
   }
 }