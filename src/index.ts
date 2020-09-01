import { retrieveNotionData } from "./services/notion.data";
import express, { Request, Response } from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const port = 3000;

app.get('/:entry', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    retrieveNotionData(req.params.entry).then(data => res.status(200).end(JSON.stringify(data, null, 3)))
});

server.listen(port, () => console.log(`Server running on port ${port}`))

