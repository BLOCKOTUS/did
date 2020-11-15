"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.reduce");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = void 0;

require("regenerator-runtime/runtime");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var WALLET_PATH = _path["default"].join(__dirname, '..', '..', '..', 'wallet');

var objectToQueryString = function objectToQueryString(initialObj) {
  var reducer = function reducer(obj) {
    var parentPrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return function (prev, key) {
      var val = obj[key];
      key = encodeURIComponent(key);
      var prefix = parentPrefix ? "".concat(parentPrefix, "[").concat(key, "]") : key;

      if (val == null || typeof val === 'function') {
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
 * DID url constructor helpers.
 */


var makePath = function makePath(urlPath) {
  return urlPath && urlPath.substr(0, 1) === '/' ? urlPath : '';
};

var makeQuery = function makeQuery(query) {
  return query ? "?".concat(objectToQueryString(query)) : '';
};

var makeFragment = function makeFragment(fragment) {
  return fragment ? "#".concat(fragment) : '';
};
/**
 * Construct a DID url based on arguments.
 * The DID url will be consumed by Chaincode Contracts.
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
    var url, methodName, methodSpecificId, urlPath, query, fragment;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = _ref2.url, methodName = _ref2.methodName, methodSpecificId = _ref2.methodSpecificId, urlPath = _ref2.urlPath, query = _ref2.query, fragment = _ref2.fragment;

            if (!(!url && (!methodName || !methodSpecificId))) {
              _context.next = 3;
              break;
            }

            throw new Error('Url or methodName and methodSpecificId are missing.');

          case 3:
            if (!url) url = makeUrl({
              methodName: methodName,
              methodSpecificId: methodSpecificId,
              urlPath: urlPath,
              query: query,
              fragment: fragment
            });
            console.log({
              url: url
            });

          case 5:
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