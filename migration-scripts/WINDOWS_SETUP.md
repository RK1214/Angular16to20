# Windows Setup Guide for Migration Scripts

Quick guide to get the migration scripts working on Windows.

## Prerequisites

### 1. Install Git for Windows (Git Bash)

**Download:** https://git-scm.com/download/win

**Installation:**
- Run the installer
- Use default options
- This includes Git Bash (required for running the scripts)

### 2. Install Python 3

**Download:** https://www.python.org/downloads/

**Installation Steps:**
1. Download the latest Python 3.x installer
2. Run the installer
3. ⚠️ **CRITICAL:** Check the box "Add Python to PATH" at the bottom of the first screen!
4. Click "Install Now"
5. Wait for installation to complete
6. Close the installer

### 3. Verify Installation

Open Git Bash and test:

```bash
# Test Python
python --version
# Should show: Python 3.x.x

# Test Git
git --version
# Should show: git version x.x.x

# Test Node.js (should already be installed for Angular)
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

## Common Windows Issues

### Issue 1: "python was not found"

**Cause:** Python is not in PATH

**Solution:**

**Option A: Reinstall Python (Easiest)**
1. Uninstall Python (Settings → Apps → Python)
2. Download fresh installer from python.org
3. Run installer
4. ✅ **CHECK "Add Python to PATH"** (don't forget!)
5. Install
6. **Restart Git Bash**
7. Test: `python --version`

**Option B: Add to PATH manually**
1. Find where Python is installed:
   - Check: `C:\Python3X`
   - Check: `C:\Users\YourName\AppData\Local\Programs\Python\Python3X`
   - Check: `C:\Program Files\Python3X`

2. Add to PATH:
   ```
   Right-click "This PC" → Properties
   → Advanced system settings
   → Environment Variables
   → Under "System variables", select "Path"
   → Click "Edit"
   → Click "New"
   → Add Python directory (e.g., C:\Python311)
   → Click "New" again
   → Add Scripts directory (e.g., C:\Python311\Scripts)
   → Click OK on all dialogs
   ```

3. **Restart Git Bash** (important!)
4. Test: `python --version`

### Issue 2: Microsoft Store Python

**Problem:** If you see this message:
```
Python was not found; run without arguments to install from the Microsoft Store
```

**Solution:**
1. DO NOT install from Microsoft Store
2. Uninstall Microsoft Store Python if already installed:
   - Settings → Apps → Python → Uninstall
3. Install Python from python.org instead (see above)
4. Make sure to check "Add to PATH"

### Issue 3: Permission Denied

**Error:**
```
Permission denied
```

**Solution:**
```bash
# Make scripts executable
chmod +x migration-scripts/*.sh
```

### Issue 4: "cannot execute binary file"

**Cause:** Trying to run bash scripts in CMD or PowerShell

**Solution:** Use Git Bash instead
1. Right-click your project folder
2. Select "Git Bash Here"
3. Run the scripts from Git Bash

## Running the Scripts on Windows

### Step 1: Open Git Bash

**Method A: From File Explorer**
1. Navigate to your Angular project folder
2. Right-click in the folder (on empty space)
3. Select "Git Bash Here"

**Method B: From Start Menu**
1. Open Git Bash from Start Menu
2. Navigate to your project:
   ```bash
   cd /c/Users/YourName/Projects/my-angular-app
   ```

### Step 2: Verify You're in the Right Place

```bash
# Check if you're in your Angular project
ls package.json
# Should show: package.json

# Check if migration scripts exist
ls migration-scripts/
# Should show list of .sh files
```

### Step 3: Make Scripts Executable

```bash
chmod +x migration-scripts/*.sh
```

### Step 4: Run Phase 1

```bash
./migration-scripts/phase1-preparation.sh
```

### Step 5: Run Phase 2 (Robust Version)

```bash
./migration-scripts/phase2-flex-layout-to-css-robust.sh
```

**The script will now automatically work with Windows Python!**

When prompted:
- Press `1` for dry-run (preview changes)
- Press `2` for full migration

### Step 6: Continue with Other Phases

```bash
./migration-scripts/phase3-material-legacy-to-mdc.sh
./migration-scripts/phase4-angular-updates.sh
./migration-scripts/phase5-testing.sh
./migration-scripts/phase6-cleanup.sh
```

## Quick Verification Checklist

Before running the scripts, verify:

- [ ] Git Bash is installed
- [ ] Python 3 is installed
- [ ] `python --version` shows Python 3.x.x
- [ ] Node.js 18+ is installed
- [ ] You're in your Angular project directory
- [ ] You can see `package.json` file
- [ ] You can see `migration-scripts/` folder
- [ ] Scripts are executable (`chmod +x migration-scripts/*.sh`)

## Path Format on Windows

Git Bash uses Unix-style paths:

```bash
# Windows path:
C:\Users\John\Projects\my-app

# Git Bash path:
/c/Users/John/Projects/my-app

# Examples:
cd /c/Users/John/Projects/my-app
cd /d/Projects/my-app  # D: drive
```

## Alternative: Use WSL (Windows Subsystem for Linux)

If Git Bash doesn't work for you, consider using WSL:

1. Install WSL:
   ```powershell
   # In PowerShell as Administrator:
   wsl --install
   ```

2. Restart your computer

3. Open Ubuntu from Start Menu

4. Navigate to your project:
   ```bash
   cd /mnt/c/Users/YourName/Projects/my-angular-app
   ```

5. Run scripts normally (they work like on Linux)

## Still Having Issues?

### Option 1: Use Original Phase 2 Script (No Python Required)

If you can't get Python working, use the original script:

```bash
# Skip the robust version, use original:
./migration-scripts/phase2-flex-layout-to-css.sh
```

### Option 2: Manual Python Test

Test if Python works for the migration:

```bash
# Test the Python script directly:
python migration-scripts/migrate-flex-to-css.py --help

# If this works, the migration should work too
```

### Option 3: Check Your Environment

```bash
# Show all environment info:
echo "Git Bash: $(bash --version | head -1)"
echo "Python: $(python --version 2>&1)"
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"
echo "Current Directory: $(pwd)"
echo "PATH: $PATH"
```

Share this output if asking for help.

## Windows-Specific Tips

1. **Always use Git Bash**, not CMD or PowerShell
2. **Always restart Git Bash** after installing Python
3. **Use forward slashes** (`/`) not backslashes (`\`) in paths
4. **Check "Add to PATH"** when installing Python
5. **Run from project root** where `package.json` is located
6. **Don't use Microsoft Store Python** - use python.org installer

## Summary: Quickest Path to Success

1. ✅ Install Git for Windows (Git Bash)
2. ✅ Install Python from python.org (check "Add to PATH")
3. ✅ Restart Git Bash
4. ✅ Test: `python --version` and `git --version`
5. ✅ Navigate to your project
6. ✅ Run: `chmod +x migration-scripts/*.sh`
7. ✅ Run: `./migration-scripts/phase1-preparation.sh`
8. ✅ Run: `./migration-scripts/phase2-flex-layout-to-css-robust.sh`
9. ✅ Continue with remaining phases

**That's it!** The scripts are now Windows-compatible and will automatically detect your Python installation.

---

*Last Updated: 2025-11-21*
