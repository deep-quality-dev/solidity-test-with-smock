# Solidity Unit test with Smock

## Reference

https://smock.readthedocs.io/en/latest/getting-started.html

## Installation

```npm
npm install --save-dev @defi-wonderland/smock
```

## Required Config

```config
// hardhat.config.ts

... // your plugin imports and whatnot go here

const config = {
  ... // your other hardhat settings go here
  solidity: {
    ... // your other Solidity settings go here
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"]
        }
      }
    }
  }
}

export default config
```
