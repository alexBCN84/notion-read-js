import { retrieveNotionData } from "./services/notion.data";
import express, { Request, Response } from "express";
import serverless from "serverless-http";
// import http from "http";

const app = express();
// const server = http.createServer(app);
const server = serverless(app);
const port = 3000;

app.get('/:entry', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    retrieveNotionData(req.params.entry).then(data => res.status(200).end(JSON.stringify(data, null, 3)))
});

app.listen(port, () => console.log(`Server running on port ${port}`))

module.exports.handler = server;