import { retrieveNotionData } from "./scripts/notion.data";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const port = 3000;

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    retrieveNotionData().then(data => res.status(200).end(JSON.stringify(data, null, 3)))
});

server.listen(port, () => console.log(`Server running on port ${port}`))

