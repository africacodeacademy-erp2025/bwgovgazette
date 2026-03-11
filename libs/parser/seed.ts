import fs from 'fs'
import path from 'path'
import { parseBotswanaSic } from './parser/parseBotswanaSic'
import { insertSicNodes } from './parser/insertSicNodes'

async function seedSic() {
  const baseDir = path.join(
    process.cwd(),
    "data",
    "output_industries_with_definitions",
  );

  if (!fs.existsSync(baseDir)) {
    throw new Error(`SIC industries directory not found at ${baseDir}`);
  }

  const availableFiles = fs
    .readdirSync(baseDir)
    .filter((f) => f.toLowerCase().endsWith(".txt"))
    .sort();

  if (!availableFiles.length) {
    throw new Error(`No SIC industry .txt files found in ${baseDir}`);
  }

  // Find a .txt argument passed via npm: `npm run seed:sic -- manufacturing.txt`
  const argFile = process.argv.find((arg) =>
    arg.toLowerCase().endsWith(".txt"),
  );

  if (!argFile) {
    console.error(
      [
        "Please provide a .txt file name from data/output_industries_with_definitions.",
        "Example:",
        "  npm run seed:sic -- manufacturing.txt",
        "",
        "Available files:",
        ...availableFiles.map((f) => `  - ${f}`),
      ].join("\n"),
    );
    process.exit(1);
  }

  const targetPath = path.isAbsolute(argFile)
    ? argFile
    : path.join(baseDir, path.basename(argFile));

  if (!fs.existsSync(targetPath)) {
    throw new Error(`Specified SIC file not found: ${targetPath}`);
  }

  const raw = fs.readFileSync(targetPath, "utf8");
  const lines = raw.split(/\r?\n/);

  console.log(`Loaded ${lines.length} lines from ${targetPath}`);

  const nodes = parseBotswanaSic(lines);
  console.log(
    `Parsed ${nodes.length} SIC nodes from ${path.basename(targetPath)}`,
  );
  await insertSicNodes(nodes);
}

seedSic()
  .then(() => {
    console.log("SIC seeding finished successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("SIC seeding failed");
    console.error(err);
    process.exit(1);
  });
