import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const folder = "./drivers";
const output = [];

fs.readdirSync(folder).forEach(file => {
  const content = fs.readFileSync(path.join(folder, file), "utf8");
  const data = yaml.load(content);
  output.push(data);
});

fs.writeFileSync("drivers.json", JSON.stringify(output, null, 2));
