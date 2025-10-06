globalThis.process ??= {}; globalThis.process.env ??= {};
import require$$0 from 'events';
import { r as requireExtend } from '../../chunks/___vite-browser-external_commonjs-proxy_CHC0ZYlW.mjs';
import { r as requireDist$1, a as requireStreamEvents, b as requireSrc$8, c as requireCommonjs } from '../../chunks/index_BQJTOnRy.mjs';
import { r as requireSrc$9 } from '../../chunks/index_DPBGxmkZ.mjs';
import { r as requireRetryRequest } from '../../chunks/index_c6Gw9JJj.mjs';
import require$$0$4 from 'stream';
import require$$0$2 from 'http';
import require$$1$1 from 'https';
import require$$2 from 'url';
import require$$0$1 from 'net';
import require$$1 from 'tls';
import require$$3 from 'assert';
import { r as requireBrowser } from '../../chunks/browser_BjZVrPyk.mjs';
import require$$0$3 from 'crypto';
import require$$1$2 from 'querystring';
import { r as requireDuplexify } from '../../chunks/index_C9J82TKw.mjs';
import require$$3$1 from 'util';
import require$$0$5 from 'fs';
import require$$3$2 from 'path';
export { r as renderers } from '../../chunks/_@astro-renderers_CsfOuLCA.mjs';

var src$7 = {};

var bigquery$1 = {};

var src$6 = {};

var operation = {};

var serviceObject = {};

var src$5 = {};

var hasRequiredSrc$7;

function requireSrc$7 () {
	if (hasRequiredSrc$7) return src$5;
	hasRequiredSrc$7 = 1;
	(function (exports) {
		/* eslint-disable prefer-rest-params */
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.promisify = promisify;
		exports.promisifyAll = promisifyAll;
		exports.callbackify = callbackify;
		exports.callbackifyAll = callbackifyAll;
		/**
		 * Wraps a callback style function to conditionally return a promise.
		 *
		 * @param {function} originalMethod - The method to promisify.
		 * @param {object=} options - Promise options.
		 * @param {boolean} options.singular - Resolve the promise with single arg instead of an array.
		 * @return {function} wrapped
		 */
		function promisify(originalMethod, options) {
		    if (originalMethod.promisified_) {
		        return originalMethod;
		    }
		    options = options || {};
		    const slice = Array.prototype.slice;
		    // tslint:disable-next-line:no-any
		    const wrapper = function () {
		        let last;
		        for (last = arguments.length - 1; last >= 0; last--) {
		            const arg = arguments[last];
		            if (typeof arg === 'undefined') {
		                continue; // skip trailing undefined.
		            }
		            if (typeof arg !== 'function') {
		                break; // non-callback last argument found.
		            }
		            return originalMethod.apply(this, arguments);
		        }
		        // peel trailing undefined.
		        const args = slice.call(arguments, 0, last + 1);
		        // tslint:disable-next-line:variable-name
		        let PromiseCtor = Promise;
		        // Because dedupe will likely create a single install of
		        // @google-cloud/common to be shared amongst all modules, we need to
		        // localize it at the Service level.
		        if (this && this.Promise) {
		            PromiseCtor = this.Promise;
		        }
		        return new PromiseCtor((resolve, reject) => {
		            // tslint:disable-next-line:no-any
		            args.push((...args) => {
		                const callbackArgs = slice.call(args);
		                const err = callbackArgs.shift();
		                if (err) {
		                    return reject(err);
		                }
		                if (options.singular && callbackArgs.length === 1) {
		                    resolve(callbackArgs[0]);
		                }
		                else {
		                    resolve(callbackArgs);
		                }
		            });
		            originalMethod.apply(this, args);
		        });
		    };
		    wrapper.promisified_ = true;
		    return wrapper;
		}
		/**
		 * Promisifies certain Class methods. This will not promisify private or
		 * streaming methods.
		 *
		 * @param {module:common/service} Class - Service class.
		 * @param {object=} options - Configuration object.
		 */
		// tslint:disable-next-line:variable-name
		function promisifyAll(Class, options) {
		    const exclude = (options && options.exclude) || [];
		    const ownPropertyNames = Object.getOwnPropertyNames(Class.prototype);
		    const methods = ownPropertyNames.filter(methodName => {
		        // clang-format off
		        return (!exclude.includes(methodName) &&
		            typeof Class.prototype[methodName] === 'function' && // is it a function?
		            !/(^_|(Stream|_)|promise$)|^constructor$/.test(methodName) // is it promisable?
		        );
		        // clang-format on
		    });
		    methods.forEach(methodName => {
		        const originalMethod = Class.prototype[methodName];
		        if (!originalMethod.promisified_) {
		            Class.prototype[methodName] = exports.promisify(originalMethod, options);
		        }
		    });
		}
		/**
		 * Wraps a promisy type function to conditionally call a callback function.
		 *
		 * @param {function} originalMethod - The method to callbackify.
		 * @param {object=} options - Callback options.
		 * @param {boolean} options.singular - Pass to the callback a single arg instead of an array.
		 * @return {function} wrapped
		 */
		function callbackify(originalMethod) {
		    if (originalMethod.callbackified_) {
		        return originalMethod;
		    }
		    // tslint:disable-next-line:no-any
		    const wrapper = function () {
		        if (typeof arguments[arguments.length - 1] !== 'function') {
		            return originalMethod.apply(this, arguments);
		        }
		        const cb = Array.prototype.pop.call(arguments);
		        originalMethod.apply(this, arguments).then(
		        // tslint:disable-next-line:no-any
		        (res) => {
		            res = Array.isArray(res) ? res : [res];
		            cb(null, ...res);
		        }, (err) => cb(err));
		    };
		    wrapper.callbackified_ = true;
		    return wrapper;
		}
		/**
		 * Callbackifies certain Class methods. This will not callbackify private or
		 * streaming methods.
		 *
		 * @param {module:common/service} Class - Service class.
		 * @param {object=} options - Configuration object.
		 */
		function callbackifyAll(
		// tslint:disable-next-line:variable-name
		Class, options) {
		    const exclude = (options && options.exclude) || [];
		    const ownPropertyNames = Object.getOwnPropertyNames(Class.prototype);
		    const methods = ownPropertyNames.filter(methodName => {
		        // clang-format off
		        return (!exclude.includes(methodName) &&
		            typeof Class.prototype[methodName] === 'function' && // is it a function?
		            !/^_|(Stream|_)|^constructor$/.test(methodName) // is it callbackifyable?
		        );
		        // clang-format on
		    });
		    methods.forEach(methodName => {
		        const originalMethod = Class.prototype[methodName];
		        if (!originalMethod.callbackified_) {
		            Class.prototype[methodName] = exports.callbackify(originalMethod);
		        }
		    });
		}
		
	} (src$5));
	return src$5;
}

var arrify_1;
var hasRequiredArrify;

function requireArrify () {
	if (hasRequiredArrify) return arrify_1;
	hasRequiredArrify = 1;

	const arrify = value => {
		if (value === null || value === undefined) {
			return [];
		}

		if (Array.isArray(value)) {
			return value;
		}

		if (typeof value === 'string') {
			return [value];
		}

		if (typeof value[Symbol.iterator] === 'function') {
			return [...value];
		}

		return [value];
	};

	arrify_1 = arrify;
	return arrify_1;
}

var util$1 = {};

var src$4 = {};

var agents = {};

var agent = {};

var promisify = {};

var hasRequiredPromisify;

function requirePromisify () {
	if (hasRequiredPromisify) return promisify;
	hasRequiredPromisify = 1;
	Object.defineProperty(promisify, "__esModule", { value: true });
	function promisify$1(fn) {
	    return function (req, opts) {
	        return new Promise((resolve, reject) => {
	            fn.call(this, req, opts, (err, rtn) => {
	                if (err) {
	                    reject(err);
	                }
	                else {
	                    resolve(rtn);
	                }
	            });
	        });
	    };
	}
	promisify.default = promisify$1;
	
	return promisify;
}

var src$3;
var hasRequiredSrc$6;

