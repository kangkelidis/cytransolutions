import UserForm from "./components/UserForm";

const UsersApi = await import("@/pages/api/user");

async function getData() {
  const res = await UsersApi.getAllUsers();
  if (!res) {
    throw new Error("Failed to fetch data");
  }
  return JSON.parse(res);
}

export default async function Users() {
  const data = await getData();

  return (
    <main>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th>{d.email}</th>
              <th>{d.name}</th>
              <th>{d.role}</th>
            </tr>
          ))}
        </tbody>
      </table>

            <UserForm />
    </main>
  );
}
