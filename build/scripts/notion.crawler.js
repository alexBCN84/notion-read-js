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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var puppeteer = require('puppeteer');
var waitTime = 5 * 1000;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    // those we don't want to log because they are not important
    function isSilenced(url) {
        var silenced = ["/api/v3/ping", "/appcache.html", "/loading-spinner.svg", "/api/v3/getUserAnalyticsSettings"];
        for (var _i = 0, silenced_1 = silenced; _i < silenced_1.length; _i++) {
            var s = silenced_1[_i];
            if (url.includes(s)) {
                return true;
            }
        }
        return false;
    }
    function isBlacklisted(url) {
        var blacklisted = ["amplitude.com/", "fullstory.com/", "intercom.io"];
        for (var _i = 0, blacklisted_1 = blacklisted; _i < blacklisted_1.length; _i++) {
            var s = blacklisted_1[_i];
            if (url.includes(s)) {
                return true;
            }
        }
        return false;
    }
    var url, browser, page;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "https://www.notion.so/mismetas/BLOG-POSTS-f058d64ad56b4f318ec58ddeb26625ff";
                return [4 /*yield*/, puppeteer.launch()];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.setRequestInterception(true)];
            case 3:
                _a.sent();
                page.on("request", function (request) {
                    var url = request.url();
                    if (isBlacklisted(url)) {
                        request.abort();
                        return;
                    }
                    request.continue();
                });
                page.on("requestfailed", function (request) {
                    var url = request.url();
                    if (isBlacklisted(url)) {
                        // it was us who failed this request
                        return;
                    }
                    console.log("request failed url:", url);
                });
                page.on("response", function (response) {
                    var request = response.request();
                    var url = request.url();
                    if (isSilenced(url)) {
                        return;
                    }
                    var method = request.method();
                    var postData = request.postData();
                    var status = response.status();
                    response.text().then(function (d) {
                        var dataLen = d.length;
                        console.log(method + " " + url + " " + status + " size: " + dataLen);
                        if (postData) {
                            console.log(postData);
                        }
                    });
                });
                return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle2" })];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.waitFor(waitTime)];
            case 5:
                _a.sent();
                return [4 /*yield*/, browser.close()];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
