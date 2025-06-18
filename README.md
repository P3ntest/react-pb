![Header](./your-header-image-name.png)

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

---

## API Reference

### `usePocketBase()`

Returns the PocketBase client instance from context. Must be used inside `PocketBaseProvider`.

```ts
const pb = usePocketBase();
```

---

### `usePbCollection(collectionId: string)`

Returns a memoized collection accessor for a given collection ID.

```ts
const collection = usePbCollection("posts");
```

---

### `usePbList(collectionId: string, options?: { page?: number; perPage?: number } & RecordListOptions)`

Fetches a paginated list of records from a collection using React Query.

```ts
const { data } = usePbList("posts", {
  page: 1,
  perPage: 10,
  filter: 'status = "published"',
});
```

---

### `usePbFullList(collectionId: string, options?: RecordFullListOptions)`

Fetches all records in a collection using PocketBase’s `getFullList()` method.

```ts
const { data } = usePbFullList("comments");
```

---

### `usePbFirst(collectionId: string, filter: string, options?: RecordListOptions)`

Fetches the first matching record from a collection.

```ts
const { data } = usePbFirst("users", 'username = "john"');
```

---

### `usePbOne(collectionId: string, id: string, options?: RecordOptions)`

Fetches a single record by ID from a collection.

```ts
const { data } = usePbOne("posts", "record_id");
```

---

### `usePbMutations(collectionId: string)`

Provides mutation hooks for creating, updating, and deleting records, as well as a method to invalidate queries.

```ts
const { create, update, deleteRecord, invalidate } = usePbMutations("posts");
```

#### `create.mutate(data)`

Creates a new record.

#### `update.mutate({ id, ...data })`

Updates an existing record.

#### `deleteRecord.mutate(id)`

Deletes a record by ID.

#### `invalidate()`

Invalidates all collection related queries to trigger refetch.

---

### `usePbSubscribe(collectionId: string, callback: (data: RecordSubscription) => void, topic?: string)`

Subscribes to real-time updates on a collection. Automatically unsubscribes on unmount.

```ts
usePbSubscribe("posts", (data) => console.log(data));
```

---

### `usePbLive(collectionId: string, topic?: string)`

Subscribes to a collection and automatically invalidates queries on any change. Useful for plug-and-play live updates.

```ts
usePbLive("posts");
```

---

### `usePbAuthStore()`

Returns the reactive `authStore`. Triggers component re-renders on auth state changes.
The `authStore` reference is memoized, so it will not change between renders. Using it as a dependency in `useEffect` will not work as expected. Use the properties like `record` and `isValid` instead.

```ts
const { record: user, isValid } = usePbAuthStore();
```

---

### `usePbAuthRefresh(authCollectionId: string, options?: { intervalMs?: number })`

An opinionated utility hook for SPAs.
Refreshes the auth session on mount, on window focus, and at an optional interval (default 1 hour). Automatically clears the auth store if the session is no longer valid.

Add this hook once in your app.

```ts
usePbAuthRefresh("users", { intervalMs: 30 * 60 * 1000 }); // every 30 minutes
```

---

### `<PocketBaseProvider />`

Wrap your application with this provider to use the hooks. Automatically sets up PocketBase and React Query context. Takes the same props as the `PocketBase` constructor.

```tsx
<PocketBaseProvider baseUrl="http://localhost:8090">
  <App />
</PocketBaseProvider>
```

---

## License

MIT
