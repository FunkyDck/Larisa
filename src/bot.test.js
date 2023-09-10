import test from 'node:test';
import assert from 'node:assert/strict';
import { createBookingFromMessage } from "./bot.js"
import dayjs from 'dayjs';

function makeTgMessage(
    text, 
    login = 'dude',
    id = 'test_id',
) {
    return {
        text,
        from: { username: login },
        message_id: id,
     }
}

test("Pareses time correctly", () => {
    const currentTime = dayjs("2023-12-10");

    [
        [
            "20.12 четверг 20-22",
            {
                startTime: "2023-12-20T20:00:00.000Z",
                endTime: "2023-12-20T22:00:00.000Z",
            },
        ], [
            "20.12 20-22",
            {
                startTime: "2023-12-20T20:00:00.000Z",
                endTime: "2023-12-20T22:00:00.000Z",
            },
        ], [
            "20.12 20:00-22",
            {
                startTime: "2023-12-20T20:00:00.000Z",
                endTime: "2023-12-20T22:00:00.000Z",
            },
        ], [
            "20.12 20-22:30",
            {
                startTime: "2023-12-20T20:00:00.000Z",
                endTime: "2023-12-20T22:30:00.000Z",
            },
        ], [
            "20.01 20-22:30",
            {
                startTime: "2024-01-20T20:00:00.000Z",
                endTime: "2024-01-20T22:30:00.000Z",
            },
        ], [
            "забей 20.01 шаббат 20-22:30 на репку для Игоря",
            {
                startTime: "2024-01-20T20:00:00.000Z",
                endTime: "2024-01-20T22:30:00.000Z",
            },
        ]
    ].forEach(([msg, expected]) => {
        const actual = createBookingFromMessage(makeTgMessage(msg), () => currentTime);

        assert.deepEqual(actual, {
            ...expected, 
            login: 'dude',
            messageId: 'test_id'
        });
    })
})