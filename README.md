# Crafting an Efficient Search

A static, GitHub Pages-friendly recreation of the worksheet PDF.

## Files

- `index.html` - page shell
- `styles.css` - page sizing, background image, and print rules
- `script.js` - field creation, autosave, restore, and clear logic
- `assets/page-bg.png` - exact render of the source PDF page

## Local preview

Open `index.html` in a browser, or use a simple local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages setup

1. Create a new public repository on GitHub.
2. Upload the files in this folder to the repository root.
3. Open **Settings** -> **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/ (root)**.
6. Save and wait for GitHub Pages to publish.

## Updating the site later

Replace the files in the repo root with the new version, then commit and push.
