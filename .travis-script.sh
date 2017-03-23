#!/bin/bash

set -e

npm t && npm run coveralls
