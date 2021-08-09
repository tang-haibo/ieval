enum readyStatus {
  UNSENT = 0,
  OPENED = 1,
  HEADERS_RECEIVED = 2,
  LOADING = 3,
  DONE = 4,
}
enum XMLHttpRequestResponseType {
  arraybuffer = 'arraybuffer',
  blob = 'blob',
  document = 'document',
  json = 'json',
  text = 'text',
  msStream = 'ms-stream',
}
export class XMLHttpRequest {
  public onreadystatechange: ((this: XMLHttpRequest, ev: any) => any) | null = null;
  /**
   * Returns client's state.
   */
  public readonly readyState: readyStatus = readyStatus.UNSENT;
  public readonly DONE: number = readyStatus.DONE;
  public readonly LOADING: number = readyStatus.LOADING;
  public readonly HEADERS_RECEIVED: number = readyStatus.HEADERS_RECEIVED;
  public readonly OPENED: number = readyStatus.OPENED;
  public readonly UNSENT: number = readyStatus.UNSENT;
  /**
   * Returns the response's body.
   */
  private readonly response: any;
  /**
   * Returns the text response.
   *
   * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "text".
   */
  private responseText: string = '';
  /**
   * Returns the response type.
   *
   * Can be set to change the response type. Values are: the empty string (default), "arraybuffer", "blob", "document", "json", and "text".
   *
   * When set: setting to "document" is ignored if current global object is not a Window object.
   *
   * When set: throws an "InvalidStateError" DOMException if state is loading or done.
   *
   * When set: throws an "InvalidAccessError" DOMException if the synchronous flag is set and current global object is a Window object.
   */
  public responseType: XMLHttpRequestResponseType = XMLHttpRequestResponseType.document;
  public responseURL: string = '';
  public status: number = 0;
  public statusText: string = '';
  /**
   * Can be set to a time in milliseconds. When set to a non-zero value will cause fetching to terminate after the given time has passed. When the time has passed, the request has not yet completed, and the synchronous flag is unset, a timeout event will then be dispatched, or a "TimeoutError" DOMException will be thrown otherwise (for the send() method).
   *
   * When set: throws an "InvalidAccessError" DOMException if the synchronous flag is set and current global object is a Window object.
   */
  public timeout: number = 60 * 1000;
  /**
   * Returns the associated XMLHttpRequestUpload object. It can be used to gather transmission information when data is transferred to a server.
   */
  public upload: any;
  /**
   * True when credentials are to be included in a cross-origin request. False when they are to be excluded in a cross-origin request and when cookies are to be ignored in its response. Initially false.
   *
   * When set: throws an "InvalidStateError" DOMException if state is not unsent or opened, or if the send() flag is set.
   */
  public withCredentials: boolean = true;
  /**
   * Cancels any network activity.
   */
  public abort() {

  };
  public getAllResponseHeaders() {

  };
  public getResponseHeader(name: string) {};
  public open(method: string, url: string, async: boolean, username?: string | null, password?: string | null) {

  };
  /**
   * Acts as if the `Content-Type` header value for response is mime. (It does not actually change the header though.)
   *
   * Throws an "InvalidStateError" DOMException if state is loading or done.
   */
  public overrideMimeType(mime: string) {

  };
  /**
   * Initiates the request. The body argument provides the request body, if any, and is ignored if the request method is GET or HEAD.
   *
   * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
   */
  public send(body?: any) {};
  /**
   * Combines a header in author request headers.
   *
   * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
   *
   * Throws a "SyntaxError" DOMException if name is not a header name or if value is not a header value.
   */
  public setRequestHeader(name: string, value: string): void {

  };
  public addEventListener(type: string, listener: (this: XMLHttpRequest, ev: any) => any, options?: boolean): void {

  };
  public removeEventListener(type: string, listener: () => void, options?: boolean): void {

  };  
}
