const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { initializeTimeStamp, processLine } = require('./helpers/timestamp');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

fileDestination = path.join(__dirname, 'formatted_timestamp.txt');

const addLineToFile = (line) =>
  fs.appendFileSync(fileDestination, `${line}\n`, (err) => {
    if (err) throw err;
  });

async function processLineByLine(filePath, initialTimestamp) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const newLine = processLine(initialTimestamp, line)
    addLineToFile(newLine)
  }
}

const readFile = async (inputTimestamp, filePath) => {
  try {
    initialTimestamp = initializeTimeStamp(inputTimestamp);
    processLineByLine(filePath, initialTimestamp);
  } catch (err) {
    console.error('There was an error: ', err);
    new Error(err);
  }
};

rl.question(
  'From what time on would you like to replace the timestamp values?',
  (inputTimestamp) => {
    rl.question('What is the timestamp file called? ', (fileName) => {
      filePath = path.join(__dirname, `${fileName}`);
      readFile(inputTimestamp, filePath);
    });
  }
);

//readFile('09:09:50', path.join(__dirname, 'Transkriptor-Stamped.txt'))
