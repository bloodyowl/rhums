import { expect, test } from "vitest";
import {
  route,
  push,
  useUrl,
  matchPattern,
  matchesPattern,
} from "../src/rhums";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

const App = () => {
  const url = useUrl();

  return (
    <div>
      <button onClick={() => push("/")}>Go to home</button>
      <button onClick={() => push("/users?search=John+Doe")}>
        Go to users
      </button>
      <button onClick={() => push("/users/1234")}>Go to user</button>
      <button onClick={() => push("/users/1234/friends/list")}>
        Go to user with deeper link
      </button>

      <main>
        {route(url.pathname, {
          "/": () => "Home",
          "/users": () => `Users (search: ${url.searchParams.get("search")})`,
          "/users/:userId/*": ({ userId, rest }) =>
            `User ${userId} (rest: ${JSON.stringify(rest)})`,
          _: () => `Not found`,
        })}
      </main>
    </div>
  );
};

test("Router", async () => {
  render(<App />);

  expect(screen.getByRole("main")).toHaveTextContent("Home");

  await userEvent.click(screen.getByText("Go to users"));
  expect(screen.getByRole("main")).toHaveTextContent(
    `Users (search: John Doe)`
  );

  await userEvent.click(screen.getByText("Go to user"));
  expect(screen.getByRole("main")).toHaveTextContent(`User 1234 (rest: "/")`);

  await userEvent.click(screen.getByText("Go to user with deeper link"));
  expect(screen.getByRole("main")).toHaveTextContent(
    `User 1234 (rest: "/friends/list")`
  );

  await userEvent.click(screen.getByText("Go to home"));
  expect(screen.getByRole("main")).toHaveTextContent("Home");
});

test("matchPattern", () => {
  expect(matchPattern("/foo/bar/quux", "/foo/bar/:baz")).toEqual({
    baz: "quux",
  });
  expect(matchPattern("/foo/bar", "/foo/*")).toEqual({
    rest: "/bar",
  });
  expect(matchPattern("/foo/bar", "/foo")).toEqual(undefined);
  expect(matchPattern("/foo/bar", "/bar/foo")).toEqual(undefined);
  expect(matchPattern("/foo/bar", "/bar/*")).toEqual(undefined);
  expect(matchPattern("/foo/bar", "/bar")).toEqual(undefined);
  expect(matchPattern("/", "/")).toEqual({});
  expect(matchPattern("/", "/*")).toEqual({ rest: "/" });
});

test("matchesPattern", () => {
  expect(matchesPattern("/foo/bar/quux", "/foo/bar/:baz")).toEqual(true);
  expect(matchesPattern("/foo/bar", "/foo/*")).toEqual(true);
  expect(matchesPattern("/foo/bar", "/foo")).toEqual(false);
  expect(matchesPattern("/foo/bar", "/bar/foo")).toEqual(false);
  expect(matchesPattern("/foo/bar", "/bar/*")).toEqual(false);
  expect(matchesPattern("/foo/bar", "/bar")).toEqual(false);
  expect(matchesPattern("/", "/")).toEqual(true);
  expect(matchesPattern("/", "/*")).toEqual(true);
});
