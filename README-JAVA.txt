PK Holding website - Java hosting version

This package does not need Python.

To run locally:
1. Install Java JDK 11 or newer.
2. Open Command Prompt in this folder.
3. The configured owner username is:
   pkadmin7680

   Set the private password through the environment (do not save it in the website files):
   Windows Command Prompt:
   set PK_ADMIN_PASSWORD=YOUR-STRONG-PRIVATE-PASSWORD

   Linux hosting:
   export PK_ADMIN_PASSWORD='YOUR-STRONG-PRIVATE-PASSWORD'

4. Run:
   javac PkHoldingWebsiteServer.java
   java PkHoldingWebsiteServer
5. Open:
   http://localhost:8000

Owner login:
- Open /admin
- Username: pkadmin7680
- The login is disabled when PK_ADMIN_PASSWORD is not configured.
- Never put the password into HTML, JavaScript, Java source, or a public repository.
- Configure PK_ADMIN_USERNAME and PK_ADMIN_PASSWORD as private environment/secret values in your hosting dashboard.
- Use HTTPS on the live domain.

Uploads:
- Posters: PNG, JPG or WebP up to 25 MB
- Videos: MP4 or WebM up to 250 MB
- Brochures: PDF up to 60 MB
- Uploaded files are stored in assets/uploads.
- Upload records are stored in data/uploads.tsv.
- On cloud hosting, both locations must use persistent storage/volume so uploads remain after a restart or redeployment.

For hosting:
- Upload all files and folders in this package.
- Start command:
  javac PkHoldingWebsiteServer.java && java PkHoldingWebsiteServer
- If your hosting provider gives a PORT environment variable, this Java server will use it automatically.

Main pages:
- / or /home
- /about
- /showroom
- /achievements
- /media (public posters and videos)
- /admin (private owner login)
