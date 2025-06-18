import { PocketBaseProvider } from "../lib/PocketBaseProvider";
import { usePbCollection } from "../lib/usePbCollection";
import { usePbAuthStore } from "../lib/usePocketBase";
import { usePbList, usePbOne } from "../lib/pbQueryHooks";
import { usePbMutations } from "../lib/usePbMutations";
import { usePbLive } from "../lib/usePbSubscribe";
import { usePbAuthRefresh } from "../lib";

export function App() {
  return (
    <PocketBaseProvider baseUrl="http://localhost:8090">
      <Auth />
    </PocketBaseProvider>
  );
}

export function Auth() {
  const authStore = usePbAuthStore();
  const users = usePbCollection("users");
  usePbAuthRefresh("users");

  if (authStore.isValid) {
    return (
      <div>
        <h1>Welcome, {authStore.record!.name}!</h1>
        <button onClick={() => authStore.clear()}>Logout</button>
        <h2>Posts</h2>
        <ListTest />
      </div>
    );
  }

  return (
    <div>
      <h1>Please log in</h1>
      <button
        onClick={async () => {
          const email = prompt("Email:");
          const password = prompt("Password:");
          if (email && password) {
            try {
              await users.authWithPassword(email, password);
              alert("Login successful!");
            } catch (_e) {
              alert("Login failed");
              console.error("Login error:", _e);
            }
          }
        }}
      >
        Login
      </button>
    </div>
  );
}

function ListTest() {
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
            content:
              Math.random().toString(36).substring(2, 15) +
              " " +
              Math.random().toString(36).substring(2, 15),
          });
        }}
      >
        Create Random Post
      </button>
      <ul>
        {data.items.map((item) => (
          <li key={item.id}>
            <ItemTest id={item.id} />
          </li>
        ))}
      </ul>
    </>
  );
}

function ItemTest({ id }: { id: string }) {
  const { data, error } = usePbOne("posts", id);
  const { update, deleteRecord } = usePbMutations("posts");
  if (error) {
    return <div>Error loading item: {JSON.stringify(error)}</div>;
  }
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Item {data.id}</h2>
      <p>{data.content}</p>
      <button
        onClick={() => {
          update.mutate({
            id: data.id,
            content:
              Math.random().toString(36).substring(2, 15) +
              " " +
              Math.random().toString(36).substring(2, 15),
          });
        }}
      >
        set to random content
      </button>
      <button
        onClick={() => {
          deleteRecord.mutate(data.id);
        }}
      >
        Delete
      </button>
    </div>
  );
}
