"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.reduce");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.url");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = void 0;

require("regenerator-runtime/runtime");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _index = require("../../../helper/api/dist/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var WALLET_PATH = _path["default"].join(__dirname, '..', '..', '..', '..', 'wallet');
/**
 * Transform a javascript object to a Query String
 * https://gist.github.com/tjmehta/9204891#gistcomment-3527084
 */


var objectToQueryString = function objectToQueryString(initialObj) {
  var reducer = function reducer(obj) {
    var parentPrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return function (prev, key) {
      var val = obj[key];
      key = encodeURIComponent(key);
      var prefix = parentPrefix ? "".concat(parentPrefix, "[").concat(key, "]") : key;

      if (val === null || typeof val === 'function') {
        prev.push("".concat(prefix, "="));
        return prev;
      }

      if (['number', 'boolean', 'string'].includes(_typeof(val))) {
        prev.push("".concat(prefix, "=").concat(encodeURIComponent(val)));
        return prev;
      }

      prev.push(Object.keys(val).reduce(reducer(val, prefix), []).join('&'));
      return prev;
    };
  };

  return Object.keys(initialObj).reduce(reducer(initialObj), []).join('&');
};
/**
 * Transform a Query String to a javasript object
 * https://stackoverflow.com/questions/8648892/how-to-convert-url-parameters-to-a-javascript-object
 */


var queryStringToObject = function queryStringToObject(queryString) {
  var params = new URLSearchParams(queryString);
  var result = {};

  var _iterator = _createForOfIteratorHelper(params),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          value = _step$value[1];

      // each 'entry' is a [key, value] tupple
      result[key] = value;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return result;
};
/**
 * DID url constructor helpers.
 */


var makePath = function makePath(urlPath) {
  return urlPath && urlPath.substr(0, 1) === '/' ? urlPath : '';
};

var makeQuery = function makeQuery(query) {
  return query ? "?".concat(objectToQueryString(JSON.parse(query))) : '';
};

var makeFragment = function makeFragment(fragment) {
  return fragment ? "#".concat(fragment) : '';
};
/**
 * Construct a DID url based on arguments.
 * The DID url will be consumed by Chaincode Contracts.
 *
 * https://www.w3.org/TR/did-core/#did-syntax
 * did-url = did path-abempty [ "?" query ] [ "#" fragment ]
 * path-abempty    ; begins with "/" or is empty
 */


var makeUrl = function makeUrl(_ref) {
  var methodName = _ref.methodName,
      methodSpecificId = _ref.methodSpecificId,
      urlPath = _ref.urlPath,
      query = _ref.query,
      fragment = _ref.fragment;
  return "did:".concat(methodName, ":").concat(methodSpecificId).concat(makePath(urlPath)).concat(makeQuery(query)).concat(makeFragment(fragment));
};
/**
 * Make a request to the network, using a DID url.
 * The function accept a constructed DID url, or arguments necessary to its construction.
 */


var request = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
    var url, methodName, methodSpecificId, urlPath, query, fragment, user, walletPath, _yield$getContractAnd, contract, gateway, rawResponse, response;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = _ref2.url, methodName = _ref2.methodName, methodSpecificId = _ref2.methodSpecificId, urlPath = _ref2.urlPath, query = _ref2.query, fragment = _ref2.fragment, user = _ref2.user;

            if (!(!url && (!methodName || !methodSpecificId))) {
              _context.next = 3;
              break;
            }

            throw new Error('Url or methodName and methodSpecificId are missing.');

          case 3:
            if (!url) {
              url = makeUrl({
                methodName: methodName,
                methodSpecificId: methodSpecificId,
                urlPath: urlPath,
                query: query,
                fragment: fragment
              });
            }

            console.log({
              url: url
            }); // create wallet

            walletPath = _path["default"].join(WALLET_PATH, "".concat(user.username, ".id"));

            _fs["default"].writeFileSync(walletPath, JSON.stringify(user.wallet)); // get contract and gateway


            _context.next = 9;
            return (0, _index.getContractAndGateway)({
              username: user.username,
              chaincode: 'did',
              contract: 'Did'
            });

          case 9:
            _yield$getContractAnd = _context.sent;
            contract = _yield$getContractAnd.contract;
            gateway = _yield$getContractAnd.gateway;

            if (!(!contract || !gateway)) {
              _context.next = 14;
              break;
            }

            throw new Error('Contract or Gateway missing.');

          case 14:
            _context.next = 16;
            return contract.submitTransaction('request', url);

          case 16:
            rawResponse = _context.sent;
            _context.next = 19;
            return gateway.disconnect();

          case 19:
            if (rawResponse) {
              _context.next = 21;
              break;
            }

            throw new Error('Error while submitting transaction.');

          case 21:
            response = JSON.parse(rawResponse.toString('utf8'));
            return _context.abrupt("return", response);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function request(_x) {
    return _ref3.apply(this, arguments);
  };
}();

exports.request = request;