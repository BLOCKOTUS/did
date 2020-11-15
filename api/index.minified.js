"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.join");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = void 0;

require("regenerator-runtime/runtime");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var WALLET_PATH = _path["default"].join(__dirname, '..', '..', '..', 'wallet');
/**
 * Construct a DID url based on arguments.
 * The DID url will be consumed by Chaincode Contracts.
 * did-url = did path-abempty [ "?" query ] [ "#" fragment ]
 * path-abempty    ; begins with "/" or is empty
 */


var makeUrl = function makeUrl(_ref) {
  var methodName = _ref.methodName,
      methodSpecificId = _ref.methodSpecificId,
      path = _ref.path,
      query = _ref.query,
      fragment = _ref.fragment;
  return "did:".concat(methodName, ":").concat(methodSpecificId);
};
/**
 * Make a request to the network, using a DID url.
 * The function accept a constructed DID url, or arguments necessary to its construction.
 */


var request = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
    var url, methodName, methodSpecificId, path, query, fragment;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = _ref2.url, methodName = _ref2.methodName, methodSpecificId = _ref2.methodSpecificId, path = _ref2.path, query = _ref2.query, fragment = _ref2.fragment;

            if (!(!url && (!methodName || !methodSpecificId))) {
              _context.next = 3;
              break;
            }

            throw new Error('Url or methodName and methodSpecificId are missing.');

          case 3:
            if (!url) url = makeUrl({
              methodName: methodName,
              methodSpecificId: methodSpecificId,
              query: query,
              fragment: fragment
            });

          case 4:
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