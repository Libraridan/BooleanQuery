# Crafting an Efficient Search - GitHub Pages site

This project recreates the PDF worksheet as a static website you can host for free on GitHub Pages.

## What is included

- Matching page layout and typography inspired by the original worksheet
- Editable issue, terms, alternatives, database, and search fields
- Connector choices for AND, w/p, w/s, and w/#
- A live search-string preview
- A Clear Form button
- Print-friendly styling so it can still be printed on one landscape page

## Files

- `index.html` - page structure
- `styles.css` - layout, spacing, and print styling
- `script.js` - live preview, connector behavior, and browser storage

## Run locally

Open `index.html` in a browser, or serve the folder with a local web server.

Example:

```bash
cd search-template-site
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Create the GitHub repository

1. Sign in to GitHub.
2. Click **New repository**.
3. Name it something like `search-template-site`.
4. Choose **Public** if you want anyone to access it.
5. Create the repository.

## Upload the files

The easiest path is to upload these files directly in the repository root:

- `index.html`
- `styles.css`
- `script.js`
- `README.md`

You can do that from the GitHub website with **Add file** → **Upload files**.

## Turn it into a website with GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings**.
3. Click **Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Choose branch **main** and folder **/ (root)**.
6. Save.
7. Wait a minute or two.
8. GitHub will show the public site URL in the Pages section.

## Optional terminal workflow

If you prefer using git in a terminal:

```bash
cd search-template-site
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then enable GitHub Pages in the repository settings as described above.
