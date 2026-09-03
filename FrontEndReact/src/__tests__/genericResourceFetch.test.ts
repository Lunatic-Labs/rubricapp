import { test, expect, jest, beforeEach } from "@jest/globals";
import { genericResourcePUT, genericResourceGET } from "../utility";

// This suite targets the promise CONTRACT of genericResourceFetch (exercised
// here through the exported GET/PUT wrappers): callers only attach a single
// .then() across the app, so every branch — success, server error, hard auth
// failure, and network failure — must RESOLVE (never reject) with a
// consistent { isLoaded, errorMessage } shape.

const cookieStore: Record<string, any> = {};

jest.mock("universal-cookie", () => {
  return {
    __esModule: true,
    default: class {
      get(key: string) {
        return cookieStore[key];
      }
      set() {}
      remove(key: string) {
        delete cookieStore[key];
      }
    },
  };
});

function makeComponent() {
  return { setState: jest.fn() } as any;
}

beforeEach(() => {
  cookieStore["access_token"] = "test-access-token";
  cookieStore["refresh_token"] = "test-refresh-token";
  cookieStore["user"] = { user_id: "42" };
  (global as any).fetch = jest.fn();
});

test("genericResourceFetch Test 1: resolves with state on a successful response", async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    status: 200,
    json: async () => ({ success: true, content: {} }),
  });

  const component = makeComponent();
  const result = await genericResourcePUT("/some_endpoint", component, JSON.stringify({}));

  expect(result).toEqual({ isLoaded: true, errorMessage: null });
  expect(component.setState).toHaveBeenCalledWith({ isLoaded: true, errorMessage: null });
});

test("genericResourceFetch Test 2: resolves (does not reject) with a parsed message on a server error", async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    status: 400,
    json: async () => ({ success: false, message: "ValueError: email already in use" }),
  });

  const component = makeComponent();
  const result = await genericResourcePUT("/some_endpoint", component, JSON.stringify({}));

  expect(result).toEqual({ isLoaded: true, errorMessage: "email already in use" });
});

test("genericResourceFetch Test 3: resolves (does not reject) with an errorMessage on a network failure", async () => {
  (global.fetch as jest.Mock).mockRejectedValue(new TypeError("Failed to fetch"));

  const component = makeComponent();

  // The regression this guards: genericResourceFetch used to `throw` here,
  // which rejected the promise. Nearly every caller in the app only attaches
  // .then() (no .catch()), so a reject meant an unhandled promise rejection
  // on every real network failure. It must resolve instead.
  await expect(genericResourcePUT("/some_endpoint", component, JSON.stringify({})))
    .resolves.toEqual({ isLoaded: true, errorMessage: "Failed to fetch" });

  expect(component.setState).toHaveBeenCalledWith({
    isLoaded: true,
    errorMessage: "Failed to fetch",
  });
});

test("genericResourceFetch Test 4: resolves with 'Not authenticated' when auth cookies are missing, without calling fetch", async () => {
  cookieStore["access_token"] = undefined;
  cookieStore["refresh_token"] = undefined;
  cookieStore["user"] = undefined;

  const component = makeComponent();
  const result = await genericResourceGET("/some_endpoint", "resource", component);

  expect(result).toEqual({ isLoaded: true, errorMessage: "Not authenticated" });
  expect(global.fetch).not.toHaveBeenCalled();
});