function requireSrc$6 () {
	if (hasRequiredSrc$6) return src$3;
	hasRequiredSrc$6 = 1;
	var __importDefault = (src$3 && src$3.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	const events_1 = require$$0;
	const debug_1 = __importDefault(requireBrowser());
	const promisify_1 = __importDefault(requirePromisify());
	const debug = debug_1.default('agent-base');
	function isAgent(v) {
	    return Boolean(v) && typeof v.addRequest === 'function';
	}
	function isSecureEndpoint() {
	    const { stack } = new Error();
	    if (typeof stack !== 'string')
	        return false;
	    return stack.split('\n').some(l => l.indexOf('(https.js:') !== -1 || l.indexOf('node:https:') !== -1);
	}
	function createAgent(callback, opts) {
	    return new createAgent.Agent(callback, opts);
	}
	(function (createAgent) {
	    /**
	     * Base `http.Agent` implementation.
	     * No pooling/keep-alive is implemented by default.
	     *
	     * @param {Function} callback
	     * @api public
	     */
	    class Agent extends events_1.EventEmitter {
	        constructor(callback, _opts) {
	            super();
	            let opts = _opts;
	            if (typeof callback === 'function') {
	                this.callback = callback;
	            }
	            else if (callback) {
	                opts = callback;
	            }
	            // Timeout for the socket to be returned from the callback
	            this.timeout = null;
	            if (opts && typeof opts.timeout === 'number') {
	                this.timeout = opts.timeout;
	            }
	            // These aren't actually used by `agent-base`, but are required
	            // for the TypeScript definition files in `@types/node` :/
	            this.maxFreeSockets = 1;
	            this.maxSockets = 1;
	            this.maxTotalSockets = Infinity;
	            this.sockets = {};
	            this.freeSockets = {};
	            this.requests = {};
	            this.options = {};
	        }
	        get defaultPort() {
	            if (typeof this.explicitDefaultPort === 'number') {
	                return this.explicitDefaultPort;
	            }
	            return isSecureEndpoint() ? 443 : 80;
	        }
	        set defaultPort(v) {
	            this.explicitDefaultPort = v;
	        }
	        get protocol() {
	            if (typeof this.explicitProtocol === 'string') {
	                return this.explicitProtocol;
	            }
	            return isSecureEndpoint() ? 'https:' : 'http:';
	        }
	        set protocol(v) {
	            this.explicitProtocol = v;
	        }
	        callback(req, opts, fn) {
	            throw new Error('"agent-base" has no default implementation, you must subclass and override `callback()`');
	        }
	        /**
	         * Called by node-core's "_http_client.js" module when creating
	         * a new HTTP request with this Agent instance.
	         *
	         * @api public
	         */
	        addRequest(req, _opts) {
	            const opts = Object.assign({}, _opts);
	            if (typeof opts.secureEndpoint !== 'boolean') {
	                opts.secureEndpoint = isSecureEndpoint();
	            }
	            if (opts.host == null) {
	                opts.host = 'localhost';
	            }
	            if (opts.port == null) {
	                opts.port = opts.secureEndpoint ? 443 : 80;
	            }
	            if (opts.protocol == null) {
	                opts.protocol = opts.secureEndpoint ? 'https:' : 'http:';
	            }
	            if (opts.host && opts.path) {
	                // If both a `host` and `path` are specified then it's most
	                // likely the result of a `url.parse()` call... we need to
	                // remove the `path` portion so that `net.connect()` doesn't
	                // attempt to open that as a unix socket file.
	                delete opts.path;
	            }
	            delete opts.agent;
	            delete opts.hostname;
	            delete opts._defaultAgent;
	            delete opts.defaultPort;
	            delete opts.createConnection;
	            // Hint to use "Connection: close"
	            // XXX: non-documented `http` module API :(
	            req._last = true;
	            req.shouldKeepAlive = false;
	            let timedOut = false;
	            let timeoutId = null;
	            const timeoutMs = opts.timeout || this.timeout;
	            const onerror = (err) => {
	                if (req._hadError)
	                    return;
	                req.emit('error', err);
	                // For Safety. Some additional errors might fire later on
	                // and we need to make sure we don't double-fire the error event.
	                req._hadError = true;
	            };
	            const ontimeout = () => {
	                timeoutId = null;
	                timedOut = true;
	                const err = new Error(`A "socket" was not created for HTTP request before ${timeoutMs}ms`);
	                err.code = 'ETIMEOUT';
	                onerror(err);
	            };
	            const callbackError = (err) => {
	                if (timedOut)
	                    return;
	                if (timeoutId !== null) {
	                    clearTimeout(timeoutId);
	                    timeoutId = null;
	                }
	                onerror(err);
	            };
	            const onsocket = (socket) => {
	                if (timedOut)
	                    return;
	                if (timeoutId != null) {
	                    clearTimeout(timeoutId);
	                    timeoutId = null;
	                }
	                if (isAgent(socket)) {
	                    // `socket` is actually an `http.Agent` instance, so
	                    // relinquish responsibility for this `req` to the Agent
	                    // from here on
	                    debug('Callback returned another Agent instance %o', socket.constructor.name);
	                    socket.addRequest(req, opts);
	                    return;
	                }
	                if (socket) {
	                    socket.once('free', () => {
	                        this.freeSocket(socket, opts);
	                    });
	                    req.onSocket(socket);
	                    return;
	                }
	                const err = new Error(`no Duplex stream was returned to agent-base for \`${req.method} ${req.path}\``);
	                onerror(err);
	            };
	            if (typeof this.callback !== 'function') {
	                onerror(new Error('`callback` is not defined'));
	                return;
	            }
	            if (!this.promisifiedCallback) {
	                if (this.callback.length >= 3) {
	                    debug('Converting legacy callback function to promise');
	                    this.promisifiedCallback = promisify_1.default(this.callback);
	                }
	                else {
	                    this.promisifiedCallback = this.callback;
	                }
	            }
	            if (typeof timeoutMs === 'number' && timeoutMs > 0) {
	                timeoutId = setTimeout(ontimeout, timeoutMs);
	            }
	            if ('port' in opts && typeof opts.port !== 'number') {
	                opts.port = Number(opts.port);
	            }
	            try {
	                debug('Resolving socket for %o request: %o', opts.protocol, `${req.method} ${req.path}`);
	                Promise.resolve(this.promisifiedCallback(req, opts)).then(onsocket, callbackError);
	            }
	            catch (err) {
	                Promise.reject(err).catch(callbackError);
	            }
	        }
	        freeSocket(socket, opts) {
	            debug('Freeing socket %o %o', socket.constructor.name, opts);
	            socket.destroy();
	        }
	        destroy() {
	            debug('Destroying agent %o', this.constructor.name);
	        }
	    }
	    createAgent.Agent = Agent;
	    // So that `instanceof` works correctly
	    createAgent.prototype = createAgent.Agent.prototype;
	})(createAgent || (createAgent = {}));
	src$3 = createAgent;
	
	return src$3;
}

var parseProxyResponse = {};

var hasRequiredParseProxyResponse;

function requireParseProxyResponse () {
	if (hasRequiredParseProxyResponse) return parseProxyResponse;
	hasRequiredParseProxyResponse = 1;
	var __importDefault = (parseProxyResponse && parseProxyResponse.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(parseProxyResponse, "__esModule", { value: true });
	const debug_1 = __importDefault(requireBrowser());
	const debug = debug_1.default('https-proxy-agent:parse-proxy-response');
	function parseProxyResponse$1(socket) {
	    return new Promise((resolve, reject) => {
	        // we need to buffer any HTTP traffic that happens with the proxy before we get
	        // the CONNECT response, so that if the response is anything other than an "200"
	        // response code, then we can re-play the "data" events on the socket once the
	        // HTTP parser is hooked up...
	        let buffersLength = 0;
	        const buffers = [];
	        function read() {
	            const b = socket.read();
	            if (b)
	                ondata(b);
	            else
	                socket.once('readable', read);
	        }
	        function cleanup() {
	            socket.removeListener('end', onend);
	            socket.removeListener('error', onerror);
	            socket.removeListener('close', onclose);
	            socket.removeListener('readable', read);
	        }
	        function onclose(err) {
	            debug('onclose had error %o', err);
	        }
	        function onend() {
	            debug('onend');
	        }
	        function onerror(err) {
	            cleanup();
	            debug('onerror %o', err);
	            reject(err);
	        }
	        function ondata(b) {
	            buffers.push(b);
	            buffersLength += b.length;
	            const buffered = Buffer.concat(buffers, buffersLength);
	            const endOfHeaders = buffered.indexOf('\r\n\r\n');
	            if (endOfHeaders === -1) {
	                // keep buffering
	                debug('have not received end of HTTP headers yet...');
	                read();
	                return;
	            }
	            const firstLine = buffered.toString('ascii', 0, buffered.indexOf('\r\n'));
	            const statusCode = +firstLine.split(' ')[1];
	            debug('got proxy server response: %o', firstLine);
	            resolve({
	                statusCode,
	                buffered
	            });
	        }
	        socket.on('error', onerror);
	        socket.on('close', onclose);
	        socket.on('end', onend);
	        read();
	    });
	}
	parseProxyResponse.default = parseProxyResponse$1;
	
	return parseProxyResponse;
}

var hasRequiredAgent;

function requireAgent () {
	if (hasRequiredAgent) return agent;
	hasRequiredAgent = 1;
	var __awaiter = (agent && agent.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __importDefault = (agent && agent.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(agent, "__esModule", { value: true });
	const net_1 = __importDefault(require$$0$1);
	const tls_1 = __importDefault(require$$1);
	const url_1 = __importDefault(require$$2);
	const assert_1 = __importDefault(require$$3);
	const debug_1 = __importDefault(requireBrowser());
	const agent_base_1 = requireSrc$6();
	const parse_proxy_response_1 = __importDefault(requireParseProxyResponse());
	const debug = debug_1.default('https-proxy-agent:agent');
	/**
	 * The `HttpsProxyAgent` implements an HTTP Agent subclass that connects to
	 * the specified "HTTP(s) proxy server" in order to proxy HTTPS requests.
	 *
	 * Outgoing HTTP requests are first tunneled through the proxy server using the
	 * `CONNECT` HTTP request method to establish a connection to the proxy server,
	 * and then the proxy server connects to the destination target and issues the
	 * HTTP request from the proxy server.
	 *
	 * `https:` requests have their socket connection upgraded to TLS once
	 * the connection to the proxy server has been established.
	 *
	 * @api public
	 */
	class HttpsProxyAgent extends agent_base_1.Agent {
	    constructor(_opts) {
	        let opts;
	        if (typeof _opts === 'string') {
	            opts = url_1.default.parse(_opts);
	        }
	        else {
	            opts = _opts;
	        }
	        if (!opts) {
	            throw new Error('an HTTP(S) proxy server `host` and `port` must be specified!');
	        }
	        debug('creating new HttpsProxyAgent instance: %o', opts);
	        super(opts);
	        const proxy = Object.assign({}, opts);
	        // If `true`, then connect to the proxy server over TLS.
	        // Defaults to `false`.
	        this.secureProxy = opts.secureProxy || isHTTPS(proxy.protocol);
	        // Prefer `hostname` over `host`, and set the `port` if needed.
	        proxy.host = proxy.hostname || proxy.host;
	        if (typeof proxy.port === 'string') {
	            proxy.port = parseInt(proxy.port, 10);
	        }
	        if (!proxy.port && proxy.host) {
	            proxy.port = this.secureProxy ? 443 : 80;
	        }
	        // ALPN is supported by Node.js >= v5.
	        // attempt to negotiate http/1.1 for proxy servers that support http/2
	        if (this.secureProxy && !('ALPNProtocols' in proxy)) {
	            proxy.ALPNProtocols = ['http 1.1'];
	        }
	        if (proxy.host && proxy.path) {
	            // If both a `host` and `path` are specified then it's most likely
	            // the result of a `url.parse()` call... we need to remove the
	            // `path` portion so that `net.connect()` doesn't attempt to open
	            // that as a Unix socket file.
	            delete proxy.path;
	            delete proxy.pathname;
	        }
	        this.proxy = proxy;
	    }
	    /**
	     * Called when the node-core HTTP client library is creating a
	     * new HTTP request.
	     *
	     * @api protected
	     */
	    callback(req, opts) {
	        return __awaiter(this, void 0, void 0, function* () {
	            const { proxy, secureProxy } = this;
	            // Create a socket connection to the proxy server.
	            let socket;
	            if (secureProxy) {
	                debug('Creating `tls.Socket`: %o', proxy);
	                socket = tls_1.default.connect(proxy);
	            }
	            else {
	                debug('Creating `net.Socket`: %o', proxy);
	                socket = net_1.default.connect(proxy);
	            }
	            const headers = Object.assign({}, proxy.headers);
	            const hostname = `${opts.host}:${opts.port}`;
	            let payload = `CONNECT ${hostname} HTTP/1.1\r\n`;
	            // Inject the `Proxy-Authorization` header if necessary.
	            if (proxy.auth) {
	                headers['Proxy-Authorization'] = `Basic ${Buffer.from(proxy.auth).toString('base64')}`;
	            }
	            // The `Host` header should only include the port
	            // number when it is not the default port.
	            let { host, port, secureEndpoint } = opts;
	            if (!isDefaultPort(port, secureEndpoint)) {
	                host += `:${port}`;
	            }
	            headers.Host = host;
	            headers.Connection = 'close';
	            for (const name of Object.keys(headers)) {
	                payload += `${name}: ${headers[name]}\r\n`;
	            }
	            const proxyResponsePromise = parse_proxy_response_1.default(socket);
	            socket.write(`${payload}\r\n`);
	            const { statusCode, buffered } = yield proxyResponsePromise;
	            if (statusCode === 200) {
	                req.once('socket', resume);
	                if (opts.secureEndpoint) {
	                    // The proxy is connecting to a TLS server, so upgrade
	                    // this socket connection to a TLS connection.
	                    debug('Upgrading socket connection to TLS');
	                    const servername = opts.servername || opts.host;
	                    return tls_1.default.connect(Object.assign(Object.assign({}, omit(opts, 'host', 'hostname', 'path', 'port')), { socket,
	                        servername }));
	                }
	                return socket;
	            }
	            // Some other status code that's not 200... need to re-play the HTTP
	            // header "data" events onto the socket once the HTTP machinery is
	            // attached so that the node core `http` can parse and handle the
	            // error status code.
	            // Close the original socket, and a new "fake" socket is returned
	            // instead, so that the proxy doesn't get the HTTP request
	            // written to it (which may contain `Authorization` headers or other
	            // sensitive data).
	            //
	            // See: https://hackerone.com/reports/541502
	            socket.destroy();
	            const fakeSocket = new net_1.default.Socket({ writable: false });
	            fakeSocket.readable = true;
	            // Need to wait for the "socket" event to re-play the "data" events.
	            req.once('socket', (s) => {
	                debug('replaying proxy buffer for failed request');
	                assert_1.default(s.listenerCount('data') > 0);
	                // Replay the "buffered" Buffer onto the fake `socket`, since at
	                // this point the HTTP module machinery has been hooked up for
	                // the user.
	                s.push(buffered);
	                s.push(null);
	            });
	            return fakeSocket;
	        });
	    }
	}
	agent.default = HttpsProxyAgent;
	function resume(socket) {
	    socket.resume();
	}
	function isDefaultPort(port, secure) {
	    return Boolean((!secure && port === 80) || (secure && port === 443));
	}
	function isHTTPS(protocol) {
	    return typeof protocol === 'string' ? /^https:?$/i.test(protocol) : false;
	}
	function omit(obj, ...keys) {
	    const ret = {};
	    let key;
	    for (key in obj) {
	        if (!keys.includes(key)) {
	            ret[key] = obj[key];
	        }
	    }
	    return ret;
	}
	
	return agent;
}

var dist;
var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist;
	hasRequiredDist = 1;
	var __importDefault = (dist && dist.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	const agent_1 = __importDefault(requireAgent());
	function createHttpsProxyAgent(opts) {
	    return new agent_1.default(opts);
	}
	(function (createHttpsProxyAgent) {
	    createHttpsProxyAgent.HttpsProxyAgent = agent_1.default;
	    createHttpsProxyAgent.prototype = agent_1.default.prototype;
	})(createHttpsProxyAgent || (createHttpsProxyAgent = {}));
	dist = createHttpsProxyAgent;
	
	return dist;
}

var hasRequiredAgents;

function requireAgents () {
	if (hasRequiredAgents) return agents;
	hasRequiredAgents = 1;
	(function (exports) {
		/**
		 * @license
		 * Copyright 2019 Google LLC
		 *
		 * Licensed under the Apache License, Version 2.0 (the "License");
		 * you may not use this file except in compliance with the License.
		 * You may obtain a copy of the License at
		 *
		 *      http://www.apache.org/licenses/LICENSE-2.0
		 *
		 * Unless required by applicable law or agreed to in writing, software
		 * distributed under the License is distributed on an "AS IS" BASIS,
		 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		 * See the License for the specific language governing permissions and
		 * limitations under the License.
		 */
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.pool = void 0;
		exports.getAgent = getAgent;
		const http_1 = require$$0$2;
		const https_1 = require$$1$1;
		const url_1 = require$$2;
		exports.pool = /* @__PURE__ */ new Map();
		function shouldUseProxyForURI(uri) {
		  const noProxyEnv = process.env.NO_PROXY || process.env.no_proxy;
		  if (!noProxyEnv) {
		    return true;
		  }
		  const givenURI = new URL(uri);
		  for (const noProxyRaw of noProxyEnv.split(",")) {
		    const noProxy = noProxyRaw.trim();
		    if (noProxy === givenURI.origin || noProxy === givenURI.hostname) {
		      return false;
		    } else if (noProxy.startsWith("*.") || noProxy.startsWith(".")) {
		      const noProxyWildcard = noProxy.replace(/^\*\./, ".");
		      if (givenURI.hostname.endsWith(noProxyWildcard)) {
		        return false;
		      }
		    }
		  }
		  return true;
		}
		function getAgent(uri, reqOpts) {
		  const isHttp = uri.startsWith("http://");
		  const proxy = reqOpts.proxy || process.env.HTTP_PROXY || process.env.http_proxy || process.env.HTTPS_PROXY || process.env.https_proxy;
		  const poolOptions = Object.assign({}, reqOpts.pool);
		  const manuallyProvidedProxy = !!reqOpts.proxy;
		  const shouldUseProxy = manuallyProvidedProxy || shouldUseProxyForURI(uri);
		  if (proxy && shouldUseProxy) {
		    const Agent = isHttp ? requireDist$1() : requireDist();
		    const proxyOpts = { ...(0, url_1.parse)(proxy), ...poolOptions };
		    return new Agent(proxyOpts);
		  }
		  let key = isHttp ? "http" : "https";
		  if (reqOpts.forever) {
		    key += ":forever";
		    if (!exports.pool.has(key)) {
		      const Agent = isHttp ? http_1.Agent : https_1.Agent;
		      exports.pool.set(key, new Agent({ ...poolOptions, keepAlive: true }));
		    }
		  }
		  return exports.pool.get(key);
		} 
	} (agents));
	return agents;
}

var TeenyStatistics = {};

var hasRequiredTeenyStatistics;

function requireTeenyStatistics () {
	if (hasRequiredTeenyStatistics) return TeenyStatistics;
	hasRequiredTeenyStatistics = 1;
	/**
	 * @license
	 * Copyright 2020 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(TeenyStatistics, "__esModule", { value: true });
	TeenyStatistics.TeenyStatistics = TeenyStatistics.TeenyStatisticsWarning = void 0;
	class TeenyStatisticsWarning extends Error {
	  static CONCURRENT_REQUESTS = "ConcurrentRequestsExceededWarning";
	  threshold = 0;
	  type = "";
	  value = 0;
	  /**
	   * @param {string} message
	   */
	  constructor(message) {
	    super(message);
	    this.name = this.constructor.name;
	    Error.captureStackTrace(this, this.constructor);
	  }
	}
	TeenyStatistics.TeenyStatisticsWarning = TeenyStatisticsWarning;
	let TeenyStatistics$1 = class TeenyStatistics {
	  /**
	   * @description A default threshold representing when to warn about excessive
	   *   in-flight/concurrent requests.
	   * @type {number}
	   * @static
	   * @readonly
	   * @default 5000
	   */
	  static DEFAULT_WARN_CONCURRENT_REQUESTS = 5e3;
	  /**
	   * @type {TeenyStatisticsConfig}
	   * @private
	   */
	  _options;
	  /**
	   * @type {number}
	   * @private
	   * @default 0
	   */
	  _concurrentRequests = 0;
	  /**
	   * @type {boolean}
	   * @private
	   * @default false
	   */
	  _didConcurrentRequestWarn = false;
	  /**
	   * @param {TeenyStatisticsOptions} [opts]
	   */
	  constructor(opts) {
	    this._options = TeenyStatistics._prepareOptions(opts);
	  }
	  /**
	   * Returns a copy of the current options.
	   * @return {TeenyStatisticsOptions}
	   */
	  getOptions() {
	    return Object.assign({}, this._options);
	  }
	  /**
	   * Change configured statistics options. This will not preserve unspecified
	   *   options that were previously specified, i.e. this is a reset of options.
	   * @param {TeenyStatisticsOptions} [opts]
	   * @returns {TeenyStatisticsConfig} The previous options.
	   * @see _prepareOptions
	   */
	  setOptions(opts) {
	    const oldOpts = this._options;
	    this._options = TeenyStatistics._prepareOptions(opts);
	    return oldOpts;
	  }
	  /**
	   * @readonly
	   * @return {TeenyStatisticsCounters}
	   */
	  get counters() {
	    return {
	      concurrentRequests: this._concurrentRequests
	    };
	  }
	  /**
	   * @description Should call this right before making a request.
	   */
	  requestStarting() {
	    this._concurrentRequests++;
	    if (this._options.concurrentRequests > 0 && this._concurrentRequests >= this._options.concurrentRequests && !this._didConcurrentRequestWarn) {
	      this._didConcurrentRequestWarn = true;
	      const warning = new TeenyStatisticsWarning("Possible excessive concurrent requests detected. " + this._concurrentRequests + " requests in-flight, which exceeds the configured threshold of " + this._options.concurrentRequests + ". Use the TEENY_REQUEST_WARN_CONCURRENT_REQUESTS environment variable or the concurrentRequests option of teeny-request to increase or disable (0) this warning.");
	      warning.type = TeenyStatisticsWarning.CONCURRENT_REQUESTS;
	      warning.value = this._concurrentRequests;
	      warning.threshold = this._options.concurrentRequests;
	      process.emitWarning(warning);
	    }
	  }
	  /**
	   * @description When using `requestStarting`, call this after the request
	   *   has finished.
	   */
	  requestFinished() {
	    this._concurrentRequests--;
	  }
	  /**
	   * Configuration Precedence:
	   *   1. Dependency inversion via defined option.
	   *   2. Global numeric environment variable.
	   *   3. Built-in default.
	   * This will not preserve unspecified options previously specified.
	   * @param {TeenyStatisticsOptions} [opts]
	   * @returns {TeenyStatisticsOptions}
	   * @private
	   */
	  static _prepareOptions({ concurrentRequests: diConcurrentRequests } = {}) {
	    let concurrentRequests = this.DEFAULT_WARN_CONCURRENT_REQUESTS;
	    const envConcurrentRequests = Number(process.env.TEENY_REQUEST_WARN_CONCURRENT_REQUESTS);
	    if (diConcurrentRequests !== void 0) {
	      concurrentRequests = diConcurrentRequests;
	    } else if (!Number.isNaN(envConcurrentRequests)) {
	      concurrentRequests = envConcurrentRequests;
	    }
	    return { concurrentRequests };
	  }
	};
	TeenyStatistics.TeenyStatistics = TeenyStatistics$1;
	return TeenyStatistics;
}

var hasRequiredSrc$5;

function requireSrc$5 () {
	if (hasRequiredSrc$5) return src$4;
	hasRequiredSrc$5 = 1;
	/**
	 * @license
	 * Copyright 2018 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(src$4, "__esModule", { value: true });
	src$4.RequestError = void 0;
	src$4.teenyRequest = teenyRequest;
	const stream_1 = require$$0$4;
	const agents_1 = requireAgents();
	const TeenyStatistics_1 = requireTeenyStatistics();
	const crypto_1 = require$$0$3;
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const streamEvents = requireStreamEvents();
	const fetch = (...args) => import('../../chunks/index_BY5V8P8x.mjs').then(({ default: fetch }) => fetch(...args));
	class RequestError extends Error {
	    code;
	}
	src$4.RequestError = RequestError;
	/**
	 * Convert options from Request to Fetch format
	 * @private
	 * @param reqOpts Request options
	 */
	function requestToFetchOptions(reqOpts) {
	    const options = {
	        method: reqOpts.method || 'GET',
	        ...(reqOpts.timeout && { timeout: reqOpts.timeout }),
	        ...(typeof reqOpts.gzip === 'boolean' && { compress: reqOpts.gzip }),
	    };
	    if (typeof reqOpts.json === 'object') {
	        // Add Content-type: application/json header
	        reqOpts.headers = reqOpts.headers || {};
	        if (reqOpts.headers instanceof globalThis.Headers) {
	            reqOpts.headers.set('Content-Type', 'application/json');
	        }
	        else {
	            reqOpts.headers['Content-Type'] = 'application/json';
	        }
	        // Set body to JSON representation of value
	        options.body = JSON.stringify(reqOpts.json);
	    }
	    else {
	        if (Buffer.isBuffer(reqOpts.body)) {
	            options.body = reqOpts.body;
	        }
	        else if (typeof reqOpts.body !== 'string') {
	            options.body = JSON.stringify(reqOpts.body);
	        }
	        else {
	            options.body = reqOpts.body;
	        }
	    }
	    if (reqOpts.headers instanceof globalThis.Headers) {
	        options.headers = {};
	        for (const pair of reqOpts.headers.entries()) {
	            options.headers[pair[0]] = pair[1];
	        }
	    }
	    else {
	        // eslint-disable-next-line @typescript-eslint/no-explicit-any
	        options.headers = reqOpts.headers;
	    }
	    let uri = (reqOpts.uri ||
	        reqOpts.url);
	    if (!uri) {
	        throw new Error('Missing uri or url in reqOpts.');
	    }
	    if (reqOpts.useQuerystring === true || typeof reqOpts.qs === 'object') {
	        // eslint-disable-next-line @typescript-eslint/no-var-requires
	        const qs = require$$1$2;
	        const params = qs.stringify(reqOpts.qs);
	        uri = uri + '?' + params;
	    }
	    options.agent = (0, agents_1.getAgent)(uri, reqOpts);
	    return { uri, options };
	}
	/**
	 * Convert a response from `fetch` to `request` format.
	 * @private
	 * @param opts The `request` options used to create the request.
	 * @param res The Fetch response
	 * @returns A `request` response object
	 */
	function fetchToRequestResponse(opts, res) {
	    const request = {};
	    request.agent = opts.agent || false;
	    request.headers = (opts.headers || {});
	    request.href = res.url;
	    // headers need to be converted from a map to an obj
	    const resHeaders = {};
	    res.headers.forEach((value, key) => (resHeaders[key] = value));
	    const response = Object.assign(res.body, {
	        statusCode: res.status,
	        statusMessage: res.statusText,
	        request,
	        body: res.body,
	        headers: resHeaders,
	        toJSON: () => ({ headers: resHeaders }),
	    });
	    return response;
	}
	/**
	 * Create POST body from two parts as multipart/related content-type
	 * @private
	 * @param boundary
	 * @param multipart
	 */
	function createMultipartStream(boundary, multipart) {
	    const finale = `--${boundary}--`;
	    const stream = new stream_1.PassThrough();
	    for (const part of multipart) {
	        const preamble = `--${boundary}\r\nContent-Type: ${part['Content-Type']}\r\n\r\n`;
	        stream.write(preamble);
	        if (typeof part.body === 'string') {
	            stream.write(part.body);
	            stream.write('\r\n');
	        }
	        else {
	            part.body.pipe(stream, { end: false });
	            part.body.on('end', () => {
	                stream.write('\r\n');
	                stream.write(finale);
	                stream.end();
	            });
	        }
	    }
	    return stream;
	}
	function teenyRequest(reqOpts, callback) {
	    const { uri, options } = requestToFetchOptions(reqOpts);
	    const multipart = reqOpts.multipart;
	    if (reqOpts.multipart && multipart.length === 2) {
	        if (!callback) {
	            // TODO: add support for multipart uploads through streaming
	            throw new Error('Multipart without callback is not implemented.');
	        }
	        const boundary = (0, crypto_1.randomUUID)();
	        options.headers['Content-Type'] =
	            `multipart/related; boundary=${boundary}`;
	        options.body = createMultipartStream(boundary, multipart);
	        // Multipart upload
	        teenyRequest.stats.requestStarting();
	        fetch(uri, options).then(res => {
	            teenyRequest.stats.requestFinished();
	            const header = res.headers.get('content-type');
	            const response = fetchToRequestResponse(options, res);
	            const body = response.body;
	            if (header === 'application/json' ||
	                header === 'application/json; charset=utf-8') {
	                res.json().then(json => {
	                    response.body = json;
	                    callback(null, response, json);
	                }, (err) => {
	                    callback(err, response, body);
	                });
	                return;
	            }
	            res.text().then(text => {
	                response.body = text;
	                callback(null, response, text);
	            }, err => {
	                callback(err, response, body);
	            });
	        }, err => {
	            teenyRequest.stats.requestFinished();
	            callback(err, null, null);
	        });
	        return;
	    }
	    if (callback === undefined) {
	        // Stream mode
	        const requestStream = streamEvents(new stream_1.PassThrough());
	        // eslint-disable-next-line @typescript-eslint/no-explicit-any
	        let responseStream;
	        requestStream.once('reading', () => {
	            if (responseStream) {
	                (0, stream_1.pipeline)(responseStream, requestStream, () => { });
	            }
	            else {
	                requestStream.once('response', () => {
	                    (0, stream_1.pipeline)(responseStream, requestStream, () => { });
	                });
	            }
	        });
	        options.compress = false;
	        teenyRequest.stats.requestStarting();
	        fetch(uri, options).then(res => {
	            teenyRequest.stats.requestFinished();
	            responseStream = res.body;
	            responseStream.on('error', (err) => {
	                requestStream.emit('error', err);
	            });
	            const response = fetchToRequestResponse(options, res);
	            requestStream.emit('response', response);
	        }, err => {
	            teenyRequest.stats.requestFinished();
	            requestStream.emit('error', err);
	        });
	        // fetch doesn't supply the raw HTTP stream, instead it
	        // returns a PassThrough piped from the HTTP response
	        // stream.
	        return requestStream;
	    }
	    // GET or POST with callback
	    teenyRequest.stats.requestStarting();
	    fetch(uri, options).then(res => {
	        teenyRequest.stats.requestFinished();
	        const header = res.headers.get('content-type');
	        const response = fetchToRequestResponse(options, res);
	        const body = response.body;
	        if (header === 'application/json' ||
	            header === 'application/json; charset=utf-8') {
	            if (response.statusCode === 204) {
	                // Probably a DELETE
	                callback(null, response, body);
	                return;
	            }
	            res.json().then(json => {
	                response.body = json;
	                callback(null, response, json);
	            }, err => {
	                callback(err, response, body);
	            });
	            return;
	        }
	        res.text().then(text => {
	            const response = fetchToRequestResponse(options, res);
	            response.body = text;
	            callback(null, response, text);
	        }, err => {
	            callback(err, response, body);
	        });
	    }, err => {
	        teenyRequest.stats.requestFinished();
	        callback(err, null, null);
	    });
	    return;
	}
	teenyRequest.defaults = (defaults) => {
	    return (reqOpts, callback) => {
	        const opts = { ...defaults, ...reqOpts };
	        if (callback === undefined) {
	            return teenyRequest(opts);
	        }
	        teenyRequest(opts, callback);
	    };
	};
	/**
	 * Single instance of an interface for keeping track of things.
	 */
	teenyRequest.stats = new TeenyStatistics_1.TeenyStatistics();
	teenyRequest.resetStats = () => {
	    teenyRequest.stats = new TeenyStatistics_1.TeenyStatistics(teenyRequest.stats.getOptions());
	};
	
	return src$4;
}

var service = {};

var hasRequiredService;

function requireService () {
	if (hasRequiredService) return service;
	hasRequiredService = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.Service = exports.DEFAULT_PROJECT_ID_TOKEN = void 0;
		/*!
		 * @module common/service
		 */
		const arrify = requireArrify();
		const extend = requireExtend();
		const util_1 = requireUtil$1();
		exports.DEFAULT_PROJECT_ID_TOKEN = "{{projectId}}";
		class Service {
		  baseUrl;
		  globalInterceptors;
		  interceptors;
		  packageJson;
		  projectId;
		  projectIdRequired;
		  providedUserAgent;
		  makeAuthenticatedRequest;
		  authClient;
		  getCredentials;
		  apiEndpoint;
		  timeout;
		  /**
		   * Service is a base class, meant to be inherited from by a "service," like
		   * BigQuery or Storage.
		   *
		   * This handles making authenticated requests by exposing a `makeReq_`
		   * function.
		   *
		   * @constructor
		   * @alias module:common/service
		   *
		   * @param {object} config - Configuration object.
		   * @param {string} config.baseUrl - The base URL to make API requests to.
		   * @param {string[]} config.scopes - The scopes required for the request.
		   * @param {object=} options - [Configuration object](#/docs).
		   */
		  constructor(config, options = {}) {
		    this.baseUrl = config.baseUrl;
		    this.apiEndpoint = config.apiEndpoint;
		    this.timeout = options.timeout;
		    this.globalInterceptors = arrify(options.interceptors_);
		    this.interceptors = [];
		    this.packageJson = config.packageJson;
		    this.projectId = options.projectId || exports.DEFAULT_PROJECT_ID_TOKEN;
		    this.projectIdRequired = config.projectIdRequired !== false;
		    this.providedUserAgent = options.userAgent;
		    const reqCfg = extend({}, config, {
		      projectIdRequired: this.projectIdRequired,
		      projectId: this.projectId,
		      authClient: options.authClient,
		      credentials: options.credentials,
		      keyFile: options.keyFilename,
		      email: options.email,
		      token: options.token
		    });
		    this.makeAuthenticatedRequest = util_1.util.makeAuthenticatedRequestFactory(reqCfg);
		    this.authClient = this.makeAuthenticatedRequest.authClient;
		    this.getCredentials = this.makeAuthenticatedRequest.getCredentials;
		    const isCloudFunctionEnv = !!process.env.FUNCTION_NAME;
		    if (isCloudFunctionEnv) {
		      this.interceptors.push({
		        request(reqOpts) {
		          reqOpts.forever = false;
		          return reqOpts;
		        }
		      });
		    }
		  }
		  /**
		   * Return the user's custom request interceptors.
		   */
		  getRequestInterceptors() {
		    return [].slice.call(this.globalInterceptors).concat(this.interceptors).filter((interceptor) => typeof interceptor.request === "function").map((interceptor) => interceptor.request);
		  }
		  getProjectId(callback) {
		    if (!callback) {
		      return this.getProjectIdAsync();
		    }
		    this.getProjectIdAsync().then((p) => callback(null, p), callback);
		  }
		  async getProjectIdAsync() {
		    const projectId = await this.authClient.getProjectId();
		    if (this.projectId === exports.DEFAULT_PROJECT_ID_TOKEN && projectId) {
		      this.projectId = projectId;
		    }
		    return this.projectId;
		  }
		  request_(reqOpts, callback) {
		    reqOpts = extend(true, {}, reqOpts, { timeout: this.timeout });
		    const isAbsoluteUrl = reqOpts.uri.indexOf("http") === 0;
		    const uriComponents = [this.baseUrl];
		    if (this.projectIdRequired) {
		      if (reqOpts.projectId) {
		        uriComponents.push("projects");
		        uriComponents.push(reqOpts.projectId);
		      } else {
		        uriComponents.push("projects");
		        uriComponents.push(this.projectId);
		      }
		    }
		    uriComponents.push(reqOpts.uri);
		    if (isAbsoluteUrl) {
		      uriComponents.splice(0, uriComponents.indexOf(reqOpts.uri));
		    }
		    reqOpts.uri = uriComponents.map((uriComponent) => {
		      const trimSlashesRegex = /^\/*|\/*$/g;
		      return uriComponent.replace(trimSlashesRegex, "");
		    }).join("/").replace(/\/:/g, ":");
		    const requestInterceptors = this.getRequestInterceptors();
		    arrify(reqOpts.interceptors_).forEach((interceptor) => {
		      if (typeof interceptor.request === "function") {
		        requestInterceptors.push(interceptor.request);
		      }
		    });
		    requestInterceptors.forEach((requestInterceptor) => {
		      reqOpts = requestInterceptor(reqOpts);
		    });
		    delete reqOpts.interceptors_;
		    const pkg = this.packageJson;
		    let userAgent = util_1.util.getUserAgentFromPackageJson(pkg);
		    if (this.providedUserAgent) {
		      userAgent = `${this.providedUserAgent} ${userAgent}`;
		    }
		    reqOpts.headers = extend({}, reqOpts.headers, {
		      "User-Agent": userAgent,
		      "x-goog-api-client": `gl-node/${process.versions.node} gccl/${pkg.version}`
		    });
		    if (reqOpts.shouldReturnStream) {
		      return this.makeAuthenticatedRequest(reqOpts);
		    } else {
		      this.makeAuthenticatedRequest(reqOpts, callback);
		    }
		  }
		  /**
		   * Make an authenticated API request.
		   *
		   * @param {object} reqOpts - Request options that are passed to `request`.
		   * @param {string} reqOpts.uri - A URI relative to the baseUrl.
		   * @param {function} callback - The callback function passed to `request`.
		   */
		  request(reqOpts, callback) {
		    Service.prototype.request_.call(this, reqOpts, callback);
		  }
		  /**
		   * Make an authenticated API request.
		   *
		   * @param {object} reqOpts - Request options that are passed to `request`.
		   * @param {string} reqOpts.uri - A URI relative to the baseUrl.
		   */
		  requestStream(reqOpts) {
		    const opts = extend(true, reqOpts, { shouldReturnStream: true });
		    return Service.prototype.request_.call(this, opts);
		  }
		}
		exports.Service = Service; 
	} (service));
	return service;
}

var hasRequiredUtil$1;

function requireUtil$1 () {
	if (hasRequiredUtil$1) return util$1;
	hasRequiredUtil$1 = 1;
	// Copyright 2014 Google LLC
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(util$1, "__esModule", { value: true });
	util$1.util = util$1.Util = util$1.PartialFailureError = util$1.ApiError = void 0;
	/*!
	 * @module common/util
	 */
	const projectify_1 = requireSrc$8();
	const htmlEntities = /*@__PURE__*/ requireCommonjs();
	const extend = requireExtend();
	const google_auth_library_1 = requireSrc$9();
	const retryRequest = requireRetryRequest();
	const stream_1 = require$$0$4;
	const teeny_request_1 = requireSrc$5();
	const service_1 = requireService();
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const duplexify = requireDuplexify();
	const requestDefaults = {
	    timeout: 60000,
	    gzip: true,
	    forever: true,
	    pool: {
	        maxSockets: Infinity,
	    },
	};
	/**
	 * Default behavior: Automatically retry retriable server errors.
	 *
	 * @const {boolean}
	 * @private
	 */
	const AUTO_RETRY_DEFAULT = true;
	/**
	 * Default behavior: Only attempt to retry retriable errors 3 times.
	 *
	 * @const {number}
	 * @private
	 */
	const MAX_RETRY_DEFAULT = 3;
	/**
	 * Custom error type for API errors.
	 *
	 * @param {object} errorBody - Error object.
	 */
	class ApiError extends Error {
	    code;
	    errors;
	    response;
	    constructor(errorBodyOrMessage) {
	        super();
	        if (typeof errorBodyOrMessage !== 'object') {
	            this.message = errorBodyOrMessage || '';
	            return;
	        }
	        const errorBody = errorBodyOrMessage;
	        this.code = errorBody.code;
	        this.errors = errorBody.errors;
	        this.response = errorBody.response;
	        try {
	            this.errors = JSON.parse(this.response.body).error.errors;
	        }
	        catch (e) {
	            this.errors = errorBody.errors;
	        }
	        this.message = ApiError.createMultiErrorMessage(errorBody, this.errors);
	        Error.captureStackTrace(this);
	    }
	    /**
	     * Pieces together an error message by combining all unique error messages
	     * returned from a single GoogleError
	     *
	     * @private
	     *
	     * @param {GoogleErrorBody} err The original error.
	     * @param {GoogleInnerError[]} [errors] Inner errors, if any.
	     * @returns {string}
	     */
	    static createMultiErrorMessage(err, errors) {
	        const messages = new Set();
	        if (err.message) {
	            messages.add(err.message);
	        }
	        if (errors && errors.length) {
	            errors.forEach(({ message }) => messages.add(message));
	        }
	        else if (err.response && err.response.body) {
	            messages.add(htmlEntities.decode(err.response.body.toString()));
	        }
	        else if (!err.message) {
	            messages.add('A failure occurred during this request.');
	        }
	        let messageArr = Array.from(messages);
	        if (messageArr.length > 1) {
	            messageArr = messageArr.map((message, i) => `    ${i + 1}. ${message}`);
	            messageArr.unshift('Multiple errors occurred during the request. Please see the `errors` array for complete details.\n');
	            messageArr.push('\n');
	        }
	        return messageArr.join('\n');
	    }
	}
	util$1.ApiError = ApiError;
	/**
	 * Custom error type for partial errors returned from the API.
	 *
	 * @param {object} b - Error object.
	 */
	class PartialFailureError extends Error {
	    errors;
	    response;
	    constructor(b) {
	        super();
	        const errorObject = b;
	        this.errors = errorObject.errors;
	        this.name = 'PartialFailureError';
	        this.response = errorObject.response;
	        this.message = ApiError.createMultiErrorMessage(errorObject, this.errors);
	    }
	}
	util$1.PartialFailureError = PartialFailureError;
	class Util {
	    ApiError = ApiError;
	    PartialFailureError = PartialFailureError;
	    /**
	     * No op.
	     *
	     * @example
	     * function doSomething(callback) {
	     *   callback = callback || noop;
	     * }
	     */
	    noop() { }
	    /**
	     * Uniformly process an API response.
	     *
	     * @param {*} err - Error value.
	     * @param {*} resp - Response value.
	     * @param {*} body - Body value.
	     * @param {function} callback - The callback function.
	     */
	    handleResp(err, resp, body, callback) {
	        callback = callback || util.noop;
	        const parsedResp = extend(true, { err: err || null }, resp && util.parseHttpRespMessage(resp), body && util.parseHttpRespBody(body));
	        // Assign the parsed body to resp.body, even if { json: false } was passed
	        // as a request option.
	        // We assume that nobody uses the previously unparsed value of resp.body.
	        if (!parsedResp.err && resp && typeof parsedResp.body === 'object') {
	            parsedResp.resp.body = parsedResp.body;
	        }
	        if (parsedResp.err && resp) {
	            parsedResp.err.response = resp;
	        }
	        callback(parsedResp.err, parsedResp.body, parsedResp.resp);
	    }
	    /**
	     * Sniff an incoming HTTP response message for errors.
	     *
	     * @param {object} httpRespMessage - An incoming HTTP response message from `request`.
	     * @return {object} parsedHttpRespMessage - The parsed response.
	     * @param {?error} parsedHttpRespMessage.err - An error detected.
	     * @param {object} parsedHttpRespMessage.resp - The original response object.
	     */
	    parseHttpRespMessage(httpRespMessage) {
	        const parsedHttpRespMessage = {
	            resp: httpRespMessage,
	        };
	        if (httpRespMessage.statusCode < 200 || httpRespMessage.statusCode > 299) {
	            // Unknown error. Format according to ApiError standard.
	            parsedHttpRespMessage.err = new ApiError({
	                errors: new Array(),
	                code: httpRespMessage.statusCode,
	                message: httpRespMessage.statusMessage,
	                response: httpRespMessage,
	            });
	        }
	        return parsedHttpRespMessage;
	    }
	    /**
	     * Parse the response body from an HTTP request.
	     *
	     * @param {object} body - The response body.
	     * @return {object} parsedHttpRespMessage - The parsed response.
	     * @param {?error} parsedHttpRespMessage.err - An error detected.
	     * @param {object} parsedHttpRespMessage.body - The original body value provided
	     *     will try to be JSON.parse'd. If it's successful, the parsed value will
	     * be returned here, otherwise the original value and an error will be returned.
	     */
	    parseHttpRespBody(body) {
	        const parsedHttpRespBody = {
	            body,
	        };
	        if (typeof body === 'string') {
	            try {
	                parsedHttpRespBody.body = JSON.parse(body);
	            }
	            catch (err) {
	                parsedHttpRespBody.body = body;
	            }
	        }
	        if (parsedHttpRespBody.body && parsedHttpRespBody.body.error) {
	            // Error from JSON API.
	            parsedHttpRespBody.err = new ApiError(parsedHttpRespBody.body.error);
	        }
	        return parsedHttpRespBody;
	    }
	    /**
	     * Take a Duplexify stream, fetch an authenticated connection header, and
	     * create an outgoing writable stream.
	     *
	     * @param {Duplexify} dup - Duplexify stream.
	     * @param {object} options - Configuration object.
	     * @param {module:common/connection} options.connection - A connection instance used to get a token with and send the request through.
	     * @param {object} options.metadata - Metadata to send at the head of the request.
	     * @param {object} options.request - Request object, in the format of a standard Node.js http.request() object.
	     * @param {string=} options.request.method - Default: "POST".
	     * @param {string=} options.request.qs.uploadType - Default: "multipart".
	     * @param {string=} options.streamContentType - Default: "application/octet-stream".
	     * @param {function} onComplete - Callback, executed after the writable Request stream has completed.
	     */
	    makeWritableStream(dup, options, onComplete) {
	        onComplete = onComplete || util.noop;
	        const writeStream = new ProgressStream();
	        writeStream.on('progress', evt => dup.emit('progress', evt));
	        dup.setWritable(writeStream);
	        const defaultReqOpts = {
	            method: 'POST',
	            qs: {
	                uploadType: 'multipart',
	            },
	            timeout: 0,
	            maxRetries: 0,
	        };
	        const metadata = options.metadata || {};
	        const reqOpts = extend(true, defaultReqOpts, options.request, {
	            multipart: [
	                {
	                    'Content-Type': 'application/json',
	                    body: JSON.stringify(metadata),
	                },
	                {
	                    'Content-Type': metadata.contentType || 'application/octet-stream',
	                    body: writeStream,
	                },
	            ],
	        });
	        options.makeAuthenticatedRequest(reqOpts, {
	            onAuthenticated(err, authenticatedReqOpts) {
	                if (err) {
	                    dup.destroy(err);
	                    return;
	                }
	                const request = teeny_request_1.teenyRequest.defaults(requestDefaults);
	                request(authenticatedReqOpts, (err, resp, body) => {
	                    util.handleResp(err, resp, body, (err, data) => {
	                        if (err) {
	                            dup.destroy(err);
	                            return;
	                        }
	                        dup.emit('response', resp);
	                        onComplete(data);
	                    });
	                });
	            },
	        });
	    }
	    /**
	     * Returns true if the API request should be retried, given the error that was
	     * given the first time the request was attempted. This is used for rate limit
	     * related errors as well as intermittent server errors.
	     *
	     * @param {error} err - The API error to check if it is appropriate to retry.
	     * @return {boolean} True if the API request should be retried, false otherwise.
	     */
	    shouldRetryRequest(err) {
	        if (err) {
	            if ([408, 429, 500, 502, 503, 504].indexOf(err.code) !== -1) {
	                return true;
	            }
	            if (err.errors) {
	                for (const e of err.errors) {
	                    const reason = e.reason;
	                    if (reason === 'rateLimitExceeded') {
	                        return true;
	                    }
	                    if (reason === 'userRateLimitExceeded') {
	                        return true;
	                    }
	                    if (reason && reason.includes('EAI_AGAIN')) {
	                        return true;
	                    }
	                }
	            }
	        }
	        return false;
	    }
	    /**
	     * Get a function for making authenticated requests.
	     *
	     * @param {object} config - Configuration object.
	     * @param {boolean=} config.autoRetry - Automatically retry requests if the
	     *     response is related to rate limits or certain intermittent server
	     * errors. We will exponentially backoff subsequent requests by default.
	     * (default: true)
	     * @param {object=} config.credentials - Credentials object.
	     * @param {boolean=} config.customEndpoint - If true, just return the provided request options. Default: false.
	     * @param {boolean=} config.useAuthWithCustomEndpoint - If true, will authenticate when using a custom endpoint. Default: false.
	     * @param {string=} config.email - Account email address, required for PEM/P12 usage.
	     * @param {number=} config.maxRetries - Maximum number of automatic retries attempted before returning the error. (default: 3)
	     * @param {string=} config.keyFile - Path to a .json, .pem, or .p12 keyfile.
	     * @param {array} config.scopes - Array of scopes required for the API.
	     */
	    makeAuthenticatedRequestFactory(config) {
	        const googleAutoAuthConfig = extend({}, config);
	        if (googleAutoAuthConfig.projectId === service_1.DEFAULT_PROJECT_ID_TOKEN) {
	            delete googleAutoAuthConfig.projectId;
	        }
	        let authClient;
	        if (googleAutoAuthConfig.authClient instanceof google_auth_library_1.GoogleAuth) {
	            // Use an existing `GoogleAuth`
	            authClient = googleAutoAuthConfig.authClient;
	        }
	        else {
	            // Pass an `AuthClient` to `GoogleAuth`, if available
	            const config = {
	                ...googleAutoAuthConfig,
	                authClient: googleAutoAuthConfig.authClient,
	            };
	            authClient = new google_auth_library_1.GoogleAuth(config);
	        }
	        function makeAuthenticatedRequest(reqOpts, optionsOrCallback) {
	            let stream;
	            let projectId;
	            const reqConfig = extend({}, config);
	            let activeRequest_;
	            if (!optionsOrCallback) {
	                stream = duplexify();
	                reqConfig.stream = stream;
	            }
	            const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : undefined;
	            const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : undefined;
	            async function setProjectId() {
	                projectId = await authClient.getProjectId();
	            }
	            const onAuthenticated = async (err, authenticatedReqOpts) => {
	                const authLibraryError = err;
	                const autoAuthFailed = err &&
	                    err.message.indexOf('Could not load the default credentials') > -1;
	                if (autoAuthFailed) {
	                    // Even though authentication failed, the API might not actually
	                    // care.
	                    authenticatedReqOpts = reqOpts;
	                }
	                if (!err || autoAuthFailed) {
	                    try {
	                        // Try with existing `projectId` value
	                        authenticatedReqOpts = util.decorateRequest(authenticatedReqOpts, projectId);
	                        err = null;
	                    }
	                    catch (e) {
	                        if (e instanceof projectify_1.MissingProjectIdError) {
	                            // A `projectId` was required, but we don't have one.
	                            try {
	                                // Attempt to get the `projectId`
	                                await setProjectId();
	                                authenticatedReqOpts = util.decorateRequest(authenticatedReqOpts, projectId);
	                                err = null;
	                            }
	                            catch (e) {
	                                // Re-use the "Could not load the default credentials error" if
	                                // auto auth failed.
	                                err = err || e;
	                            }
	                        }
	                        else {
	                            // Some other error unrelated to missing `projectId`
	                            err = err || e;
	                        }
	                    }
	                }
	                if (err) {
	                    if (stream) {
	                        stream.destroy(err);
	                    }
	                    else {
	                        const fn = options && options.onAuthenticated
	                            ? options.onAuthenticated
	                            : callback;
	                        fn(err);
	                    }
	                    return;
	                }
	                if (options && options.onAuthenticated) {
	                    options.onAuthenticated(null, authenticatedReqOpts);
	                }
	                else {
	                    activeRequest_ = util.makeRequest(authenticatedReqOpts, reqConfig, (apiResponseError, ...params) => {
	                        if (apiResponseError &&
	                            apiResponseError.code === 401 &&
	                            authLibraryError) {
	                            // Re-use the "Could not load the default credentials error" if
	                            // the API request failed due to missing credentials.
	                            apiResponseError = authLibraryError;
	                        }
	                        callback(apiResponseError, ...params);
	                    });
	                }
	            };
	            const prepareRequest = async () => {
	                try {
	                    const getProjectId = async () => {
	                        if (config.projectId &&
	                            config.projectId !== service_1.DEFAULT_PROJECT_ID_TOKEN) {
	                            // The user provided a project ID. We don't need to check with the
	                            // auth client, it could be incorrect.
	                            return config.projectId;
	                        }
	                        if (config.projectIdRequired === false) {
	                            // A projectId is not required. Return the default.
	                            return service_1.DEFAULT_PROJECT_ID_TOKEN;
	                        }
	                        return setProjectId();
	                    };
	                    const authorizeRequest = async () => {
	                        if (reqConfig.customEndpoint &&
	                            !reqConfig.useAuthWithCustomEndpoint) {
	                            // Using a custom API override. Do not use `google-auth-library` for
	                            // authentication. (ex: connecting to a local Datastore server)
	                            return reqOpts;
	                        }
	                        else {
	                            return authClient.authorizeRequest(reqOpts);
	                        }
	                    };
	                    const [_projectId, authorizedReqOpts] = await Promise.all([
	                        getProjectId(),
	                        authorizeRequest(),
	                    ]);
	                    if (_projectId) {
	                        projectId = _projectId;
	                    }
	                    return onAuthenticated(null, authorizedReqOpts);
	                }
	                catch (e) {
	                    return onAuthenticated(e);
	                }
	            };
	            void prepareRequest();
	            if (stream) {
	                return stream;
	            }
	            return {
	                abort() {
	                    setImmediate(() => {
	                        if (activeRequest_) {
	                            activeRequest_.abort();
	                            activeRequest_ = null;
	                        }
	                    });
	                },
	            };
	        }
	        const mar = makeAuthenticatedRequest;
	        mar.getCredentials = authClient.getCredentials.bind(authClient);
	        mar.authClient = authClient;
	        return mar;
	    }
	    /**
	     * Make a request through the `retryRequest` module with built-in error
	     * handling and exponential back off.
	     *
	     * @param {object} reqOpts - Request options in the format `request` expects.
	     * @param {object=} config - Configuration object.
	     * @param {boolean=} config.autoRetry - Automatically retry requests if the
	     *     response is related to rate limits or certain intermittent server
	     * errors. We will exponentially backoff subsequent requests by default.
	     * (default: true)
	     * @param {number=} config.maxRetries - Maximum number of automatic retries
	     *     attempted before returning the error. (default: 3)
	     * @param {object=} config.request - HTTP module for request calls.
	     * @param {function} callback - The callback function.
	     */
	    makeRequest(reqOpts, config, callback) {
	        let autoRetryValue = AUTO_RETRY_DEFAULT;
	        if (config.autoRetry !== undefined &&
	            config.retryOptions?.autoRetry !== undefined) {
	            throw new ApiError('autoRetry is deprecated. Use retryOptions.autoRetry instead.');
	        }
	        else if (config.autoRetry !== undefined) {
	            autoRetryValue = config.autoRetry;
	        }
	        else if (config.retryOptions?.autoRetry !== undefined) {
	            autoRetryValue = config.retryOptions.autoRetry;
	        }
	        let maxRetryValue = MAX_RETRY_DEFAULT;
	        if (config.maxRetries && config.retryOptions?.maxRetries) {
	            throw new ApiError('maxRetries is deprecated. Use retryOptions.maxRetries instead.');
	        }
	        else if (config.maxRetries) {
	            maxRetryValue = config.maxRetries;
	        }
	        else if (config.retryOptions?.maxRetries) {
	            maxRetryValue = config.retryOptions.maxRetries;
	        }
	        const options = {
	            request: teeny_request_1.teenyRequest.defaults(requestDefaults),
	            retries: autoRetryValue !== false ? maxRetryValue : 0,
	            noResponseRetries: autoRetryValue !== false ? maxRetryValue : 0,
	            shouldRetryFn(httpRespMessage) {
	                const err = util.parseHttpRespMessage(httpRespMessage).err;
	                if (config.retryOptions?.retryableErrorFn) {
	                    return err && config.retryOptions?.retryableErrorFn(err);
	                }
	                return err && util.shouldRetryRequest(err);
	            },
	            maxRetryDelay: config.retryOptions?.maxRetryDelay,
	            retryDelayMultiplier: config.retryOptions?.retryDelayMultiplier,
	            totalTimeout: config.retryOptions?.totalTimeout,
	        };
	        if (typeof reqOpts.maxRetries === 'number') {
	            options.retries = reqOpts.maxRetries;
	        }
	        if (!config.stream) {
	            return retryRequest(reqOpts, options, (err, response, body) => {
	                util.handleResp(err, response, body, callback);
	            });
	        }
	        const dup = config.stream;
	        // eslint-disable-next-line @typescript-eslint/no-explicit-any
	        let requestStream;
	        const isGetRequest = (reqOpts.method || 'GET').toUpperCase() === 'GET';
	        if (isGetRequest) {
	            requestStream = retryRequest(reqOpts, options);
	            dup.setReadable(requestStream);
	        }
	        else {
	            // Streaming writable HTTP requests cannot be retried.
	            requestStream = options.request(reqOpts);
	            dup.setWritable(requestStream);
	        }
	        // Replay the Request events back to the stream.
	        requestStream
	            .on('error', dup.destroy.bind(dup))
	            .on('response', dup.emit.bind(dup, 'response'))
	            .on('complete', dup.emit.bind(dup, 'complete'));
	        dup.abort = requestStream.abort;
	        return dup;
	    }
	    /**
	     * Decorate the options about to be made in a request.
	     *
	     * @param {object} reqOpts - The options to be passed to `request`.
	     * @param {string} projectId - The project ID.
	     * @return {object} reqOpts - The decorated reqOpts.
	     */
	    decorateRequest(reqOpts, projectId) {
	        delete reqOpts.autoPaginate;
	        delete reqOpts.autoPaginateVal;
	        delete reqOpts.objectMode;
	        if (reqOpts.qs !== null && typeof reqOpts.qs === 'object') {
	            delete reqOpts.qs.autoPaginate;
	            delete reqOpts.qs.autoPaginateVal;
	            reqOpts.qs = (0, projectify_1.replaceProjectIdToken)(reqOpts.qs, projectId);
	        }
	        if (Array.isArray(reqOpts.multipart)) {
	            reqOpts.multipart = reqOpts.multipart.map(part => {
	                return (0, projectify_1.replaceProjectIdToken)(part, projectId);
	            });
	        }
	        if (reqOpts.json !== null && typeof reqOpts.json === 'object') {
	            delete reqOpts.json.autoPaginate;
	            delete reqOpts.json.autoPaginateVal;
	            reqOpts.json = (0, projectify_1.replaceProjectIdToken)(reqOpts.json, projectId);
	        }
	        reqOpts.uri = (0, projectify_1.replaceProjectIdToken)(reqOpts.uri, projectId);
	        return reqOpts;
	    }
	    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	    isCustomType(unknown, module) {
	        function getConstructorName(obj) {
	            return obj.constructor && obj.constructor.name.toLowerCase();
	        }
	        const moduleNameParts = module.split('/');
	        const parentModuleName = moduleNameParts[0] && moduleNameParts[0].toLowerCase();
	        const subModuleName = moduleNameParts[1] && moduleNameParts[1].toLowerCase();
	        if (subModuleName && getConstructorName(unknown) !== subModuleName) {
	            return false;
	        }
	        let walkingModule = unknown;
	        // eslint-disable-next-line no-constant-condition
	        while (true) {
	            if (getConstructorName(walkingModule) === parentModuleName) {
	                return true;
	            }
	            walkingModule = walkingModule.parent;
	            if (!walkingModule) {
	                return false;
	            }
	        }
	    }
	    /**
	     * Create a properly-formatted User-Agent string from a package.json file.
	     *
	     * @param {object} packageJson - A module's package.json file.
	     * @return {string} userAgent - The formatted User-Agent string.
	     */
	    getUserAgentFromPackageJson(packageJson) {
	        const hyphenatedPackageName = packageJson.name
	            .replace('@google-cloud', 'gcloud-node') // For legacy purposes.
	            .replace('/', '-'); // For UA spec-compliance purposes.
	        return hyphenatedPackageName + '/' + packageJson.version;
	    }
	    /**
	     * Given two parameters, figure out if this is either:
	     *  - Just a callback function
	     *  - An options object, and then a callback function
	     * @param optionsOrCallback An options object or callback.
	     * @param cb A potentially undefined callback.
	     */
	    maybeOptionsOrCallback(optionsOrCallback, cb) {
	        return typeof optionsOrCallback === 'function'
	            ? [{}, optionsOrCallback]
	            : [optionsOrCallback, cb];
	    }
	}
	util$1.Util = Util;
	/**
	 * Basic Passthrough Stream that records the number of bytes read
	 * every time the cursor is moved.
	 */
	class ProgressStream extends stream_1.Transform {
	    bytesRead = 0;
	    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	    _transform(chunk, encoding, callback) {
	        this.bytesRead += chunk.length;
	        this.emit('progress', { bytesWritten: this.bytesRead, contentLength: '*' });
	        this.push(chunk);
	        callback();
	    }
	}
	const util = new Util();
	util$1.util = util;
	
	return util$1;
}

var hasRequiredServiceObject;

function requireServiceObject () {
	if (hasRequiredServiceObject) return serviceObject;
	hasRequiredServiceObject = 1;
	// Copyright 2015 Google LLC
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(serviceObject, "__esModule", { value: true });
	serviceObject.ServiceObject = void 0;
	/*!
	 * @module common/service-object
	 */
	const promisify_1 = requireSrc$7();
	const arrify = requireArrify();
	const events_1 = require$$0;
	const extend = requireExtend();
	const util_1 = requireUtil$1();
	/**
	 * ServiceObject is a base class, meant to be inherited from by a "service
	 * object," like a BigQuery dataset or Storage bucket.
	 *
	 * Most of the time, these objects share common functionality; they can be
	 * created or deleted, and you can get or set their metadata.
	 *
	 * By inheriting from this class, a service object will be extended with these
	 * shared behaviors. Note that any method can be overridden when the service
	 * object requires specific behavior.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	class ServiceObject extends events_1.EventEmitter {
	    metadata;
	    baseUrl;
	    parent;
	    id;
	    pollIntervalMs;
	    createMethod;
	    methods;
	    interceptors;
	    projectId;
	    /*
	     * @constructor
	     * @alias module:common/service-object
	     *
	     * @private
	     *
	     * @param {object} config - Configuration object.
	     * @param {string} config.baseUrl - The base URL to make API requests to.
	     * @param {string} config.createMethod - The method which creates this object.
	     * @param {string=} config.id - The identifier of the object. For example, the
	     *     name of a Storage bucket or Pub/Sub topic.
	     * @param {object=} config.methods - A map of each method name that should be inherited.
	     * @param {object} config.methods[].reqOpts - Default request options for this
	     *     particular method. A common use case is when `setMetadata` requires a
	     *     `PUT` method to override the default `PATCH`.
	     * @param {object} config.parent - The parent service instance. For example, an
	     *     instance of Storage if the object is Bucket.
	     */
	    constructor(config) {
	        super();
	        this.metadata = {};
	        this.baseUrl = config.baseUrl;
	        this.parent = config.parent; // Parent class.
	        this.id = config.id; // Name or ID (e.g. dataset ID, bucket name, etc).
	        this.createMethod = config.createMethod;
	        this.methods = config.methods || {};
	        this.interceptors = [];
	        this.pollIntervalMs = config.pollIntervalMs;
	        this.projectId = config.projectId;
	        if (config.methods) {
	            // This filters the ServiceObject instance (e.g. a "File") to only have
	            // the configured methods. We make a couple of exceptions for core-
	            // functionality ("request()" and "getRequestInterceptors()")
	            Object.getOwnPropertyNames(ServiceObject.prototype)
	                .filter(methodName => {
	                return (
	                // All ServiceObjects need `request` and `getRequestInterceptors`.
	                // clang-format off
	                !/^request/.test(methodName) &&
	                    !/^getRequestInterceptors/.test(methodName) &&
	                    // clang-format on
	                    // The ServiceObject didn't redefine the method.
	                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	                    this[methodName] ===
	                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
	                        ServiceObject.prototype[methodName] &&
	                    // This method isn't wanted.
	                    !config.methods[methodName]);
	            })
	                .forEach(methodName => {
	                // eslint-disable-next-line @typescript-eslint/no-explicit-any
	                this[methodName] = undefined;
	            });
	        }
	    }
	    create(optionsOrCallback, callback) {
	        // eslint-disable-next-line @typescript-eslint/no-this-alias
	        const self = this;
	        const args = [this.id];
	        if (typeof optionsOrCallback === 'function') {
	            callback = optionsOrCallback;
	        }
	        if (typeof optionsOrCallback === 'object') {
	            args.push(optionsOrCallback);
	        }
	        // Wrap the callback to return *this* instance of the object, not the
	        // newly-created one.
	        // tslint: disable-next-line no-any
	        function onCreate(...args) {
	            const [err, instance] = args;
	            if (!err) {
	                self.metadata = instance.metadata;
	                args[1] = self; // replace the created `instance` with this one.
	            }
	            callback(...args);
	        }
	        args.push(onCreate);
	        // eslint-disable-next-line prefer-spread
	        this.createMethod.apply(null, args);
	    }
	    delete(optionsOrCallback, cb) {
	        const [options, callback] = util_1.util.maybeOptionsOrCallback(optionsOrCallback, cb);
	        const ignoreNotFound = options.ignoreNotFound;
	        delete options.ignoreNotFound;
	        const methodConfig = (typeof this.methods.delete === 'object' && this.methods.delete) || {};
	        const reqOpts = extend(true, {
	            method: 'DELETE',
	            uri: '',
	        }, methodConfig.reqOpts, {
	            qs: options,
	        });
	        // The `request` method may have been overridden to hold any special
	        // behavior. Ensure we call the original `request` method.
	        ServiceObject.prototype.request.call(this, reqOpts, (err, ...args) => {
	            if (err) {
	                if (err.code === 404 && ignoreNotFound) {
	                    err = null;
	                }
	            }
	            callback(err, ...args);
	        });
	    }
	    exists(optionsOrCallback, cb) {
	        const [options, callback] = util_1.util.maybeOptionsOrCallback(optionsOrCallback, cb);
	        this.get(options, err => {
	            if (err) {
	                if (err.code === 404) {
	                    callback(null, false);
	                }
	                else {
	                    callback(err);
	                }
	                return;
	            }
	            callback(null, true);
	        });
	    }
	    get(optionsOrCallback, cb) {
	        // eslint-disable-next-line @typescript-eslint/no-this-alias
	        const self = this;
	        const [opts, callback] = util_1.util.maybeOptionsOrCallback(optionsOrCallback, cb);
	        const options = Object.assign({}, opts);
	        const autoCreate = options.autoCreate && typeof this.create === 'function';
	        delete options.autoCreate;
	        function onCreate(err, instance, apiResponse) {
	            if (err) {
	                if (err.code === 409) {
	                    self.get(options, callback);
	                    return;
	                }
	                callback(err, null, apiResponse);
	                return;
	            }
	            callback(null, instance, apiResponse);
	        }
	        this.getMetadata(options, (err, metadata) => {
	            if (err) {
	                if (err.code === 404 && autoCreate) {
	                    const args = [];
	                    if (Object.keys(options).length > 0) {
	                        args.push(options);
	                    }
	                    args.push(onCreate);
	                    void self.create(...args);
	                    return;
	                }
	                callback(err, null, metadata);
	                return;
	            }
	            callback(null, self, metadata);
	        });
	    }
	    getMetadata(optionsOrCallback, cb) {
	        const [options, callback] = util_1.util.maybeOptionsOrCallback(optionsOrCallback, cb);
	        const methodConfig = (typeof this.methods.getMetadata === 'object' &&
	            this.methods.getMetadata) ||
	            {};
	        const reqOpts = extend(true, {
	            uri: '',
	        }, methodConfig.reqOpts, {
	            qs: options,
	        });
	        // The `request` method may have been overridden to hold any special
	        // behavior. Ensure we call the original `request` method.
	        ServiceObject.prototype.request.call(this, reqOpts, (err, body, res) => {
	            this.metadata = body;
	            callback(err, this.metadata, res);
	        });
	    }
	    /**
	     * Return the user's custom request interceptors.
	     */
	    getRequestInterceptors() {
	        // Interceptors should be returned in the order they were assigned.
	        const localInterceptors = this.interceptors
	            .filter(interceptor => typeof interceptor.request === 'function')
	            .map(interceptor => interceptor.request);
	        return this.parent.getRequestInterceptors().concat(localInterceptors);
	    }
	    setMetadata(metadata, optionsOrCallback, cb) {
	        const [options, callback] = util_1.util.maybeOptionsOrCallback(optionsOrCallback, cb);
	        const methodConfig = (typeof this.methods.setMetadata === 'object' &&
	            this.methods.setMetadata) ||
	            {};
	        const reqOpts = extend(true, {}, {
	            method: 'PATCH',
	            uri: '',
	        }, methodConfig.reqOpts, {
	            json: metadata,
	            qs: options,
	        });
	        // The `request` method may have been overridden to hold any special
	        // behavior. Ensure we call the original `request` method.
	        ServiceObject.prototype.request.call(this, reqOpts, (err, body, res) => {
	            this.metadata = body;
	            callback(err, this.metadata, res);
	        });
	    }
	    request_(reqOpts, callback) {
	        reqOpts = extend(true, {}, reqOpts);
	        if (this.projectId) {
	            reqOpts.projectId = this.projectId;
	        }
	        const isAbsoluteUrl = reqOpts.uri.indexOf('http') === 0;
	        const uriComponents = [this.baseUrl, this.id || '', reqOpts.uri];
	        if (isAbsoluteUrl) {
	            uriComponents.splice(0, uriComponents.indexOf(reqOpts.uri));
	        }
	        reqOpts.uri = uriComponents
	            .filter(x => x.trim()) // Limit to non-empty strings.
	            .map(uriComponent => {
	            const trimSlashesRegex = /^\/*|\/*$/g;
	            return uriComponent.replace(trimSlashesRegex, '');
	        })
	            .join('/');
	        const childInterceptors = arrify(reqOpts.interceptors_);
	        const localInterceptors = [].slice.call(this.interceptors);
	        reqOpts.interceptors_ = childInterceptors.concat(localInterceptors);
	        if (reqOpts.shouldReturnStream) {
	            return this.parent.requestStream(reqOpts);
	        }
	        this.parent.request(reqOpts, callback);
	    }
	    request(reqOpts, callback) {
	        this.request_(reqOpts, callback);
	    }
	    /**
	     * Make an authenticated API request.
	     *
	     * @param {object} reqOpts - Request options that are passed to `request`.
	     * @param {string} reqOpts.uri - A URI relative to the baseUrl.
	     */
	    requestStream(reqOpts) {
	        const opts = extend(true, reqOpts, { shouldReturnStream: true });
	        return this.request_(opts);
	    }
	}
	serviceObject.ServiceObject = ServiceObject;
	(0, promisify_1.promisifyAll)(ServiceObject, { exclude: ['getRequestInterceptors'] });
	
	return serviceObject;
}

var hasRequiredOperation;

function requireOperation () {
	if (hasRequiredOperation) return operation;
	hasRequiredOperation = 1;
	// Copyright 2016 Google LLC
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(operation, "__esModule", { value: true });
	operation.Operation = void 0;
	/*!
	 * @module common/operation
	 */
	const service_object_1 = requireServiceObject();
	const util_1 = require$$3$1;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	class Operation extends service_object_1.ServiceObject {
	    completeListeners;
	    hasActiveListeners;
	    /**
	     * An Operation object allows you to interact with APIs that take longer to
	     * process things.
	     *
	     * @constructor
	     * @alias module:common/operation
	     *
	     * @param {object} config - Configuration object.
	     * @param {module:common/service|module:common/serviceObject|module:common/grpcService|module:common/grpcServiceObject} config.parent - The parent object.
	     */
	    constructor(config) {
	        const methods = {
	            /**
	             * Checks to see if an operation exists.
	             */
	            exists: true,
	            /**
	             * Retrieves the operation.
	             */
	            get: true,
	            /**
	             * Retrieves metadata for the operation.
	             */
	            getMetadata: {
	                reqOpts: {
	                    name: config.id,
	                },
	            },
	        };
	        config = Object.assign({
	            baseUrl: '',
	        }, config);
	        // eslint-disable-next-line @typescript-eslint/no-explicit-any
	        config.methods = (config.methods || methods);
	        super(config);
	        this.completeListeners = 0;
	        this.hasActiveListeners = false;
	        this.listenForEvents_();
	    }
	    /**
	     * Wraps the `complete` and `error` events in a Promise.
	     *
	     * @return {Promise}
	     */
	    promise() {
	        return new Promise((resolve, reject) => {
	            this.on('error', reject).on('complete', (metadata) => {
	                resolve([metadata]);
	            });
	        });
	    }
	    /**
	     * Begin listening for events on the operation. This method keeps track of how
	     * many "complete" listeners are registered and removed, making sure polling
	     * is handled automatically.
	     *
	     * As long as there is one active "complete" listener, the connection is open.
	     * When there are no more listeners, the polling stops.
	     *
	     * @private
	     */
	    listenForEvents_() {
	        this.on('newListener', (event) => {
	            if (event === 'complete') {
	                this.completeListeners++;
	                if (!this.hasActiveListeners) {
	                    this.hasActiveListeners = true;
	                    void this.startPolling_();
	                }
	            }
	        });
	        this.on('removeListener', (event) => {
	            if (event === 'complete' && --this.completeListeners === 0) {
	                this.hasActiveListeners = false;
	            }
	        });
	    }
	    /**
	     * Poll for a status update. Returns null for an incomplete
	     * status, and metadata for a complete status.
	     *
	     * @private
	     */
	    poll_(callback) {
	        void this.getMetadata((err, body) => {
	            if (err || body.error) {
	                callback(err || body.error);
	                return;
	            }
	            if (!body.done) {
	                callback(null);
	                return;
	            }
	            callback(null, body);
	        });
	    }
	    /**
	     * Poll `getMetadata` to check the operation's status. This runs a loop to
	     * ping the API on an interval.
	     *
	     * Note: This method is automatically called once a "complete" event handler
	     * is registered on the operation.
	     *
	     * @private
	     */
	    async startPolling_() {
	        if (!this.hasActiveListeners) {
	            return;
	        }
	        try {
	            const metadata = await (0, util_1.promisify)(this.poll_.bind(this))();
	            if (!metadata) {
	                setTimeout(this.startPolling_.bind(this), this.pollIntervalMs || 500);
	                return;
	            }
	            this.emit('complete', metadata);
	        }
	        catch (err) {
	            this.emit('error', err);
	        }
	    }
	}
	operation.Operation = Operation;
	
	return operation;
}

var hasRequiredSrc$4;

function requireSrc$4 () {
	if (hasRequiredSrc$4) return src$6;
	hasRequiredSrc$4 = 1;
	(function (exports) {
		// Copyright 2016 Google LLC
		//
		// Licensed under the Apache License, Version 2.0 (the "License");
		// you may not use this file except in compliance with the License.
		// You may obtain a copy of the License at
		//
		//      http://www.apache.org/licenses/LICENSE-2.0
		//
		// Unless required by applicable law or agreed to in writing, software
		// distributed under the License is distributed on an "AS IS" BASIS,
		// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		// See the License for the specific language governing permissions and
		// limitations under the License.
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.util = exports.ApiError = exports.ServiceObject = exports.Service = exports.Operation = void 0;
		/**
		 * @type {module:common/operation}
		 * @private
		 */
		var operation_1 = requireOperation();
		Object.defineProperty(exports, "Operation", { enumerable: true, get: function () { return operation_1.Operation; } });
		/**
		 * @type {module:common/service}
		 * @private
		 */
		var service_1 = requireService();
		Object.defineProperty(exports, "Service", { enumerable: true, get: function () { return service_1.Service; } });
		/**
		 * @type {module:common/serviceObject}
		 * @private
		 */
		var service_object_1 = requireServiceObject();
		Object.defineProperty(exports, "ServiceObject", { enumerable: true, get: function () { return service_object_1.ServiceObject; } });
		/**
		 * @type {module:common/util}
		 * @private
		 */
		var util_1 = requireUtil$1();
		Object.defineProperty(exports, "ApiError", { enumerable: true, get: function () { return util_1.ApiError; } });
		Object.defineProperty(exports, "util", { enumerable: true, get: function () { return util_1.util; } });
		
	} (src$6));
	return src$6;
}

var src$2 = {};

var resourceStream = {};

var hasRequiredResourceStream;

function requireResourceStream () {
	if (hasRequiredResourceStream) return resourceStream;
	hasRequiredResourceStream = 1;
	/*!
	 * Copyright 2019 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(resourceStream, "__esModule", { value: true });
	resourceStream.ResourceStream = void 0;
	const stream_1 = require$$0$4;
	class ResourceStream extends stream_1.Transform {
	    _ended;
	    _maxApiCalls;
	    _nextQuery;
	    _otherArgs;
	    _reading;
	    _requestFn;
	    _requestsMade;
	    _resultsToSend;
	    constructor(args, requestFn) {
	        const options = Object.assign({ objectMode: true }, args.streamOptions);
	        super(options);
	        this._ended = false;
	        this._maxApiCalls = args.maxApiCalls === -1 ? Infinity : args.maxApiCalls;
	        this._nextQuery = args.query;
	        this._reading = false;
	        this._requestFn = requestFn;
	        this._requestsMade = 0;
	        this._resultsToSend = args.maxResults === -1 ? Infinity : args.maxResults;
	        this._otherArgs = [];
	    }
	    /* eslint-disable  @typescript-eslint/no-explicit-any */
	    end(...args) {
	        this._ended = true;
	        return super.end(...args);
	    }
	    _read() {
	        if (this._reading) {
	            return;
	        }
	        this._reading = true;
	        // Wrap in a try/catch to catch input linting errors, e.g.
	        // an invalid BigQuery query. These errors are thrown in an
	        // async fashion, which makes them un-catchable by the user.
	        try {
	            this._requestFn(this._nextQuery, (err, results, nextQuery, ...otherArgs) => {
	                if (err) {
	                    this.destroy(err);
	                    return;
	                }
	                this._otherArgs = otherArgs;
	                this._nextQuery = nextQuery;
	                if (this._resultsToSend !== Infinity) {
	                    results = results.splice(0, this._resultsToSend);
	                    this._resultsToSend -= results.length;
	                }
	                let more = true;
	                for (const result of results) {
	                    if (this._ended) {
	                        break;
	                    }
	                    more = this.push(result);
	                }
	                const isFinished = !this._nextQuery || this._resultsToSend < 1;
	                const madeMaxCalls = ++this._requestsMade >= this._maxApiCalls;
	                if (isFinished || madeMaxCalls) {
	                    this.end();
	                }
	                if (more && !this._ended) {
	                    setImmediate(() => this._read());
	                }
	                this._reading = false;
	            });
	        }
	        catch (e) {
	            this.destroy(e);
	        }
	    }
	}
	resourceStream.ResourceStream = ResourceStream;
	
	return resourceStream;
}

var hasRequiredSrc$3;

function requireSrc$3 () {
	if (hasRequiredSrc$3) return src$2;
	hasRequiredSrc$3 = 1;
	(function (exports) {
		/*!
		 * Copyright 2015 Google Inc. All Rights Reserved.
		 *
		 * Licensed under the Apache License, Version 2.0 (the "License");
		 * you may not use this file except in compliance with the License.
		 * You may obtain a copy of the License at
		 *
		 *      http://www.apache.org/licenses/LICENSE-2.0
		 *
		 * Unless required by applicable law or agreed to in writing, software
		 * distributed under the License is distributed on an "AS IS" BASIS,
		 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		 * See the License for the specific language governing permissions and
		 * limitations under the License.
		 */
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.ResourceStream = exports.paginator = exports.Paginator = void 0;
		/*!
		 * @module common/paginator
		 */
		const extend = requireExtend();
		const resource_stream_1 = requireResourceStream();
		Object.defineProperty(exports, "ResourceStream", { enumerable: true, get: function () { return resource_stream_1.ResourceStream; } });
		/*! Developer Documentation
		 *
		 * paginator is used to auto-paginate `nextQuery` methods as well as
		 * streamifying them.
		 *
		 * Before:
		 *
		 *   search.query('done=true', function(err, results, nextQuery) {
		 *     search.query(nextQuery, function(err, results, nextQuery) {});
		 *   });
		 *
		 * After:
		 *
		 *   search.query('done=true', function(err, results) {});
		 *
		 * Methods to extend should be written to accept callbacks and return a
		 * `nextQuery`.
		 */
		class Paginator {
		    /**
		     * Cache the original method, then overwrite it on the Class's prototype.
		     *
		     * @param {function} Class - The parent class of the methods to extend.
		     * @param {string|string[]} methodNames - Name(s) of the methods to extend.
		     */
		    // tslint:disable-next-line:variable-name
		    extend(Class, methodNames) {
		        if (typeof methodNames === 'string') {
		            methodNames = [methodNames];
		        }
		        methodNames.forEach(methodName => {
		            const originalMethod = Class.prototype[methodName];
		            // map the original method to a private member
		            Class.prototype[methodName + '_'] = originalMethod;
		            // overwrite the original to auto-paginate
		            /* eslint-disable  @typescript-eslint/no-explicit-any */
		            Class.prototype[methodName] = function (...args) {
		                const parsedArguments = paginator.parseArguments_(args);
		                return paginator.run_(parsedArguments, originalMethod.bind(this));
		            };
		        });
		    }
		    /**
		     * Wraps paginated API calls in a readable object stream.
		     *
		     * This method simply calls the nextQuery recursively, emitting results to a
		     * stream. The stream ends when `nextQuery` is null.
		     *
		     * `maxResults` will act as a cap for how many results are fetched and emitted
		     * to the stream.
		     *
		     * @param {string} methodName - Name of the method to streamify.
		     * @return {function} - Wrapped function.
		     */
		    /* eslint-disable  @typescript-eslint/no-explicit-any */
		    streamify(methodName) {
		        return function (
		        /* eslint-disable  @typescript-eslint/no-explicit-any */
		        ...args) {
		            const parsedArguments = paginator.parseArguments_(args);
		            const originalMethod = this[methodName + '_'] || this[methodName];
		            return paginator.runAsStream_(parsedArguments, originalMethod.bind(this));
		        };
		    }
		    /**
		     * Parse a pseudo-array `arguments` for a query and callback.
		     *
		     * @param {array} args - The original `arguments` pseduo-array that the original
		     *     method received.
		     */
		    /* eslint-disable  @typescript-eslint/no-explicit-any */
		    parseArguments_(args) {
		        let query;
		        let autoPaginate = true;
		        let maxApiCalls = -1;
		        let maxResults = -1;
		        let callback;
		        const firstArgument = args[0];
		        const lastArgument = args[args.length - 1];
		        if (typeof firstArgument === 'function') {
		            callback = firstArgument;
		        }
		        else {
		            query = firstArgument;
		        }
		        if (typeof lastArgument === 'function') {
		            callback = lastArgument;
		        }
		        if (typeof query === 'object') {
		            query = extend(true, {}, query);
		            // Check if the user only asked for a certain amount of results.
		            if (query.maxResults && typeof query.maxResults === 'number') {
		                // `maxResults` is used API-wide.
		                maxResults = query.maxResults;
		            }
		            else if (typeof query.pageSize === 'number') {
		                // `pageSize` is Pub/Sub's `maxResults`.
		                maxResults = query.pageSize;
		            }
		            if (query.maxApiCalls && typeof query.maxApiCalls === 'number') {
		                maxApiCalls = query.maxApiCalls;
		                delete query.maxApiCalls;
		            }
		            // maxResults is the user specified limit.
		            if (maxResults !== -1 || query.autoPaginate === false) {
		                autoPaginate = false;
		            }
		        }
		        const parsedArguments = {
		            query: query || {},
		            autoPaginate,
		            maxApiCalls,
		            maxResults,
		            callback,
		        };
		        parsedArguments.streamOptions = extend(true, {}, parsedArguments.query);
		        delete parsedArguments.streamOptions.autoPaginate;
		        delete parsedArguments.streamOptions.maxResults;
		        delete parsedArguments.streamOptions.pageSize;
		        return parsedArguments;
		    }
		    /**
		     * This simply checks to see if `autoPaginate` is set or not, if it's true
		     * then we buffer all results, otherwise simply call the original method.
		     *
		     * @param {array} parsedArguments - Parsed arguments from the original method
		     *     call.
		     * @param {object=|string=} parsedArguments.query - Query object. This is most
		     *     commonly an object, but to make the API more simple, it can also be a
		     *     string in some places.
		     * @param {function=} parsedArguments.callback - Callback function.
		     * @param {boolean} parsedArguments.autoPaginate - Auto-pagination enabled.
		     * @param {boolean} parsedArguments.maxApiCalls - Maximum API calls to make.
		     * @param {number} parsedArguments.maxResults - Maximum results to return.
		     * @param {function} originalMethod - The cached method that accepts a callback
		     *     and returns `nextQuery` to receive more results.
		     */
		    run_(parsedArguments, originalMethod) {
		        const query = parsedArguments.query;
		        const callback = parsedArguments.callback;
		        if (!parsedArguments.autoPaginate) {
		            return originalMethod(query, callback);
		        }
		        const results = new Array();
		        let otherArgs = [];
		        const promise = new Promise((resolve, reject) => {
		            const stream = paginator.runAsStream_(parsedArguments, originalMethod);
		            stream
		                .on('error', reject)
		                .on('data', (data) => results.push(data))
		                .on('end', () => {
		                otherArgs = stream._otherArgs || [];
		                resolve(results);
		            });
		        });
		        if (!callback) {
		            return promise.then(results => [results, query, ...otherArgs]);
		        }
		        promise.then(results => callback(null, results, query, ...otherArgs), (err) => callback(err));
		    }
		    /**
		     * This method simply calls the nextQuery recursively, emitting results to a
		     * stream. The stream ends when `nextQuery` is null.
		     *
		     * `maxResults` will act as a cap for how many results are fetched and emitted
		     * to the stream.
		     *
		     * @param {object=|string=} parsedArguments.query - Query object. This is most
		     *     commonly an object, but to make the API more simple, it can also be a
		     *     string in some places.
		     * @param {function=} parsedArguments.callback - Callback function.
		     * @param {boolean} parsedArguments.autoPaginate - Auto-pagination enabled.
		     * @param {boolean} parsedArguments.maxApiCalls - Maximum API calls to make.
		     * @param {number} parsedArguments.maxResults - Maximum results to return.
		     * @param {function} originalMethod - The cached method that accepts a callback
		     *     and returns `nextQuery` to receive more results.
		     * @return {stream} - Readable object stream.
		     */
		    /* eslint-disable  @typescript-eslint/no-explicit-any */
		    runAsStream_(parsedArguments, originalMethod) {
		        return new resource_stream_1.ResourceStream(parsedArguments, originalMethod);
		    }
		}
		exports.Paginator = Paginator;
		const paginator = new Paginator();
		exports.paginator = paginator;
		
	} (src$2));
	return src$2;
}

var src$1 = {};

var hasRequiredSrc$2;

function requireSrc$2 () {
	if (hasRequiredSrc$2) return src$1;
	hasRequiredSrc$2 = 1;
	(function (exports) {
		/* eslint-disable prefer-rest-params */
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.promisify = promisify;
		exports.promisifyAll = promisifyAll;
		exports.callbackify = callbackify;
		exports.callbackifyAll = callbackifyAll;
		/**
		 * Wraps a callback style function to conditionally return a promise.
		 *
		 * @param {function} originalMethod - The method to promisify.
		 * @param {object=} options - Promise options.
		 * @param {boolean} options.singular - Resolve the promise with single arg instead of an array.
		 * @return {function} wrapped
		 */
		function promisify(originalMethod, options) {
		    if (originalMethod.promisified_) {
		        return originalMethod;
		    }
		    options = options || {};
		    const slice = Array.prototype.slice;
		    // tslint:disable-next-line:no-any
		    const wrapper = function () {
		        let last;
		        for (last = arguments.length - 1; last >= 0; last--) {
		            const arg = arguments[last];
		            if (typeof arg === 'undefined') {
		                continue; // skip trailing undefined.
		            }
		            if (typeof arg !== 'function') {
		                break; // non-callback last argument found.
		            }
		            return originalMethod.apply(this, arguments);
		        }
		        // peel trailing undefined.
		        const args = slice.call(arguments, 0, last + 1);
		        // tslint:disable-next-line:variable-name
		        let PromiseCtor = Promise;
		        // Because dedupe will likely create a single install of
		        // @google-cloud/common to be shared amongst all modules, we need to
		        // localize it at the Service level.
		        if (this && this.Promise) {
		            PromiseCtor = this.Promise;
		        }
		        return new PromiseCtor((resolve, reject) => {
		            // tslint:disable-next-line:no-any
		            args.push((...args) => {
		                const callbackArgs = slice.call(args);
		                const err = callbackArgs.shift();
		                if (err) {
		                    return reject(err);
		                }
		                if (options.singular && callbackArgs.length === 1) {
		                    resolve(callbackArgs[0]);
		                }
		                else {
		                    resolve(callbackArgs);
		                }
		            });
		            originalMethod.apply(this, args);
		        });
		    };
		    wrapper.promisified_ = true;
		    return wrapper;
		}
		/**
		 * Promisifies certain Class methods. This will not promisify private or
		 * streaming methods.
		 *
		 * @param {module:common/service} Class - Service class.
		 * @param {object=} options - Configuration object.
		 */
		// tslint:disable-next-line:variable-name
		function promisifyAll(Class, options) {
		    const exclude = (options && options.exclude) || [];
		    const ownPropertyNames = Object.getOwnPropertyNames(Class.prototype);
		    const methods = ownPropertyNames.filter(methodName => {
		        // clang-format off
		        return (!exclude.includes(methodName) &&
		            typeof Class.prototype[methodName] === 'function' && // is it a function?
		            !/(^_|(Stream|_)|promise$)|^constructor$/.test(methodName) // is it promisable?
		        );
		        // clang-format on
		    });
		    methods.forEach(methodName => {
		        const originalMethod = Class.prototype[methodName];
		        if (!originalMethod.promisified_) {
		            Class.prototype[methodName] = exports.promisify(originalMethod, options);
		        }
		    });
		}
		/**
		 * Wraps a promisy type function to conditionally call a callback function.
		 *
		 * @param {function} originalMethod - The method to callbackify.
		 * @param {object=} options - Callback options.
		 * @param {boolean} options.singular - Pass to the callback a single arg instead of an array.
		 * @return {function} wrapped
		 */
		function callbackify(originalMethod) {
		    if (originalMethod.callbackified_) {
		        return originalMethod;
		    }
		    // tslint:disable-next-line:no-any
		    const wrapper = function () {
		        if (typeof arguments[arguments.length - 1] !== 'function') {
		            return originalMethod.apply(this, arguments);
		        }
		        const cb = Array.prototype.pop.call(arguments);
		        originalMethod.apply(this, arguments).then(
		        // tslint:disable-next-line:no-any
		        (res) => {
		            res = Array.isArray(res) ? res : [res];
		            cb(null, ...res);
		        }, (err) => cb(err));
		    };
		    wrapper.callbackified_ = true;
		    return wrapper;
		}
		/**
		 * Callbackifies certain Class methods. This will not callbackify private or
		 * streaming methods.
		 *
		 * @param {module:common/service} Class - Service class.
		 * @param {object=} options - Configuration object.
		 */
		function callbackifyAll(
		// tslint:disable-next-line:variable-name
		Class, options) {
		    const exclude = (options && options.exclude) || [];
		    const ownPropertyNames = Object.getOwnPropertyNames(Class.prototype);
		    const methods = ownPropertyNames.filter(methodName => {
		        // clang-format off
		        return (!exclude.includes(methodName) &&
		            typeof Class.prototype[methodName] === 'function' && // is it a function?
		            !/^_|(Stream|_)|^constructor$/.test(methodName) // is it callbackifyable?
		        );
		        // clang-format on
		    });
		    methods.forEach(methodName => {
		        const originalMethod = Class.prototype[methodName];
		        if (!originalMethod.callbackified_) {
		            Class.prototype[methodName] = exports.callbackify(originalMethod);
		        }
		    });
		}
		
	} (src$1));
	return src$1;
}

var src = {};

var hasRequiredSrc$1;

function requireSrc$1 () {
	if (hasRequiredSrc$1) return src;
	hasRequiredSrc$1 = 1;
	/*!
	 * Copyright 2019 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(src, "__esModule", { value: true });
	src.PreciseDate = void 0;
	const FULL_ISO_REG = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{4,9}Z/;
	const NO_BIG_INT = 'BigInt only available in Node >= v10.7. Consider using getFullTimeString instead.';
	var Sign;
	(function (Sign) {
	    Sign[Sign["NEGATIVE"] = -1] = "NEGATIVE";
	    Sign[Sign["POSITIVE"] = 1] = "POSITIVE";
	    Sign[Sign["ZERO"] = 0] = "ZERO";
	})(Sign || (Sign = {}));
	/**
	 * The native Date object.
	 * @external Date
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date}
	 */
	/**
	 * @typedef {array} DateTuple
	 * @property {number} 0 Represents seconds of UTC time since Unix epoch
	 *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
	 *     9999-12-31T23:59:59Z inclusive.
	 * @property {number} 1 Non-negative fractions of a second at nanosecond
	 *     resolution. Negative second values with fractions must still have
	 *     non-negative nanos values that count forward in time. Must be from 0 to
	 *     999,999,999 inclusive.
	 */
	/**
	 * @typedef {object} DateStruct
	 * @property {number} seconds Represents seconds of UTC time since Unix epoch
	 *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
	 *     9999-12-31T23:59:59Z inclusive.
	 * @property {number} nanos Non-negative fractions of a second at nanosecond
	 *     resolution. Negative second values with fractions must still have
	 *     non-negative nanos values that count forward in time. Must be from 0 to
	 *     999,999,999 inclusive.
	 */
	/**
	 * Date object with nanosecond precision. Supports all standard Date arguments
	 * in addition to several custom types as noted below.
	 *
	 * @class
	 * @extends external:Date
	 *
	 * @param {number|string|bigint|Date|DateTuple|DateStruct} [time] The time
	 *     value.
	 * @param {...number} [dateFields] Additional date fields (month, date, hours,
	 *     minutes, seconds, milliseconds, microseconds, nanoseconds).
	 *
	 * @example <caption>With a RFC 3339 formatted string.</caption>
	 * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
	 *
	 * @example <caption>With a nanosecond timestamp string.</caption>
	 * const date = new PreciseDate('1549622069481320032');
	 *
	 * @example <caption>With a BigInt (requires Node >= v10.7)</caption>
	 * const date = new PreciseDate(1549622069481320032n);
	 *
	 * @example <caption>With a tuple containing seconds and nanoseconds.</caption>
	 * const date = new PreciseDate([1549622069, 481320032]);
	 *
	 * @example <caption>With an object containing `seconds` and `nanos`</caption>
	 * const date = new PreciseDate({seconds: 1549622069, nanos: 481320032});
	 *
	 * @example <caption>Specifiying date fields</caption>
	 * const date = new PreciseDate(2018, 5, 14, 41, 11, 34, 123, 874, 321);
	 */
	class PreciseDate extends Date {
	    _micros = 0;
	    _nanos = 0;
	    constructor(time) {
	        super();
	        if (time && typeof time !== 'number' && !(time instanceof Date)) {
	            this.setFullTime(PreciseDate.parseFull(time));
	            return;
	        }
	        // eslint-disable-next-line prefer-rest-params
	        const args = Array.from(arguments);
	        const dateFields = args.slice(0, 7);
	        const date = new Date(...dateFields);
	        const nanos = args.length === 9 ? args.pop() : 0;
	        const micros = args.length === 8 ? args.pop() : 0;
	        this.setTime(date.getTime());
	        this.setMicroseconds(micros);
	        this.setNanoseconds(nanos);
	    }
	    /**
	     * Returns the specified date represented in nanoseconds according to
	     * universal time.
	     *
	     * **NOTE:** Because this method returns a `BigInt` it requires Node >= v10.7.
	     * Use {@link PreciseDate#getFullTimeString} to get the time as a string.
	     *
	     * @see {@link https://github.com/tc39/proposal-bigint|BigInt}
	     *
	     * @throws {error} If `BigInt` is unavailable.
	     * @returns {bigint}
	     *
	     * @example
	     * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
	     *
	     * console.log(date.getFullTime());
	     * // expected output: 1549622069481145231n
	     */
	    getFullTime() {
	        if (typeof BigInt !== 'function') {
	            throw new Error(NO_BIG_INT);
	        }
	        return BigInt(this.getFullTimeString());
	    }
	    /**
	     * Returns a string of the specified date represented in nanoseconds according
	     * to universal time.
	     *
	     * @returns {string}
	     *
	     * @example
	     * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
	     *
	     * console.log(date.getFullTimeString());
	     * // expected output: "1549622069481145231"
	     */
	    getFullTimeString() {
	        const seconds = this._getSeconds();
	        let nanos = this._getNanos();
	        if (nanos && Math.sign(seconds) === Sign.NEGATIVE) {
	            nanos = 1e9 - nanos;
	        }
	        return `${seconds}${padLeft(nanos, 9)}`;
	    }
	    /**
	     * Returns the microseconds in the specified date according to universal time.
	     *
	     * @returns {number}
	     *
	     * @example
	     * const date = new PreciseDate('2019-02-08T10:34:29.481145Z');
	     *
	     * console.log(date.getMicroseconds());
	     * // expected output: 145
	     */
	    getMicroseconds() {
	        return this._micros;
	    }
	    /**
	     * Returns the nanoseconds in the specified date according to universal time.
	     *
	     * @returns {number}
	     *
	     * @example
	     * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
	     *
	     * console.log(date.getNanoseconds());
	     * // expected output: 231
	     */
	    getNanoseconds() {
	        return this._nanos;
	    }
	    /**
	     * Sets the microseconds for a specified date according to universal time.
	     *
	     * @param {number} microseconds A number representing the microseconds.
	     * @returns {string} Returns a string representing the nanoseconds in the
	     *     specified date according to universal time.
	     *
	     * @example
	     * const date = new PreciseDate();
	     *
	     * date.setMicroseconds(149);
	     *
	     * console.log(date.getMicroseconds());
	     * // expected output: 149
	     */
	    setMicroseconds(micros) {
	        const abs = Math.abs(micros);
	        let millis = this.getUTCMilliseconds();
	        if (abs >= 1000) {
	            millis += Math.floor(abs / 1000) * Math.sign(micros);
	            micros %= 1000;
	        }
	        if (Math.sign(micros) === Sign.NEGATIVE) {
	            millis -= 1;
	            micros += 1000;
	        }
	        this._micros = micros;
	        this.setUTCMilliseconds(millis);
	        return this.getFullTimeString();
	    }
	    /**
	     * Sets the nanoseconds for a specified date according to universal time.
	     *
	     * @param {number} nanoseconds A number representing the nanoseconds.
	     * @returns {string} Returns a string representing the nanoseconds in the
	     *     specified date according to universal time.
	     *
	     * @example
	     * const date = new PreciseDate();
	     *
	     * date.setNanoseconds(231);
	     *
	     * console.log(date.getNanoseconds());
	     * // expected output: 231
	     */
	    setNanoseconds(nanos) {
	        const abs = Math.abs(nanos);
	        let micros = this._micros;
	        if (abs >= 1000) {
	            micros += Math.floor(abs / 1000) * Math.sign(nanos);
	            nanos %= 1000;
	        }
	        if (Math.sign(nanos) === Sign.NEGATIVE) {
	            micros -= 1;
	            nanos += 1000;
	        }
	        this._nanos = nanos;
	        return this.setMicroseconds(micros);
	    }
	    /**
	     * Sets the PreciseDate object to the time represented by a number of
	     * nanoseconds since January 1, 1970, 00:00:00 UTC.
	     *
	     * @param {bigint|number|string} time Value representing the number of
	     *     nanoseconds since January 1, 1970, 00:00:00 UTC.
	     * @returns {string} Returns a string representing the nanoseconds in the
	     *     specified date according to universal time (effectively, the value of
	     *     the argument).
	     *
	     * @see {@link https://github.com/tc39/proposal-bigint|BigInt}
	     *
	     * @example <caption>With a nanosecond string.</caption>
	     * const date = new PreciseDate();
	     * date.setFullTime('1549622069481145231');
	     *
	     * @example <caption>With a BigInt</caption>
	     * date.setFullTime(1549622069481145231n);
	     */
	    setFullTime(time) {
	        if (typeof time !== 'string') {
	            time = time.toString();
	        }
	        const sign = Math.sign(Number(time));
	        time = time.replace(/^-/, '');
	        const seconds = Number(time.substr(0, time.length - 9)) * sign;
	        const nanos = Number(time.substr(-9)) * sign;
	        this.setTime(seconds * 1000);
	        return this.setNanoseconds(nanos);
	    }
	    /**
	     * Sets the PreciseDate object to the time represented by a number of
	     * milliseconds since January 1, 1970, 00:00:00 UTC. Calling this method will
	     * reset both the microseconds and nanoseconds to 0.
	     *
	     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setTime|Date#setTime}
	     *
	     * @param {number} time Value representing the number of milliseconds since
	     *     January 1, 1970, 00:00:00 UTC.
	     * @returns {string} The number of milliseconds between January 1, 1970,
	     *     00:00:00 UTC and the updated date (effectively, the value of the
	     *     argument).
	     */
	    setTime(time) {
	        this._micros = 0;
	        this._nanos = 0;
	        return super.setTime(time);
	    }
	    /**
	     * Returns a string in RFC 3339 format. Unlike the native `Date#toISOString`,
	     * this will return 9 digits to represent sub-second precision.
	     *
	     * @see {@link https://tools.ietf.org/html/rfc3339|RFC 3339}
	     *
	     * @returns {string}
	     *
	     * @example
	     * const date = new PreciseDate(1549622069481145231n);
	     *
	     * console.log(date.toISOString());
	     * // expected output: "2019-02-08T10:34:29.481145231Z"
	     */
	    toISOString() {
	        const micros = padLeft(this._micros, 3);
	        const nanos = padLeft(this._nanos, 3);
	        return super.toISOString().replace(/z$/i, `${micros}${nanos}Z`);
	    }
	    /**
	     * Returns an object representing the specified date according to universal
	     * time.
	     *
	     * @see {@link https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#timestamp|google.protobuf.Timestamp}
	     *
	     * @returns {DateStruct}
	     *
	     * @example
	     * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
	     *
	     * console.log(date.toStruct());
	     * // expected output: {seconds: 1549622069, nanos: 481145231}
	     */
	    toStruct() {
	        let seconds = this._getSeconds();
	        const nanos = this._getNanos();
	        const sign = Math.sign(seconds);
	        // These objects are essentially a mirror of protobuf timestamps.
	        // `nanos` must always count forward in time, even if the date is <= Unix
	        // epoch. To do this we just need to count backwards 1 second and return the
	        // nanoseconds as is.
	        if (sign === Sign.NEGATIVE && nanos) {
	            seconds -= 1;
	        }
	        return { seconds, nanos };
	    }
	    /**
	     * Returns a tuple representing the specified date according to universal
	     * time.
	     *
	     * @returns {DateTuple}
	     *
	     * @example
	     * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
	     *
	     * console.log(date.toTuple());
	     * // expected output: [1549622069, 481145231]
	     */
	    toTuple() {
	        const { seconds, nanos } = this.toStruct();
	        return [seconds, nanos];
	    }
	    /**
	     * Returns the total number of seconds in the specified date since Unix epoch.
	     * Numbers representing < epoch will be negative.
	     *
	     * @private
	     *
	     * @returns {number}
	     */
	    _getSeconds() {
	        const time = this.getTime();
	        const sign = Math.sign(time);
	        return Math.floor(Math.abs(time) / 1000) * sign;
	    }
	    /**
	     * Returns the sub-second precision of the specified date. This will always be
	     * a positive number.
	     *
	     * @private
	     *
	     * @returns {number}
	     */
	    _getNanos() {
	        const msInNanos = this.getUTCMilliseconds() * 1e6;
	        const microsInNanos = this._micros * 1000;
	        return this._nanos + msInNanos + microsInNanos;
	    }
	    /**
	     * Parses a precise time.
	     *
	     * @static
	     *
	     * @param {string|bigint|DateTuple|DateStruct} time The precise time value.
	     * @returns {string} Returns a string representing the nanoseconds in the
	     *     specified date according to universal time.
	     *
	     * @example <caption>From a RFC 3339 formatted string.</caption>
	     * const time = PreciseDate.parseFull('2019-02-08T10:34:29.481145231Z');
	     * console.log(time); // expected output: "1549622069481145231"
	     *
	     * @example <caption>From a nanosecond timestamp string.</caption>
	     * const time = PreciseDate.parseFull('1549622069481145231');
	     * console.log(time); // expected output: "1549622069481145231"
	     *
	     * @example <caption>From a BigInt (requires Node >= v10.7)</caption>
	     * const time = PreciseDate.parseFull(1549622069481145231n);
	     * console.log(time); // expected output: "1549622069481145231"
	     *
	     * @example <caption>From a tuple.</caption>
	     * const time = PreciseDate.parseFull([1549622069, 481145231]);
	     * console.log(time); // expected output: "1549622069481145231"
	     *
	     * @example <caption>From an object.</caption>
	     * const struct = {seconds: 1549622069, nanos: 481145231};
	     * const time = PreciseDate.parseFull(struct);
	     * console.log(time); // expected output: "1549622069481145231"
	     */
	    static parseFull(time) {
	        const date = new PreciseDate();
	        if (Array.isArray(time)) {
	            const [seconds, nanos] = time;
	            time = { seconds, nanos };
	        }
	        if (isFullTime(time)) {
	            date.setFullTime(time);
	        }
	        else if (isStruct(time)) {
	            const { seconds, nanos } = parseProto(time);
	            date.setTime(seconds * 1000);
	            date.setNanoseconds(nanos);
	        }
	        else if (isFullISOString(time)) {
	            date.setFullTime(parseFullISO(time));
	        }
	        else {
	            date.setTime(new Date(time).getTime());
	        }
	        return date.getFullTimeString();
	    }
	    /**
	     * Accepts the same number parameters as the PreciseDate constructor, but
	     * treats them as UTC. It returns a string that represents the number of
	     * nanoseconds since January 1, 1970, 00:00:00 UTC.
	     *
	     * **NOTE:** Because this method returns a `BigInt` it requires Node >= v10.7.
	     *
	     * @see {@link https://github.com/tc39/proposal-bigint|BigInt}
	     *
	     * @static
	     *
	     * @throws {error} If `BigInt` is unavailable.
	     *
	     * @param {...number} [dateFields] The date fields.
	     * @returns {bigint}
	     *
	     * @example
	     * const time = PreciseDate.fullUTC(2019, 1, 8, 10, 34, 29, 481, 145, 231);
	     * console.log(time); // expected output: 1549622069481145231n
	     */
	    static fullUTC(...args) {
	        if (typeof BigInt !== 'function') {
	            throw new Error(NO_BIG_INT);
	        }
	        return BigInt(PreciseDate.fullUTCString(...args));
	    }
	    /**
	     * Accepts the same number parameters as the PreciseDate constructor, but
	     * treats them as UTC. It returns a string that represents the number of
	     * nanoseconds since January 1, 1970, 00:00:00 UTC.
	     *
	     * @static
	     *
	     * @param {...number} [dateFields] The date fields.
	     * @returns {string}
	     *
	     * @example
	     * const time = PreciseDate.fullUTCString(2019, 1, 8, 10, 34, 29, 481, 145,
	     * 231); console.log(time); // expected output: '1549622069481145231'
	     */
	    static fullUTCString(...args) {
	        const milliseconds = Date.UTC(...args.slice(0, 7));
	        const date = new PreciseDate(milliseconds);
	        if (args.length === 9) {
	            date.setNanoseconds(args.pop());
	        }
	        if (args.length === 8) {
	            date.setMicroseconds(args.pop());
	        }
	        return date.getFullTimeString();
	    }
	}
	src.PreciseDate = PreciseDate;
	/**
	 * Parses a RFC 3339 formatted string representation of the date, and returns
	 * a string representing the nanoseconds since January 1, 1970, 00:00:00.
	 *
	 * @private
	 *
	 * @param {string} time The RFC 3339 formatted string.
	 * @returns {string}
	 */
	function parseFullISO(time) {
	    let digits = '0';
	    time = time.replace(/\.(\d+)/, ($0, $1) => {
	        digits = $1;
	        return '.000';
	    });
	    const nanos = Number(padRight(digits, 9));
	    const date = new PreciseDate(time);
	    return date.setNanoseconds(nanos);
	}
	/**
	 * Normalizes a {@link google.protobuf.Timestamp} object.
	 *
	 * @private
	 *
	 * @param {google.protobuf.Timestamp} timestamp The timestamp object.
	 * @returns {DateStruct}
	 */
	function parseProto({ seconds = 0, nanos = 0 }) {
	    if (typeof seconds.toNumber === 'function') {
	        seconds = seconds.toNumber();
	    }
	    seconds = Number(seconds);
	    nanos = Number(nanos);
	    return { seconds, nanos };
	}
	/**
	 * Checks to see if time value is specified in nanoseconds. We assume that all
	 * BigInt and string timestamps represent nanoseconds.
	 *
	 * @private
	 *
	 * @param {*} time The time to check.
	 * @returns {boolean}
	 */
	function isFullTime(time) {
	    return (typeof time === 'bigint' || (typeof time === 'string' && /^\d+$/.test(time)));
	}
	/**
	 * Checks to see if time value is a {@link DateStruct}.
	 *
	 * @private
	 *
	 * @param {*} time The time to check.
	 * @returns {boolean}
	 */
	function isStruct(time) {
	    return ((typeof time === 'object' &&
	        typeof time.seconds !== 'undefined') ||
	        typeof time.nanos === 'number');
	}
	/**
	 * Checks to see if the time value is a RFC 3339 formatted string.
	 *
	 * @private
	 *
	 * @param {*} time The time to check.
	 * @returns {boolean}
	 */
	function isFullISOString(time) {
	    return typeof time === 'string' && FULL_ISO_REG.test(time);
	}
	/**
	 * Pads a number/string with "0" to the left.
	 *
	 * @private
	 *
	 * @param {string|number} n The number/string to pad.
	 * @param {number} min The min size of the padded string.
	 * @returns {string}
	 */
	function padLeft(n, min) {
	    const padding = getPadding(n, min);
	    return `${padding}${n}`;
	}
	/**
	 * Pads a number/string with "0" to the right.
	 *
	 * @private
	 *
	 * @param {string|number} n The number/string to pad.
	 * @param {number} min The min size of the padded string.
	 * @returns {string}
	 */
	function padRight(n, min) {
	    const padding = getPadding(n, min);
	    return `${n}${padding}`;
	}
	/**
	 * Creates padding based on current size and min size needed.
	 *
	 * @private
	 *
	 * @param {string|number} n The number/string to pad.
	 * @param {number} [min=3] The min size of the padded string.
	 * @returns {string}
	 */
	function getPadding(n, min) {
	    const size = Math.max(min - n.toString().length, 0);
	    return '0'.repeat(size);
	}
	
	return src;
}

var util = {};

var hasRequiredUtil;

function requireUtil () {
	if (hasRequiredUtil) return util;
	hasRequiredUtil = 1;
	// Copyright 2025 Google LLC
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//     https://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(util, "__esModule", { value: true });
	util.toArray = toArray;
	util.isObject = isObject;
	util.isString = isString;
	util.isArray = isArray;
	util.isDate = isDate;
	util.isBoolean = isBoolean;
	util.isNumber = isNumber;
	/**
	 * Convert a value to an array. Replacement to arrify
	 * @internal
	 */
	function toArray(value) {
	    if (value === null || value === undefined) {
	        return [];
	    }
	    if (Array.isArray(value)) {
	        return value;
	    }
	    if (typeof value === 'string') {
	        return [value];
	    }
	    if (typeof value[Symbol.iterator] === 'function') {
	        return [...value];
	    }
	    return [value];
	}
	/**
	 * Check if value is an object.
	 * @internal
	 */
	function isObject(value) {
	    return value && [undefined, Object].includes(value.constructor);
	}
	/**
	 * Check if value is an object.
	 * @internal
	 */
	function isString(value) {
	    return Object.prototype.toString.call(value) === '[object String]';
	}
	/**
	 * Check if value is an array.
	 * @internal
	 */
	function isArray(value) {
	    return Array.isArray(value);
	}
	/**
	 * Check if value is an instance of Date.
	 * @internal
	 */
	function isDate(value) {
	    return value instanceof Date;
	}
	/**
	 * Check if value is a boolean.
	 * @internal
	 */
	function isBoolean(value) {
	    return Object.prototype.toString.call(value) === '[object Boolean]';
	}
	/**
	 * Check if value is a number.
	 * @internal
	 */
	function isNumber(value) {
	    return Object.prototype.toString.call(value) === '[object Number]';
	}
	
	return util;
}

var big$1 = {exports: {}};

/*
 *  big.js v6.2.2
 *  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
 *  Copyright (c) 2024 Michael Mclaughlin
 *  https://github.com/MikeMcl/big.js/LICENCE.md
 */
var big = big$1.exports;

var hasRequiredBig;

function requireBig () {
	if (hasRequiredBig) return big$1.exports;
	hasRequiredBig = 1;
	(function (module) {
(function (GLOBAL) {
		  var Big,


		/************************************** EDITABLE DEFAULTS *****************************************/


		    // The default values below must be integers within the stated ranges.

		    /*
		     * The maximum number of decimal places (DP) of the results of operations involving division:
		     * div and sqrt, and pow with negative exponents.
		     */
		    DP = 20,            // 0 to MAX_DP

		    /*
		     * The rounding mode (RM) used when rounding to the above decimal places.
		     *
		     *  0  Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
		     *  1  To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
		     *  2  To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
		     *  3  Away from zero.                                  (ROUND_UP)
		     */
		    RM = 1,             // 0, 1, 2 or 3

		    // The maximum value of DP and Big.DP.
		    MAX_DP = 1E6,       // 0 to 1000000

		    // The maximum magnitude of the exponent argument to the pow method.
		    MAX_POWER = 1E6,    // 1 to 1000000

		    /*
		     * The negative exponent (NE) at and beneath which toString returns exponential notation.
		     * (JavaScript numbers: -7)
		     * -1000000 is the minimum recommended exponent value of a Big.
		     */
		    NE = -7,            // 0 to -1000000

		    /*
		     * The positive exponent (PE) at and above which toString returns exponential notation.
		     * (JavaScript numbers: 21)
		     * 1000000 is the maximum recommended exponent value of a Big, but this limit is not enforced.
		     */
		    PE = 21,            // 0 to 1000000

		    /*
		     * When true, an error will be thrown if a primitive number is passed to the Big constructor,
		     * or if valueOf is called, or if toNumber is called on a Big which cannot be converted to a
		     * primitive number without a loss of precision.
		     */
		    STRICT = false,     // true or false


		/**************************************************************************************************/


		    // Error messages.
		    NAME = '[big.js] ',
		    INVALID = NAME + 'Invalid ',
		    INVALID_DP = INVALID + 'decimal places',
		    INVALID_RM = INVALID + 'rounding mode',
		    DIV_BY_ZERO = NAME + 'Division by zero',

		    // The shared prototype object.
		    P = {},
		    UNDEFINED = void 0,
		    NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;


		  /*
		   * Create and return a Big constructor.
		   */
		  function _Big_() {

		    /*
		     * The Big constructor and exported function.
		     * Create and return a new instance of a Big number object.
		     *
		     * n {number|string|Big} A numeric value.
		     */
		    function Big(n) {
		      var x = this;

		      // Enable constructor usage without new.
		      if (!(x instanceof Big)) return n === UNDEFINED ? _Big_() : new Big(n);

		      // Duplicate.
		      if (n instanceof Big) {
		        x.s = n.s;
		        x.e = n.e;
		        x.c = n.c.slice();
		      } else {
		        if (typeof n !== 'string') {
		          if (Big.strict === true && typeof n !== 'bigint') {
		            throw TypeError(INVALID + 'value');
		          }

		          // Minus zero?
		          n = n === 0 && 1 / n < 0 ? '-0' : String(n);
		        }

		        parse(x, n);
		      }

		      // Retain a reference to this Big constructor.
		      // Shadow Big.prototype.constructor which points to Object.
		      x.constructor = Big;
		    }

		    Big.prototype = P;
		    Big.DP = DP;
		    Big.RM = RM;
		    Big.NE = NE;
		    Big.PE = PE;
		    Big.strict = STRICT;
		    Big.roundDown = 0;
		    Big.roundHalfUp = 1;
		    Big.roundHalfEven = 2;
		    Big.roundUp = 3;

		    return Big;
		  }


		  /*
		   * Parse the number or string value passed to a Big constructor.
		   *
		   * x {Big} A Big number instance.
		   * n {number|string} A numeric value.
		   */
		  function parse(x, n) {
		    var e, i, nl;

		    if (!NUMERIC.test(n)) {
		      throw Error(INVALID + 'number');
		    }

		    // Determine sign.
		    x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

		    // Decimal point?
		    if ((e = n.indexOf('.')) > -1) n = n.replace('.', '');

		    // Exponential form?
		    if ((i = n.search(/e/i)) > 0) {

		      // Determine exponent.
		      if (e < 0) e = i;
		      e += +n.slice(i + 1);
		      n = n.substring(0, i);
		    } else if (e < 0) {

		      // Integer.
		      e = n.length;
		    }

		    nl = n.length;

		    // Determine leading zeros.
		    for (i = 0; i < nl && n.charAt(i) == '0';) ++i;

		    if (i == nl) {

		      // Zero.
		      x.c = [x.e = 0];
		    } else {

		      // Determine trailing zeros.
		      for (; nl > 0 && n.charAt(--nl) == '0';);
		      x.e = e - i - 1;
		      x.c = [];

		      // Convert string to array of digits without leading/trailing zeros.
		      for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
		    }

		    return x;
		  }


		  /*
		   * Round Big x to a maximum of sd significant digits using rounding mode rm.
		   *
		   * x {Big} The Big to round.
		   * sd {number} Significant digits: integer, 0 to MAX_DP inclusive.
		   * rm {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
		   * [more] {boolean} Whether the result of division was truncated.
		   */
		  function round(x, sd, rm, more) {
		    var xc = x.c;

		    if (rm === UNDEFINED) rm = x.constructor.RM;
		    if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
		      throw Error(INVALID_RM);
		    }

		    if (sd < 1) {
		      more =
		        rm === 3 && (more || !!xc[0]) || sd === 0 && (
		        rm === 1 && xc[0] >= 5 ||
		        rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED))
		      );

		      xc.length = 1;

		      if (more) {

		        // 1, 0.1, 0.01, 0.001, 0.0001 etc.
		        x.e = x.e - sd + 1;
		        xc[0] = 1;
		      } else {

		        // Zero.
		        xc[0] = x.e = 0;
		      }
		    } else if (sd < xc.length) {

		      // xc[sd] is the digit after the digit that may be rounded up.
		      more =
		        rm === 1 && xc[sd] >= 5 ||
		        rm === 2 && (xc[sd] > 5 || xc[sd] === 5 &&
		          (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) ||
		        rm === 3 && (more || !!xc[0]);

		      // Remove any digits after the required precision.
		      xc.length = sd;

		      // Round up?
		      if (more) {

		        // Rounding up may mean the previous digit has to be rounded up.
		        for (; ++xc[--sd] > 9;) {
		          xc[sd] = 0;
		          if (sd === 0) {
		            ++x.e;
		            xc.unshift(1);
		            break;
		          }
		        }
		      }

		      // Remove trailing zeros.
		      for (sd = xc.length; !xc[--sd];) xc.pop();
		    }

		    return x;
		  }


		  /*
		   * Return a string representing the value of Big x in normal or exponential notation.
		   * Handles P.toExponential, P.toFixed, P.toJSON, P.toPrecision, P.toString and P.valueOf.
		   */
		  function stringify(x, doExponential, isNonzero) {
		    var e = x.e,
		      s = x.c.join(''),
		      n = s.length;

		    // Exponential notation?
		    if (doExponential) {
		      s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;

		    // Normal notation.
		    } else if (e < 0) {
		      for (; ++e;) s = '0' + s;
		      s = '0.' + s;
		    } else if (e > 0) {
		      if (++e > n) {
		        for (e -= n; e--;) s += '0';
		      } else if (e < n) {
		        s = s.slice(0, e) + '.' + s.slice(e);
		      }
		    } else if (n > 1) {
		      s = s.charAt(0) + '.' + s.slice(1);
		    }

		    return x.s < 0 && isNonzero ? '-' + s : s;
		  }


		  // Prototype/instance methods


		  /*
		   * Return a new Big whose value is the absolute value of this Big.
		   */
		  P.abs = function () {
		    var x = new this.constructor(this);
		    x.s = 1;
		    return x;
		  };


		  /*
		   * Return 1 if the value of this Big is greater than the value of Big y,
		   *       -1 if the value of this Big is less than the value of Big y, or
		   *        0 if they have the same value.
		   */
		  P.cmp = function (y) {
		    var isneg,
		      x = this,
		      xc = x.c,
		      yc = (y = new x.constructor(y)).c,
		      i = x.s,
		      j = y.s,
		      k = x.e,
		      l = y.e;

		    // Either zero?
		    if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;

		    // Signs differ?
		    if (i != j) return i;

		    isneg = i < 0;

		    // Compare exponents.
		    if (k != l) return k > l ^ isneg ? 1 : -1;

		    j = (k = xc.length) < (l = yc.length) ? k : l;

		    // Compare digit by digit.
		    for (i = -1; ++i < j;) {
		      if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
		    }

		    // Compare lengths.
		    return k == l ? 0 : k > l ^ isneg ? 1 : -1;
		  };


		  /*
		   * Return a new Big whose value is the value of this Big divided by the value of Big y, rounded,
		   * if necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
		   */
		  P.div = function (y) {
		    var x = this,
		      Big = x.constructor,
		      a = x.c,                  // dividend
		      b = (y = new Big(y)).c,   // divisor
		      k = x.s == y.s ? 1 : -1,
		      dp = Big.DP;

		    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
		      throw Error(INVALID_DP);
		    }

		    // Divisor is zero?
		    if (!b[0]) {
		      throw Error(DIV_BY_ZERO);
		    }

		    // Dividend is 0? Return +-0.
		    if (!a[0]) {
		      y.s = k;
		      y.c = [y.e = 0];
		      return y;
		    }

		    var bl, bt, n, cmp, ri,
		      bz = b.slice(),
		      ai = bl = b.length,
		      al = a.length,
		      r = a.slice(0, bl),   // remainder
		      rl = r.length,
		      q = y,                // quotient
		      qc = q.c = [],
		      qi = 0,
		      p = dp + (q.e = x.e - y.e) + 1;    // precision of the result

		    q.s = k;
		    k = p < 0 ? 0 : p;

		    // Create version of divisor with leading zero.
		    bz.unshift(0);

		    // Add zeros to make remainder as long as divisor.
		    for (; rl++ < bl;) r.push(0);

		    do {

		      // n is how many times the divisor goes into current remainder.
		      for (n = 0; n < 10; n++) {

		        // Compare divisor and remainder.
		        if (bl != (rl = r.length)) {
		          cmp = bl > rl ? 1 : -1;
		        } else {
		          for (ri = -1, cmp = 0; ++ri < bl;) {
		            if (b[ri] != r[ri]) {
		              cmp = b[ri] > r[ri] ? 1 : -1;
		              break;
		            }
		          }
		        }

		        // If divisor < remainder, subtract divisor from remainder.
		        if (cmp < 0) {

		          // Remainder can't be more than 1 digit longer than divisor.
		          // Equalise lengths using divisor with extra leading zero?
		          for (bt = rl == bl ? b : bz; rl;) {
		            if (r[--rl] < bt[rl]) {
		              ri = rl;
		              for (; ri && !r[--ri];) r[ri] = 9;
		              --r[ri];
		              r[rl] += 10;
		            }
		            r[rl] -= bt[rl];
		          }

		          for (; !r[0];) r.shift();
		        } else {
		          break;
		        }
		      }

		      // Add the digit n to the result array.
		      qc[qi++] = cmp ? n : ++n;

		      // Update the remainder.
		      if (r[0] && cmp) r[rl] = a[ai] || 0;
		      else r = [a[ai]];

		    } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

		    // Leading zero? Do not remove if result is simply zero (qi == 1).
		    if (!qc[0] && qi != 1) {

		      // There can't be more than one zero.
		      qc.shift();
		      q.e--;
		      p--;
		    }

		    // Round?
		    if (qi > p) round(q, p, Big.RM, r[0] !== UNDEFINED);

		    return q;
		  };


		  /*
		   * Return true if the value of this Big is equal to the value of Big y, otherwise return false.
		   */
		  P.eq = function (y) {
		    return this.cmp(y) === 0;
		  };


		  /*
		   * Return true if the value of this Big is greater than the value of Big y, otherwise return
		   * false.
		   */
		  P.gt = function (y) {
		    return this.cmp(y) > 0;
		  };


		  /*
		   * Return true if the value of this Big is greater than or equal to the value of Big y, otherwise
		   * return false.
		   */
		  P.gte = function (y) {
		    return this.cmp(y) > -1;
		  };


		  /*
		   * Return true if the value of this Big is less than the value of Big y, otherwise return false.
		   */
		  P.lt = function (y) {
		    return this.cmp(y) < 0;
		  };


		  /*
		   * Return true if the value of this Big is less than or equal to the value of Big y, otherwise
		   * return false.
		   */
		  P.lte = function (y) {
		    return this.cmp(y) < 1;
		  };


		  /*
		   * Return a new Big whose value is the value of this Big minus the value of Big y.
		   */
		  P.minus = P.sub = function (y) {
		    var i, j, t, xlty,
		      x = this,
		      Big = x.constructor,
		      a = x.s,
		      b = (y = new Big(y)).s;

		    // Signs differ?
		    if (a != b) {
		      y.s = -b;
		      return x.plus(y);
		    }

		    var xc = x.c.slice(),
		      xe = x.e,
		      yc = y.c,
		      ye = y.e;

		    // Either zero?
		    if (!xc[0] || !yc[0]) {
		      if (yc[0]) {
		        y.s = -b;
		      } else if (xc[0]) {
		        y = new Big(x);
		      } else {
		        y.s = 1;
		      }
		      return y;
		    }

		    // Determine which is the bigger number. Prepend zeros to equalise exponents.
		    if (a = xe - ye) {

		      if (xlty = a < 0) {
		        a = -a;
		        t = xc;
		      } else {
		        ye = xe;
		        t = yc;
		      }

		      t.reverse();
		      for (b = a; b--;) t.push(0);
		      t.reverse();
		    } else {

		      // Exponents equal. Check digit by digit.
		      j = ((xlty = xc.length < yc.length) ? xc : yc).length;

		      for (a = b = 0; b < j; b++) {
		        if (xc[b] != yc[b]) {
		          xlty = xc[b] < yc[b];
		          break;
		        }
		      }
		    }

		    // x < y? Point xc to the array of the bigger number.
		    if (xlty) {
		      t = xc;
		      xc = yc;
		      yc = t;
		      y.s = -y.s;
		    }

		    /*
		     * Append zeros to xc if shorter. No need to add zeros to yc if shorter as subtraction only
		     * needs to start at yc.length.
		     */
		    if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

		    // Subtract yc from xc.
		    for (b = i; j > a;) {
		      if (xc[--j] < yc[j]) {
		        for (i = j; i && !xc[--i];) xc[i] = 9;
		        --xc[i];
		        xc[j] += 10;
		      }

		      xc[j] -= yc[j];
		    }

		    // Remove trailing zeros.
		    for (; xc[--b] === 0;) xc.pop();

		    // Remove leading zeros and adjust exponent accordingly.
		    for (; xc[0] === 0;) {
		      xc.shift();
		      --ye;
		    }

		    if (!xc[0]) {

		      // n - n = +0
		      y.s = 1;

		      // Result must be zero.
		      xc = [ye = 0];
		    }

		    y.c = xc;
		    y.e = ye;

		    return y;
		  };


		  /*
		   * Return a new Big whose value is the value of this Big modulo the value of Big y.
		   */
		  P.mod = function (y) {
		    var ygtx,
		      x = this,
		      Big = x.constructor,
		      a = x.s,
		      b = (y = new Big(y)).s;

		    if (!y.c[0]) {
		      throw Error(DIV_BY_ZERO);
		    }

		    x.s = y.s = 1;
		    ygtx = y.cmp(x) == 1;
		    x.s = a;
		    y.s = b;

		    if (ygtx) return new Big(x);

		    a = Big.DP;
		    b = Big.RM;
		    Big.DP = Big.RM = 0;
		    x = x.div(y);
		    Big.DP = a;
		    Big.RM = b;

		    return this.minus(x.times(y));
		  };
		  
		  
		  /*
		   * Return a new Big whose value is the value of this Big negated.
		   */
		  P.neg = function () {
		    var x = new this.constructor(this);
		    x.s = -x.s;
		    return x;
		  };


		  /*
		   * Return a new Big whose value is the value of this Big plus the value of Big y.
		   */
		  P.plus = P.add = function (y) {
		    var e, k, t,
		      x = this,
		      Big = x.constructor;

		    y = new Big(y);

		    // Signs differ?
		    if (x.s != y.s) {
		      y.s = -y.s;
		      return x.minus(y);
		    }

		    var xe = x.e,
		      xc = x.c,
		      ye = y.e,
		      yc = y.c;

		    // Either zero?
		    if (!xc[0] || !yc[0]) {
		      if (!yc[0]) {
		        if (xc[0]) {
		          y = new Big(x);
		        } else {
		          y.s = x.s;
		        }
		      }
		      return y;
		    }

		    xc = xc.slice();

		    // Prepend zeros to equalise exponents.
		    // Note: reverse faster than unshifts.
		    if (e = xe - ye) {
		      if (e > 0) {
		        ye = xe;
		        t = yc;
		      } else {
		        e = -e;
		        t = xc;
		      }

		      t.reverse();
		      for (; e--;) t.push(0);
		      t.reverse();
		    }

		    // Point xc to the longer array.
		    if (xc.length - yc.length < 0) {
		      t = yc;
		      yc = xc;
		      xc = t;
		    }

		    e = yc.length;

		    // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
		    for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;

		    // No need to check for zero, as +x + +y != 0 && -x + -y != 0

		    if (k) {
		      xc.unshift(k);
		      ++ye;
		    }

		    // Remove trailing zeros.
		    for (e = xc.length; xc[--e] === 0;) xc.pop();

		    y.c = xc;
		    y.e = ye;

		    return y;
		  };


		  /*
		   * Return a Big whose value is the value of this Big raised to the power n.
		   * If n is negative, round to a maximum of Big.DP decimal places using rounding
		   * mode Big.RM.
		   *
		   * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
		   */
		  P.pow = function (n) {
		    var x = this,
		      one = new x.constructor('1'),
		      y = one,
		      isneg = n < 0;

		    if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
		      throw Error(INVALID + 'exponent');
		    }

		    if (isneg) n = -n;

		    for (;;) {
		      if (n & 1) y = y.times(x);
		      n >>= 1;
		      if (!n) break;
		      x = x.times(x);
		    }

		    return isneg ? one.div(y) : y;
		  };


		  /*
		   * Return a new Big whose value is the value of this Big rounded to a maximum precision of sd
		   * significant digits using rounding mode rm, or Big.RM if rm is not specified.
		   *
		   * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
		   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
		   */
		  P.prec = function (sd, rm) {
		    if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
		      throw Error(INVALID + 'precision');
		    }
		    return round(new this.constructor(this), sd, rm);
		  };


		  /*
		   * Return a new Big whose value is the value of this Big rounded to a maximum of dp decimal places
		   * using rounding mode rm, or Big.RM if rm is not specified.
		   * If dp is negative, round to an integer which is a multiple of 10**-dp.
		   * If dp is not specified, round to 0 decimal places.
		   *
		   * dp? {number} Integer, -MAX_DP to MAX_DP inclusive.
		   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
		   */
		  P.round = function (dp, rm) {
		    if (dp === UNDEFINED) dp = 0;
		    else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
		      throw Error(INVALID_DP);
		    }
		    return round(new this.constructor(this), dp + this.e + 1, rm);
		  };


		  /*
		   * Return a new Big whose value is the square root of the value of this Big, rounded, if
		   * necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
		   */
		  P.sqrt = function () {
		    var r, c, t,
		      x = this,
		      Big = x.constructor,
		      s = x.s,
		      e = x.e,
		      half = new Big('0.5');

		    // Zero?
		    if (!x.c[0]) return new Big(x);

		    // Negative?
		    if (s < 0) {
		      throw Error(NAME + 'No square root');
		    }

		    // Estimate.
		    s = Math.sqrt(+stringify(x, true, true));

		    // Math.sqrt underflow/overflow?
		    // Re-estimate: pass x coefficient to Math.sqrt as integer, then adjust the result exponent.
		    if (s === 0 || s === 1 / 0) {
		      c = x.c.join('');
		      if (!(c.length + e & 1)) c += '0';
		      s = Math.sqrt(c);
		      e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
		      r = new Big((s == 1 / 0 ? '5e' : (s = s.toExponential()).slice(0, s.indexOf('e') + 1)) + e);
		    } else {
		      r = new Big(s + '');
		    }

		    e = r.e + (Big.DP += 4);

		    // Newton-Raphson iteration.
		    do {
		      t = r;
		      r = half.times(t.plus(x.div(t)));
		    } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));

		    return round(r, (Big.DP -= 4) + r.e + 1, Big.RM);
		  };


		  /*
		   * Return a new Big whose value is the value of this Big times the value of Big y.
		   */
		  P.times = P.mul = function (y) {
		    var c,
		      x = this,
		      Big = x.constructor,
		      xc = x.c,
		      yc = (y = new Big(y)).c,
		      a = xc.length,
		      b = yc.length,
		      i = x.e,
		      j = y.e;

		    // Determine sign of result.
		    y.s = x.s == y.s ? 1 : -1;

		    // Return signed 0 if either 0.
		    if (!xc[0] || !yc[0]) {
		      y.c = [y.e = 0];
		      return y;
		    }

		    // Initialise exponent of result as x.e + y.e.
		    y.e = i + j;

		    // If array xc has fewer digits than yc, swap xc and yc, and lengths.
		    if (a < b) {
		      c = xc;
		      xc = yc;
		      yc = c;
		      j = a;
		      a = b;
		      b = j;
		    }

		    // Initialise coefficient array of result with zeros.
		    for (c = new Array(j = a + b); j--;) c[j] = 0;

		    // Multiply.

		    // i is initially xc.length.
		    for (i = b; i--;) {
		      b = 0;

		      // a is yc.length.
		      for (j = a + i; j > i;) {

		        // Current sum of products at this digit position, plus carry.
		        b = c[j] + yc[i] * xc[j - i - 1] + b;
		        c[j--] = b % 10;

		        // carry
		        b = b / 10 | 0;
		      }

		      c[j] = b;
		    }

		    // Increment result exponent if there is a final carry, otherwise remove leading zero.
		    if (b) ++y.e;
		    else c.shift();

		    // Remove trailing zeros.
		    for (i = c.length; !c[--i];) c.pop();
		    y.c = c;

		    return y;
		  };


		  /*
		   * Return a string representing the value of this Big in exponential notation rounded to dp fixed
		   * decimal places using rounding mode rm, or Big.RM if rm is not specified.
		   *
		   * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
		   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
		   */
		  P.toExponential = function (dp, rm) {
		    var x = this,
		      n = x.c[0];

		    if (dp !== UNDEFINED) {
		      if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
		        throw Error(INVALID_DP);
		      }
		      x = round(new x.constructor(x), ++dp, rm);
		      for (; x.c.length < dp;) x.c.push(0);
		    }

		    return stringify(x, true, !!n);
		  };


		  /*
		   * Return a string representing the value of this Big in normal notation rounded to dp fixed
		   * decimal places using rounding mode rm, or Big.RM if rm is not specified.
		   *
		   * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
		   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
		   *
		   * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
		   * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
		   */
		  P.toFixed = function (dp, rm) {
		    var x = this,
		      n = x.c[0];

		    if (dp !== UNDEFINED) {
		      if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
		        throw Error(INVALID_DP);
		      }
		      x = round(new x.constructor(x), dp + x.e + 1, rm);

		      // x.e may have changed if the value is rounded up.
		      for (dp = dp + x.e + 1; x.c.length < dp;) x.c.push(0);
		    }

		    return stringify(x, false, !!n);
		  };


		  /*
		   * Return a string representing the value of this Big.
		   * Return exponential notation if this Big has a positive exponent equal to or greater than
		   * Big.PE, or a negative exponent equal to or less than Big.NE.
		   * Omit the sign for negative zero.
		   */
		  P.toJSON = P.toString = function () {
		    var x = this,
		      Big = x.constructor;
		    return stringify(x, x.e <= Big.NE || x.e >= Big.PE, !!x.c[0]);
		  };


		  /*
		   * Return the value of this Big as a primitve number.
		   */
		  P.toNumber = function () {
		    var n = +stringify(this, true, true);
		    if (this.constructor.strict === true && !this.eq(n.toString())) {
		      throw Error(NAME + 'Imprecise conversion');
		    }
		    return n;
		  };


		  /*
		   * Return a string representing the value of this Big rounded to sd significant digits using
		   * rounding mode rm, or Big.RM if rm is not specified.
		   * Use exponential notation if sd is less than the number of digits necessary to represent
		   * the integer part of the value in normal notation.
		   *
		   * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
		   * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
		   */
		  P.toPrecision = function (sd, rm) {
		    var x = this,
		      Big = x.constructor,
		      n = x.c[0];

		    if (sd !== UNDEFINED) {
		      if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
		        throw Error(INVALID + 'precision');
		      }
		      x = round(new Big(x), sd, rm);
		      for (; x.c.length < sd;) x.c.push(0);
		    }

		    return stringify(x, sd <= x.e || x.e <= Big.NE || x.e >= Big.PE, !!n);
		  };


		  /*
		   * Return a string representing the value of this Big.
		   * Return exponential notation if this Big has a positive exponent equal to or greater than
		   * Big.PE, or a negative exponent equal to or less than Big.NE.
		   * Include the sign for negative zero.
		   */
		  P.valueOf = function () {
		    var x = this,
		      Big = x.constructor;
		    if (Big.strict === true) {
		      throw Error(NAME + 'valueOf disallowed');
		    }
		    return stringify(x, x.e <= Big.NE || x.e >= Big.PE, true);
		  };


		  // Export


		  Big = _Big_();

		  Big['default'] = Big.Big = Big;

		  //AMD.
		  if (module.exports) {
		    module.exports = Big;

		  //Browser.
		  } else {
		    GLOBAL.Big = Big;
		  }
		})(big); 
	} (big$1));
	return big$1.exports;
}

