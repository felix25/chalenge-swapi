/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const YAML = require('yaml-js');

module.exports = () => {
  try {
    const functionsDir = path.join(__dirname, 'source', 'functions');
    
    if (!fs.existsSync(functionsDir)) {
      console.error('Functions directory not found at:', functionsDir);
      throw new Error(`Functions directory not found at: ${functionsDir}`);
    }
    
    const folders = fs
      .readdirSync(functionsDir, { withFileTypes: true })
      .filter((item) => item.isDirectory())
      .map((item) => item.name);
      
    
    const functionsConfig = folders.reduce((acc, folder) => {
      const filePath = path.join(functionsDir, folder, 'config.yml');
      
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        
        try {
          const config = YAML.load(raw);
          
          Object.entries(config).forEach(([functionName, functionConfig]) => {
            if (functionConfig.handler) {
              functionConfig.handler = `source/functions/${folder}/${path.basename(functionConfig.handler)}`;
            }
            acc[functionName] = functionConfig;
          });
        } catch (yamlError) {
          console.error(`Error parsing YAML for ${folder}:`, yamlError);
          throw yamlError;
        }
      } else {
        console.log('No config file found for:', folder);
      }
      return acc;
    }, {});

    return functionsConfig;
    
  } catch (error) {
    console.error('Error in serverless-dynamic.js:', error);
    throw error;
  }
};