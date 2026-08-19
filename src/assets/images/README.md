Images folder for the COMOT app

Place image files (PNG, JPG, SVG, etc.) in this folder.

Usage in React components (relative to `src`):

- Import an image:

import Logo from '../assets/images/logo.png'

- Use in JSX:

<img src={Logo} alt="Logo" />

Notes:
- You can also put public/static images in the `public` folder and reference them by absolute path.
- Prefer `src/assets/images` when you want to import images as modules (bundled by Vite).