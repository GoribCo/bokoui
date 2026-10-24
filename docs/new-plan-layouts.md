I am planning to create a generic UI layout project for web.

- project code will be in " examples/next-js-layouts/ " here
- As this is a generic layout for large scale project so I can fit for any large project.
- I can easily extend to new pages, menus, contents very easily.
- Multiple role people can login and one person can have multiple role.
- Multiple organization can fit here and people can switch to any organization.
- Any menu can be possible to extend to any number without breaking the UI structure.
- Any type of  contents can be fit here.
- At initial level, I want a left sidebar,
- A switch to change organizations on left top and based on organization left menu will change.
- Left menu will be separated for easy navigation
- On left sidebar bottom there will be some common menus like terms, help, privacy settings etc as standard.
- And on bottom there will be account management like show name, email, photo, sub menu for manage account, show profile, and logout button and other standard menus
- Sidebar will be collapsible
- In mobile view sidebar will convert to bottom navigation. Submenu will be show  there
- For mobile view apart from bottom navigation add a hamburger menu on left side
- on right top of header there will be a button to change, theme, style, language (font optional)  etc
- In header add other standard menus if needed including branding
- In footer there will be  some menus
- I will use this layout in another project, on that project I will replace all contents/data with correct values from api endpoints and json/ts code
- So, right now no need to worry about contents
- Must follow standard coding practice and folder structure
- use nextjs src and app router. No need other framework now, onlt he nextjs now.
- For similar page use (dashboard) type bracket to separate files and folder
- For UI use the bokoui/react
- use the correct typography now, future easily I can change if needed
- Write SEO code for each page
- use props for each components and pages
- Use proper folder and naming for typescript code
- For state management follow the following table

| State type | Best pick |
|---|---|
| Server data (API/DB) | **Server Components** for initial fetches, plus **TanStack Query** for client-side fetching, caching and mutations |
| Global client/UI state | **Zustand** |
| URL state (filters, tabs, pagination) | **nuqs** (type-safe search params) |
| Forms | **React Hook Form** + Zod |
| Fine-grained derived state | **Jotai** (an alternative to Zustand) |
| Large team, strict patterns, heavy devtools needs | **Redux Toolkit** |

-