var dataset = {};

var table = {};

var rowQueue = {};

var rowBatch = {};

var hasRequiredRowBatch;

function requireRowBatch () {
	if (hasRequiredRowBatch) return rowBatch;
	hasRequiredRowBatch = 1;
	(function (exports) {
		/*!
		 * Copyright 2022 Google LLC. All Rights Reserved.
		 *
		 * Licensed under the Apache License, Version 2.0 (the "License");
		 * you may not use this file except in compliance with the License.
		 * You may obtain a copy of the License at
		 *
		 *      http://www.apache.org/licenses/LICENSE-2.0
		 *
		 * Unless required by applicable law or agreed to in writing, software
		 * distributed under the License is distributed on an "AS IS" BASIS,
		 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		 * See the License for the specific language governing permissions and
		 * limitations under the License.
		 */
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.RowBatch = exports.BATCH_LIMITS = void 0;
		exports.BATCH_LIMITS = {
		    maxBytes: 9 * 1024 * 1024,
		    maxRows: 50000,
		};
		/**
		 * Call used to help batch rows.
		 *
		 * @private
		 *
		 * @param {BatchInsertOptions} options The batching options.
		 */
		class RowBatch {
		    batchOptions;
		    rows;
		    callbacks;
		    created;
		    bytes;
		    constructor(options) {
		        this.batchOptions = options;
		        this.rows = [];
		        this.callbacks = [];
		        this.created = Date.now();
		        this.bytes = 0;
		    }
		    /**
		     * Adds a row to the current batch.
		     *
		     * @param {object} row The row to insert.
		     * @param {InsertRowsCallback} callback The callback function.
		     */
		    add(row, callback) {
		        this.rows.push(row);
		        this.callbacks.push(callback);
		        this.bytes += Buffer.byteLength(JSON.stringify(row));
		    }
		    /**
		     * Indicates if a given row can fit in the batch.
		     *
		     * @param {object} row The row in question.
		     * @returns {boolean}
		     */
		    canFit(row) {
		        const { maxRows, maxBytes } = this.batchOptions;
		        return (this.rows.length < maxRows &&
		            this.bytes + Buffer.byteLength(JSON.stringify(row)) <= maxBytes);
		    }
		    /**
		     * Checks to see if this batch is at the maximum allowed payload size.
		     *
		     * @returns {boolean}
		     */
		    isAtMax() {
		        const { maxRows, maxBytes } = exports.BATCH_LIMITS;
		        return this.rows.length >= maxRows || this.bytes >= maxBytes;
		    }
		    /**
		     * Indicates if the batch is at capacity.
		     *
		     * @returns {boolean}
		     */
		    isFull() {
		        const { maxRows, maxBytes } = this.batchOptions;
		        return this.rows.length >= maxRows || this.bytes >= maxBytes;
		    }
		}
		exports.RowBatch = RowBatch;
		
	} (rowBatch));
	return rowBatch;
}

