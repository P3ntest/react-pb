# `use-pocketbase` React Library

A React library for working with [PocketBase](https://pocketbase.io/) using [React Query](https://react-query.tanstack.com/) under the hood.

Provides a reactive interface to PocketBase collections, records, authentication and subscriptions.

Also provides the `usePocketBase` hook for direct access to the PocketBase client.

## Comparison to `pocketbase-react`

This library follows reactive patterns more closely than `pocketbase-react`, which is more imperative. It uses React Query to manage server state and caching, making it easier to work with PocketBase in a React application.

## Installation

`use-pocketbase` relies on `pocketbase` and `@tanstack/react-query` as peer dependencies, so you need to install them as well.

`npm install use-pocketbase pocketbase @tanstack/react-query`

## Usage

Wrap your application with the `PocketBaseProvider` and pass in your PocketBase client instance:

```tsx
export function Main() {
  return (
    <PocketBaseProvider baseUrl="http://localhost:8090">
      <YourApp />
    </PocketBaseProvider>
  );
}
```

Then you can use pocketbase hooks in your components. This example lists posts and allows you to create a new post. It also subscribes to live updates for the "posts" collection:

```tsx
function List() {
  const { data } = usePbList("posts");
  const { create } = usePbMutations("posts");
  usePbLive("posts");

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <button
        onClick={() => {
          create.mutate({
            content: "new post",
          });
        }}
      >
        Create Mew Post
      </button>
      <ul>
        {data.items.map((item) => (
          <li key={item.id}>
            {item.content} - {item.created}
          </li>
        ))}
      </ul>
    </>
  );
}
```
