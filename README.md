# PK Holding website — GitHub Pages

This package is a static website prepared for GitHub Pages. It does not need Java, Python, Node.js, a database, or a build command.

## Publish from the GitHub website

1. Create a new public GitHub repository (or open the repository you want to use).
2. Upload **the contents of this folder** so that `index.html` is at the repository root.
3. Commit the files to the `main` branch.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch **main**, folder **/(root)**, and click **Save**.
7. Wait for GitHub to show the published website URL.

For a project repository, the normal URL is:

`https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`

For a user/organization site whose repository is named `YOUR-USERNAME.github.io`, the URL is:

`https://YOUR-USERNAME.github.io/`

## Publish with Git

```bash
git init
git add .
git commit -m "Publish PK Holding website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Then configure **Settings → Pages** using the steps above.

## Notes

- Keep all files and the `assets` folder in their current relative locations.
- `.nojekyll` is intentional and tells GitHub Pages to serve the files directly.
- Product quotation data is stored in the visitor's browser and the final enquiry opens WhatsApp. No server is required.
- External Google Fonts, Google Maps, brochures, and WhatsApp links require internet access.
- To use a custom domain, enter it under **Settings → Pages → Custom domain** and follow GitHub's displayed DNS instructions.
