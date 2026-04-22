# NPM for Rubricapp
## Purpose
Rules to help readers figure out how to use npm and resolve some of the errors related to package.json and package-lock.json getting out of sync. Please do 1 if this is your first time reading this.

### Never manually edit the package.json or package-lock.json files.
<span style="opacity:0.5">~~seriously~~</span>

#### 1. Do npm install.

Do:
```bash
npm install
```
That will install husky so that the git-hooks and merge drivers can be installed. 

#### 2. How do I add or remove a library to the front end if I can not manually edit it?
The best way is to do the following:
```bash
# To install a package
npm install <package-name>

# To uninstall a pacakage
npm uninstall <package-name>
```
That will also update both package.json and package-lock.json for you.

#### 3. When I try running the front end either through docker or locally with npm ci, it says that package.json or package-lock.json have packages not listed in the other. 
That is the files being out of sync. The easiest way to fix it is to do:
```bash
npm install --package-lock-only
```
That will regenerate the package-lock.json file so that its in sync.

#### 4. What is a git hook and a merge driver?
A git hook is a custom script that fires when certain events in the git lifecycle occur. Husky installs one that checks if package.json and package-lock.json are in sync after a git commit. If they are not, then it will auto regenerate the package-lock.json file.

A merge driver is a custom script that handles mergeing for specific files. Husky installs a driver that makes sure package.json and package-lock.json are in sync and updates them when needed.

#### 5. I had a merge and the driver did not run.
The merge driver will run only if there is a merge conflict in package-lock.json. If there was a conflict and it did not run, the issue probably is that the merge driver is not yet installed. Husky installs/updates the merge drivers after the commit cycle is done. If you want it now, then run the two git commands in Scripts/setupMergeDriver.sh