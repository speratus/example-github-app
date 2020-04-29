const MILLISECONDS_PER_DAY = 86400000


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


function daysToTime(days) {
  return days * MILLISECONDS_PER_DAY
}

function daysUntilNextSunday(date) {
  return 7 - (new Date(date).getDay())
}

function nextSunday(date) {
  let days = daysUntilNextSunday(date)
  let daysInTime = daysToTime(days)
  return date + daysInTime
}

function isDateLastWeek(date) {
  let sunday = nextSunday(date)
  return Date.now() > sunday
}


exports.milliPerDay = MILLISECONDS_PER_DAY
exports.convertDay = convertDay
exports.daysToTime = daysToTime
exports.daysUntilNextSunday = daysUntilNextSunday
exports.nextSunday = nextSunday
exports.isDateLastWeek = isDateLastWeek