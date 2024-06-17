# Sunrise Agency - Client Base

## Overview
This project is the client base application for Sunrise Agency. It is a full-stack application consisting of a frontend built with React and a backend powered by Node.js and Express. The project also includes tools for Sass preprocessing, TypeScript compilation, and various development scripts.

## Requirements

### Node.js
Ensure you have Node.js installed. This project is tested with Node.js version `18.17.1`.

### NPM
This project uses NPM for package management. Ensure you have NPM version `10.2.5` installed.

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/client-base.git
   cd client-base
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

## Development

### Running the Development Servers

You can run both the frontend and backend servers concurrently using the following VS Code tasks configuration:

1. **Run Frontend:**
   ```sh
   npm run dev
   ```

2. **Run Backend:**
   ```sh
   npm run serve
   ```

3. **Run Sass Watcher:**
   ```sh
   npm run sass:watch
   ```

4. **Run TypeScript Watcher:**
   ```sh
   npx tsc --watch
   ```

### Combined Command

To run all tasks simultaneously:
```sh
npm run start
```

This will start the frontend, backend, Sass watcher, and TypeScript watcher concurrently.

## Pre-Commit Hooks

We use Lefthook for managing git hooks. Here is an example of the `lefthook.yml` configuration:

```yaml
pre-commit:
  commands:
    check:
      glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}"
      run: npx @biomejs/biome check --no-errors-on-unmatched --files-ignore-unknown=true {staged_files}
    format:
      run: npx prettier --write {staged_files}
    lint:
      run: npx eslint {staged_files}
    test:
      run: npm test
    security:
      run: npm audit
    typecheck:
      run: npx tsc --noEmit
```

## Scripts

- `start`: Runs the Node.js server with environment variables.
- `build`: Builds the React application and compiles TypeScript.
- `serve`: Starts the Node.js server with nodemon for hot-reloading.
- `sass:watch`: Watches Sass files for changes and recompiles.
- `dev`: Starts the React development server.
- `test`: Runs tests using React Testing Library.
- `eject`: Ejects the React app configuration.


## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push your branch to GitHub.
4. Open a pull request.

## License

This project is licensed under the MIT License.