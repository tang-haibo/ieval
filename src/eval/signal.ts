/**
 * @author: Jrainlau
 * @desc: 判断、记录关键标记语句（return, break, continue）
 * 
 * @class
 */

 export class Signal {
  public type: any;
  public value: any;
  constructor (type: any, value: any) {
    this.type = type;
    this.value = value;
  }

  static Return (value: any) {
    return new Signal('return', value)
  }

  static Break (label = null) {
    return new Signal('break', label)
  }

  static Continue (label: any) {
    return new Signal('continue', label)
  }

  static isReturn(signal: any) {
    return signal instanceof Signal && signal.type === 'return'
  }

  static isContinue(signal: any) {
    return signal instanceof Signal && signal.type === 'continue'
  }

  static isBreak(signal: any) {
    return signal instanceof Signal && signal.type === 'break'
  }

  static isSignal (signal: any) {
    return signal instanceof Signal
  }
}