import dayjs from "dayjs"

export function createState() {
    return {
        ready: true,
        bookings: [],
    }
}

export function createBooking(login, messageId, startTime, endTime) {
    return { login, messageId, startTime, endTime }
}

export function book(state, booking) {
    state.bookings.push(booking)
}

export function cancel(state, booking) {
    const index = state.bookings.find((candidate) => {
        return candidate.login == booking.login &&
            candidate.startTime == booking.startTime
    })

    if (index !== -1) {
        state.bookings.splice(index, 1)
        return true
    } else {
        return false
    }
}

export function getBookings(state) {
    return state.bookings;
}

export function cleanup(state, olderThan) {
    return {
        ...state,
        bookings: state.bookings.filter((booking) => {
            return dayjs(booking.startTime).isAfter(olderThan)
        })
    }
}

export function intersect(state, startTime, endTime) {
    return state.bookings.filter((booking) => {
        const t0 = dayjs(booking.startTime)
        const t1 = dayjs(booking.endTime)

        return (startTime.isBefore(t1) && endTime.isAfter(t0))
    })
}

export function checkBookingForErrors(state, booking) {
    const now = dayjs();
    const st = dayjs(booking.startTime);
    const et = dayjs(booking.endTime);

    if (st.isAfter(now.add(1, 'month'))) {
        return "Дальше чем на месяц вперёд не занимаю"
    }

    if (et.isBefore(now)) {
        return "В прошлое не занимаю";
    }
    
    if (et.diff(st, 'hours') > 3) {
        return"Больше 3х часов не забиваем";
    }

    const alreadyBooked = state.bookings.some((booking) => {
        const t = dayjs(booking.startTime)
        return t.month() === st.month() && t.date() === st.date()
    })

    if (alreadyBooked) {
        return "На эту дату вы уже забронили"
    }

    const intersects = intersects(state, st, et);

    if (intersects.length > 0) {
        return `Пересекается с ${intersects.map((x) => x.login).join()}`
    }

    // No error given. Everything is fine.
    return null;
}
