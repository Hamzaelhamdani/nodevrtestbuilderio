"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var BASE_URL = 'http://localhost:5000/api/auth/register';
var users = __spreadArray(__spreadArray([
    {
        email: "admin@example.com",
        password: "AdminPass123!",
        role: "Admin",
        name: "Super Admin"
    },
    {
        email: "support1@ventures.com",
        password: "SupportPass123!",
        role: "SupportStructure",
        name: "Support Structure 1"
    },
    {
        email: "support2@ventures.com",
        password: "SupportPass123!",
        role: "SupportStructure",
        name: "Support Structure 2"
    },
    {
        email: "support3@ventures.com",
        password: "SupportPass123!",
        role: "SupportStructure",
        name: "Support Structure 3"
    }
], Array.from({ length: 12 }, function (_, i) { return ({
    email: "startup".concat(i + 1, "@ventures.com"),
    password: "StartupPass123!",
    role: "Startup", // Ensure capital S
    name: "Startup ".concat(i + 1)
}); }), true), Array.from({ length: 5 }, function (_, i) { return ({
    email: "client".concat(i + 1, "@ventures.com"),
    password: "ClientPass123!",
    role: "Client",
    name: "Client ".concat(i + 1)
}); }), true);
var seed = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, users_1, user, res, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _i = 0, users_1 = users;
                _b.label = 1;
            case 1:
                if (!(_i < users_1.length)) return [3 /*break*/, 6];
                user = users_1[_i];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1.default.post(BASE_URL, user)];
            case 3:
                res = _b.sent();
                console.log("\u2705 ".concat(user.email, " registered"));
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                console.error("\u274C ".concat(user.email, " failed:"), ((_a = err_1.response) === null || _a === void 0 ? void 0 : _a.data) || err_1.message);
                return [3 /*break*/, 5];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); };
seed();
