// Subscription Map: Tracks listeners for state updates
import Store from "./core/store";

const subscriptions = new Map();
const store = new Store();

function onValueChange(obj, key, callback) {
  const objectKey = `${obj}-${key}`; // Unique identifier for the object and key

  if (!subscriptions.has(objectKey)) {
    subscriptions.set(objectKey, []);
  }

  // Add the callback to the subscription list
  subscriptions.get(objectKey).push(callback);

  // Use a Proxy to monitor changes to the property
  if (!obj.__isProxy) {
    Object.keys(obj).forEach((prop) => {
      let value = obj[prop];
      Object.defineProperty(obj, prop, {
        get() {
          return value;
        },
        set(newValue) {
          value = newValue;
          const subKey = `${obj}-${prop}`;
          if (subscriptions.has(subKey)) {
            subscriptions.get(subKey).forEach((cb) => cb());
          }
        },
      });
    });

    obj.__isProxy = true; // Prevent re-wrapping the same object
  }
}

function createStaxElement(tag, props) {
  var element = document.createElement(tag);
  if (props.styles) {
    Object.assign(element.style, props.styles);
  }

  if (props.events) {
    Object.entries(props.events).forEach(([eventName, eventHandler]) => {
      element.addEventListener(eventName, eventHandler);
    });
  }

  // Handle dynamic children with placeholders
  if (props.children) {
    if (typeof props.children === 'string') {
      const regex = /&\(([^)]+)\)/g;
      const initialContent = props.children.replace(regex, (_, expr) => {
        const [bindObj, bindKey] = expr.split('.');
        return props.bindings?.[bindObj]?.[bindKey] ?? '';
      });

      element.textContent = initialContent;

      // Subscribe to changes in the store
      props.children.replace(regex, (_, expr) => {
        const [bindObj, bindKey] = expr.split('.');
        if (props.bindings?.[bindObj]) {
          store.subscribe(bindObj, (newValue) => {
            element.textContent = props.children.replace(regex, (_, expr) => {
              const [bindObj, bindKey] = expr.split('.');
              return newValue[bindKey] ?? '';
            });
          });
        }
      });
    } else {
      props.children.forEach((child) => element.appendChild(child));
    }
  }

  if (props.id) {
    element.id = props.id;
  }

  if (props.className || props.class) {
    element.className = props.className || props.class;
  }

  // Handle binding
  if (props.bind) {
    const [obj, key] = props.bind;
    element.textContent = obj[key]; // Initial value

    onValueChange(obj, key, () => {
      element.textContent = obj[key]; // Update on change
    });
  }

//   Props for input element
  if (props.type) {
    element.setAttribute('type', props.type);
  }

  if (props.placeholder) {
    element.setAttribute('placeholder', props.placeholder);
  }

  if (props.value) {
    element.setAttribute('value', props.value);
  }

  if (props.disabled) {
    element.setAttribute('disabled', props.disabled);
  }

  if (props.checked) {
    element.setAttribute('checked', props.checked);
  }

  if (props.src) {
    element.setAttribute('src', props.src);
  }

  if (typeof props.ref === "function") {
    props.ref(element); // Pass the element to the ref callback
  }

  return element;
}

class Stax {
  component(renderFn) {
    return renderFn();
  }

  create(tag, props) {
    return createStaxElement(tag, props);
  }

  constructor() {
    const tags = [
      "div",
      "span",
      "button",
      "a",
      "p",
      "img",
      "input",
      "ul",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
    ];
    tags.forEach((tag) => {
      this[tag] = (props) => createStaxElement(tag, props || {});
    });
  }

  link(props = {}) {
    const { href = "#", isExternal = false, ...rest } = props;

    // Add default attributes for links
    const linkProps = {
      ...rest,
      href,
      events: {
        click: (event) => {
          if (!isExternal && href.startsWith("#")) {
            event.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: "smooth" });
            }
          } else if (isExternal) {
            // Open in new tab for external links
            window.open(href, "_blank");
          }
        },
        ...rest.events,
      },
      styles: {
        cursor: "pointer",
        ...rest.styles,
      },
    };

    return this.a(linkProps); // Use the shorthand for <a>
  }

  render(elements, parent) {
    if (!(parent instanceof HTMLElement)) {
      throw new Error("Parent must be a valid DOM element.");
    }

    if (Array.isArray(elements)) {
      elements.forEach((element) => parent.appendChild(element));
    } else {
      parent.appendChild(elements);
    }
  }
}

const stax = new Stax();

export { stax, store };

// module.exports = new Stax();