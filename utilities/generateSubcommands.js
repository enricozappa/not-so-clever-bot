// Generate command choices from json keys
function generateSubcommands(resourcesData) {
  const choices = Object.keys(resourcesData).map((key) => ({
    name: key,
    value: key,
  }));

  return choices;
}

export default generateSubcommands;
