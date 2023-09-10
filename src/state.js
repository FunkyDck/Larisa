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
            candidate.startTime == booking.startTime &&
            candidate.endTime == booking.endTime
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
