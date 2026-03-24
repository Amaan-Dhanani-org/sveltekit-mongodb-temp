<details>
<summary>Start Database</summary>
  
  We will store our users in a MongoDB database. We will use [MongoDB Altas](https://mongodb.com/atlas) which is their cloud-based solution.
  
  Open your MongoDB dashboard and create a cluster (if you are unsure how that works, check out their tutorial). By clicking "Connect", you will get a URI of the form.
  
  Save the URI as an environment variable `SECRET_MONGODB_URI` in the `.env` file (located at the root of the project).
  Also generate a JWT Secret and save it as an environment variable `SECRET_JWT_KEY` in the `.env` file.
  
  ```
  SECRET_MONGODB_URI="mongodb+srv://{USER_NAME}:{USER_PASSWORD}@{CLUSTER_NAME}.mongodb.net/data?retryWrites=true&w=majority"
  SECRET_JWT_KEY="{YOUR_RANDOMLY_GENERATED_JWT_SECRET}"
  ```
  
  NOTE: You can replace `SECRET_MONGODB_URI` with any connection string format. The password needs to be URL encoded if needed! Notice that I have added `data` before the question mark. This will be the name of the database under which the user collection will be created. Otherwise, MongoDB will call it test by default.
</details>


<details>

<summary>Protecting Routes</summary>
 Our goal is to protect certain pages from non-authenticated users. Simply head to `hooks.server.ts` and find this section of code and add a directory!
 
 ```ts
 export const handle = async ({ event, resolve }) => {
    const is_protected =
		  event.url.pathname.startsWith('/dashboard') ||
		  event.url.pathname.startsWith('/settings')
      //YOU CAN ADD MORE HERE
```
</details>


<details>

<summary>TailwindCSS Custom Properties & Theme</summary>

If you are using a color/properties too much and you want to organize them, especially when it involves a theme, go the `.css` file and the rest is self-explanatory!
 
 ```css
@theme {
    --font-poppins: 'Poppins', sans-serif;
    /* It works with fonts! */

    /* === COLORS === */
    --color-backdrop: #1f1f39;
    --color-backdrop-light: #f0f0f2;
    --color-primary: #3d5cff;	
    --color-secondary: #2f2f42;
    --color-subheading: #b8d8d2;
    /* Add as many as you want */
}
```

Theme rendering can be seen in the `+layout.svelte` of the project! It uses `npm` package `sk-clib` by GitHub user `TreltaSev`!
</details>

<details>

<summary>Packages and Their Uses</summary>

| Package | Purpose / Description |
|---------|---------------------|
| `@sveltejs/adapter-vercel` | An official SvelteKit adapter that converts your project into a format optimized for the Vercel platform. Used in `svelte.config.js`. Create new project in Vercel, enter environment variables, and import GitHub repository! |
| `bcrypt` | Library for hashing passwords securely. Used to store user passwords safely in your database. |
| `jsonwebtoken` | Library for creating and verifying JWT tokens. Essential for authentication and protecting routes. |
| `mongoose` | ODM (Object Document Mapper) for MongoDB. Simplifies interacting with MongoDB using schemas and models. |
| `nodemailer` | Library to send emails from Node.js. Useful for account verification, password reset, or notifications. When sending emails with HTML, note that rendering may be weird. Make sure to have a .txt template and a .html template for best practice. Template are located in the `static` folder. |
| `prettier` | An opinionated code formatter that enforces a consistent style across your entire codebase. |
| `sveltekit-superforms` | Library for building forms in SvelteKit with built-in validation, error handling, and easy integration with server actions.  https://www.youtube.com/watch?v=MiKzH3kcVfs%20<br>https://superforms.rocks/ |
| `sk-clib` | A component library for SvelteKit (custom library, likely providing pre-built UI components and utilities) created by github user TreltaSev. |
| `tailwind-merge` | Utility to intelligently merge Tailwind CSS classes, avoiding duplicate or conflicting class names dynamically. |
| `unplugin-icons` | Vite/Svelte plugin to use icons as components. Works with multiple icon packs like Iconify. |
| `zod` | Type-safe schema validation library, often used with Superforms to define and validate form data. Validation schemas are located at `src/lib/validation`. |

If you use TypeScript, you will also want to install the types as a dev dependency for certain packages.

</details>