var hasRequiredRowQueue;

function requireRowQueue () {
	if (hasRequiredRowQueue) return rowQueue;
	hasRequiredRowQueue = 1;
	(function (exports) {
		/*!
		 * Copyright 2022 Google LLC. All Rights Reserved.
		 *
		 * Licensed under the Apache License, Version 2.0 (the "License");
		 * you may not use this file except in compliance with the License.
		 * You may obtain a copy of the License at
		 *
		 *      http://www.apache.org/licenses/LICENSE-2.0
		 *
		 * Unless required by applicable law or agreed to in writing, software
		 * distributed under the License is distributed on an "AS IS" BASIS,
		 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		 * See the License for the specific language governing permissions and
		 * limitations under the License.
		 */
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.RowQueue = exports.defaultOptions = void 0;
		const common = requireSrc$4();
		const extend = requireExtend();
		const crypto_1 = require$$0$3;
		const _1 = requireSrc();
		const rowBatch_1 = requireRowBatch();
		exports.defaultOptions = {
		    // The maximum number of rows we'll batch up for insert().
		    maxOutstandingRows: 300,
		    // The maximum size of the total batched up rows for insert().
		    maxOutstandingBytes: 9 * 1024 * 1024,
		    // The maximum time we'll wait to send batched rows, in milliseconds.
		    maxDelayMillis: 10000,
		};
		/**
		 * Standard row queue used for inserting rows.
		 *
		 *
		 * @param {Table} table The table.
		 * @param {Duplex} dup Row stream.
		 * @param {InsertStreamOptions} options Insert and batch options.
		 */
		class RowQueue {
		    table;
		    stream;
		    insertRowsOptions = {};
		    batch;
		    batchOptions;
		    inFlight;
		    pending;
		    constructor(table, dup, options) {
		        this.table = table;
		        this.stream = dup;
		        this.inFlight = false;
		        const opts = typeof options === 'object' ? options : {};
		        if (opts.insertRowsOptions) {
		            this.insertRowsOptions = opts.insertRowsOptions;
		        }
		        else {
		            this.insertRowsOptions = {};
		        }
		        if (opts.batchOptions) {
		            this.setOptions(opts.batchOptions);
		        }
		        else {
		            this.setOptions();
		        }
		        this.batch = new rowBatch_1.RowBatch(this.batchOptions);
		    }
		    /**
		     * Adds a row to the queue.
		     *
		     * @param {RowMetadata} row The row to insert.
		     * @param {InsertRowsCallback} callback The insert callback.
		     */
		    add(row, callback) {
		        if (!this.insertRowsOptions.raw) {
		            row = {
		                json: _1.Table.encodeValue_(row),
		            };
		            if (this.insertRowsOptions.createInsertId !== false) {
		                row.insertId = (0, crypto_1.randomUUID)();
		            }
		        }
		        if (!this.batch.canFit(row)) {
		            this.insert();
		        }
		        this.batch.add(row, callback);
		        if (this.batch.isFull()) {
		            this.insert();
		        }
		        else if (!this.pending) {
		            const { maxMilliseconds } = this.batchOptions;
		            this.pending = setTimeout(() => {
		                this.insert();
		            }, maxMilliseconds);
		        }
		    }
		    /**
		     * Cancels any pending inserts and calls _insert immediately.
		     */
		    insert(callback) {
		        const { rows, callbacks } = this.batch;
		        this.batch = new rowBatch_1.RowBatch(this.batchOptions);
		        if (this.pending) {
		            clearTimeout(this.pending);
		            delete this.pending;
		        }
		        if (rows.length > 0) {
		            this._insert(rows, callbacks, callback);
		        }
		    }
		    /**
		     * Accepts a batch of rows and inserts them into table.
		     *
		     * @param {object[]} rows The rows to insert.
		     * @param {InsertCallback[]} callbacks The corresponding callback functions.
		     * @param {function} [callback] Callback to be fired when insert is done.
		     */
		    _insert(rows, callbacks, cb) {
		        const json = extend(true, {}, this.insertRowsOptions, { rows });
		        delete json.createInsertId;
		        delete json.partialRetries;
		        delete json.raw;
		        this.table.request({
		            method: 'POST',
		            uri: '/insertAll',
		            json,
		        }, (err, resp) => {
		            const partialFailures = (resp?.insertErrors || []).map((insertError) => {
		                return {
		                    errors: insertError.errors.map(error => {
		                        return {
		                            message: error.message,
		                            reason: error.reason,
		                        };
		                    }),
		                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
		                    row: rows[insertError.index],
		                };
		            });
		            if (partialFailures.length > 0) {
		                err = new common.util.PartialFailureError({
		                    errors: partialFailures,
		                    response: resp,
		                });
		                callbacks.forEach(callback => callback(err, resp));
		                this.stream.emit('error', err);
		            }
		            else {
		                callbacks.forEach(callback => callback(err, resp));
		                this.stream.emit('response', resp);
		                cb?.(err, resp);
		            }
		            cb?.(err, resp);
		        });
		    }
		    /**
		     * Sets the batching options.
		     *
		     *
		     * @param {RowBatchOptions} [options] The batching options.
		     */
		    setOptions(options = {}) {
		        const defaults = this.getOptionDefaults();
		        const { maxBytes, maxRows, maxMilliseconds } = extend(true, defaults, options);
		        this.batchOptions = {
		            maxBytes: Math.min(maxBytes, rowBatch_1.BATCH_LIMITS.maxBytes),
		            maxRows: Math.min(maxRows, rowBatch_1.BATCH_LIMITS.maxRows),
		            maxMilliseconds: maxMilliseconds,
		        };
		    }
		    getOptionDefaults() {
		        // Return a unique copy to avoid shenanigans.
		        const defaults = {
		            maxBytes: exports.defaultOptions.maxOutstandingBytes,
		            maxRows: exports.defaultOptions.maxOutstandingRows,
		            maxMilliseconds: exports.defaultOptions.maxDelayMillis,
		        };
		        return defaults;
		    }
		}
		exports.RowQueue = RowQueue;
		
	} (rowQueue));
	return rowQueue;
}

