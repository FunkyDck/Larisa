import LocalSession from 'telegraf-session-local';
import { startBot } from './bot.js';
import { startWebServer } from './webserver.js';


main()


function main() {
    const localSession = new LocalSession({ database: 'larisa_db.json' })

    startBot(localSession)
    startWebServer(localSession)
}
