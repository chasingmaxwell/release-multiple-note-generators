[![Build Status](https://travis-ci.org/chasingmaxwell/release-multiple-note-generators.svg?branch=master)](https://travis-ci.org/chasingmaxwell/release-multiple-note-generators.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/chasingmaxwell/release-multiple-note-generators/badge.svg?branch=master)](https://coveralls.io/github/chasingmaxwell/release-multiple-note-generators?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# release-multiple-note-generators

release-multiple-note-generators is a [semantic-release](https://github.com/semantic-release/semantic-release) plugin which allows you to chain together multiple note generation plugins. You can use this plugin in combination with other note generation plugins to mutate the default log message or generate other release artifacts. For example, you could publish an AWS SNS message containing release information with [release-sns](https://github.com/chasingmaxwell/release-sns). Each plugin is invoked in the order it is defined and passed an `incompleteLog` configuration property which is either the log as it was returned by the previous plugin or an empty string if the plugin is first in your configuration.

## Installation

1. Require this package.

   `yarn add --dev release-multiple-note-generators`

   or

   `npm i --save-dev release-multiple-note-generators`

2. Configure your package.json.

   Ensure your package.json has the following configuration.

   ```json
   {
     "release": {
       "generateNotes": {
         "path": "release-multiple-note-generators",
         "plugins": [
           "@semantic-release/release-notes-generator",
           {
             "path": "some-other-plugin",
             "anyAdditionConfig": "parameters can be defined here."
           }
         ]
       }
     }
   }
   ```

   The "plugins" config property should contain the configuration for the generateNotes plugins as you would normally format them when specifying a plugin for semantic-release. In the above example we are using the default release-notes-generator plugin which generates the initial changelog. Then we are also specifying "some-other-plugin" to which we are also passing configuration. Remember that the order in which your plugins are specified is important. Each plugin will receive the log as it was returned by the previous plugin.
