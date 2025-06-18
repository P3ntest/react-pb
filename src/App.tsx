import { PocketBase } from "../lib/PocketBase";
import { usePbCollection } from "../lib/usePbCollection";
import { usePbAuthStore } from "../lib/usePocketBase";
import { usePbList, usePbOne } from "../lib/pbQueryHooks";

export function App() {
  return (
    <PocketBase baseUrl="http://localhost:8090">
      <Auth />
    </PocketBase>
  );
}

export function Auth() {
  const authStore = usePbAuthStore();
  const users = usePbCollection("users");

  if (authStore.isValid) {
    return (
      <div>
        <h1>Welcome, {authStore.record!.email}!</h1>
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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {data.items.map((item) => (
        <li key={item.id}>
          <ItemTest id={item.id} />
        </li>
      ))}
    </ul>
  );
}

function ItemTest({ id }: { id: string }) {
  const { data, error } = usePbOne("posts", id);
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
    </div>
  );
}
