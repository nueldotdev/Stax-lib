# Stax Library

Stax is a lightweight, reactive UI library designed to provide flexibility and simplicity for building web applications. It allows you to create dynamic and reactive UI components with minimal setup.

## Features

- **Declarative UI**: Define your UI components in a clear and declarative way.
- **Reactive Data Binding**: Automatically update the UI when data changes.
- **Lightweight**: Minimal overhead, focusing on performance and simplicity.
- **Flexible**: Easily integrate with other libraries and frameworks.

## Installation

To install Stax, use npm:

```bash
npm install stax-lib
```

## Usage

Here's a basic example of how to create a simple page with a centered text using Stax:

```javascript
import { Stax } from 'stax-lib';

const stax = new Stax();

const testDiv = stax.div({
  styles: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  children: [
    stax.p({
      children: "Welcome to Stax",
      styles: {
        color: "blue",
        fontSize: "24px",
      },
    }),
  ],
});

const app = document.getElementById("app");

stax.render(testDiv, app);
```

This code will create a `div` element containing a paragraph with the text "Welcome to Stax", styled and centered on the page.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve the Stax library.

---

Happy coding with **Stax**! 🚀
