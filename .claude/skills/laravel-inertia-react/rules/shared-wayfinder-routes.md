---
section: shared-data
priority: critical
description: Use Wayfinder for type-safe Laravel route generation in React
keywords: [wayfinder, routes, routing, laravel, named-routes, type-safety]
---

# Shared Wayfinder Routes

Use Laravel Wayfinder to import type-safe route functions generated from your Laravel controllers. Wayfinder auto-generates TypeScript functions in `resources/js/actions/` during `npm run dev`.

## Bad Example

```tsx
// Anti-pattern: Hardcoding URLs
import { Link } from '@inertiajs/react';

export default function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <Link href={`/users/${user.id}`}>{user.name}</Link>
          <Link href={`/users/${user.id}/edit`}>Edit</Link>
          <button onClick={() => deleteUser(`/users/${user.id}`)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

// Anti-pattern: String concatenation for complex routes
const searchUrl = `/users?search=${search}&role=${role}&page=${page}`;
```

## Good Example

```tsx
// Wayfinder auto-generates these imports when you run `npm run dev`
// or `php artisan wayfinder:generate`
import { show, edit, destroy } from '@/actions/Admin/Users/ShowAction';
import { index } from '@/actions/Admin/Users/IndexAction';
import { Link, router } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersIndexProps {
  users: PaginatedData<User>;
  filters: {
    search: string;
    role: string;
  };
}

export default function Index({ users, filters }: UsersIndexProps) {
  const handleDelete = (user: User) => {
    if (confirm(`Delete ${user.name}?`)) {
      router.delete(destroy({ user: user.id }).url());
    }
  };

  const handleSearch = (search: string) => {
    router.get(
      index().url(),
      { ...filters, search },
      { preserveState: true }
    );
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <input
          type="search"
          defaultValue={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users..."
        />

        {/* Link with Wayfinder action */}
        <Link
          href={index().url()}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          All Users
        </Link>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.data.map((user) => (
            <tr key={user.id}>
              <td>
                {/* Action with route model binding parameter */}
                <Link href={show({ user: user.id }).url()}>
                  {user.name}
                </Link>
              </td>
              <td>{user.email}</td>
              <td className="flex gap-2">
                <Link
                  href={edit({ user: user.id }).url()}
                  className="text-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(user)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Using Wayfinder actions for various HTTP methods
function ActionExamples() {
  // GET request
  const listUrl = index().url();

  // GET with route binding
  const showUrl = show({ user: 1 }).url();

  // Form action (POST)
  // import { store } from '@/actions/Admin/Users/StoreAction';
  // <form action={store().url()} method="POST">

  // Programmatic navigation
  router.get(index().url(), { search: 'john' }, { preserveState: true });
  router.delete(destroy({ user: 1 }).url());

  return null;
}
```

## Setup

Wayfinder is configured via the Vite plugin in `vite.config.ts`:

```ts
import { wayfinder } from '@laravel/vite-plugin-wayfinder';

export default defineConfig({
  plugins: [
    // ...
    wayfinder({ formVariants: true }),
  ],
});
```

Run `npm run dev` or `php artisan wayfinder:generate` to regenerate the `resources/js/actions/` directory after adding or renaming controllers/routes.

> **Note:** `resources/js/actions/` is gitignored — regenerate locally after pulling changes.

## Why

Using Wayfinder for route generation provides:

1. **Single Source of Truth**: Routes defined once in Laravel controllers, typed automatically in TypeScript
2. **Refactoring Safety**: Renaming a controller action updates the generated types — TypeScript catches all usages
3. **Parameter Validation**: TypeScript ensures correct route model binding parameters
4. **No Hardcoding**: URLs don't break when route patterns change
5. **HTTP Method Safety**: Each action exposes the correct HTTP method (`.get()`, `.post()`, `.url()`)
6. **IDE Support**: Full autocomplete for action imports and parameters
7. **Tree-Shakeable**: Only imports the actions you use
