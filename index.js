const path = require("path");
const fs = require("fs");

const ignored = ["node_modules", ".git"];
const regex = /.md/;
const template = /{{\s*.+\s*->\s*.+\s*}}/g;

const embedCode = (file) => {
  let content = fs.readFileSync(file, "utf-8");
  const matches = content.matchAll(template)
  for (const match of matches) {
      const args = match[0].replaceAll(' ', '').replaceAll('{', '').replaceAll('}', '').split('->');
      content = content.replace(
        match,
        "```" + args[0] + "\n" + fs.readFileSync(args[1], "utf-8") + "\n```"
      );
  }
  fs.writeFileSync(file, content)
};

const fromDir = (startDir, filter) => {
  if (fs.existsSync(startDir)) {
    fs.readdirSync(startDir).forEach((f) => {
      const filename = path.join(startDir, f);
      if (fs.lstatSync(filename).isDirectory() && !ignored.includes(f)) {
        fromDir(filename, filter);
      } else if (filter.test(filename)) {
        embedCode(filename);
      }
    });
  }
};

fromDir(process.cwd(), regex);