# Appalachian Trail Conservancy

# Point of Contact

For inquiries about the project, contact

| Name        | Email                  |
| ----------- | ---------------------- |
| Sophie Tsai | sophietsai31@gmail.com |
| Akash Patil | akashspxp@gmail.com    |

# Project Info

[Appalachian Trail Conservancy](https://appalachiantrail.org/) is the leading organization in charge of protecting, managing, and advocating for the entire 2,000+ mile Appalachian Trail and its surrounding lands.

Our project aims to help the Appalachian Trail Conservancy streamline and gamify training processes for their staff and volunteers.

# Tech Stack

**Frontend:**

- Framework: [React](https://react.dev/)
- Language: [Typescript](https://www.typescriptlang.org/docs/handbook/intro.html)
- Styling: [CSS Modules](https://github.com/css-modules/css-modules)
- Libraries: [MaterialUI](https://mui.com/material-ui/), [Axios](https://axios-http.com/docs/intro)
- Build Tool: [Vite](https://vitejs.dev/)

**Backend:** TBD

# Running the Repo Locally

1. Clone the repo and cd into it
2. Run `npm install` in the react-app directory
3. Run `npm run dev` in the react-app directory
4. Navigate to http://localhost:3000/ in your browser

---

# Project Structure

## File Organization & Preferred Practices

- Documentation on the preferred practices used for this project can be found [here](https://github.com/Hack4Impact-UMD/appalachian-trail-conservancy/blob/main/preferred-practices.md)

Note:

- We are using a singular global assets folder: `/assets`.
- Only components used across multiple pages are stored in the global components folder: `/components`.
- The Typescript and CSS files for each page can be found in `/pages`. The specific page folders may contain additional sub-folders for each component used on the page for organization. Each folder should contain the x.tsx file and corresponding x.module.css file.
