import express from 'express';
import { readFileSync } from "fs";


const templates = {
    calendar: readFileSync(new URL("./calendar.html", import.meta.url), 'utf-8'),
};


export function startWebServer(localSession) {
    const port = 8000
    const app = express()

    app.use(express.urlencoded())

    app.get('/calendar', (req, res) => {
        const state = JSON.stringify(localSession.getSession(req.query.key));

        res.send(templates.calendar.replace("{/*CALENDAR_STATE*/}", state));
    })

    app.listen(port, () => {
      console.log(`Web server listening at ${port}`)
    })
}
