const fs = require('fs');
const path = require('path');

// Path to your appsettings.json file
const appSettingsPath = path.join(__dirname, 'appsettings.json');

// Read and parse the content of appsettings.json
const readConfigFile = () => {
  try {
    const data = fs.readFileSync(appSettingsPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading or parsing appsettings.json:', err);
    return null;
  }
};

// Export the settings
const appSettings = readConfigFile();
module.exports = appSettings;
