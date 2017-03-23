const relative = require('require-relative');

module.exports = (pluginConfig, config, callback) => {
  if (!Array.isArray(pluginConfig.plugins) || pluginConfig.plugins.length < 1) {
    callback(new Error('No generateNotes plugins defined.'));
    return;
  }

  // Promisify all the plugins.
  const plugins = pluginConfig.plugins.map(nestedPluginConfig => new Promise((resolve) => {
    let plugin;
    if (typeof nestedPluginConfig === 'string') {
      plugin = relative(nestedPluginConfig);
    }
    else if (nestedPluginConfig && (typeof nestedPluginConfig.path === 'string')) {
      plugin = relative(nestedPluginConfig.path);
    }

    if (plugin) {
      plugin(nestedPluginConfig, config, (err, res) => {
        resolve({ err, res });
      });
    }
    else {
      resolve({ err: new Error('Improperly defined plugin.') });
    }
  }));

  // Execute all the plugins, collecting and reporting their results.
  Promise.all(plugins)
    .then((pluginResults) => {
      const args = ['err', 'res']
        .map(type => pluginResults.map(result => result[type]).filter(val => val != null))
        .map(group => (group.length > 0 ? group : null));

      callback(args[0], args[1]);
    })
    .catch((err) => {
      callback(err);
    });
};
