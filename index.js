const fs = require('fs');
const path = require('path');
const moment = require('moment');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

fileDestination = path.join(__dirname, 'formatted_timestamp.txt');
const initialTimestamp = new Date();
const removeStrings = ['2021-09-10T', '-03:00'];
const timestampRegex = /(?:(?:([01]?\d|2[0-3]))?:([0-5]?\d))?:([0-5]?\d)/g;

const initializeTimeStamp = (inputTimestamp) => {
  const [initialHours, initialMinutes, initialSeconds] =
    inputTimestamp.split(':');
  initialTimestamp.setHours(initialHours);
  initialTimestamp.setMinutes(initialMinutes);
  initialTimestamp.setSeconds(initialSeconds);
};

async function processLineByLine(filePath) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (line.match(timestampRegex)) {
      //get timestamp from original line
      const [hours, minutes, seconds] = line
        .match(timestampRegex)[0]
        .split(':');

      //change it to the new value
      const newTimeStampValue = moment(initialTimestamp)
        .add(hours, 'hours')
        .add(minutes, 'minutes')
        .add(seconds, 'seconds')
        .format()
        .replace(removeStrings[0], '')
        .replace(removeStrings[1], '');
      const newLine = line.replace(timestampRegex, newTimeStampValue);

      fs.appendFileSync(fileDestination, `${newLine}\n`, (err) => {
        if (err) throw err;
      });
    } else {
      fs.appendFileSync(fileDestination, `${line}\n`, (err) => {
        if (err) throw err;
      });
    }
  }
}

const readFile = async (inputTimestamp, filePath) => {
  try {
    initializeTimeStamp(inputTimestamp);
    processLineByLine(filePath);
  } catch (err) {
    console.error('There was an error: ', err);
    new Error(err);
  }
};

rl.question(
  'From what timestamp on do you want to add new values? ',
  (inputTimestamp) => {
    rl.question('What is timestamp file called? ', (fileName) => {
      filePath = path.join(__dirname, `${fileName}.txt`);
      readFile(inputTimestamp, filePath);
    });
  }
);
