"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveNotionData = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
function retrieveNotionData(entry) {
    return __awaiter(this, void 0, void 0, function () {
        function transformStringIntoId(str) {
            var subStr1 = str.substring(0, 8);
            var subStr2 = str.substring(8, 12);
            var subStr3 = str.substring(12, 16);
            var subStr4 = str.substring(16, 20);
            var subStr5 = str.substring(20);
            return subStr1 + "-" + subStr2 + "-" + subStr3 + "-" + subStr4 + "-" + subStr5;
        }
        function requestData(id) {
            return __awaiter(this, void 0, void 0, function () {
                var options, response, resJson, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            options = {
                                headers: {
                                    'content-type': 'application/json'
                                },
                                method: 'POST',
                                body: JSON.stringify({
                                    'pageId': id,
                                    'limit': 50,
                                    'cursor': {
                                        'stack': [[{
                                                    'table': 'block', 'id': id, 'index': 0
                                                }]]
                                    },
                                    'chunkNumber': 0,
                                    'verticalColumns': false
                                })
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, node_fetch_1.default('https://www.notion.so/api/v3/loadPageChunk', options)];
                        case 2:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 3:
                            resJson = _a.sent();
                            return [2 /*return*/, resJson];
                        case 4:
                            error_1 = _a.sent();
                            console.log(error_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        function transformEntryPage(data) {
            var blog = {
                entryPage: {
                    title: null,
                    posts: []
                },
                posts: []
            };
            var block = data.recordMap.block;
            var blockKeys = Object.keys(block);
            blockKeys.forEach(function (key, i) {
                var entry = block[key];
                var content = entry.value.properties && entry.value.properties.title[0][0];
                var created = entry.value && entry.value.created_time;
                var edited = entry.value && entry.value.last_edited_time;
                if (i == 0) {
                    blog.entryPage.title = content;
                }
                else {
                    blog.entryPage.posts.push({
                        id: key,
                        postTitle: content,
                        created: created,
                        edited: edited
                    });
                }
            });
            return blog;
        }
        function getRowDataForPosts(data) {
            return __awaiter(this, void 0, void 0, function () {
                var posts, postsRowData;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            posts = data.entryPage.posts;
                            return [4 /*yield*/, Promise.all(posts.map(function (_a) {
                                    var id = _a.id;
                                    return __awaiter(_this, void 0, void 0, function () { var _b; return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                _b = { id: id };
                                                return [4 /*yield*/, requestData(id)];
                                            case 1: return [2 /*return*/, (_b.data = _c.sent(), _b)];
                                        }
                                    }); });
                                }))];
                        case 1:
                            postsRowData = _a.sent();
                            postsRowData.forEach(function (postData) {
                                var matchingPost = posts.find(function (_a) {
                                    var id = _a.id;
                                    return postData.id === id;
                                });
                                if (matchingPost) {
                                    matchingPost.postRowData = postData;
                                }
                            });
                            return [2 /*return*/, __assign(__assign({}, data), { posts: posts })];
                    }
                });
            });
        }
        function getTextContentFromData(data) {
            var posts = data.posts;
            var parsedPosts = posts
                .map(function (_a) {
                var _b;
                var postRowData = _a.postRowData, id = _a.id;
                if (postRowData === null || postRowData === void 0 ? void 0 : postRowData.data) {
                    return _b = {}, _b[id] = Object.keys(postRowData.data.recordMap.block)
                        .filter(function (key) { return key === id || key === masterId ? null : key; })
                        .filter(function (key) { var _a; return (_a = postRowData.data) === null || _a === void 0 ? void 0 : _a.recordMap.block[key].value.properties; })
                        .map(function (key, index) {
                        var _a, _b;
                        return ({
                            text: (_a = postRowData.data) === null || _a === void 0 ? void 0 : _a.recordMap.block[key].value.properties.title[0][0],
                            type: (_b = postRowData.data) === null || _b === void 0 ? void 0 : _b.recordMap.block[key].value.type,
                            position: index
                        });
                    }), _b;
                }
            });
            return __assign(__assign({}, data), { posts: parsedPosts });
        }
        var masterId, data, blogEntryPage, postsWithRowData, transformedPosts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    masterId = transformStringIntoId(entry);
                    return [4 /*yield*/, requestData(masterId)];
                case 1:
                    data = _a.sent();
                    if (!data) return [3 /*break*/, 3];
                    blogEntryPage = transformEntryPage(data);
                    return [4 /*yield*/, getRowDataForPosts(blogEntryPage)];
                case 2:
                    postsWithRowData = _a.sent();
                    transformedPosts = getTextContentFromData(postsWithRowData);
                    return [2 /*return*/, transformedPosts];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.retrieveNotionData = retrieveNotionData;
