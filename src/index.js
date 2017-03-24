const _ = require('lodash');
const relative = require('require-relative');

module.exports = (pluginConfig, config, callback) => {
  if (!Array.isArray(pluginConfig.plugins) || pluginConfig.plugins.length < 1) {
    callback(new Error('No generateNotes plugins defined.'));
    return;
  }

  let generate = Promise.resolve('');

  pluginConfig.plugins.forEach((pluginDef) => {
    generate = generate.then(log => new Promise((resolve) => {
      let plugin;
      if (typeof pluginDef === 'string') {
        plugin = relative(pluginDef).bind(null, { incompleteLog: log });
      }
      else if (pluginDef && (typeof pluginDef.path === 'string')) {
        plugin = relative(pluginDef.path).bind(null, _.assign({ incompleteLog: log }, pluginDef));
      }

      if (plugin) {
        plugin(config, (err, res) => {
          if (err) throw err;
          resolve(res);
        });
      }
      else {
        throw new Error('Improperly defined plugin.');
      }
    }));
  });

  // Execute all the plugins, collecting and reporting their results.
  generate
    .then(log => callback(null, log))
    .catch(err => callback(err));
};