var hasRequiredTable;

function requireTable () {
	if (hasRequiredTable) return table;
	hasRequiredTable = 1;
	/*!
	 * Copyright 2014 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(table, "__esModule", { value: true });
	table.Table = void 0;
	const common_1 = requireSrc$4();
	const paginator_1 = requireSrc$3();
	const promisify_1 = requireSrc$2();
	const util_1 = requireUtil();
	const Big = requireBig();
	const extend = requireExtend();
	const events_1 = require$$0;
	const fs = require$$0$5;
	const path = require$$3$2;
	const streamEvents = requireStreamEvents();
	const crypto_1 = require$$0$3;
	const duplexify = requireDuplexify();
	const _1 = requireSrc();
	const stream_1 = require$$0$4;
	const rowQueue_1 = requireRowQueue();
	/**
	 * The file formats accepted by BigQuery.
	 *
	 * @type {object}
	 * @private
	 */
	const FORMATS = {
	    avro: 'AVRO',
	    csv: 'CSV',
	    export_metadata: 'DATASTORE_BACKUP',
	    json: 'NEWLINE_DELIMITED_JSON',
	    orc: 'ORC',
	    parquet: 'PARQUET',
	};
	/**
	 * Table objects are returned by methods such as
	 * {@link Dataset#table}, {@link Dataset#createTable}, and
	 * {@link Dataset#getTables}.
	 *
	 * @class
	 * @param {Dataset} dataset {@link Dataset} instance.
	 * @param {string} id The ID of the table.
	 * @param {object} [options] Table options.
	 * @param {string} [options.location] The geographic location of the table, by
	 *      default this value is inherited from the dataset. This can be used to
	 *      configure the location of all jobs created through a table instance. It
	 *      cannot be used to set the actual location of the table. This value will
	 *      be superseded by any API responses containing location data for the
	 *      table.
	 *
	 * @example
	 * ```
	 * const {BigQuery} = require('@google-cloud/bigquery');
	 * const bigquery = new BigQuery();
	 * const dataset = bigquery.dataset('my-dataset');
	 *
	 * const table = dataset.table('my-table');
	 * ```
	 */
	class Table extends common_1.ServiceObject {
	    dataset;
	    bigQuery;
	    location;
	    rowQueue;
	    createReadStream(options) {
	        // placeholder body, overwritten in constructor
	        return new paginator_1.ResourceStream({}, () => { });
	    }
	    constructor(dataset, id, options) {
	        const methods = {
	            /**
	             * @callback CreateTableCallback
	             * @param {?Error} err Request error, if any.
	             * @param {Table} table The table.
	             * @param {object} apiResponse The full API response body.
	             */
	            /**
	             * @typedef {array} CreateTableResponse
	             * @property {Table} 0 The table.
	             * @property {object} 1 The full API response body.
	             */
	            /**
	             * Create a table.
	             *
	             * @method Table#create
	             * @param {object} [options] See {@link Dataset#createTable}.
	             * @param {CreateTableCallback} [callback]
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {Table} callback.table The new {@link Table}.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<CreateTableResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             *
	             * const table = dataset.table('my-table');
	             *
	             * table.create((err, table, apiResponse) => {
	             *   if (!err) {
	             *     // The table was created successfully.
	             *   }
	             * });
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * table.create().then((data) => {
	             *   const table = data[0];
	             *   const apiResponse = data[1];
	             * });
	             * ```
	             */
	            create: true,
	            /**
	             * @callback DeleteTableCallback
	             * @param {?Error} err Request error, if any.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * @typedef {array} DeleteTableResponse
	             * @property {object} 0 The full API response.
	             */
	            /**
	             * Delete a table and all its data.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/v2/tables/delete| Tables: delete API Documentation}
	             *
	             * @method Table#delete
	             * @param {DeleteTableCallback} [callback]
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<DeleteTableResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             *
	             * const table = dataset.table('my-table');
	             *
	             * table.delete((err, apiResponse) => {});
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * table.delete().then((data) => {
	             *   const apiResponse = data[0];
	             * });
	             * ```
	             */
	            delete: true,
	            /**
	             * @callback TableExistsCallback
	             * @param {?Error} err Request error, if any.
	             * @param {boolean} exists Indicates if the table exists.
	             */
	            /**
	             * @typedef {array} TableExistsCallback
	             * @property {boolean} 0 Indicates if the table exists.
	             */
	            /**
	             * Check if the table exists.
	             *
	             * @method Table#exists
	             * @param {TableExistsCallback} [callback]
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {boolean} callback.exists Whether the table exists or not.
	             * @returns {Promise<TableExistsCallback>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             *
	             * const table = dataset.table('my-table');
	             *
	             * table.exists((err, exists) => {});
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * table.exists().then((data) => {
	             *   const exists = data[0];
	             * });
	             * ```
	             */
	            exists: true,
	            /**
	             * @callback GetTableCallback
	             * @param {?Error} err Request error, if any.
	             * @param {Table} table The table.
	             * @param {object} apiResponse The full API response body.
	             */
	            /**
	             * @typedef {array} GetTableResponse
	             * @property {Table} 0 The table.
	             * @property {object} 1 The full API response body.
	             */
	            /**
	             * Get a table if it exists.
	             *
	             * You may optionally use this to "get or create" an object by providing
	             * an object with `autoCreate` set to `true`. Any extra configuration that
	             * is normally required for the `create` method must be contained within
	             * this object as well.
	             *
	             * If you wish to get a selection of metadata instead of the full table metadata
	             * (retrieved by both Table#get by default and by Table#getMetadata), use
	             * the `options` parameter to set the `view` and/or `selectedFields` query parameters.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/tables/get#TableMetadataView| Tables.get and TableMetadataView }
	             *
	             * @method Table#get
	             * @param {options} [options] Configuration object.
	             * @param {boolean} [options.autoCreate=false] Automatically create the
	             *     object if it does not exist.
	             * @param {function} [callback]
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {Table} callback.table The {@link Table}.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<GetTableResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             *
	             * const table = dataset.table('my-table');
	             *
	             * const options = {
	             *   view: "BASIC"
	             * }
	             *
	             * table.get((err, table, apiResponse) => {
	             *   // `table.metadata` has been populated.
	             * });
	             *
	             * table.get(options, (err, table, apiResponse) => {
	             *   // A selection of `table.metadata` has been populated
	             * })
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * table.get().then((data) => {
	             *   const table = data[0];
	             *   const apiResponse = data[1];
	             * });
	             * ```
	             */
	            get: true,
	            /**
	             * @callback GetTableMetadataCallback
	             * @param {?Error} err Request error, if any.
	             * @param {object} metadata The table metadata.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * @typedef {array} GetTableMetadataResponse
	             * @property {object} 0 The table metadata.
	             * @property {object} 1 The full API response.
	             */
	            /**
	             * Return the metadata associated with the Table.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/v2/tables/get| Tables: get API Documentation}
	             *
	             * @method Table#getMetadata
	             * @param {GetTableMetadataCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {object} callback.metadata The metadata of the Table.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<GetTableMetadataResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             *
	             * const table = dataset.table('my-table');
	             *
	             * table.getMetadata((err, metadata, apiResponse) => {});
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * table.getMetadata().then((data) => {
	             *   const metadata = data[0];
	             *   const apiResponse = data[1];
	             * });
	             * ```
	             */
	            getMetadata: true,
	        };
	        super({
	            parent: dataset,
	            baseUrl: '/tables',
	            id,
	            createMethod: dataset.createTable.bind(dataset),
	            methods,
	        });
	        if (options && options.location) {
	            this.location = options.location;
	        }
	        this.bigQuery = dataset.bigQuery;
	        this.dataset = dataset;
	        // Catch all for read-modify-write cycle
	        // https://cloud.google.com/bigquery/docs/api-performance#read-patch-write
	        this.interceptors.push({
	            request: (reqOpts) => {
	                if (reqOpts.method === 'PATCH' && reqOpts.json.etag) {
	                    reqOpts.headers = reqOpts.headers || {};
	                    reqOpts.headers['If-Match'] = reqOpts.json.etag;
	                }
	                return reqOpts;
	            },
	        });
	        /**
	         * Create a readable stream of the rows of data in your table. This method
	         * is simply a wrapper around {@link Table#getRows}.
	         *
	         * See {@link https://cloud.google.com/bigquery/docs/reference/v2/tabledata/list| Tabledata: list API Documentation}
	         *
	         * @returns {ReadableStream}
	         *
	         * @example
	         * ```
	         * const {BigQuery} = require('@google-cloud/bigquery');
	         * const bigquery = new BigQuery();
	         * const dataset = bigquery.dataset('my-dataset');
	         * const table = dataset.table('my-table');
	         *
	         * table.createReadStream(options)
	         *   .on('error', console.error)
	         *   .on('data', row => {})
	         *   .on('end', function() {
	         *     // All rows have been retrieved.
	         *   });
	         *
	         * //-
	         * // If you anticipate many results, you can end a stream early to prevent
	         * // unnecessary processing and API requests.
	         * //-
	         * table.createReadStream()
	         *   .on('data', function(row) {
	         *     this.end();
	         *   });
	         * ```
	         */
	        this.createReadStream = paginator_1.paginator.streamify('getRows');
	    }
	    /**
	     * Convert a comma-separated name:type string to a table schema object.
	     *
	     * @static
	     * @private
	     *
	     * @param {string} str Comma-separated schema string.
	     * @returns {object} Table schema in the format the API expects.
	     */
	    static createSchemaFromString_(str) {
	        return str.split(',').reduce((acc, pair) => {
	            acc.fields.push({
	                name: pair.split(':')[0].trim(),
	                type: (pair.split(':')[1] || 'STRING').toUpperCase().trim(),
	            });
	            return acc;
	        }, {
	            fields: [],
	        });
	    }
	    /**
	     * Convert a row entry from native types to their encoded types that the API
	     * expects.
	     *
	     * @static
	     * @private
	     *
	     * @param {*} value The value to be converted.
	     * @returns {*} The converted value.
	     */
	    static encodeValue_(value) {
	        if (typeof value === 'undefined' || value === null) {
	            return null;
	        }
	        if (value instanceof Buffer) {
	            return value.toString('base64');
	        }
	        if (value instanceof Big) {
	            return value.toFixed();
	        }
	        const customTypeConstructorNames = [
	            'BigQueryDate',
	            'BigQueryDatetime',
	            'BigQueryInt',
	            'BigQueryTime',
	            'BigQueryTimestamp',
	            'BigQueryRange',
	            'Geography',
	        ];
	        const constructorName = value.constructor?.name;
	        const isCustomType = customTypeConstructorNames.indexOf(constructorName) > -1;
	        if (isCustomType) {
	            return value.value;
	        }
	        if ((0, util_1.isDate)(value)) {
	            return value.toJSON();
	        }
	        if ((0, util_1.isArray)(value)) {
	            return value.map(Table.encodeValue_);
	        }
	        if (typeof value === 'object') {
	            return Object.keys(value).reduce((acc, key) => {
	                acc[key] = Table.encodeValue_(value[key]);
	                return acc;
	            }, {});
	        }
	        return value;
	    }
	    /**
	     * @private
	     */
	    static formatMetadata_(options) {
	        const body = extend(true, {}, options);
	        if (options.name) {
	            body.friendlyName = options.name;
	            delete body.name;
	        }
	        if ((0, util_1.isString)(options.schema)) {
	            body.schema = Table.createSchemaFromString_(options.schema);
	        }
	        if ((0, util_1.isArray)(options.schema)) {
	            body.schema = {
	                fields: options.schema,
	            };
	        }
	        if (body.schema && body.schema.fields) {
	            body.schema.fields = body.schema.fields.map(field => {
	                if (field.fields) {
	                    field.type = 'RECORD';
	                }
	                return field;
	            });
	        }
	        if ((0, util_1.isString)(options.partitioning)) {
	            body.timePartitioning = {
	                type: options.partitioning.toUpperCase(),
	            };
	            delete body.partitioning;
	        }
	        if ((0, util_1.isString)(options.view)) {
	            body.view = {
	                query: options.view,
	                useLegacySql: false,
	            };
	        }
	        return body;
	    }
	    copy(destination, metadataOrCallback, cb) {
	        const metadata = typeof metadataOrCallback === 'object' ? metadataOrCallback : {};
	        const callback = typeof metadataOrCallback === 'function' ? metadataOrCallback : cb;
	        this.createCopyJob(destination, metadata, (err, job, resp) => {
	            if (err) {
	                callback(err, resp);
	                return;
	            }
	            job.on('error', callback).on('complete', (metadata) => {
	                callback(null, metadata);
	            });
	        });
	    }
	    copyFrom(sourceTables, metadataOrCallback, cb) {
	        const metadata = typeof metadataOrCallback === 'object' ? metadataOrCallback : {};
	        const callback = typeof metadataOrCallback === 'function' ? metadataOrCallback : cb;
	        this.createCopyFromJob(sourceTables, metadata, (err, job, resp) => {
	            if (err) {
	                callback(err, resp);
	                return;
	            }
	            job.on('error', callback).on('complete', metadata => {
	                callback(null, metadata);
	            });
	        });
	    }
	    createCopyJob(destination, metadataOrCallback, cb) {
	        if (!(destination instanceof Table)) {
	            throw new Error('Destination must be a Table object.');
	        }
	        const metadata = typeof metadataOrCallback === 'object'
	            ? metadataOrCallback
	            : {};
	        const callback = typeof metadataOrCallback === 'function' ? metadataOrCallback : cb;
	        const body = {
	            configuration: {
	                copy: extend(true, metadata, {
	                    destinationTable: {
	                        datasetId: destination.dataset.id,
	                        projectId: destination.dataset.projectId,
	                        tableId: destination.id,
	                    },
	                    sourceTable: {
	                        datasetId: this.dataset.id,
	                        projectId: this.dataset.projectId,
	                        tableId: this.id,
	                    },
	                }),
	            },
	        };
	        if (metadata.jobPrefix) {
	            body.jobPrefix = metadata.jobPrefix;
	            delete metadata.jobPrefix;
	        }
	        if (this.location) {
	            body.location = this.location;
	        }
	        if (metadata.jobId) {
	            body.jobId = metadata.jobId;
	            delete metadata.jobId;
	        }
	        if (body.configuration && metadata.reservation) {
	            body.configuration.reservation = metadata.reservation;
	            delete metadata.reservation;
	        }
	        this.bigQuery.createJob(body, callback);
	    }
	    createCopyFromJob(source, metadataOrCallback, cb) {
	        const sourceTables = (0, util_1.toArray)(source);
	        sourceTables.forEach(sourceTable => {
	            if (!(sourceTable instanceof Table)) {
	                throw new Error('Source must be a Table object.');
	            }
	        });
	        const metadata = typeof metadataOrCallback === 'object' ? metadataOrCallback : {};
	        const callback = typeof metadataOrCallback === 'function' ? metadataOrCallback : cb;
	        const body = {
	            configuration: {
	                copy: extend(true, metadata, {
	                    destinationTable: {
	                        datasetId: this.dataset.id,
	                        projectId: this.dataset.projectId,
	                        tableId: this.id,
	                    },
	                    sourceTables: sourceTables.map(sourceTable => {
	                        return {
	                            datasetId: sourceTable.dataset.id,
	                            projectId: sourceTable.dataset.projectId,
	                            tableId: sourceTable.id,
	                        };
	                    }),
	                }),
	            },
	        };
	        if (metadata.jobPrefix) {
	            body.jobPrefix = metadata.jobPrefix;
	            delete metadata.jobPrefix;
	        }
	        if (this.location) {
	            body.location = this.location;
	        }
	        if (metadata.jobId) {
	            body.jobId = metadata.jobId;
	            delete metadata.jobId;
	        }
	        if (body.configuration && metadata.reservation) {
	            body.configuration.reservation = metadata.reservation;
	            delete metadata.reservation;
	        }
	        this.bigQuery.createJob(body, callback);
	    }
	    createExtractJob(destination, optionsOrCallback, cb) {
	        let options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
	        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
	        options = extend(true, options, {
	            destinationUris: (0, util_1.toArray)(destination).map(dest => {
	                if (!common_1.util.isCustomType(dest, 'storage/file')) {
	                    throw new Error('Destination must be a File object.');
	                }
	                // If no explicit format was provided, attempt to find a match from the
	                // file's extension. If no match, don't set, and default upstream to
	                // CSV.
	                const format = path.extname(dest.name).substr(1).toLowerCase();
	                if (!options.destinationFormat && !options.format && FORMATS[format]) {
	                    options.destinationFormat = FORMATS[format];
	                }
	                return 'gs://' + dest.bucket.name + '/' + dest.name;
	            }),
	        });
	        if (options.format) {
	            options.format = options.format.toLowerCase();
	            if (FORMATS[options.format]) {
	                options.destinationFormat = FORMATS[options.format];
	                delete options.format;
	            }
	            else {
	                throw new Error('Destination format not recognized: ' + options.format);
	            }
	        }
	        if (options.gzip) {
	            options.compression = 'GZIP';
	            delete options.gzip;
	        }
	        const body = {
	            configuration: {
	                extract: extend(true, options, {
	                    sourceTable: {
	                        datasetId: this.dataset.id,
	                        projectId: this.dataset.projectId,
	                        tableId: this.id,
	                    },
	                }),
	            },
	        };
	        if (options.jobPrefix) {
	            body.jobPrefix = options.jobPrefix;
	            delete options.jobPrefix;
	        }
	        if (this.location) {
	            body.location = this.location;
	        }
	        if (options.jobId) {
	            body.jobId = options.jobId;
	            delete options.jobId;
	        }
	        if (body.configuration && options.reservation) {
	            body.configuration.reservation = options.reservation;
	            delete options.reservation;
	        }
	        this.bigQuery.createJob(body, callback);
	    }
	    createLoadJob(source, metadataOrCallback, cb) {
	        const metadata = typeof metadataOrCallback === 'object' ? metadataOrCallback : {};
	        const callback = typeof metadataOrCallback === 'function' ? metadataOrCallback : cb;
	        this._createLoadJob(source, metadata).then(([resp]) => callback(null, resp, resp.metadata), err => callback(err));
	    }
	    /**
	     * @param {string | File | File[]} source
	     * @param {JobLoadMetadata} metadata
	     * @returns {Promise<JobResponse>}
	     * @private
	     */
	    async _createLoadJob(source, metadata) {
	        if (metadata.format) {
	            metadata.sourceFormat = FORMATS[metadata.format.toLowerCase()];
	            delete metadata.format;
	        }
	        if (this.location) {
	            metadata.location = this.location;
	        }
	        if (typeof source === 'string') {
	            // A path to a file was given. If a sourceFormat wasn't specified, try to
	            // find a match from the file's extension.
	            const detectedFormat = FORMATS[path.extname(source).substr(1).toLowerCase()];
	            if (!metadata.sourceFormat && detectedFormat) {
	                metadata.sourceFormat = detectedFormat;
	            }
	            // Read the file into a new write stream.
	            const jobWritable = fs
	                .createReadStream(source)
	                .pipe(this.createWriteStream_(metadata));
	            const [jobResponse] = (await (0, events_1.once)(jobWritable, 'job'));
	            return [jobResponse, jobResponse.metadata];
	        }
	        const body = {
	            configuration: {
	                load: {
	                    destinationTable: {
	                        projectId: this.dataset.projectId,
	                        datasetId: this.dataset.id,
	                        tableId: this.id,
	                    },
	                },
	            },
	        };
	        if (metadata.jobPrefix) {
	            body.jobPrefix = metadata.jobPrefix;
	            delete metadata.jobPrefix;
	        }
	        if (metadata.location) {
	            body.location = metadata.location;
	            delete metadata.location;
	        }
	        if (metadata.jobId) {
	            body.jobId = metadata.jobId;
	            delete metadata.jobId;
	        }
	        if (body.configuration && metadata.reservation) {
	            body.configuration.reservation = metadata.reservation;
	            delete metadata.reservation;
	        }
	        extend(true, body.configuration?.load, metadata, {
	            sourceUris: (0, util_1.toArray)(source).map(src => {
	                if (!common_1.util.isCustomType(src, 'storage/file')) {
	                    throw new Error('Source must be a File object.');
	                }
	                // If no explicit format was provided, attempt to find a match from
	                // the file's extension. If no match, don't set, and default upstream
	                // to CSV.
	                const format = FORMATS[path.extname(src.name).substr(1).toLowerCase()];
	                if (!metadata.sourceFormat &&
	                    format &&
	                    body.configuration &&
	                    body.configuration.load) {
	                    body.configuration.load.sourceFormat = format;
	                }
	                return 'gs://' + src.bucket.name + '/' + src.name;
	            }),
	        });
	        return this.bigQuery.createJob(body);
	    }
	    createQueryJob(options, callback) {
	        return this.dataset.createQueryJob(options, callback);
	    }
	    /**
	     * Run a query scoped to your dataset as a readable object stream.
	     *
	     * See {@link BigQuery#createQueryStream} for full documentation of this
	     * method.
	     *
	     * @param {object} query See {@link BigQuery#createQueryStream} for full
	     *     documentation of this method.
	     * @returns {stream} See {@link BigQuery#createQueryStream} for full
	     *     documentation of this method.
	     */
	    createQueryStream(query) {
	        return this.dataset.createQueryStream(query);
	    }
	    /**
	     * Creates a write stream. Unlike the public version, this will not
	     * automatically poll the underlying job.
	     *
	     * @private
	     *
	     * @param {string|object} [metadata] Metadata to set with the load operation.
	     *     The metadata object should be in the format of the
	     *     {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/Job#JobConfigurationLoad| `configuration.load`}
	     * property of a Jobs resource. If a string is given, it will be used
	     * as the filetype.
	     * @param {string} [metadata.jobId] Custom job id.
	     * @param {string} [metadata.jobPrefix] Prefix to apply to the job id.
	     * @returns {WritableStream}
	     */
	    createWriteStream_(metadata) {
	        metadata = metadata || {};
	        if (typeof metadata === 'string') {
	            metadata = {
	                sourceFormat: FORMATS[metadata.toLowerCase()],
	            };
	        }
	        if (typeof metadata.schema === 'string') {
	            metadata.schema = Table.createSchemaFromString_(metadata.schema);
	        }
	        metadata = extend(true, {
	            destinationTable: {
	                projectId: this.dataset.projectId,
	                datasetId: this.dataset.id,
	                tableId: this.id,
	            },
	        }, metadata);
	        let jobId = metadata.jobId || (0, crypto_1.randomUUID)();
	        if (metadata.jobId) {
	            delete metadata.jobId;
	        }
	        if (metadata.jobPrefix) {
	            jobId = metadata.jobPrefix + jobId;
	            delete metadata.jobPrefix;
	        }
	        const dup = streamEvents(duplexify());
	        const jobMetadata = {
	            configuration: {
	                load: metadata,
	            },
	            jobReference: {
	                jobId,
	                projectId: this.dataset.projectId,
	                location: this.location,
	            },
	        };
	        dup.once('writing', () => {
	            common_1.util.makeWritableStream(dup, {
	                makeAuthenticatedRequest: this.bigQuery.makeAuthenticatedRequest,
	                metadata: jobMetadata,
	                request: {
	                    uri: `${this.bigQuery.apiEndpoint}/upload/bigquery/v2/projects/${this.dataset.projectId}/jobs`,
	                },
	            }, (data) => {
	                let job = null;
	                const jobRef = data.jobReference;
	                if (jobRef && jobRef.jobId) {
	                    job = this.bigQuery.job(jobRef.jobId, {
	                        location: jobRef.location,
	                        projectId: jobRef.projectId,
	                    });
	                    job.metadata = data;
	                }
	                dup.emit('job', job);
	            });
	        });
	        return dup;
	    }
	    /**
	     * Load data into your table from a readable stream of AVRO, CSV, JSON, ORC,
	     * or PARQUET data.
	     *
	     * See {@link https://cloud.google.com/bigquery/docs/reference/v2/jobs/insert| Jobs: insert API Documentation}
	     *
	     * @param {string|object} [metadata] Metadata to set with the load operation.
	     *     The metadata object should be in the format of the
	     *     {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/Job#JobConfigurationLoad| `configuration.load`}
	     * property of a Jobs resource. If a string is given,
	     * it will be used as the filetype.
	     * @param {string} [metadata.jobId] Custom job id.
	     * @param {string} [metadata.jobPrefix] Prefix to apply to the job id.
	     * @returns {WritableStream}
	     *
	     * @throws {Error} If source format isn't recognized.
	     *
	     * @example
	     * ```
	     * const {BigQuery} = require('@google-cloud/bigquery');
	     * const bigquery = new BigQuery();
	     * const dataset = bigquery.dataset('my-dataset');
	     * const table = dataset.table('my-table');
	     *
	     * //-
	     * // Load data from a CSV file.
	     * //-
	     * const request = require('request');
	     *
	     * const csvUrl = 'http://goo.gl/kSE7z6';
	     *
	     * const metadata = {
	     *   allowJaggedRows: true,
	     *   skipLeadingRows: 1
	     * };
	     *
	     * request.get(csvUrl)
	     *   .pipe(table.createWriteStream(metadata))
	     *   .on('job', (job) => {
	     *     // `job` is a Job object that can be used to check the status of the
	     *     // request.
	     *   })
	     *   .on('complete', (job) => {
	     *     // The job has completed successfully.
	     *   });
	     *
	     * //-
	     * // Load data from a JSON file.
	     * //-
	     * const fs = require('fs');
	     *
	     * fs.createReadStream('./test/testdata/testfile.json')
	     *   .pipe(table.createWriteStream('json'))
	     *   .on('job', (job) => {
	     *     // `job` is a Job object that can be used to check the status of the
	     *     // request.
	     *   })
	     *   .on('complete', (job) => {
	     *     // The job has completed successfully.
	     *   });
	     * ```
	     */
	    createWriteStream(metadata) {
	        const stream = this.createWriteStream_(metadata);
	        stream.on('prefinish', () => {
	            stream.cork();
	        });
	        stream.on('job', (job) => {
	            job
	                .on('error', err => {
	                stream.destroy(err);
	            })
	                .on('complete', () => {
	                stream.emit('complete', job);
	                stream.uncork();
	            });
	        });
	        return stream;
	    }
	    extract(destination, optionsOrCallback, cb) {
	        const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
	        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
	        this.createExtractJob(destination, options, (err, job, resp) => {
	            if (err) {
	                callback(err, resp);
	                return;
	            }
	            job.on('error', callback).on('complete', metadata => {
	                callback(null, metadata);
	            });
	        });
	    }
	    /**
	     * Retrieves table data from a specified set of rows. The rows are returned to
	     * your callback as an array of objects matching your table's schema.
	     *
	     * See {@link https://cloud.google.com/bigquery/docs/reference/v2/tabledata/list| Tabledata: list API Documentation}
	     *
	     * @param {object} [options] The configuration object.
	     * @param {boolean} [options.autoPaginate=true] Have pagination handled
	     *     automatically.
	     * @param {number} [options.maxApiCalls] Maximum number of API calls to make.
	     * @param {number} [options.maxResults] Maximum number of results to return.
	     * @param {boolean|IntegerTypeCastOptions} [options.wrapIntegers=false] Wrap values
	     *     of 'INT64' type in {@link BigQueryInt} objects.
	     *     If a `boolean`, this will wrap values in {@link BigQueryInt} objects.
	     *     If an `object`, this will return a value returned by
	     *     `wrapIntegers.integerTypeCastFunction`.
	     * @param {RowsCallback} [callback] The callback function. If `autoPaginate`
	     *     is set to false a {@link ManualQueryResultsCallback} should be used.
	     * @param {?error} callback.err An error returned while making this request
	     * @param {array} callback.rows The table data from specified set of rows.
	     * @returns {Promise<RowsResponse>}
	     *
	     * @example
	     * ```
	     * const {BigQuery} = require('@google-cloud/bigquery');
	     * const bigquery = new BigQuery();
	     * const dataset = bigquery.dataset('my-dataset');
	     * const table = dataset.table('my-table');
	     *
	     * table.getRows((err, rows) => {
	     *   if (!err) {
	     *     // rows is an array of results.
	     *   }
	     * });
	     *
	     * //-
	     * // To control how many API requests are made and page through the results
	     * // manually, set `autoPaginate` to `false`.
	     * //-
	     * function manualPaginationCallback(err, rows, nextQuery, apiResponse) {
	     *   if (nextQuery) {
	     *     // More results exist.
	     *     table.getRows(nextQuery, manualPaginationCallback);
	     *   }
	     * }
	     *
	     * table.getRows({
	     *   autoPaginate: false
	     * }, manualPaginationCallback);
	     *
	     * //-
	     * // If the callback is omitted, we'll return a Promise.
	     * //-
	     * table.getRows().then((data) => {
	     *   const rows = data[0];
	     *   });
	     * ```
	     */
	    getRows(optionsOrCallback, cb) {
	        const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
	        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
	        const wrapIntegers = options.wrapIntegers ? options.wrapIntegers : false;
	        delete options.wrapIntegers;
	        const parseJSON = options.parseJSON ? options.parseJSON : false;
	        delete options.parseJSON;
	        const selectedFields = options.selectedFields
	            ? options.selectedFields.split(',')
	            : [];
	        const onComplete = (err, rows, nextQuery, resp) => {
	            if (err) {
	                callback(err, null, null, resp);
	                return;
	            }
	            rows = _1.BigQuery.mergeSchemaWithRows_(this.metadata.schema, rows || [], {
	                wrapIntegers,
	                selectedFields,
	                parseJSON,
	            });
	            callback(null, rows, nextQuery, resp);
	        };
	        const qs = extend({
	            'formatOptions.useInt64Timestamp': true,
	        }, options);
	        this.request({
	            uri: '/data',
	            qs,
	        }, (err, resp) => {
	            if (err) {
	                onComplete(err, null, null, resp);
	                return;
	            }
	            let nextQuery = null;
	            if (resp.pageToken) {
	                nextQuery = Object.assign({}, qs, {
	                    pageToken: resp.pageToken,
	                });
	            }
	            if (resp.rows && resp.rows.length > 0 && !this.metadata.schema) {
	                // We don't know the schema for this table yet. Do a quick stat.
	                void this.getMetadata((err, metadata, apiResponse) => {
	                    if (err) {
	                        onComplete(err, null, null, apiResponse);
	                        return;
	                    }
	                    onComplete(null, resp.rows, nextQuery, resp);
	                });
	                return;
	            }
	            onComplete(null, resp.rows, nextQuery, resp);
	        });
	    }
	    insert(rows, optionsOrCallback, cb) {
	        const options = typeof optionsOrCallback === 'object'
	            ? optionsOrCallback
	            : {};
	        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
	        const promise = this._insertAndCreateTable(rows, options);
	        if (callback) {
	            promise.then(resp => callback(null, resp), err => callback(err, null));
	        }
	        else {
	            return promise.then(r => [r]);
	        }
	    }
	    /**
	     * Insert rows with retries, but will create the table if not exists.
	     *
	     * @param {RowMetadata | RowMetadata[]} rows
	     * @param {InsertRowsOptions} options
	     * @returns {Promise<bigquery.ITableDataInsertAllResponse | bigquery.ITable>}
	     * @private
	     */
	    async _insertAndCreateTable(rows, options) {
	        const { schema } = options;
	        const delay = 60000;
	        try {
	            return await this._insertWithRetry(rows, options);
	        }
	        catch (err) {
	            if (err.code !== 404 || !schema) {
	                throw err;
	            }
	        }
	        try {
	            await this.create({ schema });
	        }
	        catch (err) {
	            if (err.code !== 409) {
	                throw err;
	            }
	        }
	        // table creation after failed access is subject to failure caching and
	        // eventual consistency, see:
	        // https://github.com/googleapis/google-cloud-python/issues/4553#issuecomment-350110292
	        await new Promise(resolve => setTimeout(resolve, delay));
	        return this._insertAndCreateTable(rows, options);
	    }
	    /**
	     * This method will attempt to insert rows while retrying any partial failures
	     * that occur along the way. Because partial insert failures are returned
	     * differently, we can't depend on our usual retry strategy.
	     *
	     * @private
	     *
	     * @param {RowMetadata|RowMetadata[]} rows The rows to insert.
	     * @param {InsertRowsOptions} options Insert options.
	     * @returns {Promise<bigquery.ITableDataInsertAllResponse>}
	     */
	    async _insertWithRetry(rows, options) {
	        const { partialRetries = 3 } = options;
	        let error;
	        const maxAttempts = Math.max(partialRetries, 0) + 1;
	        for (let attempts = 0; attempts < maxAttempts; attempts++) {
	            try {
	                return await this._insert(rows, options);
	            }
	            catch (e) {
	                error = e;
	                rows = (e.errors || [])
	                    .filter(err => !!err.row)
	                    .map(err => err.row);
	                if (!rows.length) {
	                    break;
	                }
	            }
	        }
	        throw error;
	    }
	    /**
	     * This method does the bulk of the work for processing options and making the
	     * network request.
	     *
	     * @private
	     *
	     * @param {RowMetadata|RowMetadata[]} rows The rows to insert.
	     * @param {InsertRowsOptions} options Insert options.
	     * @returns {Promise<bigquery.ITableDataInsertAllResponse>}
	     */
	    async _insert(rows, options) {
	        rows = (0, util_1.toArray)(rows);
	        if (!rows.length) {
	            throw new Error('You must provide at least 1 row to be inserted.');
	        }
	        const json = extend(true, {}, options, { rows });
	        if (!options.raw) {
	            json.rows = rows.map((row) => {
	                const encoded = {
	                    json: Table.encodeValue_(row),
	                };
	                if (options.createInsertId !== false) {
	                    encoded.insertId = (0, crypto_1.randomUUID)();
	                }
	                return encoded;
	            });
	        }
	        delete json.createInsertId;
	        delete json.partialRetries;
	        delete json.raw;
	        delete json.schema;
	        const [resp] = await this.request({
	            method: 'POST',
	            uri: '/insertAll',
	            json,
	        });
	        const partialFailures = (resp.insertErrors || []).map((insertError) => {
	            return {
	                errors: insertError.errors.map(error => {
	                    return {
	                        message: error.message,
	                        reason: error.reason,
	                    };
	                }),
	                // eslint-disable-next-line @typescript-eslint/no-explicit-any
	                row: rows[insertError.index],
	            };
	        });
	        if (partialFailures.length > 0) {
	            throw new common_1.util.PartialFailureError({
	                errors: partialFailures,
	                response: resp,
	            });
	        }
	        return resp;
	    }
	    createInsertStream(options) {
	        options = typeof options === 'object' ? options : {};
	        const dup = new stream_1.Duplex({ objectMode: true });
	        dup._write = (chunk, encoding, cb) => {
	            this.rowQueue.add(chunk, () => { });
	            cb();
	        };
	        this.rowQueue = new rowQueue_1.RowQueue(this, dup, options);
	        return dup;
	    }
	    load(source, metadataOrCallback, cb) {
	        const metadata = typeof metadataOrCallback === 'object' ? metadataOrCallback : {};
	        const callback = typeof metadataOrCallback === 'function' ? metadataOrCallback : cb;
	        this.createLoadJob(source, metadata, (err, job, resp) => {
	            if (err) {
	                callback(err, resp);
	                return;
	            }
	            job.on('error', callback).on('complete', metadata => {
	                callback(null, metadata);
	            });
	        });
	    }
	    query(query, callback) {
	        if (typeof query === 'string') {
	            query = {
	                query,
	            };
	        }
	        this.dataset.query(query, callback);
	    }
	    setMetadata(metadata, callback) {
	        const body = Table.formatMetadata_(metadata);
	        void super.setMetadata(body, callback);
	    }
	    getIamPolicy(optionsOrCallback, cb) {
	        const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
	        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
	        if (typeof options.requestedPolicyVersion === 'number' &&
	            options.requestedPolicyVersion !== 1) {
	            throw new Error('Only IAM policy version 1 is supported.');
	        }
	        const json = extend(true, {}, { options });
	        this.request({
	            method: 'POST',
	            uri: '/:getIamPolicy',
	            json,
	        }, (err, resp) => {
	            if (err) {
	                callback(err, null);
	                return;
	            }
	            callback(null, resp);
	        });
	    }
	    setIamPolicy(policy, optionsOrCallback, cb) {
	        const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
	        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
	        if (policy.version && policy.version !== 1) {
	            throw new Error('Only IAM policy version 1 is supported.');
	        }
	        const json = extend(true, {}, options, { policy });
	        this.request({
	            method: 'POST',
	            uri: '/:setIamPolicy',
	            json,
	        }, (err, resp) => {
	            if (err) {
	                callback(err, null);
	                return;
	            }
	            callback(null, resp);
	        });
	    }
	    testIamPermissions(permissions, callback) {
	        permissions = (0, util_1.toArray)(permissions);
	        const json = extend(true, {}, { permissions });
	        this.request({
	            method: 'POST',
	            uri: '/:testIamPermissions',
	            json,
	        }, (err, resp) => {
	            if (err) {
	                callback(err, null);
	                return;
	            }
	            callback(null, resp);
	        });
	    }
	}
	table.Table = Table;
	/*! Developer Documentation
	 *
	 * These methods can be auto-paginated.
	 */
	paginator_1.paginator.extend(Table, ['getRows']);
	/*! Developer Documentation
	 *
	 * All async methods (except for streams) will return a Promise in the event
	 * that a callback is omitted.
	 */
	(0, promisify_1.promisifyAll)(Table);
	
	return table;
}

