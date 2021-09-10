const fs = require("fs");
const path = require("path");
const moment = require("moment");
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

fileDestination = path.join(__dirname, "formatted_timestamp.txt");

const initialTimestamp = new Date();
const removeStrings = ["2021-09-10T", "-03:00"];
let formattedTimestamps = [];

const initializeTimeStamp = (inputTimestamp) => {
    const [initialHours, initialMinutes, initialSeconds] = inputTimestamp.split(":");
    initialTimestamp.setHours(initialHours);
    initialTimestamp.setMinutes(initialMinutes);
    initialTimestamp.setSeconds(initialSeconds);
}

const writeToText = async (formattedTimestamps) => {
  try {
      console.log(formattedTimestamps)
      formattedTimestamps.map(timestamp => {
        fs.appendFileSync('formatted_timestamp.txt', `${timestamp}\n`, function (err) {
            if (err) throw err;
          });
      })
  } catch (err) {
    console.error("There was an error writing to the file: ", err);
    new Error(err);
  }
};

const readFile = async (inputTimestamp, filePath) => {
  try {
    initializeTimeStamp(inputTimestamp)
    const fileData = await fs.promises.readFile(filePath, "utf8");
    const timestamps = fileData.match(
      /(?:(?:([01]?\d|2[0-3]))?:([0-5]?\d))?:([0-5]?\d)/g
    );

    if (timestamps.length) {
      for (let index = 0; index < timestamps.length; index++) {
        const [hours, minutes, seconds] = timestamps[index].split(":");
        formattedTimestamps.push(
          moment(initialTimestamp)
            .add(hours, "hours")
            .add(minutes, "minutes")
            .add(seconds, "seconds")
            .format()
            .replace(removeStrings[0], "")
            .replace(removeStrings[1], "")
        );
      }
    }
    writeToText(formattedTimestamps);
  } catch (err) {
    console.error("There was an error: ", err);
    new Error(err);
  }
};

rl.question('From what timestamp on do you want to add new values? ', (inputTimestamp) => {
    rl.question('What is timestamp file called? ', (fileName) => {
        filePath = path.join(__dirname, `${fileName}.txt`);
        readFile(inputTimestamp, filePath);
    })
})
