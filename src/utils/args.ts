export function parseArguments() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("No arguments has been provided");
    return;
  }

  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const isKey = arg.startsWith("-");
    const key = arg.replace(/^--/, "");

    if (isKey) {
      let value: string | number = args[i + 1] ?? "";

      if (/^[0-9]+$/.test(value)) {
        value = Number(value);
      }

      Object.assign(options, {
        [key]: value,
      });
      continue;
    }
  }

  return options;
}