var model = {};

var hasRequiredModel;

function requireModel () {
	if (hasRequiredModel) return model;
	hasRequiredModel = 1;
	/*!
	 * Copyright 2019 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(model, "__esModule", { value: true });
	model.Model = void 0;
	const common_1 = requireSrc$4();
	const promisify_1 = requireSrc$2();
	const util_1 = requireUtil();
	const extend = requireExtend();
	/**
	 * The model export formats accepted by BigQuery.
	 *
	 * @type {array}
	 * @private
	 */
	const FORMATS = ['ML_TF_SAVED_MODEL', 'ML_XGBOOST_BOOSTER'];
	/**
	 * Model objects are returned by methods such as {@link Dataset#model} and
	 * {@link Dataset#getModels}.
	 *
	 * @class
	 * @param {Dataset} dataset {@link Dataset} instance.
	 * @param {string} id The ID of the model.
	 *
	 * @example
	 * ```
	 * const {BigQuery} = require('@google-cloud/bigquery');
	 * const bigquery = new BigQuery();
	 * const dataset = bigquery.dataset('my-dataset');
	 *
	 * const model = dataset.model('my-model');
	 * ```
	 */
	class Model extends common_1.ServiceObject {
	    dataset;
	    bigQuery;
	    constructor(dataset, id) {
	        const methods = {
	            /**
	             * @callback DeleteModelCallback
	             * @param {?Error} err Request error, if any.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * Delete the model.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/models/delete| Models: delete API Documentation}
	             *
	             * @method Model#delete
	             * @param {DeleteModelCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             * const model = dataset.model('my-model');
	             *
	             * model.delete((err, apiResponse) => {});
	             *
	             * ```
	             * @example If the callback is omitted we'll return a Promise.
	             * ```
	             * const [apiResponse] = await model.delete();
	             * ```
	             * @example If successful, the response body is empty.
	             * ```
	             * ```
	             */
	            delete: true,
	            /**
	             * @callback ModelExistsCallback
	             * @param {?Error} err Request error, if any.
	             * @param {boolean} exists Indicates if the model exists.
	             */
	            /**
	             * @typedef {array} ModelExistsResponse
	             * @property {boolean} 0 Indicates if the model exists.
	             */
	            /**
	             * Check if the model exists.
	             *
	             * @method Model#exists
	             * @param {ModelExistsCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {boolean} callback.exists Whether the model exists or not.
	             * @returns {Promise<ModelExistsResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             * const model = dataset.model('my-model');
	             *
	             * model.exists((err, exists) => {});
	             *
	             * ```
	             * @example If the callback is omitted we'll return a Promise.
	             * ```
	             * const [exists] = await model.exists();
	             * ```
	             */
	            exists: true,
	            /**
	             * @callback GetModelCallback
	             * @param {?Error} err Request error, if any.
	             * @param {Model} model The model.
	             * @param {object} apiResponse The full API response body.
	             */
	            /**
	             * @typedef {array} GetModelResponse
	             * @property {Model} 0 The model.
	             * @property {object} 1 The full API response body.
	             */
	            /**
	             * Get a model if it exists.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/models/get| Models: get API Documentation}
	             *
	             * @method Model#get:
	             * @param {GetModelCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {Model} callback.model The {@link Model}.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<GetModelResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             * const model = dataset.model('my-model');
	             *
	             * model.get(err => {
	             *   if (!err) {
	             *     // `model.metadata` has been populated.
	             *   }
	             * });
	             *
	             * ```
	             * @example If the callback is omitted we'll return a Promise.
	             * ```
	             * await model.get();
	             * ```
	             */
	            get: true,
	            /**
	             * @callback GetModelMetadataCallback
	             * @param {?Error} err Request error, if any.
	             * @param {object} metadata The model metadata.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * @typedef {array} GetModelMetadataResponse
	             * @property {object} 0 The model metadata.
	             * @property {object} 1 The full API response.
	             */
	            /**
	             * Return the metadata associated with the model.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/models/get| Models: get API Documentation}
	             *
	             * @method Model#getMetadata
	             * @param {GetModelMetadataCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {object} callback.metadata The metadata of the model.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<GetModelMetadataResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             * const model = dataset.model('my-model');
	             *
	             * model.getMetadata((err, metadata, apiResponse) => {});
	             *
	             * ```
	             * @example If the callback is omitted we'll return a Promise.
	             * ```
	             * const [metadata, apiResponse] = await model.getMetadata();
	             * ```
	             */
	            getMetadata: true,
	            /**
	             * @callback SetModelMetadataCallback
	             * @param {?Error} err Request error, if any.
	             * @param {object} metadata The model metadata.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * @typedef {array} SetModelMetadataResponse
	             * @property {object} 0 The model metadata.
	             * @property {object} 1 The full API response.
	             */
	            /**
	             * See {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/models/patch| Models: patch API Documentation}
	             *
	             * @method Model#setMetadata
	             * @param {object} metadata The metadata key/value object to set.
	             * @param {SetModelMetadataCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {object} callback.metadata The updated metadata of the model.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<SetModelMetadataResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             * const model = dataset.model('my-model');
	             *
	             * const metadata = {
	             *   friendlyName: 'TheBestModelEver'
	             * };
	             *
	             * model.setMetadata(metadata, (err, metadata, apiResponse) => {});
	             *
	             * ```
	             * @example If the callback is omitted we'll return a Promise.
	             * ```
	             * const [metadata, apiResponse] = await model.setMetadata(metadata);
	             * ```
	             */
	            setMetadata: true,
	        };
	        super({
	            parent: dataset,
	            baseUrl: '/models',
	            id,
	            methods,
	        });
	        this.dataset = dataset;
	        this.bigQuery = dataset.bigQuery;
	    }
	    createExtractJob(destination, optionsOrCallback, cb) {
	        let options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
	        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
	        options = extend(true, options, {
	            destinationUris: (0, util_1.toArray)(destination).map(dest => {
	                if (common_1.util.isCustomType(dest, 'storage/file')) {
	                    return ('gs://' + dest.bucket.name + '/' + dest.name);
	                }
	                if (typeof dest === 'string') {
	                    return dest;
	                }
	                throw new Error('Destination must be a string or a File object.');
	            }),
	        });
	        if (options.format) {
	            options.format = options.format.toUpperCase();
	            if (FORMATS.includes(options.format)) {
	                options.destinationFormat = options.format;
	                delete options.format;
	            }
	            else {
	                throw new Error('Destination format not recognized: ' + options.format);
	            }
	        }
	        const body = {
	            configuration: {
	                extract: extend(true, options, {
	                    sourceModel: {
	                        datasetId: this.dataset.id,
	                        projectId: this.dataset.projectId,
	                        modelId: this.id,
	                    },
	                }),
	            },
	        };
	        if (options.jobPrefix) {
	            body.jobPrefix = options.jobPrefix;
	            delete options.jobPrefix;
	        }
	        if (options.jobId) {
	            body.jobId = options.jobId;
	            delete options.jobId;
	        }
	        if (body.configuration && options.reservation) {
	            body.configuration.reservation = options.reservation;
	            delete options.reservation;
	        }
	        this.bigQuery.createJob(body, callback);
	    }
	    extract(destination, optionsOrCallback, cb) {
	        const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
	        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
	        this.createExtractJob(destination, options, (err, job, resp) => {
	            if (err) {
	                callback(err, resp);
	                return;
	            }
	            job.on('error', callback).on('complete', metadata => {
	                callback(null, metadata);
	            });
	        });
	    }
	}
	model.Model = Model;
	/*! Developer Documentation
	 *
	 * All async methods (except for streams) will return a Promise in the event
	 * that a callback is omitted.
	 */
	(0, promisify_1.promisifyAll)(Model);
	
	return model;
}

var routine = {};

var hasRequiredRoutine;

function requireRoutine () {
	if (hasRequiredRoutine) return routine;
	hasRequiredRoutine = 1;
	Object.defineProperty(routine, "__esModule", { value: true });
	routine.Routine = void 0;
	/*!
	 * Copyright 2020 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	const common_1 = requireSrc$4();
	const promisify_1 = requireSrc$2();
	const extend = requireExtend();
	/**
	 * Routine objects are returned by methods such as
	 * {@link Dataset#routine}, {@link Dataset#createRoutine}, and
	 * {@link Dataset#getRoutines}.
	 *
	 * @class
	 * @param {Dataset} dataset {@link Dataset} instance.
	 * @param {string} id The ID of the routine.
	 *
	 * @example
	 * ```
	 * const {BigQuery} = require('@google-cloud/bigquery');
	 * const bigquery = new BigQuery();
	 * const dataset = bigquery.dataset('my-dataset');
	 *
	 * const routine = dataset.routine('my_routine');
	 * ```
	 */
	class Routine extends common_1.ServiceObject {
	    constructor(dataset, id) {
	        const methods = {
	            /**
	             * Create a routine.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/routines/insert| Routines: insert API Documentation}
	             *
	             * @method Routine#create
	             * @param {object} config A [routine resource]{@link https://cloud.google.com/bigquery/docs/reference/rest/v2/routines#Routine}.
	             * @param {CreateRoutineCallback} [callback] The callback function.
	             * @returns {Promise<CreateRoutineResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             * const routine = dataset.routine('my_routine');
	             *
	             * const config = {
	             *   arguments: [{
	             *     name: 'x',
	             *     dataType: {
	             *       typeKind: 'INT64'
	             *     }
	             *   }],
	             *   definitionBody: 'x * 3',
	             *   routineType: 'SCALAR_FUNCTION',
	             *   returnType: {
	             *     typeKind: 'INT64'
	             *   }
	             * };
	             *
	             * routine.create(config, (err, routine, apiResponse) => {
	             *   if (!err) {
	             *     // The routine was created successfully.
	             *   }
	             * });
	             *
	             * ```
	             * @example If the callback is omitted a Promise will be returned
	             * ```
	             * const [routine, apiResponse] = await routine.create(config);
	             * ```
	             */
	            create: true,
	            /**
	             * @callback DeleteRoutineCallback
	             * @param {?Error} err Request error, if any.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * @typedef {array} DeleteRoutineResponse
	             * @property {object} 0 The full API response.
	             */
	            /**
	             * Deletes a routine.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/routines/delete| Routines: delete API Documentation}
	             *
	             * @method Routine#delete
	             * @param {DeleteRoutineCallback} [callback] The callback function.
	             * @returns {Promise<DeleteRoutineResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             * const routine = dataset.routine('my_routine');
	             *
	             * routine.delete((err, apiResponse) => {
	             *   if (!err) {
	             *     // The routine was deleted successfully.
	             *   }
	             * });
	             *
	             * ```
	             * @example If the callback is omitted a Promise will be returned
	             * ```
	             * const [apiResponse] = await routine.delete();
	             * ```
	             */
	            delete: true,
	            /**
	             * @callback RoutineExistsCallback
	             * @param {?Error} err Request error, if any.
	             * @param {boolean} exists Indicates if the routine exists.
	             */
	            /**
	             * @typedef {array} RoutineExistsResponse
	             * @property {boolean} 0 Indicates if the routine exists.
	             */
	            /**
	             * Check if the routine exists.
	             *
	             * @method Routine#exists
	             * @param {RoutineExistsCallback} [callback] The callback function.
	             * @returns {Promise<RoutineExistsResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             * const routine = dataset.routine('my_routine');
	             *
	             * routine.exists((err, exists) => {});
	             *
	             * ```
	             * @example If the callback is omitted a Promise will be returned
	             * ```
	             * const [exists] = await routine.exists();
	             * ```
	             */
	            exists: true,
	            /**
	             * @callback GetRoutineCallback
	             * @param {?Error} err Request error, if any.
	             * @param {Routine} routine The routine.
	             * @param {object} apiResponse The full API response body.
	             */
	            /**
	             * @typedef {array} GetRoutineResponse
	             * @property {Routine} 0 The routine.
	             * @property {object} 1 The full API response body.
	             */
	            /**
	             * Get a routine if it exists.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/routines/get| Routines: get API Documentation}
	             *
	             * @method Routine#get
	             * @param {GetRoutineCallback} [callback] The callback function.
	             * @returns {Promise<GetRoutineResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             * const routine = dataset.routine('my_routine');
	             *
	             * routine.get((err, routine) => {});
	             *
	             * ```
	             * @example If the callback is omitted a Promise will be returned
	             * ```
	             * const [routine2] = await routine.get();
	             * ```
	             */
	            get: true,
	            /**
	             * @callback GetRoutineMetadataCallback
	             * @param {?Error} err Request error, if any.
	             * @param {object} metadata The routine metadata.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * @typedef {array} GetRoutineMetadataResponse
	             * @property {object} 0 The routine metadata.
	             * @property {object} 1 The full API response.
	             */
	            /**
	             * Get the metadata associated with a routine.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/routines/get| Routines: get API Documentation}
	             *
	             * @method Routine#getMetadata
	             * @param {GetRoutineMetadataCallback} [callback] The callback function.
	             * @returns {Promise<GetRoutineMetadataResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             * const routine = dataset.routine('my_routine');
	             *
	             * routine.getMetadata((err, metadata, apiResponse) => {});
	             *
	             * ```
	             * @example If the callback is omitted a Promise will be returned
	             * ```
	             * const [metadata, apiResponse] = await routine.getMetadata();
	             * ```
	             */
	            getMetadata: true,
	            /**
	             * @callback SetRoutineMetadataCallback
	             * @param {?Error} err Request error, if any.
	             * @param {object} metadata The routine metadata.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * @typedef {array} SetRoutineMetadataResponse
	             * @property {object} 0 The routine metadata.
	             * @property {object} 1 The full API response.
	             */
	            /**
	             * Update a routine.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/routines/update| Routines: update API Documentation}
	             *
	             * @method Routine#setMetadata
	             * @param {object} metadata A [routine resource object]{@link https://cloud.google.com/bigquery/docs/reference/rest/v2/routines#Routine}.
	             * @param {SetRoutineMetadataCallback} [callback] The callback function.
	             * @returns {Promise<SetRoutineMetadataResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('my-dataset');
	             * const routine = dataset.routine('my_routine');
	             *
	             * const updates = {
	             *   description: 'The perfect description!'
	             * };
	             *
	             * routine.setMetadata(updates, (err, metadata, apiResponse) => {});
	             *
	             * ```
	             * @example If the callback is omitted a Promise will be returned
	             * ```
	             * const [metadata, apiResponse] = await routine.setMetadata(updates);
	             * ```
	             */
	            setMetadata: {
	                reqOpts: {
	                    method: 'PUT',
	                },
	            },
	        };
	        super({
	            parent: dataset,
	            baseUrl: '/routines',
	            id,
	            methods,
	            createMethod: dataset.createRoutine.bind(dataset),
	        });
	    }
	    setMetadata(metadata, callback) {
	        // per the python client, it would appear that in order to update a routine
	        // you need to send the routine in its entirety, not just the updated fields
	        void this.getMetadata((err, fullMetadata) => {
	            if (err) {
	                callback(err);
	                return;
	            }
	            const updatedMetadata = extend(true, {}, fullMetadata, metadata);
	            void super.setMetadata(updatedMetadata, callback);
	        });
	    }
	}
	routine.Routine = Routine;
	/*! Developer Documentation
	 *
	 * All async methods (except for streams) will return a Promise in the event
	 * that a callback is omitted.
	 */
	(0, promisify_1.promisifyAll)(Routine);
	
	return routine;
}

var hasRequiredDataset;

function requireDataset () {
	if (hasRequiredDataset) return dataset;
	hasRequiredDataset = 1;
	/*!
	 * Copyright 2014 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(dataset, "__esModule", { value: true });
	dataset.Dataset = void 0;
	const common_1 = requireSrc$4();
	const paginator_1 = requireSrc$3();
	const promisify_1 = requireSrc$2();
	const extend = requireExtend();
	const table_1 = requireTable();
	const model_1 = requireModel();
	const routine_1 = requireRoutine();
	/**
	 * Interact with your BigQuery dataset. Create a Dataset instance with
	 * {@link BigQuery#createDataset} or {@link BigQuery#dataset}.
	 *
	 * @class
	 * @param {BigQuery} bigQuery {@link BigQuery} instance.
	 * @param {string} id The ID of the Dataset.
	 * @param {object} [options] Dataset options.
	 * @param {string} [options.projectId] The GCP project ID.
	 * @param {string} [options.location] The geographic location of the dataset.
	 *      Defaults to US.
	 *
	 * @example
	 * ```
	 * const {BigQuery} = require('@google-cloud/bigquery');
	 * const bigquery = new BigQuery();
	 * const dataset = bigquery.dataset('institutions');
	 * ```
	 */
	class Dataset extends common_1.ServiceObject {
	    bigQuery;
	    location;
	    projectId;
	    getModelsStream(options) {
	        // placeholder body, overwritten in constructor
	        return new paginator_1.ResourceStream({}, () => { });
	    }
	    getRoutinesStream(options) {
	        // placeholder body, overwritten in constructor
	        return new paginator_1.ResourceStream({}, () => { });
	    }
	    getTablesStream(options) {
	        // placeholder body, overwritten in constructor
	        return new paginator_1.ResourceStream({}, () => { });
	    }
	    constructor(bigQuery, id, options) {
	        const methods = {
	            /**
	             * @callback CreateDatasetCallback
	             * @param {?Error} err Request error, if any.
	             * @param {Dataset} dataset The newly created dataset.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * @typedef {array} CreateDatasetResponse
	             * @property {Dataset} 0 The newly created dataset.
	             * @property {object} 1 The full API response body.
	             */
	            /**
	             * Create a dataset.
	             *
	             * @method Dataset#create
	             * @param {CreateDatasetCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {Dataset} callback.dataset The newly created dataset.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<CreateDatasetResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('institutions');
	             * dataset.create((err, dataset, apiResponse) => {
	             *   if (!err) {
	             *     // The dataset was created successfully.
	             *   }
	             * });
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * dataset.create().then((data) => {
	             *   const dataset = data[0];
	             *   const apiResponse = data[1];
	             * });
	             * ```
	             */
	            create: true,
	            /**
	             * @callback DatasetExistsCallback
	             * @param {?Error} err Request error, if any.
	             * @param {boolean} exists Indicates if the dataset exists.
	             */
	            /**
	             * @typedef {array} DatasetExistsResponse
	             * @property {boolean} 0 Indicates if the dataset exists.
	             */
	            /**
	             * Check if the dataset exists.
	             *
	             * @method Dataset#exists
	             * @param {DatasetExistsCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {boolean} callback.exists Whether the dataset exists or not.
	             * @returns {Promise<DatasetExistsResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('institutions');
	             * dataset.exists((err, exists) => {});
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * dataset.exists().then((data) => {
	             *   const exists = data[0];
	             * });
	             * ```
	             */
	            exists: true,
	            /**
	             * @callback GetDatasetCallback
	             * @param {?Error} err Request error, if any.
	             * @param {Dataset} dataset The dataset.
	             * @param {object} apiResponse The full API response body.
	             */
	            /**
	             * @typedef {array} GetDatasetResponse
	             * @property {Dataset} 0 The dataset.
	             * @property {object} 1 The full API response body.
	             */
	            /**
	             * Get a dataset if it exists.
	             *
	             * You may optionally use this to "get or create" an object by providing
	             * an object with `autoCreate` set to `true`. Any extra configuration that
	             * is normally required for the `create` method must be contained within
	             * this object as well.
	             *
	             * @method Dataset#get
	             * @param {options} [options] Configuration object.
	             * @param {boolean} [options.autoCreate=false] Automatically create the
	             *     object if it does not exist.
	             * @param {GetDatasetCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {Dataset} callback.dataset The dataset.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<GetDatasetResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('institutions');
	             * dataset.get((err, dataset, apiResponse) => {
	             *   if (!err) {
	             *     // `dataset.metadata` has been populated.
	             *   }
	             * });
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * dataset.get().then((data) => {
	             *   const dataset = data[0];
	             *   const apiResponse = data[1];
	             * });
	             * ```
	             */
	            get: true,
	            /**
	             * @callback GetDatasetMetadataCallback
	             * @param {?Error} err Request error, if any.
	             * @param {object} metadata The dataset metadata.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * @typedef {array} GetDatasetMetadataResponse
	             * @property {object} 0 The dataset metadata.
	             * @property {object} 1 The full API response.
	             */
	            /**
	             * Get the metadata for the Dataset.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/v2/datasets/get| Datasets: get API Documentation}
	             *
	             * @method Dataset#getMetadata
	             * @param {GetDatasetMetadataCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {object} callback.metadata The dataset's metadata.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<GetDatasetMetadataResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('institutions');
	             * dataset.getMetadata((err, metadata, apiResponse) => {});
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * dataset.getMetadata().then((data) => {
	             *   const metadata = data[0];
	             *   const apiResponse = data[1];
	             * });
	             * ```
	             */
	            getMetadata: true,
	            /**
	             * @callback SetDatasetMetadataCallback
	             * @param {?Error} err Request error, if any.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * @typedef {array} SetDatasetMetadataResponse
	             * @property {object} 0 The full API response.
	             */
	            /**
	             * Sets the metadata of the Dataset object.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/v2/datasets/patch| Datasets: patch API Documentation}
	             *
	             * @method Dataset#setMetadata
	             * @param {object} metadata Metadata to save on the Dataset.
	             * @param {SetDatasetMetadataCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<SetDatasetMetadataResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             * const dataset = bigquery.dataset('institutions');
	             *
	             * const metadata = {
	             *   description: 'Info for every institution in the 2013 IPEDS universe'
	             * };
	             *
	             * dataset.setMetadata(metadata, (err, apiResponse) => {});
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * dataset.setMetadata(metadata).then((data) => {
	             *   const apiResponse = data[0];
	             * });
	             * ```
	             */
	            setMetadata: true,
	        };
	        super({
	            parent: bigQuery,
	            baseUrl: '/datasets',
	            id,
	            methods,
	            createMethod: (id, optionsOrCallback, cb) => {
	                let options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
	                const callback = typeof optionsOrCallback === 'function'
	                    ? optionsOrCallback
	                    : cb;
	                if (this.location) {
	                    options = extend({}, options, { location: this.location });
	                }
	                if (this.projectId) {
	                    options = extend({}, options, { projectId: this.projectId });
	                }
	                return bigQuery.createDataset(id, options, callback);
	            },
	        });
	        if (options && options.location) {
	            this.location = options.location;
	        }
	        if (options?.projectId) {
	            this.projectId = options.projectId;
	        }
	        else {
	            this.projectId = bigQuery.projectId;
	        }
	        this.bigQuery = bigQuery;
	        // Catch all for read-modify-write cycle
	        // https://cloud.google.com/bigquery/docs/api-performance#read-patch-write
	        this.interceptors.push({
	            request: (reqOpts) => {
	                if (reqOpts.method === 'PATCH' && reqOpts.json.etag) {
	                    reqOpts.headers = reqOpts.headers || {};
	                    reqOpts.headers['If-Match'] = reqOpts.json.etag;
	                }
	                if (this.projectId) {
	                    // Override projectId if provided
	                    reqOpts.uri = reqOpts.uri.replace(`/projects/${this.bigQuery.projectId}/`, `/projects/${this.projectId}/`);
	                }
	                return reqOpts;
	            },
	        });
	        /**
	         * List all or some of the {@link Model} objects in your project
	         * as a readable object stream.
	         *
	         * @method Dataset#getModelsStream
	         * @param {object} [options] Configuration object. See
	         *     {@link Dataset#getModels} for a complete list of options.
	         * @return {stream}
	         *
	         * @example
	         * ```
	         * const {BigQuery} = require('@google-cloud/bigquery');
	         * const bigquery = new BigQuery();
	         * const dataset = bigquery.dataset('institutions');
	         *
	         * dataset.getModelsStream()
	         *   .on('error', console.error)
	         *   .on('data', (model) => {})
	         *   .on('end', () => {
	         *     // All models have been retrieved
	         *   });
	         *
	         * ```
	         * @example If you anticipate many results, you can end a stream early to prevent unnecessary processing and API requests.
	         * ```
	         * dataset.getModelsStream()
	         *   .on('data', function(model) {
	         *     this.end();
	         *   });
	         * ```
	         */
	        this.getModelsStream = paginator_1.paginator.streamify('getModels');
	        /**
	         * List all or some of the {@link Routine} objects in your project as a
	         * readable object stream.
	         *
	         * @method Dataset#getRoutinesStream
	         * @param {GetRoutinesOptions} [options] Configuration object.
	         * @returns {stream}
	         *
	         * @example
	         * ```
	         * const {BigQuery} = require('@google-cloud/bigquery');
	         * const bigquery = new BigQuery();
	         * const dataset = bigquery.dataset('institutions');
	         *
	         * dataset.getRoutinesStream()
	         *   .on('error', console.error)
	         *   .on('data', (routine) => {})
	         *   .on('end', () => {
	         *     // All routines have been retrieved
	         *   });
	         *
	         * ```
	         * @example If you anticipate many results, you can end a stream early to prevent unnecessary processing and API requests.
	         * ```
	         * dataset.getRoutinesStream()
	         *   .on('data', function(routine) {
	         *     this.end();
	         *   });
	         * ```
	         */
	        this.getRoutinesStream = paginator_1.paginator.streamify('getRoutines');
	        /**
	         * List all or some of the {@link Table} objects in your project
	         * as a readable object stream.
	         *
	         * @method Dataset#getTablesStream
	         * @param {object} [options] Configuration object. See
	         *     {@link Dataset#getTables} for a complete list of options.
	         * @return {stream}
	         *
	         * @example
	         * ```
	         * const {BigQuery} = require('@google-cloud/bigquery');
	         * const bigquery = new BigQuery();
	         * const dataset = bigquery.dataset('institutions');
	         *
	         * dataset.getTablesStream()
	         *   .on('error', console.error)
	         *   .on('data', (table) => {})
	         *   .on('end', () => {
	         *     // All tables have been retrieved
	         *   });
	         *
	         * //-
	         * // If you anticipate many results, you can end a stream early to prevent
	         * // unnecessary processing and API requests.
	         * //-
	         * dataset.getTablesStream()
	         *   .on('data', function(table) {
	         *     this.end();
	         *   });
	         * ```
	         */
	        this.getTablesStream = paginator_1.paginator.streamify('getTables');
	    }
	    createQueryJob(options, callback) {
	        if (typeof options === 'string') {
	            options = {
	                query: options,
	            };
	        }
	        options = extend(true, {}, options, {
	            defaultDataset: {
	                datasetId: this.id,
	            },
	            location: this.location,
	        });
	        return this.bigQuery.createQueryJob(options, callback);
	    }
	    /**
	     * Run a query scoped to your dataset as a readable object stream.
	     *
	     * See {@link BigQuery#createQueryStream} for full documentation of this
	     * method.
	     *
	     * @param {object} options See {@link BigQuery#createQueryStream} for full
	     *     documentation of this method.
	     * @returns {stream}
	     */
	    createQueryStream(options) {
	        if (typeof options === 'string') {
	            options = {
	                query: options,
	            };
	        }
	        options = extend(true, {}, options, {
	            defaultDataset: {
	                datasetId: this.id,
	            },
	            location: this.location,
	        });
	        return this.bigQuery.createQueryStream(options);
	    }
	    createRoutine(id, config, callback) {
	        const json = Object.assign({}, config, {
	            routineReference: {
	                routineId: id,
	                datasetId: this.id,
	                projectId: this.projectId,
	            },
	        });
	        this.request({
	            method: 'POST',
	            uri: '/routines',
	            json,
	        }, (err, resp) => {
	            if (err) {
	                callback(err, null, resp);
	                return;
	            }
	            const routine = this.routine(resp.routineReference.routineId);
	            routine.metadata = resp;
	            callback(null, routine, resp);
	        });
	    }
	    createTable(id, optionsOrCallback, cb) {
	        const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
	        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
	        const body = table_1.Table.formatMetadata_(options);
	        // eslint-disable-next-line @typescript-eslint/no-explicit-any
	        body.tableReference = {
	            datasetId: this.id,
	            projectId: this.projectId,
	            tableId: id,
	        };
	        this.request({
	            method: 'POST',
	            uri: '/tables',
	            json: body,
	        }, (err, resp) => {
	            if (err) {
	                callback(err, null, resp);
	                return;
	            }
	            const table = this.table(resp.tableReference.tableId, {
	                location: resp.location,
	            });
	            table.metadata = resp;
	            callback(null, table, resp);
	        });
	    }
	    delete(optionsOrCallback, callback) {
	        const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
	        callback =
	            typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
	        const query = {
	            deleteContents: !!options.force,
	        };
	        this.request({
	            method: 'DELETE',
	            uri: '',
	            qs: query,
	        }, callback);
	    }
	    getModels(optsOrCb, cb) {
	        const options = typeof optsOrCb === 'object' ? optsOrCb : {};
	        const callback = typeof optsOrCb === 'function' ? optsOrCb : cb;
	        this.request({
	            uri: '/models',
	            qs: options,
	        }, (err, resp) => {
	            if (err) {
	                callback(err, null, null, resp);
	                return;
	            }
	            let nextQuery = null;
	            if (resp.nextPageToken) {
	                nextQuery = Object.assign({}, options, {
	                    pageToken: resp.nextPageToken,
	                });
	            }
	            const models = (resp.models || []).map(modelObject => {
	                const model = this.model(modelObject.modelReference.modelId);
	                model.metadata = modelObject;
	                return model;
	            });
	            callback(null, models, nextQuery, resp);
	        });
	    }
	    getRoutines(optsOrCb, cb) {
	        const options = typeof optsOrCb === 'object' ? optsOrCb : {};
	        const callback = typeof optsOrCb === 'function' ? optsOrCb : cb;
	        this.request({
	            uri: '/routines',
	            qs: options,
	        }, (err, resp) => {
	            if (err) {
	                callback(err, null, null, resp);
	                return;
	            }
	            let nextQuery = null;
	            if (resp.nextPageToken) {
	                nextQuery = Object.assign({}, options, {
	                    pageToken: resp.nextPageToken,
	                });
	            }
	            const routines = (resp.routines || []).map(metadata => {
	                const routine = this.routine(metadata.routineReference.routineId);
	                routine.metadata = metadata;
	                return routine;
	            });
	            callback(null, routines, nextQuery, resp);
	        });
	    }
	    getTables(optionsOrCallback, cb) {
	        const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
	        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
	        this.request({
	            uri: '/tables',
	            qs: options,
	        }, (err, resp) => {
	            if (err) {
	                callback(err, null, null, resp);
	                return;
	            }
	            let nextQuery = null;
	            if (resp.nextPageToken) {
	                nextQuery = Object.assign({}, options, {
	                    pageToken: resp.nextPageToken,
	                });
	            }
	            // eslint-disable-next-line @typescript-eslint/no-explicit-any
	            const tables = (resp.tables || []).map((tableObject) => {
	                const table = this.table(tableObject.tableReference.tableId, {
	                    location: tableObject.location,
	                });
	                table.metadata = tableObject;
	                return table;
	            });
	            callback(null, tables, nextQuery, resp);
	        });
	    }
	    /**
	     * Create a {@link Model} object.
	     *
	     * @throws {TypeError} if model ID is missing.
	     *
	     * @param {string} id The ID of the model.
	     * @return {Model}
	     *
	     * @example
	     * ```
	     * const {BigQuery} = require('@google-cloud/bigquery');
	     * const bigquery = new BigQuery();
	     * const dataset = bigquery.dataset('institutions');
	     *
	     * const model = dataset.model('my-model');
	     * ```
	     */
	    model(id) {
	        if (typeof id !== 'string') {
	            throw new TypeError('A model ID is required.');
	        }
	        return new model_1.Model(this, id);
	    }
	    query(options, callback) {
	        if (typeof options === 'string') {
	            options = {
	                query: options,
	            };
	        }
	        options = extend(true, {}, options, {
	            defaultDataset: {
	                datasetId: this.id,
	            },
	            location: this.location,
	        });
	        return this.bigQuery.query(options, callback);
	    }
	    /**
	     * Create a {@link Routine} object.
	     *
	     * @throws {TypeError} if routine ID is missing.
	     *
	     * @param {string} id The ID of the routine.
	     * @returns {Routine}
	     *
	     * @example
	     * ```
	     * const {BigQuery} = require('@google-cloud/bigquery');
	     * const bigquery = new BigQuery();
	     * const dataset = bigquery.dataset('institutions');
	     *
	     * const routine = dataset.routine('my_routine');
	     * ```
	     */
	    routine(id) {
	        if (typeof id !== 'string') {
	            throw new TypeError('A routine ID is required.');
	        }
	        return new routine_1.Routine(this, id);
	    }
	    /**
	     * Create a {@link Table} object.
	     *
	     * @throws {TypeError} if table ID is missing.
	     *
	     * @param {string} id The ID of the table.
	     * @param {object} [options] Table options.
	     * @param {string} [options.location] The geographic location of the table, by
	     *      default this value is inherited from the dataset. This can be used to
	     *      configure the location of all jobs created through a table instance.
	     * It cannot be used to set the actual location of the table. This value will
	     *      be superseded by any API responses containing location data for the
	     *      table.
	     * @return {Table}
	     *
	     * @example
	     * ```
	     * const {BigQuery} = require('@google-cloud/bigquery');
	     * const bigquery = new BigQuery();
	     * const dataset = bigquery.dataset('institutions');
	     *
	     * const institutions = dataset.table('institution_data');
	     * ```
	     */
	    table(id, options) {
	        if (typeof id !== 'string') {
	            throw new TypeError('A table ID is required.');
	        }
	        options = extend({
	            location: this.location,
	            projectId: this.projectId,
	        }, options);
	        return new table_1.Table(this, id, options);
	    }
	}
	dataset.Dataset = Dataset;
	/*! Developer Documentation
	 *
	 * These methods can be auto-paginated.
	 */
	paginator_1.paginator.extend(Dataset, ['getModels', 'getRoutines', 'getTables']);
	/*! Developer Documentation
	 *
	 * All async methods (except for streams) will return a Promise in the event
	 * that a callback is omitted.
	 */
	(0, promisify_1.promisifyAll)(Dataset, {
	    exclude: ['model', 'routine', 'table'],
	});
	
	return dataset;
}

