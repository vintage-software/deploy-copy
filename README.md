# deploy-copy
[![Build Status](https://api.travis-ci.org/vintage-software/deploy-copy.svg?branch=master)](https://travis-ci.org/vintage-software/deploy-copy)
[![npm version](https://badge.fury.io/js/deploy-copy.svg)](https://badge.fury.io/js/deploy-copy)

Config-based script to copy only files needed for production.

## Install

`npm install -g deploy-copy`

## Usage

`deploy-copy [-source:/path/to/source]` (default source is the current working directory)

All folders containing a `deploy.json` file will be copied to the deploy folder (`/path/to/source-deploy`) except files matching an excluded path.

### deploy.json

``` json
{
  "exclude": [
    "./glob/pattern/to/exclude",
    "./another/glob/pattern/to/exclude"
  ]
}
```

The paths in [common.deploy.json](https://github.com/vintage-software/deploy-copy/blob/master/common.deploy.json) are automatically excluded.