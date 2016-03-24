One benefit of server-side rendering is that client-side updates don't have to rewrite the entire DOM; instead, they can hook into the server-rendered DOM and make their changes on top of that. But if your component renders differently depending on whether it's client- or server-side, React can't cheaply update the client-side DOM.

For example, suppose you have a component that hooks into the DOM (and thus requires access to the `navigator` or `window` global). You can't just import this component unconditionally, because `navigator` is not defined on the server-side. So your component `render()` function might include the following:

```jsx
return (
    { canUseDOM && require('client-side-component') }
)
```

However, this means the server-rendered version of the page does not contain `client-side-component`, whereas the client-rendered version does, throwing the error. Granted, it's pretty finicky, and here are a couple common fixes:

1. On your server-side template, have `render()` wrap everything in an extra single div (ReactDOM uses an injection div)
2. On your client-side template, if you're injecting into `document.documentElement`, try `document` instead
3. Make sure you're passing the same props to both client- and server-side versions of the component
4. Make sure you're not using any dynamically-generated values (timestamps, random numbers, etc.) that might differ between the client and server side.

If the issue is something else: the error message displays the line where the diff occurs (both versions), and you can use that as your entry point for debugging. You can start by console logging the innerHTML of your component before and after `render()`, and diffing the results.

To expand on @chemoish's reply, one solution to the above scenario is to trigger a state update with `componentDidMount()`.

Imports:
```js
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
const ClientSideComponent = canUseDOM ? require('client-side-component') : undefined;
```

Component instance:
```jsx
componentDidMount() {
    // Re-render for isomorphic purposes
    requestAnimationFrame(() => {
      this.setState({ appIsMounted: true });
      // Do whatever you did in your old componentDidMount here
    });
  }

render() {
    return (
      <div className="MyComponent">
        { this.state.appIsMounted && <ClientSideComponent /> }
      </div>
    );
  }

var foo = {
  home: {
    title: "home"
  },
  about: {
    title: "about",
    subpages: {
      dog: {
        title: "about my dog",
        subpages: {
          name: {
            title: "my dog's name"
          },
          age: {
            title: "my dog's age"
          }
        }
      }
    }
  }

}