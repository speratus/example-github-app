// The number of milliseconds in a day.
const MILLISECONDS_PER_DAY = 86400000

// Convert a date constructed by running Date.now() into a meaningful
// day of the week.
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
// for details.
function convertDay(date) {
  const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }
  return days[(new Date(date)).getDay()]
}

// Converts the a number of days into the appropriate number of milliseconds
function daysToTime(days) {
  return days * MILLISECONDS_PER_DAY
}

// Calculates the number of days until the next Sunday.
function daysUntilNextSunday(date) {
  return 7 - (new Date(date).getDay())
}

// Calculates the actual date of the next Sunday.
function nextSunday(date) {
  let days = daysUntilNextSunday(date)
  // Convert the number of days into the correct number milliseconds.
  let daysInTime = daysToTime(days)
  // Add those milliseconds to the current date.
  // This enables us to create a date object correctly.
  return date + daysInTime
}

// Checks whether a date was last week (or longer ago than that).
function isDateLastWeek(date) {
  // Finds the Sunday following the given date.
  let sunday = nextSunday(date)
  // If the current date is greater than the date of the Sunday
  // following the given date, then the given date occurred
  // last week (or longer ago).
  return Date.now() > sunday
}


exports.milliPerDay = MILLISECONDS_PER_DAY
exports.convertDay = convertDay
exports.daysToTime = daysToTime
exports.daysUntilNextSunday = daysUntilNextSunday
exports.nextSunday = nextSunday
exports.isDateLastWeek = isDateLastWeek