var job = {};

var logger = {};

var hasRequiredLogger;

function requireLogger () {
	if (hasRequiredLogger) return logger;
	hasRequiredLogger = 1;
	// Copyright 2024 Google LLC
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//     https://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.
	Object.defineProperty(logger, "__esModule", { value: true });
	logger.logger = logger$1;
	logger.setLogFunction = setLogFunction;
	const util = require$$3$1;
	/*! The external function used to emit logs. */
	let logFunction = null;
	/**
	 * Log function to use for debug output. By default, we don't perform any
	 * logging.
	 *
	 * @private
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function logger$1(source, msg, ...otherArgs) {
	    if (logFunction) {
	        const time = new Date().toISOString();
	        const formattedMsg = util.format(`D ${time} | ${source} | ${msg} |`, ...otherArgs);
	        logFunction(formattedMsg);
	    }
	}
	/**
	 * Sets or disables the log function for all active BigQuery instances.
	 *
	 * @param logger A log function that takes a message (such as `console.log`) or
	 * `null` to turn off logging.
	 */
	function setLogFunction(logger) {
	    logFunction = logger;
	}
	
	return logger;
}

var hasRequiredJob;

function requireJob () {
	if (hasRequiredJob) return job;
	hasRequiredJob = 1;
	/*!
	 * Copyright 2014 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(job, "__esModule", { value: true });
	job.Job = void 0;
	/*!
	 * @module bigquery/job
	 */
	const common_1 = requireSrc$4();
	const paginator_1 = requireSrc$3();
	const promisify_1 = requireSrc$2();
	const extend = requireExtend();
	const bigquery_1 = requireBigquery();
	const logger_1 = requireLogger();
	/**
	 * @callback QueryResultsCallback
	 * @param {?Error} err An error returned while making this request.
	 * @param {array} rows The results of the job.
	 */
	/**
	 * @callback ManualQueryResultsCallback
	 * @param {?Error} err An error returned while making this request.
	 * @param {array} rows The results of the job.
	 * @param {?object} nextQuery A pre-made configuration object for your next
	 *     request. This will be `null` if no additional results are available.
	 *     If the query is not yet complete, you may get empty `rows` and
	 *     non-`null` `nextQuery` that you should use for your next request.
	 * @param {object} apiResponse The full API response.
	 */
	/**
	 * Job objects are returned from various places in the BigQuery API:
	 *
	 * - {@link BigQuery#getJobs}
	 * - {@link BigQuery#job}
	 * - {@link BigQuery#query}
	 * - {@link BigQuery#createJob}
	 * - {@link Table#copy}
	 * - {@link Table#createWriteStream}
	 * - {@link Table#extract}
	 * - {@link Table#load}
	 *
	 * They can be used to check the status of a running job or fetching the results
	 * of a previously-executed one.
	 *
	 * @class
	 * @param {BigQuery} bigQuery {@link BigQuery} instance.
	 * @param {string} id The ID of the job.
	 * @param {object} [options] Configuration object.
	 * @param {string} [options.location] The geographic location of the job.
	 *      Required except for US and EU.
	 *
	 * @example
	 * ```
	 * const {BigQuery} = require('@google-cloud/bigquery');
	 * const bigquery = new BigQuery();
	 *
	 * const job = bigquery.job('job-id');
	 *
	 * //-
	 * // All jobs are event emitters. The status of each job is polled
	 * // continuously, starting only after you register a "complete" listener.
	 * //-
	 * job.on('complete', (metadata) => {
	 *   // The job is complete.
	 * });
	 *
	 * //-
	 * // Be sure to register an error handler as well to catch any issues which
	 * // impeded the job.
	 * //-
	 * job.on('error', (err) => {
	 *   // An error occurred during the job.
	 * });
	 *
	 * //-
	 * // To force the Job object to stop polling for updates, simply remove any
	 * // "complete" listeners you've registered.
	 * //
	 * // The easiest way to do this is with `removeAllListeners()`.
	 * //-
	 * job.removeAllListeners();
	 * ```
	 */
	class Job extends common_1.Operation {
	    bigQuery;
	    location;
	    getQueryResultsStream(options) {
	        // placeholder body, overwritten in constructor
	        return new paginator_1.ResourceStream({}, () => { });
	    }
	    constructor(bigQuery, id, options) {
	        let location;
	        const methods = {
	            /**
	             * @callback DeleteJobCallback
	             * @param {?Error} err Request error, if any.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * @typedef {array} DeleteJobResponse
	             * @property {object} 0 The full API response.
	             */
	            /**
	             * Delete the job.
	             *
	             * @see [Jobs: delete API Documentation]{@link https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/delete}
	             *
	             * @method Job#delete
	             * @param {DeleteJobCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<DeleteJobResponse>}
	             *
	             * @example
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             *
	             * const job = bigquery.job(jobId);
	             * job.delete((err, apiResponse) => {
	             *   if (!err) {
	             *     // The job was deleted successfully.
	             *   }
	             * });
	             *
	             * @example If the callback is omitted a Promise will be returned
	             * const [apiResponse] = await job.delete();
	             */
	            delete: {
	                reqOpts: {
	                    method: 'DELETE',
	                    uri: '/delete',
	                    qs: {
	                        get location() {
	                            return location;
	                        },
	                    },
	                },
	            },
	            /**
	             * @callback JobExistsCallback
	             * @param {?Error} err Request error, if any.
	             * @param {boolean} exists Indicates if the job exists.
	             */
	            /**
	             * @typedef {array} JobExistsResponse
	             * @property {boolean} 0 Indicates if the job exists.
	             */
	            /**
	             * Check if the job exists.
	             *
	             * @method Job#exists
	             * @param {JobExistsCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {boolean} callback.exists Whether the job exists or not.
	             * @returns {Promise<JobExistsResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             *
	             * const job = bigquery.job('job-id');
	             *
	             * job.exists((err, exists) => {});
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * job.exists().then((data) => {
	             *   const exists = data[0];
	             * });
	             * ```
	             */
	            exists: true,
	            /**
	             * @callback GetJobCallback
	             * @param {?Error} err Request error, if any.
	             * @param {Model} model The job.
	             * @param {object} apiResponse The full API response body.
	             */
	            /**
	             * @typedef {array} GetJobResponse
	             * @property {Model} 0 The job.
	             * @property {object} 1 The full API response body.
	             */
	            /**
	             * Get a job if it exists.
	             *
	             * @method Job#get
	             * @param {object} [options] Configuration object.
	             * @param {string} [options.location] The geographic location of the job.
	             *     Required except for US and EU.
	             * @param {GetJobCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {Job} callback.job The job.
	             * @returns {Promise<GetJobResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             *
	             * const job = bigquery.job('job-id');
	             *
	             * job.get((err, job, apiResponse) => {
	             *   if (!err) {
	             *     // `job.metadata` has been populated.
	             *   }
	             * });
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * job.get().then((data) => {
	             *   const job = data[0];
	             *   const apiResponse = data[1];
	             * });
	             * ```
	             */
	            get: true,
	            /**
	             * @callback GetJobMetadataCallback
	             * @param {?Error} err Request error, if any.
	             * @param {object} metadata The job metadata.
	             * @param {object} apiResponse The full API response.
	             */
	            /**
	             * @typedef {array} GetJobMetadataResponse
	             * @property {object} 0 The job metadata.
	             * @property {object} 1 The full API response.
	             */
	            /**
	             * Get the metadata of the job. This will mostly be useful for checking
	             * the status of a previously-run job.
	             *
	             * See {@link https://cloud.google.com/bigquery/docs/reference/v2/jobs/get| Jobs: get API Documentation}
	             *
	             * @method Job#getMetadata
	             * @param {GetJobMetadataCallback} [callback] The callback function.
	             * @param {?error} callback.err An error returned while making this
	             *     request.
	             * @param {object} callback.metadata The metadata of the job.
	             * @param {object} callback.apiResponse The full API response.
	             * @returns {Promise<GetJobMetadataResponse>}
	             *
	             * @example
	             * ```
	             * const {BigQuery} = require('@google-cloud/bigquery');
	             * const bigquery = new BigQuery();
	             *
	             * const job = bigquery.job('id');
	             * job.getMetadata((err, metadata, apiResponse) => {});
	             *
	             * //-
	             * // If the callback is omitted, we'll return a Promise.
	             * //-
	             * job.getMetadata().then((data) => {
	             *   const metadata = data[0];
	             *   const apiResponse = data[1];
	             * });
	             * ```
	             */
	            getMetadata: {
	                reqOpts: {
	                    qs: {
	                        get location() {
	                            return location;
	                        },
	                    },
	                },
	            },
	        };
	        super({
	            parent: bigQuery,
	            baseUrl: '/jobs',
	            id,
	            methods,
	        });
	        Object.defineProperty(this, 'location', {
	            get() {
	                return location;
	            },
	            set(_location) {
	                location = _location;
	            },
	        });
	        this.bigQuery = bigQuery;
	        if (options && options.location) {
	            this.location = options.location;
	        }
	        if (options?.projectId) {
	            this.projectId = options.projectId;
	        }
	        /**
	         * Get the results of a job as a readable object stream.
	         *
	         * @param {object} options Configuration object. See
	         *     {@link Job#getQueryResults} for a complete list of options.
	         * @return {stream}
	         *
	         * @example
	         * ```
	         * const through2 = require('through2');
	         * const fs = require('fs');
	         * const {BigQuery} = require('@google-cloud/bigquery');
	         * const bigquery = new BigQuery();
	         *
	         * const job = bigquery.job('job-id');
	         *
	         * job.getQueryResultsStream()
	         *   .pipe(through2.obj(function (row, enc, next) {
	         *     this.push(JSON.stringify(row) + '\n');
	         *     next();
	         *   }))
	         *   .pipe(fs.createWriteStream('./test/testdata/testfile.json'));
	         * ```
	         */
	        this.getQueryResultsStream = paginator_1.paginator.streamify('getQueryResultsAsStream_');
	    }
	    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	    trace_(msg, ...otherArgs) {
	        (0, logger_1.logger)(`[job][${this.id}]`, msg, ...otherArgs);
	    }
	    cancel(callback) {
	        let qs;
	        if (this.location) {
	            qs = { location: this.location };
	        }
	        this.request({
	            method: 'POST',
	            uri: '/cancel',
	            qs,
	        }, callback);
	    }
	    getQueryResults(optionsOrCallback, cb) {
	        const options = typeof optionsOrCallback === 'object' ? optionsOrCallback : {};
	        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : cb;
	        const qs = extend({
	            location: this.location,
	            'formatOptions.useInt64Timestamp': true,
	        }, options);
	        this.trace_('[getQueryResults]', this.id, options.pageToken, options.startIndex);
	        const wrapIntegers = qs.wrapIntegers ? qs.wrapIntegers : false;
	        delete qs.wrapIntegers;
	        const parseJSON = qs.parseJSON ? qs.parseJSON : false;
	        delete qs.parseJSON;
	        delete qs.job;
	        const timeoutOverride = typeof qs.timeoutMs === 'number' ? qs.timeoutMs : false;
	        const cachedRows = options._cachedRows;
	        const cachedResponse = options._cachedResponse;
	        delete options._cachedRows;
	        delete options._cachedResponse;
	        if (cachedRows) {
	            let nextQuery = null;
	            if (options.pageToken) {
	                nextQuery = Object.assign({}, options, {
	                    pageToken: options.pageToken,
	                });
	            }
	            delete cachedResponse?.rows;
	            callback(null, cachedRows, nextQuery, cachedResponse);
	            return;
	        }
	        this.bigQuery.request({
	            uri: '/queries/' + this.id,
	            qs,
	        }, (err, resp) => {
	            if (err) {
	                callback(err, null, null, resp);
	                return;
	            }
	            // eslint-disable-next-line @typescript-eslint/no-explicit-any
	            let rows = [];
	            if (resp.schema && resp.rows) {
	                rows = bigquery_1.BigQuery.mergeSchemaWithRows_(resp.schema, resp.rows, {
	                    wrapIntegers,
	                    parseJSON,
	                });
	            }
	            let nextQuery = null;
	            if (resp.jobComplete === false) {
	                // Query is still running.
	                nextQuery = Object.assign({}, options);
	                // If timeout override was provided, return error.
	                if (timeoutOverride) {
	                    const err = new Error(`The query did not complete before ${timeoutOverride}ms`);
	                    callback(err, null, nextQuery, resp);
	                    return;
	                }
	            }
	            else if (resp.pageToken) {
	                this.trace_('[getQueryResults] has more pages', resp.pageToken);
	                // More results exist.
	                nextQuery = Object.assign({}, options, {
	                    pageToken: resp.pageToken,
	                });
	                delete nextQuery.startIndex;
	            }
	            delete resp.rows;
	            callback(null, rows, nextQuery, resp);
	        });
	    }
	    /**
	     * This method will be called by `getQueryResultsStream()`. It is required to
	     * properly set the `autoPaginate` option value.
	     *
	     * @private
	     */
	    getQueryResultsAsStream_(options, callback) {
	        options = extend({ autoPaginate: false }, options);
	        this.getQueryResults(options, callback);
	    }
	    /**
	     * Poll for a status update. Execute the callback:
	     *
	     *   - callback(err): Job failed
	     *   - callback(): Job incomplete
	     *   - callback(null, metadata): Job complete
	     *
	     * @private
	     *
	     * @param {function} callback
	     */
	    poll_(callback) {
	        void this.getMetadata((err, metadata) => {
	            if (!err && metadata.status && metadata.status.errorResult) {
	                err = new common_1.util.ApiError(metadata.status);
	            }
	            if (err) {
	                callback(err);
	                return;
	            }
	            if (metadata.status.state !== 'DONE') {
	                callback(null);
	                return;
	            }
	            callback(null, metadata);
	        });
	    }
	}
	job.Job = Job;
	/*! Developer Documentation
	 *
	 * These methods can be auto-paginated.
	 */
	paginator_1.paginator.extend(Job, ['getQueryResults']);
	/*! Developer Documentation
	 *
	 * All async methods (except for streams) will return a Promise in the event
	 * that a callback is omitted.
	 */
	(0, promisify_1.promisifyAll)(Job);
	
	return job;
}

const name = "@google-cloud/bigquery";
const description = "Google BigQuery Client Library for Node.js";
const version = "8.1.1";
const license = "Apache-2.0";
const author = "Google LLC";
const engines = {"node":">=18"};
const repository = "googleapis/nodejs-bigquery";
const main = "./build/src/index.js";
const types = "./build/src/index.d.ts";
const files = ["build/src","!build/src/**/*.map"];
const keywords = ["google apis client","google api client","google apis","google api","google","google cloud platform","google cloud","cloud","google bigquery","bigquery"];
const scripts = {"prebenchmark":"npm run compile","benchmark":"node build/benchmark/bench.js benchmark/queries.json","docs":"jsdoc -c .jsdoc.js","lint":"gts check","samples-test":"cd samples/ && npm link ../ && npm test && cd ../","test":"c8 mocha build/test","system-test":"mocha build/system-test --timeout 600000","presystem-test":"npm run compile","clean":"gts clean","compile":"tsc -p . && cp src/types.d.ts build/src/","fix":"gts fix","predocs":"npm run compile","prepare":"npm run compile","pretest":"npm run compile","docs-test":"linkinator docs","predocs-test":"npm run docs","types":"node scripts/gen-types.js","prelint":"cd samples; npm link ../; npm install","precompile":"gts clean"};
const dependencies = {"@google-cloud/common":"^6.0.0","@google-cloud/paginator":"^6.0.0","@google-cloud/precise-date":"^5.0.0","@google-cloud/promisify":"^5.0.0","teeny-request":"^10.0.0","arrify":"^3.0.0","big.js":"^6.2.2","duplexify":"^4.1.3","extend":"^3.0.2","stream-events":"^1.0.5"};
const overrides = {"@google-cloud/common":{"google-auth-library":"10.1.0"}};
const devDependencies = {"@google-cloud/storage":"^7.16.0","@types/big.js":"^6.2.2","@types/duplexify":"^3.6.4","@types/extend":"^3.0.4","@types/is":"^0.0.25","@types/mocha":"^10.0.10","@types/node":"^22.14.0","@types/proxyquire":"^1.3.31","@types/sinon":"^17.0.4","c8":"^10.1.3","codecov":"^3.8.3","discovery-tsd":"^0.3.0","eslint-plugin-prettier":"^5.2.6","gts":"^6.0.2","jsdoc":"^4.0.4","jsdoc-fresh":"^3.0.0","jsdoc-region-tag":"^3.0.0","linkinator":"^6.1.2","mocha":"^11.1.0","nise":"^6.1.1","pack-n-play":"^3.0.1","path-to-regexp":"^8.2.0","prettier":"^3.5.3","proxyquire":"^2.1.3","sinon":"^20.0.0","typescript":"^5.8.2"};
const require$$12 = {
  name,
  description,
  version,
  license,
  author,
  engines,
  repository,
  main,
  types,
  files,
  keywords,
  scripts,
  dependencies,
  overrides,
  devDependencies,
};

var hasRequiredBigquery;

