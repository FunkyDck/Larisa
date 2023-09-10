import { Telegraf } from 'telegraf';
import dayjs from 'dayjs';

import * as state from "./state.js"


export function startBot(localSession) {
    const bot = new Telegraf(process.env.BOT_TOKEN);

    bot.use((localSession).middleware())
    
    bot.start((ctx) => ctx.reply('Welcome'));

    bot.command("book", async (ctx) => {
        if (!ctx.session.ready) {
            Object.assign(ctx.session, state.createState())
        }

        const booking = createBookingFromMessage(ctx.message)

        let result = "Что-то пошло не так..."

        if (booking) {
            state.book(ctx.session, booking);
            result = "Застолбила";
        } else {
            result = "Извините, я не поняла. Попробуйте как-то так: '01.02 16-18' или '03.04 19:30 - 21:30'";
        }

        ctx.reply(result, { reply_to_message_id: ctx.message.message_id });
    });

    bot.command("cancel", async (ctx) => {
        if (!ctx.session.ready) {
            Object.assign(ctx.session, state.createState())
        }

        const booking = createBookingFromMessage(ctx.message)

        let result = "Что-то пошло не так..."

        if (booking) {
            state.book(ctx.session, booking);
            result = "Отменила";
        } else {
            result = "Извините, я не поняла. Попробуйте как-то так: '01.02 16-18' или '03.04 19:30 - 21:30'";
        }

        ctx.reply(result, { reply_to_message_id: ctx.message.message_id });
    });

    bot.command("give_calendar_link", (ctx) => {
        ctx.replyWithMarkdownV2(`[Ссылка](${process.env.WEB_URL}/calendar?key=${encodeURIComponent(localSession.getSessionKey(ctx))}) на каленедарь этого чата\\.`);
    });

    bot.launch();
    
    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}


function createBookingFromMessage(message) {
    const match = message.text.match(/(\d+\s*\.\s*\d+).*?\b(\d+(?::\d+)?)\s*-\s*(\d+(?::\d+)?)/)

    if (match == null) {
        return undefined;
    }

    const [_, date, startTimeStr, endTimeStr] = match;
    const startTime = fuzzyParseTime(date, startTimeStr);
    const endTime = fuzzyParseTime(date, endTimeStr);

    if (!startTime.isValid() || !endTime.isValid()) {
        return undefined;
    }
    
    return state.createBooking(
        message.from.username,
        message.message_id,
        startTime.toISOString(),
        endTime.toISOString()
    )
}


function fuzzyParseTime(date, time) {
    const currentTime = dayjs();

    const [day, month] = date.split(/[-. ]/)

    let year = currentTime.year()
    if (currentTime.month > month) {
        year += 1
    }

    // Replicates ISO8601
    const timestampStr = [
        year, "-",
        month, "-",
        day,
        "T",
        time.length <= 2 ? time + ":00" : time
    ].join("")

    return dayjs(timestampStr)
}
