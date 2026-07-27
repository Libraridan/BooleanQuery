# Crafting an Efficient Search - GitHub Pages site

This folder contains a static recreation of the PDF template as a webpage.

## Files

- `index.html` - the page structure
- `styles.css` - layout and visual styling
- `script.js` - live search preview and Clear Form behavior

## Run locally

Open `index.html` in a browser, or serve the folder with any simple static server.

Example with Python:

```bash
cd search-template-site
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages deployment

1. Sign in to GitHub.
2. Create a new repository, for example `search-template-site`.
3. Upload the files in this folder to the repository root.
4. Go to the repository **Settings**.
5. Click **Pages**.
6. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
7. Choose the **main** branch and the **/ (root)** folder.
8. Save.
9. Wait a minute or two for GitHub to publish the site.

GitHub will give you a public URL in the Pages section of the repository settings.

## Optional git command-line workflow

If you prefer the terminal:

```bash
cd search-template-site
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

After pushing, enable GitHub Pages in the repository settings as described above.
