[![Build Status](https://travis-ci.org/chasingmaxwell/release-multiple-note-generators.svg?branch=master)](https://travis-ci.org/chasingmaxwell/release-multiple-note-generators.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/chasingmaxwell/release-multiple-note-generators/badge.svg?branch=master)](https://coveralls.io/github/chasingmaxwell/release-multiple-note-generators?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# release-multiple-note-generators

release-multiple-note-generators is a [semantic-release](https://github.com/semantic-release/semantic-release) plugin which allows you to run multiple note generation plugins in parallel.

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

   The "plugins" config property should contain the configuration for the generateNotes plugins as you would normally format them when specifying a plugin for semantic-release. In the above example we are using the default release-notes-generator plugin which creates release notes in GitHub. Then we are also specifying "some-other-plugin" to which we are also passing configuration.
