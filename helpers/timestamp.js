const moment = require('moment');

const removeStrings = [`${moment(new Date()).format('YYYY-MM-DD')}T`, '-03:00'];
const timestampRegex = /(?:(?:([01]?\d|2[0-3]))?:([0-5]?\d))?:([0-5]?\d)/g;

const initializeTimeStamp = (inputTimestamp) => {
  const initialTimestamp = new Date();
  const [initialHours, initialMinutes, initialSeconds] =
    inputTimestamp.split(':');
  initialTimestamp.setHours(initialHours);
  initialTimestamp.setMinutes(initialMinutes);
  initialTimestamp.setSeconds(initialSeconds);

  return initialTimestamp;
};

const addToInitialTime = (initialTimestamp, { hours, minutes, seconds }) =>
  moment(initialTimestamp)
    .add(hours, 'hours')
    .add(minutes, 'minutes')
    .add(seconds, 'seconds')
    .format()
    .replace(removeStrings[0], '')
    .replace(removeStrings[1],'')

const processLine = (initialTimestamp, line) => {
  if (line.match(timestampRegex)) {
    //get timestamp from original line
    const [hours, minutes, seconds] = line.match(timestampRegex)[0].split(':');
    const lineTimeStamp = {
      hours,
      minutes,
      seconds
    }
    const newTimeStampValue = addToInitialTime(initialTimestamp, lineTimeStamp);
    //console.log('sum: ', newTimeStampValue)
    return line.replace(timestampRegex, newTimeStampValue);
  } else return line;
};

module.exports = {
  initializeTimeStamp,
  addToInitialTime,
  processLine
};
