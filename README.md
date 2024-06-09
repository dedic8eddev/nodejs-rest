# REST

REST package for MDN projects

## Documentation

Documentation is written in [DOCS.MD](./DOCS.MD)

## Commands

### Install

```bash
npm install
```

### Build

```bash
npm run build
```

This command will run first linting and testing and then builds a project

### Test

```bash
npm test
```

Code coverage report will be created inside the project root in `coverage` folder.

You can open the report

```bash
google-chrome ./coverage/lcov-report/index.html
```

Or whatever browser you use

### Test on watch mode

```bash
npm run test-watch
```

### Lint code

```bash
npm run lint
```

### Generate documentation

```bash
npm run document-code
```

## Used technologies:

1. [Winston](https://www.npmjs.com/package/winston) - logging library
2. [Typescript](https://www.typescriptlang.org/) - project is written and compiled using this awesome language
3. [Jest.js](https://jestjs.io/) - test framework
4. [tslint](https://palantir.github.io/tslint/) - linting library
5. [prettier](https://prettier.io/) - Awesome code formatter
6. [Typedoc](https://typedoc.org/) - documentation generator for Typescript
7. [Editorconfig](https://editorconfig.org/) - keeps consistent configuration across various editors and IDEs
