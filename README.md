# Crafting an Efficient Search

This folder contains a static HTML/CSS/JS recreation of the worksheet PDF.

## Files

- `index.html` - main page
- `styles.css` - layout and print styling
- `script.js` - autosave, restore, and clear button behavior

## Local preview

Open `index.html` in a browser, or run a simple local server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Publish to GitHub Pages

1. Create a repository on GitHub.
2. Upload these files to the repository root.
3. Go to **Settings** -> **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**.
6. Save and wait a minute or two for deployment.

## Updating the site later

Replace the files in the repository with the newest versions and commit the change. GitHub Pages will republish automatically.
