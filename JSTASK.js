const fs = require("fs").promises;
// Fetch data from CoinGecko API
const fetchDATA = async (url, name) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Data not found");
    }
    const data = await response.json();
    const JData = JSON.stringify(data);
    await JSON_File_Creator(JData, name);
  } catch (error) {
    console.error(error);
  }
};

// Write JSON string to a file
const JSON_File_Creator = async (json_string, name) => {
  try {
    await fs.writeFile(`${name}.json`, json_string);
    console.log("Data written to file");
  } catch (err) {
    console.error("Error writing file", err);
  }
};

// Read the first ten currencies from the file
const firstTen = async (file) => {
  try {
    const fileContent = await fs.readFile(file, "utf8");
    const data = JSON.parse(fileContent);
    var top10 = data.slice(0, 10);
    console.log(top10);
  } catch (err) {
    console.error("Error reading or parsing file", err);
  }
  return top10;
};

const parsingJSON = async (top10, name) => {
  var result = {};
  try {
    // Read the JSON file
    const data = await fs.readFile(`${name}.json`, "utf8");

    // Parse the JSON file
    const obj = JSON.parse(data);
    const list = obj.rates;
    //console.log(list);
    //Iterate over the JSON object
    for (let index = 0; index < top10.length; index++) {
      const element = top10[index];
      if (element in list) {
        x = 1 / list[element].value;
        console.log(`${element}: ${x} bitcoin`);
        result[element] = x;
      } else {
        console.log("Not Happen");
      }
    }
  } catch (err) {
    console.error("Error reading or parsing file", err);
  }
  // for (var key in result) {
  //   console.log(key + " : " + result[key]);
  // }
  jResult = JSON.stringify(result, null, 2);
  JSON_File_Creator(jResult, "result");
};

const main = async () => {
  try {
    console.log("Waiting");

    await fetchDATA(
      "https://api.coingecko.com/api/v3/simple/supported_vs_currencies",
      "supported_vs_currencies"
    );

    top10 = await firstTen("supported_vs_currencies.json");

    await fetchDATA(
      "https://api.coingecko.com/api/v3/exchange_rates",
      "coingecko_vs_currencies"
    );

    await parsingJSON(top10, "coingecko_vs_currencies");
  } catch (error) {
    console.log("Problem happened", error);
  } finally {
    console.log("SUCCESSFUL");
  }
};

main();
