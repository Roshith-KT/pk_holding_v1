@echo off
setlocal
set "PK_ADMIN_USERNAME=pkadmin7680"
for /f "usebackq delims=" %%P in (`powershell -NoProfile -Command "$s=Read-Host 'Owner password' -AsSecureString; $b=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($s); try {[Runtime.InteropServices.Marshal]::PtrToStringBSTR($b)} finally {[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b)}"`) do set "PK_ADMIN_PASSWORD=%%P"
if not defined PK_ADMIN_PASSWORD (
  echo A password is required to start the owner admin area.
  exit /b 1
)
javac PkHoldingWebsiteServer.java
if errorlevel 1 exit /b 1
java PkHoldingWebsiteServer
set "PK_ADMIN_PASSWORD="
endlocal
