<img width="108" alt="rhums" src="https://github.com/bloodyowl/rhums/blob/main/logo.svg?raw=true">

# rhums

> React Hook for URL Matching and Subscription

**rhums** is a dead simple typesafe router for React that's build on top of the [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) web API.

```tsx
import { useUrl, route } from "rhums";

const App = () => {
  const url = useUrl();

  return route(url.pathname, {
    "/": () => <h1>{`Home`}</h1>,
    "/users": () => <h1>{`Users`}</h1>,
    "/users/:userId/*": ({ userId, rest }) => (
      <>
        <h1>{`User ${userId}`}</h1>
        <UserDetails path={rest} />
      </>
    ),
    _: () => <h1>Not found</h1>,
  });
};
```

## Installation

```console
$ yarn add rhums
```

## API

### useUrl()

Hook to get the current URL:

```tsx
const url = useUrl();
```

The returned value is a [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)

### push(to)

Pushes the page URL

```tsx
push("/users/bloodyowl");
```

### replace(to)

Replaces the page URL

```tsx
replace("/users/bloodyowl");
```

### getUrl()

Returns the current URL

```tsx
const url = getUrl();
```

### watchUrl()

Returns the current URL

```tsx
const unwatchUrl = watchUrl((url) => {
  console.log(url);
});

// ...
unwatchUrl();
```

### useNavigationBlocker(shouldBlock, message)

Blocks page navigation if `shouldBlock` is `true`.

```tsx
useNavigationBlocker(
  formStatus === "editing",
  "Are you sure you want to leave this page?"
);
```

### useIsActivePath(path)

Returns whether the provided path is active

```tsx
const isActive = useIsActivePath("/foo/bar");
```

### route(path, config)

Matches the pathname to the config

- Route params like `:paramName` are selected.
- Rest params like `*` are selected as `rest`.

```tsx
route(url.pathname, {
  "/": () => <h1>{`Home`}</h1>,
  "/users": () => <h1>{`Users`}</h1>,
  "/users/:userId/*": ({ userId, rest }) => (
    <>
      <h1>{`User ${userId}`}</h1>
      <UserDetails path={rest} />
    </>
  ),
  _: () => <h1>Not found</h1>,
});
```

### route(pathname, pattern)

Checks if a the provided pathname matches a given URL pattern

- Route params like `:paramName` are selected.
- Rest params like `*` are selected as `rest`.

```tsx
route(url.pathname, {
  "/": () => <h1>{`Home`}</h1>,
  "/users": () => <h1>{`Users`}</h1>,
  "/users/:userId/*": ({ userId, rest }) => (
    <>
      <h1>{`User ${userId}`}</h1>
      <UserDetails path={rest} />
    </>
  ),
  _: () => <h1>Not found</h1>,
});
```

### matchPattern(pathname, pattern)

Matches the pathname agaisnt the pattern. Returns the params in case of match, returns `undefined` otherwise.

```tsx
matchPattern(url.pathname, "/users/:userId/*"); // {userId: "foo", rest: "/bar"}
matchPattern(url.pathname, "/profiles/:profileId/*"); // undefined
```

### matchesPattern(pathname, pattern)

Checks if the pathname matches the pattern.

```tsx
matchesPattern(url.pathname, "/users/:userId/*"); // true
matchesPattern(url.pathname, "/profiles/:profileId/*"); // false
```

## Inspirations

- [Rescript React Router](https://rescript-lang.org/docs/react/latest/router) for the whole API
- [Chicane](https://swan-io.github.io/chicane/) for the TypeScript wizardy logic

## [License](./LICENSE)
