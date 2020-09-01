"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var notion_data_1 = require("./services/notion.data");
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var app = express_1.default();
var server = http_1.default.createServer(app);
var port = 3000;
app.get('/:entry', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    notion_data_1.retrieveNotionData(req.params.entry).then(function (data) { return res.status(200).end(JSON.stringify(data, null, 3)); });
});
server.listen(port, function () { return console.log("Server running on port " + port); });