function requireBigquery () {
	if (hasRequiredBigquery) return bigquery$1;
	hasRequiredBigquery = 1;
	(function (exports) {
		/*!
		 * Copyright 2019 Google LLC
		 *
		 * Licensed under the Apache License, Version 2.0 (the "License");
		 * you may not use this file except in compliance with the License.
		 * You may obtain a copy of the License at
		 *
		 *      http://www.apache.org/licenses/LICENSE-2.0
		 *
		 * Unless required by applicable law or agreed to in writing, software
		 * distributed under the License is distributed on an "AS IS" BASIS,
		 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		 * See the License for the specific language governing permissions and
		 * limitations under the License.
		 */
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.BigQueryInt = exports.BigQueryTime = exports.BigQueryDatetime = exports.BigQueryTimestamp = exports.Geography = exports.BigQueryDate = exports.BigQueryRange = exports.BigQuery = exports.PROTOCOL_REGEX = exports.common = void 0;
		const common_1 = requireSrc$4();
		const common = requireSrc$4();
		exports.common = common;
		const paginator_1 = requireSrc$3();
		const promisify_1 = requireSrc$2();
		const precise_date_1 = requireSrc$1();
		const util_1 = requireUtil();
		const Big = requireBig();
		const extend = requireExtend();
		const crypto_1 = require$$0$3;
		const dataset_1 = requireDataset();
		const job_1 = requireJob();
		const table_1 = requireTable();
		const logger_1 = requireLogger();
		exports.PROTOCOL_REGEX = /^(\w*):\/\//;
		class BigQuery extends common_1.Service {
		  location;
		  _universeDomain;
		  _defaultJobCreationMode;
		  createQueryStream(options) {
		    return new paginator_1.ResourceStream({}, () => {
		    });
		  }
		  getDatasetsStream(options) {
		    return new paginator_1.ResourceStream({}, () => {
		    });
		  }
		  getJobsStream(options) {
		    return new paginator_1.ResourceStream({}, () => {
		    });
		  }
		  constructor(options = {}) {
		    let universeDomain = "googleapis.com";
		    const servicePath = "bigquery";
		    if (options.universeDomain) {
		      universeDomain = BigQuery.sanitizeDomain(options.universeDomain);
		    }
		    const EMULATOR_HOST = process.env.BIGQUERY_EMULATOR_HOST;
		    let apiEndpoint = `https://${servicePath}.${universeDomain}`;
		    if (typeof EMULATOR_HOST === "string") {
		      apiEndpoint = BigQuery.sanitizeEndpoint(EMULATOR_HOST);
		    }
		    if (options.apiEndpoint) {
		      apiEndpoint = BigQuery.sanitizeEndpoint(options.apiEndpoint);
		    }
		    options = Object.assign({}, options, {
		      apiEndpoint
		    });
		    const baseUrl = EMULATOR_HOST || `${options.apiEndpoint}/bigquery/v2`;
		    const config = {
		      apiEndpoint: options.apiEndpoint,
		      baseUrl,
		      scopes: ["https://www.googleapis.com/auth/bigquery"],
		      packageJson: require$$12,
		      autoRetry: options.autoRetry,
		      maxRetries: options.maxRetries,
		      retryOptions: options.retryOptions
		    };
		    if (options.scopes) {
		      config.scopes = config.scopes.concat(options.scopes);
		    }
		    super(config, options);
		    if (options.defaultJobCreationMode) {
		      this._defaultJobCreationMode = options.defaultJobCreationMode;
		    }
		    this._universeDomain = universeDomain;
		    this.location = options.location;
		    this.createQueryStream = paginator_1.paginator.streamify("queryAsStream_");
		    this.getDatasetsStream = paginator_1.paginator.streamify("getDatasets");
		    this.getJobsStream = paginator_1.paginator.streamify("getJobs");
		    this.interceptors.push({
		      request: (reqOpts) => {
		        return extend(true, {}, reqOpts, { qs: { prettyPrint: false } });
		      }
		    });
		  }
		  // eslint-disable-next-line @typescript-eslint/no-explicit-any
		  trace_(msg, ...otherArgs) {
		    (0, logger_1.logger)("[bigquery]", msg, ...otherArgs);
		  }
		  get universeDomain() {
		    return this._universeDomain;
		  }
		  static sanitizeEndpoint(url) {
		    if (!exports.PROTOCOL_REGEX.test(url)) {
		      url = `https://${url}`;
		    }
		    return this.sanitizeDomain(url);
		  }
		  static sanitizeDomain(url) {
		    return url.replace(/\/+$/, "");
		  }
		  /**
		   * Merge a rowset returned from the API with a table schema.
		   *
		   * @private
		   *
		   * @param {object} schema
		   * @param {array} rows
		   * @param {object} options
		   * @param {boolean|IntegerTypeCastOptions} options.wrapIntegers Wrap values of
		   *     'INT64' type in {@link BigQueryInt} objects.
		   *     If a `boolean`, this will wrap values in {@link BigQueryInt} objects.
		   *     If an `object`, this will return a value returned by
		   *     `wrapIntegers.integerTypeCastFunction`.
		   *     Please see {@link IntegerTypeCastOptions} for options descriptions.
		   * @param {array} options.selectedFields List of fields to return.
		   * If unspecified, all fields are returned.
		   * @param {array} options.parseJSON parse a 'JSON' field into a JSON object.
		   * @returns Fields using their matching names from the table's schema.
		   */
		  static mergeSchemaWithRows_(schema, rows, options) {
		    let schemaFields = extend(true, [], schema?.fields);
		    let selectedFields = extend(true, [], options.selectedFields);
		    if (options.selectedFields && options.selectedFields.length > 0) {
		      const selectedFieldsArray = options.selectedFields.map((c) => {
		        return c.split(".");
		      });
		      const currentFields = selectedFieldsArray.map((c) => c.shift()).filter((c) => c !== void 0);
		      schemaFields = schemaFields.filter((field) => currentFields.map((c) => c.toLowerCase()).indexOf(field.name.toLowerCase()) >= 0);
		      selectedFields = selectedFieldsArray.filter((c) => c.length > 0).map((c) => c.join("."));
		    }
		    return (0, util_1.toArray)(rows).map(mergeSchema).map(flattenRows);
		    function mergeSchema(row) {
		      return row.f.map((field, index) => {
		        const schemaField = schemaFields[index];
		        let value = field.v;
		        if (schemaField && schemaField.mode === "REPEATED") {
		          value = value.map((val) => {
		            return convertSchemaFieldValue(schemaField, val.v, {
		              ...options,
		              selectedFields
		            });
		          });
		        } else {
		          value = convertSchemaFieldValue(schemaField, value, {
		            ...options,
		            selectedFields
		          });
		        }
		        const fieldObject = {};
		        fieldObject[schemaField.name] = value;
		        return fieldObject;
		      });
		    }
		    function flattenRows(rows2) {
		      return rows2.reduce((acc, row) => {
		        const key = Object.keys(row)[0];
		        acc[key] = row[key];
		        return acc;
		      }, {});
		    }
		  }
		  /**
		   * The `DATE` type represents a logical calendar date, independent of time
		   * zone. It does not represent a specific 24-hour time period. Rather, a given
		   * DATE value represents a different 24-hour period when interpreted in
		   * different time zones, and may represent a shorter or longer day during
		   * Daylight Savings Time transitions.
		   *
		   * @param {object|string} value The date. If a string, this should be in the
		   *     format the API describes: `YYYY-[M]M-[D]D`.
		   *     Otherwise, provide an object.
		   * @param {string|number} value.year Four digits.
		   * @param {string|number} value.month One or two digits.
		   * @param {string|number} value.day One or two digits.
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const bigquery = new BigQuery();
		   * const date = bigquery.date('2017-01-01');
		   *
		   * //-
		   * // Alternatively, provide an object.
		   * //-
		   * const date2 = bigquery.date({
		   *   year: 2017,
		   *   month: 1,
		   *   day: 1
		   * });
		   * ```
		   */
		  static date(value) {
		    return new BigQueryDate(value);
		  }
		  /**
		   * @param {object|string} value The date. If a string, this should be in the
		   *     format the API describes: `YYYY-[M]M-[D]D`.
		   *     Otherwise, provide an object.
		   * @param {string|number} value.year Four digits.
		   * @param {string|number} value.month One or two digits.
		   * @param {string|number} value.day One or two digits.
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const date = BigQuery.date('2017-01-01');
		   *
		   * //-
		   * // Alternatively, provide an object.
		   * //-
		   * const date2 = BigQuery.date({
		   *   year: 2017,
		   *   month: 1,
		   *   day: 1
		   * });
		   * ```
		   */
		  date(value) {
		    return BigQuery.date(value);
		  }
		  /**
		   * A `DATETIME` data type represents a point in time. Unlike a `TIMESTAMP`,
		   * this does not refer to an absolute instance in time. Instead, it is the
		   * civil time, or the time that a user would see on a watch or calendar.
		   *
		   * @method BigQuery.datetime
		   * @param {object|string} value The time. If a string, this should be in the
		   *     format the API describes: `YYYY-[M]M-[D]D[ [H]H:[M]M:[S]S[.DDDDDD]]`.
		   *     Otherwise, provide an object.
		   * @param {string|number} value.year Four digits.
		   * @param {string|number} value.month One or two digits.
		   * @param {string|number} value.day One or two digits.
		   * @param {string|number} [value.hours] One or two digits (`00` - `23`).
		   * @param {string|number} [value.minutes] One or two digits (`00` - `59`).
		   * @param {string|number} [value.seconds] One or two digits (`00` - `59`).
		   * @param {string|number} [value.fractional] Up to six digits for microsecond
		   *     precision.
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const datetime = BigQuery.datetime('2017-01-01 13:00:00');
		   *
		   * //-
		   * // Alternatively, provide an object.
		   * //-
		   * const datetime = BigQuery.datetime({
		   *   year: 2017,
		   *   month: 1,
		   *   day: 1,
		   *   hours: 14,
		   *   minutes: 0,
		   *   seconds: 0
		   * });
		   * ```
		   */
		  /**
		   * A `DATETIME` data type represents a point in time. Unlike a `TIMESTAMP`,
		   * this does not refer to an absolute instance in time. Instead, it is the
		   * civil time, or the time that a user would see on a watch or calendar.
		   *
		   * @param {object|string} value The time. If a string, this should be in the
		   *     format the API describes: `YYYY-[M]M-[D]D[ [H]H:[M]M:[S]S[.DDDDDD]]`.
		   *     Otherwise, provide an object.
		   * @param {string|number} value.year Four digits.
		   * @param {string|number} value.month One or two digits.
		   * @param {string|number} value.day One or two digits.
		   * @param {string|number} [value.hours] One or two digits (`00` - `23`).
		   * @param {string|number} [value.minutes] One or two digits (`00` - `59`).
		   * @param {string|number} [value.seconds] One or two digits (`00` - `59`).
		   * @param {string|number} [value.fractional] Up to six digits for microsecond
		   *     precision.
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const bigquery = new BigQuery();
		   * const datetime = bigquery.datetime('2017-01-01 13:00:00');
		   *
		   * //-
		   * // Alternatively, provide an object.
		   * //-
		   * const datetime = bigquery.datetime({
		   *   year: 2017,
		   *   month: 1,
		   *   day: 1,
		   *   hours: 14,
		   *   minutes: 0,
		   *   seconds: 0
		   * });
		   * ```
		   */
		  static datetime(value) {
		    return new BigQueryDatetime(value);
		  }
		  datetime(value) {
		    return BigQuery.datetime(value);
		  }
		  /**
		   * A `TIME` data type represents a time, independent of a specific date.
		   *
		   * @method BigQuery.time
		   * @param {object|string} value The time. If a string, this should be in the
		   *     format the API describes: `[H]H:[M]M:[S]S[.DDDDDD]`. Otherwise, provide
		   *     an object.
		   * @param {string|number} [value.hours] One or two digits (`00` - `23`).
		   * @param {string|number} [value.minutes] One or two digits (`00` - `59`).
		   * @param {string|number} [value.seconds] One or two digits (`00` - `59`).
		   * @param {string|number} [value.fractional] Up to six digits for microsecond
		   *     precision.
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const time = BigQuery.time('14:00:00'); // 2:00 PM
		   *
		   * //-
		   * // Alternatively, provide an object.
		   * //-
		   * const time = BigQuery.time({
		   *   hours: 14,
		   *   minutes: 0,
		   *   seconds: 0
		   * });
		   * ```
		   */
		  /**
		   * A `TIME` data type represents a time, independent of a specific date.
		   *
		   * @param {object|string} value The time. If a string, this should be in the
		   *     format the API describes: `[H]H:[M]M:[S]S[.DDDDDD]`. Otherwise, provide
		   *     an object.
		   * @param {string|number} [value.hours] One or two digits (`00` - `23`).
		   * @param {string|number} [value.minutes] One or two digits (`00` - `59`).
		   * @param {string|number} [value.seconds] One or two digits (`00` - `59`).
		   * @param {string|number} [value.fractional] Up to six digits for microsecond
		   *     precision.
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const bigquery = new BigQuery();
		   * const time = bigquery.time('14:00:00'); // 2:00 PM
		   *
		   * //-
		   * // Alternatively, provide an object.
		   * //-
		   * const time = bigquery.time({
		   *   hours: 14,
		   *   minutes: 0,
		   *   seconds: 0
		   * });
		   * ```
		   */
		  static time(value) {
		    return new BigQueryTime(value);
		  }
		  time(value) {
		    return BigQuery.time(value);
		  }
		  /**
		   * A timestamp represents an absolute point in time, independent of any time
		   * zone or convention such as Daylight Savings Time.
		   *
		   * The recommended input here is a `Date` or `PreciseDate` class.
		   * If passing as a `string`, it should be Timestamp literals: https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical#timestamp_literals.
		   * When passing a `number` input, it should be epoch seconds in float representation.
		   *
		   * @method BigQuery.timestamp
		   * @param {Date|string} value The time.
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const timestamp = BigQuery.timestamp(new Date());
		   * ```
		   */
		  static timestamp(value) {
		    return new BigQueryTimestamp(value);
		  }
		  /**
		   * A timestamp represents an absolute point in time, independent of any time
		   * zone or convention such as Daylight Savings Time.
		   *
		   * The recommended input here is a `Date` or `PreciseDate` class.
		   * If passing as a `string`, it should be Timestamp literals: https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical#timestamp_literals.
		   * When passing a `number` input, it should be epoch seconds in float representation.
		   *
		   * @param {Date|string|string|number} value The time.
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const bigquery = new BigQuery();
		   * const timestamp = bigquery.timestamp(new Date());
		   * ```
		   */
		  timestamp(value) {
		    return BigQuery.timestamp(value);
		  }
		  /**
		   * A range represents contiguous range between two dates, datetimes, or timestamps.
		   * The lower and upper bound for the range are optional.
		   * The lower bound is inclusive and the upper bound is exclusive.
		   *
		   * @method BigQuery.range
		   * @param {string|BigQueryRangeOptions} value The range API string or start/end with dates/datetimes/timestamp ranges.
		   * @param {string} elementType The range element type - DATE|DATETIME|TIMESTAMP
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const timestampRange = BigQuery.range('[2020-10-01 12:00:00+08, 2020-12-31 12:00:00+08)', 'TIMESTAMP');
		   * ```
		   */
		  static range(value, elementType) {
		    return new BigQueryRange(value, elementType);
		  }
		  /**
		   * A range represents contiguous range between two dates, datetimes, or timestamps.
		   * The lower and upper bound for the range are optional.
		   * The lower bound is inclusive and the upper bound is exclusive.
		   *
		   * @param {string|BigQueryRangeOptions} value The range API string or start/end with dates/datetimes/timestamp ranges.
		   * @param {string} elementType The range element type - DATE|DATETIME|TIMESTAMP
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const bigquery = new BigQuery();
		   * const timestampRange = bigquery.range('[2020-10-01 12:00:00+08, 2020-12-31 12:00:00+08)', 'TIMESTAMP');
		   * ```
		   */
		  range(value, elementType) {
		    return BigQuery.range(value, elementType);
		  }
		  /**
		   * A BigQueryInt wraps 'INT64' values. Can be used to maintain precision.
		   *
		   * @param {string|number|IntegerTypeCastValue} value The INT64 value to convert.
		   * @param {IntegerTypeCastOptions} typeCastOptions Configuration to convert
		   *     value. Must provide an `integerTypeCastFunction` to handle conversion.
		   * @returns {BigQueryInt}
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const bigquery = new BigQuery();
		   *
		   * const largeIntegerValue = Number.MAX_SAFE_INTEGER + 1;
		   *
		   * const options = {
		   *   integerTypeCastFunction: value => value.split(),
		   * };
		   *
		   * const bqInteger = bigquery.int(largeIntegerValue, options);
		   *
		   * const customValue = bqInteger.valueOf();
		   * // customValue is the value returned from your `integerTypeCastFunction`.
		   * ```
		   */
		  static int(value, typeCastOptions) {
		    return new BigQueryInt(value, typeCastOptions);
		  }
		  int(value, typeCastOptions) {
		    return BigQuery.int(value, typeCastOptions);
		  }
		  /**
		   * A geography value represents a surface area on the Earth
		   * in Well-known Text (WKT) format.
		   *
		   * @param {string} value The geospatial data.
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const bigquery = new BigQuery();
		   * const geography = bigquery.geography('POINT(1, 2)');
		   * ```
		   */
		  static geography(value) {
		    return new Geography(value);
		  }
		  geography(value) {
		    return BigQuery.geography(value);
		  }
		  /**
		   * Convert an INT64 value to Number.
		   *
		   * @private
		   * @param {object} value The INT64 value to convert.
		   */
		  static decodeIntegerValue_(value) {
		    const num = Number(value.integerValue);
		    if (!Number.isSafeInteger(num)) {
		      throw new Error("We attempted to return all of the numeric values, but " + (value.schemaFieldName ? value.schemaFieldName + " " : "") + "value " + value.integerValue + " is out of bounds of 'Number.MAX_SAFE_INTEGER'.\nTo prevent this error, please consider passing 'options.wrapIntegers' as\n{\n  integerTypeCastFunction: provide <your_custom_function>\n  fields: optionally specify field name(s) to be custom casted\n}\n");
		    }
		    return num;
		  }
		  /**
		   * Return a value's provided type.
		   *
		   * @private
		   *
		   * @throws {error} If the type provided is invalid.
		   *
		   * See {@link https://cloud.google.com/bigquery/data-types| Data Type}
		   *
		   * @param {*} providedType The type.
		   * @returns {string} The valid type provided.
		   */
		  static getTypeDescriptorFromProvidedType_(providedType) {
		    const VALID_TYPES = [
		      "DATE",
		      "DATETIME",
		      "TIME",
		      "TIMESTAMP",
		      "BYTES",
		      "NUMERIC",
		      "DECIMAL",
		      "BIGNUMERIC",
		      "BIGDECIMAL",
		      "BOOL",
		      "INT64",
		      "INT",
		      "SMALLINT",
		      "INTEGER",
		      "BIGINT",
		      "TINYINT",
		      "BYTEINT",
		      "FLOAT64",
		      "FLOAT",
		      "STRING",
		      "GEOGRAPHY",
		      "ARRAY",
		      "STRUCT",
		      "JSON",
		      "RANGE"
		    ];
		    if ((0, util_1.isArray)(providedType)) {
		      providedType = providedType;
		      return {
		        type: "ARRAY",
		        arrayType: BigQuery.getTypeDescriptorFromProvidedType_(providedType[0])
		      };
		    } else if ((0, util_1.isObject)(providedType)) {
		      return {
		        type: "STRUCT",
		        structTypes: Object.keys(providedType).map((prop) => {
		          return {
		            name: prop,
		            type: BigQuery.getTypeDescriptorFromProvidedType_(providedType[prop])
		          };
		        })
		      };
		    }
		    providedType = providedType.toUpperCase();
		    if (!VALID_TYPES.includes(providedType)) {
		      throw new Error(`Invalid type provided: "${providedType}"`);
		    }
		    return { type: providedType.toUpperCase() };
		  }
		  /**
		   * Detect a value's type.
		   *
		   * @private
		   *
		   * @throws {error} If the type could not be detected.
		   *
		   * See {@link https://cloud.google.com/bigquery/data-types| Data Type}
		   *
		   * @param {*} value The value.
		   * @returns {string} The type detected from the value.
		   */
		  static getTypeDescriptorFromValue_(value) {
		    let typeName;
		    if (value === null) {
		      throw new Error("Parameter types must be provided for null values via the 'types' field in query options.");
		    }
		    if (value instanceof BigQueryDate) {
		      typeName = "DATE";
		    } else if (value instanceof BigQueryDatetime) {
		      typeName = "DATETIME";
		    } else if (value instanceof BigQueryTime) {
		      typeName = "TIME";
		    } else if (value instanceof BigQueryTimestamp) {
		      typeName = "TIMESTAMP";
		    } else if (value instanceof Buffer) {
		      typeName = "BYTES";
		    } else if (value instanceof Big) {
		      if (value.c.length - value.e >= 10) {
		        typeName = "BIGNUMERIC";
		      } else {
		        typeName = "NUMERIC";
		      }
		    } else if (value instanceof BigQueryInt) {
		      typeName = "INT64";
		    } else if (value instanceof Geography) {
		      typeName = "GEOGRAPHY";
		    } else if (value instanceof BigQueryRange) {
		      return {
		        type: "RANGE",
		        rangeElementType: {
		          type: value.elementType
		        }
		      };
		    } else if ((0, util_1.isArray)(value)) {
		      if (value.length === 0) {
		        throw new Error("Parameter types must be provided for empty arrays via the 'types' field in query options.");
		      }
		      return {
		        type: "ARRAY",
		        arrayType: BigQuery.getTypeDescriptorFromValue_(value[0])
		      };
		    } else if ((0, util_1.isBoolean)(value)) {
		      typeName = "BOOL";
		    } else if ((0, util_1.isNumber)(value)) {
		      typeName = value % 1 === 0 ? "INT64" : "FLOAT64";
		    } else if ((0, util_1.isObject)(value)) {
		      return {
		        type: "STRUCT",
		        structTypes: Object.keys(value).map((prop) => {
		          return {
		            name: prop,
		            // eslint-disable-next-line @typescript-eslint/no-explicit-any
		            type: BigQuery.getTypeDescriptorFromValue_(value[prop])
		          };
		        })
		      };
		    } else if ((0, util_1.isString)(value)) {
		      typeName = "STRING";
		    }
		    if (!typeName) {
		      throw new Error([
		        "This value could not be translated to a BigQuery data type.",
		        value
		      ].join("\n"));
		    }
		    return {
		      type: typeName
		    };
		  }
		  /**
		   * Convert a value into a `queryParameter` object.
		   *
		   * @private
		   *
		   * See {@link https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query#request-body| Jobs.query API Reference Docs (see `queryParameters`)}
		   *
		   * @param {*} value The value.
		   * @param {string|ProvidedTypeStruct|ProvidedTypeArray} providedType Provided
		   *     query parameter type.
		   * @returns {object} A properly-formed `queryParameter` object.
		   */
		  static valueToQueryParameter_(value, providedType) {
		    if ((0, util_1.isDate)(value)) {
		      value = BigQuery.timestamp(value);
		    }
		    let parameterType;
		    if (providedType) {
		      parameterType = BigQuery.getTypeDescriptorFromProvidedType_(providedType);
		    } else {
		      parameterType = BigQuery.getTypeDescriptorFromValue_(value);
		    }
		    const queryParameter = { parameterType, parameterValue: {} };
		    const typeName = queryParameter.parameterType.type;
		    if (typeName === "ARRAY") {
		      queryParameter.parameterValue.arrayValues = value.map((itemValue) => {
		        const value2 = BigQuery._getValue(itemValue, parameterType.arrayType);
		        if ((0, util_1.isObject)(value2) || (0, util_1.isArray)(value2)) {
		          if ((0, util_1.isArray)(providedType)) {
		            providedType = providedType;
		            return BigQuery.valueToQueryParameter_(value2, providedType[0]).parameterValue;
		          } else {
		            return BigQuery.valueToQueryParameter_(value2).parameterValue;
		          }
		        }
		        return { value: value2 };
		      });
		    } else if (typeName === "STRUCT") {
		      queryParameter.parameterValue.structValues = Object.keys(value).reduce((structValues, prop) => {
		        let nestedQueryParameter;
		        if (providedType) {
		          nestedQueryParameter = BigQuery.valueToQueryParameter_(value[prop], providedType[prop]);
		        } else {
		          nestedQueryParameter = BigQuery.valueToQueryParameter_(value[prop]);
		        }
		        structValues[prop] = nestedQueryParameter.parameterValue;
		        return structValues;
		      }, {});
		    } else if (typeName === "RANGE") {
		      let rangeValue;
		      if (value instanceof BigQueryRange) {
		        rangeValue = value;
		      } else {
		        rangeValue = BigQuery.range(value, queryParameter.parameterType?.rangeElementType?.type);
		      }
		      queryParameter.parameterValue.rangeValue = {
		        start: {
		          value: rangeValue.value.start
		        },
		        end: {
		          value: rangeValue.value.end
		        }
		      };
		    } else if (typeName === "JSON" && (0, util_1.isObject)(value)) {
		      queryParameter.parameterValue.value = JSON.stringify(value);
		    } else {
		      queryParameter.parameterValue.value = BigQuery._getValue(value, parameterType);
		    }
		    return queryParameter;
		  }
		  // eslint-disable-next-line @typescript-eslint/no-explicit-any
		  static _getValue(value, type) {
		    if (value === null) {
		      return null;
		    }
		    if (value.type)
		      type = value;
		    return BigQuery._isCustomType(type) ? value.value : value;
		  }
		  static _isCustomType({ type }) {
		    return type.indexOf("TIME") > -1 || type.indexOf("DATE") > -1 || type.indexOf("GEOGRAPHY") > -1 || type.indexOf("RANGE") > -1 || type.indexOf("BigQueryInt") > -1;
		  }
		  createDataset(id, optionsOrCallback, cb) {
		    const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
		    const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;
		    const reqOpts = {
		      method: "POST",
		      uri: "/datasets",
		      json: extend(true, {
		        location: this.location
		      }, options, {
		        datasetReference: {
		          datasetId: id
		        }
		      })
		    };
		    if (options.projectId) {
		      reqOpts.projectId = options.projectId;
		    }
		    this.request(reqOpts, (err, resp) => {
		      if (err) {
		        callback(err, null, resp);
		        return;
		      }
		      const dataset = this.dataset(id, options);
		      dataset.metadata = resp;
		      callback(null, dataset, resp);
		    });
		  }
		  createQueryJob(opts, callback) {
		    const options = typeof opts === "object" ? opts : { query: opts };
		    this.trace_("[createQueryJob]", options, callback);
		    if ((!options || !options.query) && !options.pageToken) {
		      throw new Error("A SQL query string is required.");
		    }
		    const query = extend(true, {
		      useLegacySql: false
		    }, options);
		    this.trace_("[createQueryJob]", query);
		    if (options.destination) {
		      if (!(options.destination instanceof table_1.Table)) {
		        throw new Error("Destination must be a Table object.");
		      }
		      query.destinationTable = {
		        datasetId: options.destination.dataset.id,
		        projectId: options.destination.dataset.projectId,
		        tableId: options.destination.id
		      };
		      delete query.destination;
		    }
		    if (query.params) {
		      const { parameterMode, params } = this.buildQueryParams_(query.params, query.types);
		      query.parameterMode = parameterMode;
		      query.queryParameters = params;
		      delete query.params;
		    }
		    const reqOpts = {};
		    reqOpts.configuration = {
		      query
		    };
		    if (typeof query.jobTimeoutMs === "number") {
		      reqOpts.configuration.jobTimeoutMs = query.jobTimeoutMs.toString();
		      delete query.jobTimeoutMs;
		    }
		    if (query.dryRun) {
		      reqOpts.configuration.dryRun = query.dryRun;
		      delete query.dryRun;
		    }
		    if (query.labels) {
		      reqOpts.configuration.labels = query.labels;
		      delete query.labels;
		    }
		    if (query.jobPrefix) {
		      reqOpts.jobPrefix = query.jobPrefix;
		      delete query.jobPrefix;
		    }
		    if (query.location) {
		      reqOpts.location = query.location;
		      delete query.location;
		    }
		    if (query.jobId) {
		      reqOpts.jobId = query.jobId;
		      delete query.jobId;
		    }
		    if (query.reservation) {
		      reqOpts.configuration.reservation = query.reservation;
		      delete query.reservation;
		    }
		    this.createJob(reqOpts, callback);
		  }
		  buildQueryParams_(params, types) {
		    if (!params) {
		      return {
		        parameterMode: void 0,
		        params: void 0
		      };
		    }
		    const parameterMode = (0, util_1.isArray)(params) ? "positional" : "named";
		    const queryParameters = [];
		    if (parameterMode === "named") {
		      const namedParams = params;
		      for (const namedParameter of Object.getOwnPropertyNames(namedParams)) {
		        const value = namedParams[namedParameter];
		        let queryParameter;
		        if (types) {
		          if (!(0, util_1.isObject)(types)) {
		            throw new Error("Provided types must match the value type passed to `params`");
		          }
		          const namedTypes = types;
		          if (namedTypes[namedParameter]) {
		            queryParameter = BigQuery.valueToQueryParameter_(value, namedTypes[namedParameter]);
		          } else {
		            queryParameter = BigQuery.valueToQueryParameter_(value);
		          }
		        } else {
		          queryParameter = BigQuery.valueToQueryParameter_(value);
		        }
		        queryParameter.name = namedParameter;
		        queryParameters.push(queryParameter);
		      }
		    } else {
		      if (types) {
		        if (!(0, util_1.isArray)(types)) {
		          throw new Error("Provided types must match the value type passed to `params`");
		        }
		        const positionalTypes = types;
		        if (params.length !== types.length) {
		          throw new Error("Incorrect number of parameter types provided.");
		        }
		        params.forEach((value, i) => {
		          const queryParameter = BigQuery.valueToQueryParameter_(value, positionalTypes[i]);
		          queryParameters.push(queryParameter);
		        });
		      } else {
		        params.forEach((value) => {
		          const queryParameter = BigQuery.valueToQueryParameter_(value);
		          queryParameters.push(queryParameter);
		        });
		      }
		    }
		    return {
		      parameterMode,
		      params: queryParameters
		    };
		  }
		  createJob(options, callback) {
		    const JOB_ID_PROVIDED = typeof options.jobId !== "undefined";
		    const DRY_RUN = options.configuration?.dryRun ? options.configuration.dryRun : false;
		    const reqOpts = Object.assign({}, options);
		    let jobId = JOB_ID_PROVIDED ? reqOpts.jobId : (0, crypto_1.randomUUID)();
		    if (reqOpts.jobId) {
		      delete reqOpts.jobId;
		    }
		    if (reqOpts.jobPrefix) {
		      jobId = reqOpts.jobPrefix + jobId;
		      delete reqOpts.jobPrefix;
		    }
		    reqOpts.jobReference = {
		      projectId: this.projectId,
		      jobId,
		      location: this.location
		    };
		    if (reqOpts.location) {
		      reqOpts.jobReference.location = reqOpts.location;
		      delete reqOpts.location;
		    }
		    if (reqOpts.configuration && reqOpts.reservation) {
		      reqOpts.configuration.reservation = reqOpts.reservation;
		      delete reqOpts.reservation;
		    }
		    const job = this.job(jobId, {
		      location: reqOpts.jobReference.location
		    });
		    this.request({
		      method: "POST",
		      uri: "/jobs",
		      json: reqOpts
		    }, async (err, resp) => {
		      const ALREADY_EXISTS_CODE = 409;
		      if (err) {
		        if (err.code === ALREADY_EXISTS_CODE && !JOB_ID_PROVIDED && !DRY_RUN) {
		          err = null;
		          [resp] = await job.getMetadata();
		        } else {
		          callback(err, null, resp);
		          return;
		        }
		      }
		      if (resp.status.errors) {
		        err = new common_1.util.ApiError({
		          errors: resp.status.errors,
		          response: resp
		        });
		      }
		      job.location = resp.jobReference.location;
		      job.metadata = resp;
		      callback(err, job, resp);
		    });
		  }
		  /**
		   * Create a reference to a dataset.
		   *
		   * @param {string} id ID of the dataset.
		   * @param {object} [options] Dataset options.
		   * @param {string} [options.projectId] The GCP project ID.
		   * @param {string} [options.location] The geographic location of the dataset.
		   *      Required except for US and EU.
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const bigquery = new BigQuery();
		   * const dataset = bigquery.dataset('higher_education');
		   * ```
		   */
		  dataset(id, options) {
		    if (typeof id !== "string") {
		      throw new TypeError("A dataset ID is required.");
		    }
		    if (this.location) {
		      options = extend({ location: this.location }, options);
		    }
		    return new dataset_1.Dataset(this, id, options);
		  }
		  getDatasets(optionsOrCallback, cb) {
		    const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
		    const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;
		    const reqOpts = {
		      uri: "/datasets",
		      qs: options
		    };
		    if (options.projectId) {
		      reqOpts.projectId = options.projectId;
		    }
		    this.request(reqOpts, (err, resp) => {
		      if (err) {
		        callback(err, null, null, resp);
		        return;
		      }
		      let nextQuery = null;
		      if (resp.nextPageToken) {
		        nextQuery = Object.assign({}, options, {
		          pageToken: resp.nextPageToken
		        });
		      }
		      const datasets = (resp.datasets || []).map((dataset) => {
		        const dsOpts = {
		          location: dataset.location
		        };
		        if (options.projectId) {
		          dsOpts.projectId = options.projectId;
		        }
		        const ds = this.dataset(dataset.datasetReference.datasetId, dsOpts);
		        ds.metadata = dataset;
		        return ds;
		      });
		      callback(null, datasets, nextQuery, resp);
		    });
		  }
		  getJobs(optionsOrCallback, cb) {
		    const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
		    const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;
		    this.request({
		      uri: "/jobs",
		      qs: options,
		      useQuerystring: true
		    }, (err, resp) => {
		      if (err) {
		        callback(err, null, null, resp);
		        return;
		      }
		      let nextQuery = null;
		      if (resp.nextPageToken) {
		        nextQuery = Object.assign({}, options, {
		          pageToken: resp.nextPageToken
		        });
		      }
		      const jobs = (resp.jobs || []).map((jobObject) => {
		        const job = this.job(jobObject.jobReference.jobId, {
		          location: jobObject.jobReference.location
		        });
		        job.metadata = jobObject;
		        return job;
		      });
		      callback(null, jobs, nextQuery, resp);
		    });
		  }
		  /**
		   * Create a reference to an existing job.
		   *
		   * @param {string} id ID of the job.
		   * @param {object} [options] Configuration object.
		   * @param {string} [options.location] The geographic location of the job.
		   *      Required except for US and EU.
		   *
		   * @example
		   * ```
		   * const {BigQuery} = require('@google-cloud/bigquery');
		   * const bigquery = new BigQuery();
		   *
		   * const myExistingJob = bigquery.job('job-id');
		   * ```
		   */
		  job(id, options) {
		    if (this.location) {
		      options = extend({ location: this.location }, options);
		    }
		    return new job_1.Job(this, id, options);
		  }
		  query(query, optionsOrCallback, cb) {
		    let options = typeof optionsOrCallback === "object" ? optionsOrCallback : {};
		    const queryOpts = typeof query === "object" ? {
		      wrapIntegers: query.wrapIntegers,
		      parseJSON: query.parseJSON
		    } : {};
		    const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : cb;
		    this.trace_("[query]", query, options);
		    const queryReq = this.buildQueryRequest_(query, options);
		    this.trace_("[query] queryReq", queryReq);
		    if (!queryReq) {
		      this.createQueryJob(query, (err, job, resp) => {
		        if (err) {
		          callback(err, null, resp);
		          return;
		        }
		        if (typeof query === "object" && query.dryRun) {
		          callback(null, [], resp);
		          return;
		        }
		        options = extend({ job }, queryOpts, options);
		        job.getQueryResults(options, callback);
		      });
		      return;
		    }
		    void this.runJobsQuery(queryReq, (err, job, res) => {
		      this.trace_("[runJobsQuery callback]: ", query, err, job, res);
		      if (err) {
		        callback(err, null, job);
		        return;
		      }
		      options = extend({ job }, queryOpts, options);
		      if (res && res.jobComplete) {
		        let rows = [];
		        if (res.schema && res.rows) {
		          rows = BigQuery.mergeSchemaWithRows_(res.schema, res.rows, {
		            wrapIntegers: options.wrapIntegers || false,
		            parseJSON: options.parseJSON
		          });
		          delete res.rows;
		        }
		        this.trace_("[runJobsQuery] job complete");
		        options._cachedRows = rows;
		        options._cachedResponse = res;
		        if (res.pageToken) {
		          this.trace_("[runJobsQuery] has more pages");
		          options.pageToken = res.pageToken;
		        } else {
		          this.trace_("[runJobsQuery] no more pages");
		        }
		        job.getQueryResults(options, callback);
		        return;
		      }
		      if (queryReq.timeoutMs) {
		        const err2 = new Error(`The query did not complete before ${queryReq.timeoutMs}ms`);
		        callback(err2, null, job);
		        return;
		      }
		      delete options.timeoutMs;
		      this.trace_("[runJobsQuery] job not complete");
		      job.getQueryResults(options, callback);
		    });
		  }
		  /**
		   * Check if the given Query can run using the `jobs.query` endpoint.
		   * Returns a bigquery.IQueryRequest that can be used to call `jobs.query`.
		   * Return undefined if is not possible to convert to a bigquery.IQueryRequest.
		   *
		   * @param query string | Query
		   * @param options QueryOptions
		   * @returns bigquery.IQueryRequest | undefined
		   */
		  buildQueryRequest_(query, options) {
		    if (process.env.FAST_QUERY_PATH === "DISABLED") {
		      return void 0;
		    }
		    const queryObj = typeof query === "string" ? {
		      query
		    } : query;
		    this.trace_("[buildQueryRequest]", query, options, queryObj);
		    if (!!queryObj.destination || !!queryObj.tableDefinitions || !!queryObj.createDisposition || !!queryObj.writeDisposition || !!queryObj.priority && queryObj.priority !== "INTERACTIVE" || queryObj.useLegacySql || !!queryObj.maximumBillingTier || !!queryObj.timePartitioning || !!queryObj.rangePartitioning || !!queryObj.clustering || !!queryObj.destinationEncryptionConfiguration || !!queryObj.schemaUpdateOptions || !!queryObj.jobTimeoutMs || // User has defined the jobID generation behavior
		    !!queryObj.jobId) {
		      return void 0;
		    }
		    if (queryObj.dryRun) {
		      return void 0;
		    }
		    if (options.job) {
		      return void 0;
		    }
		    const req = {
		      useQueryCache: queryObj.useQueryCache,
		      labels: queryObj.labels,
		      defaultDataset: queryObj.defaultDataset,
		      createSession: queryObj.createSession,
		      maximumBytesBilled: queryObj.maximumBytesBilled,
		      timeoutMs: options.timeoutMs,
		      location: queryObj.location || options.location,
		      formatOptions: {
		        useInt64Timestamp: true
		      },
		      maxResults: queryObj.maxResults || options.maxResults,
		      query: queryObj.query,
		      useLegacySql: false,
		      requestId: (0, crypto_1.randomUUID)(),
		      jobCreationMode: this._defaultJobCreationMode,
		      reservation: queryObj.reservation,
		      continuous: queryObj.continuous,
		      destinationEncryptionConfiguration: queryObj.destinationEncryptionConfiguration,
		      writeIncrementalResults: queryObj.writeIncrementalResults,
		      connectionProperties: queryObj.connectionProperties,
		      preserveNulls: queryObj.preserveNulls
		    };
		    if (queryObj.jobCreationMode) {
		      req.jobCreationMode = queryObj.jobCreationMode;
		    }
		    const { parameterMode, params } = this.buildQueryParams_(queryObj.params, queryObj.types);
		    if (params) {
		      req.queryParameters = params;
		    }
		    if (parameterMode) {
		      req.parameterMode = parameterMode;
		    }
		    return req;
		  }
		  runJobsQuery(req, callback) {
		    this.trace_("[runJobsQuery]", req, callback);
		    this.request({
		      method: "POST",
		      uri: "/queries",
		      json: req
		    }, async (err, res) => {
		      this.trace_("jobs.query res:", res, err);
		      if (err) {
		        callback(err, null, res);
		        return;
		      }
		      let job = null;
		      if (res.jobReference) {
		        const jobRef = res.jobReference;
		        job = this.job(jobRef.jobId, {
		          location: jobRef.location
		        });
		      } else if (res.queryId) {
		        job = this.job(res.queryId);
		      }
		      callback(null, job, res);
		    });
		  }
		  /**
		   * This method will be called by `createQueryStream()`. It is required to
		   * properly set the `autoPaginate` option value.
		   *
		   * @private
		   */
		  queryAsStream_(query, callback) {
		    if (query.job) {
		      query.job.getQueryResults(query, callback);
		      return;
		    }
		    const { location, maxResults, pageToken, wrapIntegers, parseJSON } = query;
		    const opts = {
		      location,
		      maxResults,
		      pageToken,
		      wrapIntegers,
		      parseJSON,
		      autoPaginate: false
		    };
		    delete query.location;
		    delete query.maxResults;
		    delete query.pageToken;
		    delete query.wrapIntegers;
		    delete query.parseJSON;
		    this.query(query, opts, callback);
		  }
		  static setLogFunction = logger_1.setLogFunction;
		}
		exports.BigQuery = BigQuery;
		/*! Developer Documentation
		 *
		 * These methods can be auto-paginated.
		 */
		paginator_1.paginator.extend(BigQuery, ["getDatasets", "getJobs"]);
		/*! Developer Documentation
		 *
		 * All async methods (except for streams) will return a Promise in the event
		 * that a callback is omitted.
		 */
		(0, promisify_1.promisifyAll)(BigQuery, {
		  exclude: [
		    "dataset",
		    "date",
		    "datetime",
		    "geography",
		    "int",
		    "job",
		    "time",
		    "timestamp",
		    "range"
		  ]
		});
		function convertSchemaFieldValue(schemaField, value, options) {
		  if (value === null) {
		    return value;
		  }
		  switch (schemaField.type) {
		    case "BOOLEAN":
		    case "BOOL": {
		      value = value.toLowerCase() === "true";
		      break;
		    }
		    case "BYTES": {
		      value = Buffer.from(value, "base64");
		      break;
		    }
		    case "FLOAT":
		    case "FLOAT64": {
		      value = Number(value);
		      break;
		    }
		    case "INTEGER":
		    case "INT64": {
		      const { wrapIntegers } = options;
		      value = wrapIntegers ? typeof wrapIntegers === "object" ? BigQuery.int({ integerValue: value, schemaFieldName: schemaField.name }, wrapIntegers).valueOf() : BigQuery.int(value) : Number(value);
		      break;
		    }
		    case "NUMERIC": {
		      value = new Big(value);
		      break;
		    }
		    case "BIGNUMERIC": {
		      value = new Big(value);
		      break;
		    }
		    case "RECORD": {
		      value = BigQuery.mergeSchemaWithRows_(schemaField, value, options).pop();
		      break;
		    }
		    case "DATE": {
		      value = BigQuery.date(value);
		      break;
		    }
		    case "DATETIME": {
		      value = BigQuery.datetime(value);
		      break;
		    }
		    case "TIME": {
		      value = BigQuery.time(value);
		      break;
		    }
		    case "TIMESTAMP": {
		      const pd = new precise_date_1.PreciseDate();
		      pd.setFullTime(precise_date_1.PreciseDate.parseFull(BigInt(value) * BigInt(1e3)));
		      value = BigQuery.timestamp(pd);
		      break;
		    }
		    case "GEOGRAPHY": {
		      value = BigQuery.geography(value);
		      break;
		    }
		    case "JSON": {
		      const { parseJSON } = options;
		      value = parseJSON ? JSON.parse(value) : value;
		      break;
		    }
		    case "RANGE": {
		      value = BigQueryRange.fromSchemaValue_(value, schemaField.rangeElementType.type);
		      break;
		    }
		  }
		  return value;
		}
		class BigQueryRange {
		  elementType;
		  start;
		  end;
		  constructor(value, elementType) {
		    if (typeof value === "string") {
		      if (!elementType) {
		        throw new Error("invalid RANGE. Element type required when using RANGE API string.");
		      }
		      const [start, end] = BigQueryRange.fromStringValue_(value);
		      this.start = this.convertElement_(start, elementType);
		      this.end = this.convertElement_(end, elementType);
		      this.elementType = elementType;
		    } else {
		      const { start, end } = value;
		      if (start && end) {
		        if (typeof start !== typeof end) {
		          throw Error("upper and lower bound on a RANGE should be of the same type.");
		        }
		      }
		      const inferredType = {
		        BigQueryDate: "DATE",
		        BigQueryDatetime: "DATETIME",
		        BigQueryTimestamp: "TIMESTAMP"
		      }[(start || end || Object).constructor.name] || elementType;
		      this.start = this.convertElement_(start, inferredType);
		      this.end = this.convertElement_(end, inferredType);
		      this.elementType = inferredType;
		    }
		  }
		  /*
		   * Get Range string representation used by the BigQuery API.
		   */
		  get apiValue() {
		    return `[${this.start ? this.start.value : "UNBOUNDED"}, ${this.end ? this.end.value : "UNBOUNDED"})`;
		  }
		  /*
		   * Get Range literal representation accordingly to
		   * https://cloud.google.com/bigquery/docs/reference/standard-sql/lexical#range_literals
		   */
		  get literalValue() {
		    return `RANGE<${this.elementType}> ${this.apiValue}`;
		  }
		  get value() {
		    return {
		      start: this.start ? this.start.value : "UNBOUNDED",
		      end: this.end ? this.end.value : "UNBOUNDED"
		    };
		  }
		  static fromStringValue_(value) {
		    let cleanedValue = value;
		    if (cleanedValue.startsWith("[") || cleanedValue.startsWith("(")) {
		      cleanedValue = cleanedValue.substring(1);
		    }
		    if (cleanedValue.endsWith(")") || cleanedValue.endsWith("]")) {
		      cleanedValue = cleanedValue.substring(0, cleanedValue.length - 1);
		    }
		    const parts = cleanedValue.split(",");
		    if (parts.length !== 2) {
		      throw new Error("invalid RANGE. See RANGE literal format docs for more information.");
		    }
		    const [start, end] = parts.map((s) => s.trim());
		    return [start, end];
		  }
		  static fromSchemaValue_(value, elementType) {
		    const [start, end] = BigQueryRange.fromStringValue_(value);
		    const convertRangeSchemaValue = (value2) => {
		      if (value2 === "UNBOUNDED" || value2 === "NULL") {
		        return null;
		      }
		      return convertSchemaFieldValue({ type: elementType }, value2, {
		        wrapIntegers: false
		      });
		    };
		    return BigQuery.range({
		      start: convertRangeSchemaValue(start),
		      end: convertRangeSchemaValue(end)
		    }, elementType);
		  }
		  convertElement_(value, elementType) {
		    if (typeof value === "string") {
		      if (value === "UNBOUNDED" || value === "NULL") {
		        return void 0;
		      }
		      switch (elementType) {
		        case "DATE":
		          return new BigQueryDate(value);
		        case "DATETIME":
		          return new BigQueryDatetime(value);
		        case "TIMESTAMP":
		          return new BigQueryTimestamp(value);
		      }
		      return void 0;
		    }
		    return value;
		  }
		}
		exports.BigQueryRange = BigQueryRange;
		class BigQueryDate {
		  value;
		  constructor(value) {
		    if (typeof value === "object") {
		      value = BigQuery.datetime(value).value;
		    }
		    this.value = value;
		  }
		}
		exports.BigQueryDate = BigQueryDate;
		class Geography {
		  value;
		  constructor(value) {
		    this.value = value;
		  }
		}
		exports.Geography = Geography;
		class BigQueryTimestamp {
		  value;
		  constructor(value) {
		    let pd;
		    if (value instanceof precise_date_1.PreciseDate) {
		      pd = value;
		    } else if (value instanceof Date) {
		      pd = new precise_date_1.PreciseDate(value);
		    } else if (typeof value === "string") {
		      if (/^\d{4}-\d{1,2}-\d{1,2}/.test(value)) {
		        pd = new precise_date_1.PreciseDate(value);
		      } else {
		        const floatValue = Number.parseFloat(value);
		        if (!Number.isNaN(floatValue)) {
		          pd = this.fromFloatValue_(floatValue);
		        } else {
		          pd = new precise_date_1.PreciseDate(value);
		        }
		      }
		    } else {
		      pd = this.fromFloatValue_(value);
		    }
		    if (pd.getMicroseconds() > 0) {
		      this.value = pd.toISOString();
		    } else {
		      this.value = new Date(pd.getTime()).toJSON();
		    }
		  }
		  fromFloatValue_(value) {
		    const secs = Math.trunc(value);
		    const micros = Math.trunc((value - secs) * 1e6 + 0.5);
		    const pd = new precise_date_1.PreciseDate([secs, micros * 1e3]);
		    return pd;
		  }
		}
		exports.BigQueryTimestamp = BigQueryTimestamp;
		class BigQueryDatetime {
		  value;
		  constructor(value) {
		    if (typeof value === "object") {
		      let time;
		      if (value.hours) {
		        time = BigQuery.time(value).value;
		      }
		      const y = value.year;
		      const m = value.month;
		      const d = value.day;
		      time = time ? " " + time : "";
		      value = `${y}-${m}-${d}${time}`;
		    } else {
		      value = value.replace(/^(.*)T(.*)Z$/, "$1 $2");
		    }
		    this.value = value;
		  }
		}
		exports.BigQueryDatetime = BigQueryDatetime;
		class BigQueryTime {
		  value;
		  constructor(value) {
		    if (typeof value === "object") {
		      const h = value.hours;
		      const m = value.minutes || 0;
		      const s = value.seconds || 0;
		      const f = value.fractional !== void 0 ? "." + value.fractional : "";
		      value = `${h}:${m}:${s}${f}`;
		    }
		    this.value = value;
		  }
		}
		exports.BigQueryTime = BigQueryTime;
		class BigQueryInt extends Number {
		  type;
		  value;
		  typeCastFunction;
		  _schemaFieldName;
		  constructor(value, typeCastOptions) {
		    super(typeof value === "object" ? value.integerValue : value);
		    this._schemaFieldName = typeof value === "object" ? value.schemaFieldName : void 0;
		    this.value = typeof value === "object" ? value.integerValue.toString() : value.toString();
		    this.type = "BigQueryInt";
		    if (typeCastOptions) {
		      if (typeof typeCastOptions.integerTypeCastFunction !== "function") {
		        throw new Error("integerTypeCastFunction is not a function or was not provided.");
		      }
		      const typeCastFields = typeCastOptions.fields ? (0, util_1.toArray)(typeCastOptions.fields) : void 0;
		      let customCast = true;
		      if (typeCastFields) {
		        customCast = this._schemaFieldName ? typeCastFields.includes(this._schemaFieldName) ? true : false : false;
		      }
		      customCast && (this.typeCastFunction = typeCastOptions.integerTypeCastFunction);
		    }
		  }
		  // eslint-disable-next-line @typescript-eslint/no-explicit-any
		  valueOf() {
		    const shouldCustomCast = this.typeCastFunction ? true : false;
		    if (shouldCustomCast) {
		      try {
		        return this.typeCastFunction(this.value);
		      } catch (error) {
		        if (error instanceof Error) {
		          error.message = `integerTypeCastFunction threw an error:

  - ${error.message}`;
		        }
		        throw error;
		      }
		    } else {
		      return BigQuery.decodeIntegerValue_({
		        integerValue: this.value,
		        schemaFieldName: this._schemaFieldName
		      });
		    }
		  }
		  toJSON() {
		    return { type: this.type, value: this.value };
		  }
		}
		exports.BigQueryInt = BigQueryInt; 
	} (bigquery$1));
	return bigquery$1;
}

var hasRequiredSrc;

function requireSrc () {
	if (hasRequiredSrc) return src$7;
	hasRequiredSrc = 1;
	(function (exports) {
		/*!
		 * Copyright 2019 Google Inc. All Rights Reserved.
		 *
		 * Licensed under the Apache License, Version 2.0 (the "License");
		 * you may not use this file except in compliance with the License.
		 * You may obtain a copy of the License at
		 *
		 *      http://www.apache.org/licenses/LICENSE-2.0
		 *
		 * Unless required by applicable law or agreed to in writing, software
		 * distributed under the License is distributed on an "AS IS" BASIS,
		 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		 * See the License for the specific language governing permissions and
		 * limitations under the License.
		 */
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.Table = exports.RowQueue = exports.RowBatch = exports.Routine = exports.Model = exports.Job = exports.Dataset = exports.PROTOCOL_REGEX = exports.Geography = exports.common = exports.BigQueryTimestamp = exports.BigQueryTime = exports.BigQueryInt = exports.BigQueryDatetime = exports.BigQueryDate = exports.BigQuery = void 0;
		var bigquery_1 = requireBigquery();
		Object.defineProperty(exports, "BigQuery", { enumerable: true, get: function () { return bigquery_1.BigQuery; } });
		Object.defineProperty(exports, "BigQueryDate", { enumerable: true, get: function () { return bigquery_1.BigQueryDate; } });
		Object.defineProperty(exports, "BigQueryDatetime", { enumerable: true, get: function () { return bigquery_1.BigQueryDatetime; } });
		Object.defineProperty(exports, "BigQueryInt", { enumerable: true, get: function () { return bigquery_1.BigQueryInt; } });
		Object.defineProperty(exports, "BigQueryTime", { enumerable: true, get: function () { return bigquery_1.BigQueryTime; } });
		Object.defineProperty(exports, "BigQueryTimestamp", { enumerable: true, get: function () { return bigquery_1.BigQueryTimestamp; } });
		Object.defineProperty(exports, "common", { enumerable: true, get: function () { return bigquery_1.common; } });
		Object.defineProperty(exports, "Geography", { enumerable: true, get: function () { return bigquery_1.Geography; } });
		Object.defineProperty(exports, "PROTOCOL_REGEX", { enumerable: true, get: function () { return bigquery_1.PROTOCOL_REGEX; } });
		var dataset_1 = requireDataset();
		Object.defineProperty(exports, "Dataset", { enumerable: true, get: function () { return dataset_1.Dataset; } });
		var job_1 = requireJob();
		Object.defineProperty(exports, "Job", { enumerable: true, get: function () { return job_1.Job; } });
		var model_1 = requireModel();
		Object.defineProperty(exports, "Model", { enumerable: true, get: function () { return model_1.Model; } });
		var routine_1 = requireRoutine();
		Object.defineProperty(exports, "Routine", { enumerable: true, get: function () { return routine_1.Routine; } });
		var rowBatch_1 = requireRowBatch();
		Object.defineProperty(exports, "RowBatch", { enumerable: true, get: function () { return rowBatch_1.RowBatch; } });
		var rowQueue_1 = requireRowQueue();
		Object.defineProperty(exports, "RowQueue", { enumerable: true, get: function () { return rowQueue_1.RowQueue; } });
		var table_1 = requireTable();
		Object.defineProperty(exports, "Table", { enumerable: true, get: function () { return table_1.Table; } });
		
	} (src$7));
	return src$7;
}

var srcExports = requireSrc();

function getEnv(locals) {
  return locals?.runtime?.env || {};
}
let bigquery;
function initializeBigQuery(env) {
  if (bigquery) return;
  const projectId = env.GCP_PROJECT_ID;
  const keyJson = env.GCP_SERVICE_ACCOUNT_KEY;
  if (!projectId || !keyJson) {
    throw new Error("GCP_PROJECT_ID and GCP_SERVICE_ACCOUNT_KEY must be configured in environment secrets.");
  }
  let credentials;
  try {
    credentials = JSON.parse(keyJson);
  } catch (e) {
    throw new Error("GCP_SERVICE_ACCOUNT_KEY secret is not a valid JSON string.");
  }
  bigquery = new srcExports.BigQuery({
    projectId,
    credentials
  });
  console.log("BigQuery client initialized successfully.");
}
const EXAMPLE_QUERIES = [
  {
    query: "SELECT 1 as test_column",
    results: [{ test_column: 1 }],
    rowCount: 1,
    executionTime: "45ms"
  },
  {
    query: "SELECT 'GitHub' as platform, 'JavaScript' as language, 1234567 as repos_count",
    results: [{ platform: "GitHub", language: "JavaScript", repos_count: 1234567 }],
    rowCount: 1,
    executionTime: "62ms"
  },
  {
    query: "SELECT language.name, COUNT(*) as count FROM `bigquery-public-data.github_repos.languages`",
    results: [
      { name: "JavaScript", count: 2456789 },
      { name: "Python", count: 1834567 },
      { name: "Java", count: 1523456 },
      { name: "TypeScript", count: 987654 },
      { name: "Go", count: 654321 }
    ],
    rowCount: 5,
    executionTime: "1.2s"
  }
];
const POST = async ({ request, locals }) => {
  try {
    const env = getEnv(locals);
    const body = await request.json();
    const query = body.query;
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ status: "error", message: "Query is required and must be a string." }), { status: 400 });
    }
    const projectId = env.GCP_PROJECT_ID;
    const keyJson = env.GCP_SERVICE_ACCOUNT_KEY;
    if (!projectId || !keyJson) {
      console.log("BigQuery credentials not configured, returning example data");
      const example = EXAMPLE_QUERIES.find(
        (ex) => query.toLowerCase().includes(ex.query.toLowerCase().split(" ")[1])
        // Simple matching
      ) || EXAMPLE_QUERIES[0];
      return new Response(JSON.stringify({
        status: "success",
        query,
        rowCount: example.rowCount,
        executionTime: example.executionTime,
        results: example.results,
        note: "Przykładowe dane - skonfiguruj GCP_PROJECT_ID i GCP_SERVICE_ACCOUNT_KEY dla prawdziwych zapytań"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    initializeBigQuery(env);
    const startTime = Date.now();
    const [job] = await bigquery.createQueryJob({ query });
    console.log(`BigQuery job ${job.id} started.`);
    const [rows] = await job.getQueryResults();
    const executionTime = `${Date.now() - startTime}ms`;
    return new Response(JSON.stringify({
      status: "success",
      query,
      rowCount: rows.length,
      executionTime,
      results: rows
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("BigQuery API Error:", error);
    return new Response(JSON.stringify({
      status: "error",
      message: error instanceof Error ? error.message : "Failed to execute BigQuery query."
    }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
