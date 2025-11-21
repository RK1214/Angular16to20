# How to Run Migration Scripts

Simple guide to running the Angular 16→20 migration bash scripts.

> **Windows Users:** Having trouble with Python? See [WINDOWS_SETUP.md](WINDOWS_SETUP.md) for complete Windows setup guide!

## Quick Start (3 Steps)

### Step 1: Open Terminal in Your Project

**macOS:**
1. Open Finder
2. Navigate to your Angular project folder
3. Right-click on the folder → Services → New Terminal at Folder
4. Or: Open Terminal and type: `cd /path/to/your/project`

**Linux:**
1. Open Terminal
2. Navigate to your project: `cd /path/to/your/project`

**Windows:**
1. Open Git Bash (comes with Git for Windows)
2. Navigate to your project: `cd /c/path/to/your/project`

### Step 2: Make Scripts Executable (One-time)

```bash
chmod +x migration-scripts/*.sh
```

This makes all scripts runnable. You only need to do this once.

### Step 3: Run Scripts in Order

```bash
# Phase 1: Preparation
./migration-scripts/phase1-preparation.sh

# Phase 2: Flex Layout → CSS (⭐ Node.js version - RECOMMENDED)
./migration-scripts/phase2-flex-layout-to-css-nodejs.sh
# OR use Python version:
# ./migration-scripts/phase2-flex-layout-to-css-robust.sh
# OR use original bash version:
# ./migration-scripts/phase2-flex-layout-to-css.sh

# Phase 3: Material Legacy → MDC
./migration-scripts/phase3-material-legacy-to-mdc.sh

# Phase 4: Angular Updates
./migration-scripts/phase4-angular-updates.sh

# Phase 5: Testing
./migration-scripts/phase5-testing.sh

# Phase 6: Cleanup
./migration-scripts/phase6-cleanup.sh
```

**That's it!** Each script will guide you through the process.

---

## Phase 2: Choosing Between Migration Options

For Phase 2 (Flex Layout → CSS), you have **three options**:

### Option A: Node.js Migration (⭐ RECOMMENDED)

```bash
./migration-scripts/phase2-flex-layout-to-css-nodejs.sh
```

**✅ Best choice because:**
- ✅ **No additional dependencies** - Node.js already required for Angular!
- ✅ **Works on all platforms** - Windows, macOS, Linux
- ✅ **No PATH issues** - Uses existing Node.js installation
- ✅ **Fast and reliable** - Built-in glob support
- ✅ Handles ALL complex scenarios

**Features:**
- Node.js-based HTML parser (no syntax breaking)
- Properly merges CSS classes (no duplicates)
- Creates TypeScript directives for dynamic bindings
- Dry-run mode to preview changes
- Comprehensive warnings for manual review
- Handles dynamic bindings, calc(), template expressions, etc.

**Requirements:**
- Node.js 18+ (already installed for Angular projects)

**Interactive prompts:**
1. Select **1** for dry-run (preview changes)
2. Select **2** for full migration

### Option B: Python Migration

```bash
./migration-scripts/phase2-flex-layout-to-css-robust.sh
```

**Use this if:**
- You prefer Python over Node.js
- You already have Python 3 installed

**Requirements:**
- Python 3.x

### Option C: Original Migration (Bash Only)

```bash
./migration-scripts/phase2-flex-layout-to-css.sh
```

**Use this if:**
- You only have simple static directives
- You prefer the simplest bash-only approach

**Note:** May have issues with:
- Multiple `class=""` attributes
- Broken HTML syntax
- Incorrect responsive class generation

### Which One Should I Choose?

**👉 We strongly recommend Option A (Node.js version)** for most projects!

**Why Node.js version is best:**
1. ✅ Node.js is **already installed** (required for Angular)
2. ✅ **No Python setup** needed (avoids PATH issues on Windows)
3. ✅ **Same features** as Python version
4. ✅ **Works everywhere** without additional setup

```bash
# Verify Node.js is available (it should be!):
node --version
# Should show: v18.x.x or higher

# Then just run:
./migration-scripts/phase2-flex-layout-to-css-nodejs.sh
```

---

## Detailed Instructions

### For macOS Users

**Option 1: Using Terminal (Built-in)**

```bash
# 1. Open Terminal (Applications → Utilities → Terminal)

# 2. Navigate to your project
cd ~/Projects/my-angular-app

# 3. Make scripts executable
chmod +x migration-scripts/*.sh

# 4. Run first script
./migration-scripts/phase1-preparation.sh
```

**Option 2: Using VS Code Terminal**

```bash
# 1. Open your project in VS Code

# 2. Open Terminal in VS Code (View → Terminal or Ctrl+`)

# 3. Make scripts executable
chmod +x migration-scripts/*.sh

# 4. Run first script
./migration-scripts/phase1-preparation.sh
```

---

### For Linux Users

Same as macOS - Linux has bash built-in!

```bash
# 1. Open Terminal (Ctrl+Alt+T on most distributions)

# 2. Navigate to your project
cd ~/projects/my-angular-app

# 3. Make scripts executable
chmod +x migration-scripts/*.sh

# 4. Run scripts
./migration-scripts/phase1-preparation.sh
```

---

### For Windows Users

**Option 1: Using Git Bash (Recommended)**

Git Bash is installed with Git for Windows.

```bash
# 1. Right-click on your project folder
# 2. Select "Git Bash Here"

# 3. Make scripts executable
chmod +x migration-scripts/*.sh

# 4. Run scripts
./migration-scripts/phase1-preparation.sh
```

**Option 2: Using WSL (Windows Subsystem for Linux)**

```bash
# 1. Open WSL (search "Ubuntu" or "WSL" in Start menu)

# 2. Navigate to your project
cd /mnt/c/Users/YourName/Projects/my-angular-app

# 3. Make scripts executable
chmod +x migration-scripts/*.sh

# 4. Run scripts
./migration-scripts/phase1-preparation.sh
```

**Option 3: Using PowerShell (Alternative)**

If you can't use Git Bash, you can run bash commands directly:

```powershell
# In PowerShell, navigate to your project
cd C:\Projects\my-angular-app

# Run script with bash
bash migration-scripts/phase1-preparation.sh
```

---

## Common Issues & Solutions

### Issue: "Permission denied"

**Error:**
```
bash: ./migration-scripts/phase1-preparation.sh: Permission denied
```

**Solution:**
```bash
# Make the script executable
chmod +x migration-scripts/phase1-preparation.sh

# Or make all scripts executable at once
chmod +x migration-scripts/*.sh
```

---

### Issue: "No such file or directory"

**Error:**
```
bash: ./migration-scripts/phase1-preparation.sh: No such file or directory
```

**Solution:**
```bash
# Check you're in the right directory
pwd

# You should be in your Angular project root (where package.json is)
# If not, navigate there
cd /path/to/your/angular-project

# Check if scripts exist
ls migration-scripts/
```

---

### Issue: "command not found: ng"

**Error:**
```
./migration-scripts/phase4-angular-updates.sh: line 45: ng: command not found
```

**Solution:**
```bash
# Install dependencies first
npm install

# Then run the script again
./migration-scripts/phase4-angular-updates.sh
```

---

### Issue: "command not found: python3" or "python was not found"

**Error:**
```
./migration-scripts/phase2-flex-layout-to-css-robust.sh: line 25: python3: command not found
```
OR
```
Python was not found; run without arguments to install from the Microsoft Store
```

**Solution:**

**For Windows (Most Common Issue):**

The script now automatically detects both `python` and `python3` commands!

If Python is installed but not working:

1. **Check if Python is in PATH:**
   ```bash
   # Try both commands:
   python --version
   python3 --version
   ```

2. **If neither works, Python is not in PATH. To fix:**
   - **Option A: Reinstall Python**
     1. Download from: https://www.python.org/downloads/
     2. Run installer
     3. ⚠️ **IMPORTANT:** Check ✅ "Add Python to PATH"
     4. Complete installation
     5. **Restart Git Bash** (important!)
     6. Test: `python --version`

   - **Option B: Add existing Python to PATH manually**
     1. Find Python location (usually `C:\Python3X` or `C:\Users\YourName\AppData\Local\Programs\Python\Python3X`)
     2. Add to PATH:
        - Right-click "This PC" → Properties
        - Advanced system settings → Environment Variables
        - Edit "Path" → Add Python directory
        - Add Python Scripts directory (e.g., `C:\Python3X\Scripts`)
     3. **Restart Git Bash**
     4. Test: `python --version`

3. **Microsoft Store Python (Not Recommended):**
   If you installed Python from Microsoft Store, it may not work properly with Git Bash.
   Uninstall it and use the official installer from python.org instead.

**For macOS/Linux:**
```bash
# Check if Python 3 is installed
python3 --version

# If not installed, install it:
# macOS (using Homebrew):
brew install python3

# Linux (Ubuntu/Debian):
sudo apt update && sudo apt install python3

# Then run the script again
./migration-scripts/phase2-flex-layout-to-css-robust.sh
```

**Quick Test:**
```bash
# The script will now work with either command:
python --version   # Windows usually uses this
python3 --version  # Linux/macOS usually uses this

# If either shows "Python 3.x.x", you're good!
```

**Still not working?** Use the original Phase 2 script (no Python required):
```bash
./migration-scripts/phase2-flex-layout-to-css.sh
```

---

### Issue: Windows - "cannot execute binary file"

**Error:**
```
cannot execute binary file: Exec format error
```

**Solution:**
This happens if you're trying to run bash scripts without bash. Use Git Bash or WSL instead of CMD/PowerShell.

---

## Step-by-Step Example

Here's a complete example from start to finish:

```bash
# 1. Open Terminal and navigate to your Angular project
cd ~/Projects/my-angular-app

# 2. Verify you're in the right place (should show package.json)
ls package.json

# 3. Make all migration scripts executable
chmod +x migration-scripts/*.sh

# 4. Run Phase 1
./migration-scripts/phase1-preparation.sh
# ✓ This will create git branches and inventory

# 5. Run Phase 2 (NODE.JS VERSION - Recommended)
./migration-scripts/phase2-flex-layout-to-css-nodejs.sh
# ✓ This will convert Flex Layout to CSS (5-10 minutes)
# ✓ Select option 1 for dry-run first, then option 2 for full migration
# ✓ No Python required - uses Node.js (already installed for Angular!)
# OR use Python version: ./migration-scripts/phase2-flex-layout-to-css-robust.sh
# OR use original bash version: ./migration-scripts/phase2-flex-layout-to-css.sh

# 6. Run Phase 3
./migration-scripts/phase3-material-legacy-to-mdc.sh
# ✓ This will convert Material Legacy to MDC (5-10 minutes)

# 7. Run Phase 4 (longest step)
./migration-scripts/phase4-angular-updates.sh
# ✓ This will update Angular 16→17→18→19→20 (15-30 minutes)

# 8. Run Phase 5
./migration-scripts/phase5-testing.sh
# ✓ This will test the build and start dev server

# 9. Run Phase 6
./migration-scripts/phase6-cleanup.sh
# ✓ This will clean up and finalize

# 10. Done! Your app is now on Angular 20
```

---

## Running Scripts One Command at a Time

If you prefer to run all scripts at once (not recommended for first time):

```bash
# Make executable
chmod +x migration-scripts/*.sh

# Run all phases sequentially using NODE.JS version (will take 40-70 minutes)
./migration-scripts/phase1-preparation.sh && \
./migration-scripts/phase2-flex-layout-to-css-nodejs.sh && \
./migration-scripts/phase3-material-legacy-to-mdc.sh && \
./migration-scripts/phase4-angular-updates.sh && \
./migration-scripts/phase5-testing.sh && \
./migration-scripts/phase6-cleanup.sh

# OR use Python version for Phase 2:
# ./migration-scripts/phase1-preparation.sh && \
# ./migration-scripts/phase2-flex-layout-to-css-robust.sh && \
# ...

# OR use original bash version for Phase 2:
# ./migration-scripts/phase1-preparation.sh && \
# ./migration-scripts/phase2-flex-layout-to-css.sh && \
# ...
```

**⚠️ Warning:** This runs everything automatically. Better to run one at a time to review results.

---

## What You'll See

Each script provides colored output:

- **🟢 Green (✓)** = Success
- **🔴 Red (✗)** = Error
- **🟡 Yellow (⚠)** = Warning
- **🔵 Blue (ℹ)** = Information

Example output:
```
========================================
Phase 1: Preparation & Setup
========================================

✓ Detected Angular project
✓ Node.js version check passed: v20.11.0
✓ Created pre-migration-backup branch
✓ Created and switched to feature/angular-20-migration branch
✓ Critical files backed up to .migration-backup/
✓ Migration inventory created: MIGRATION_INVENTORY.md

========================================
Phase 1 Complete!
========================================

ℹ Next step: Run phase2-flex-layout-to-css.sh
```

---

## Tips

✅ **Do:**
- Run scripts in order (Phase 1 → 2 → 3 → 4 → 5 → 6)
- Read the output after each phase
- Review git commits after each phase
- Test the application after Phase 4
- Keep your terminal open throughout the process

❌ **Don't:**
- Skip phases
- Run scripts out of order
- Close terminal while scripts are running
- Run multiple scripts simultaneously
- Ignore errors (stop and fix them)

---

## Need Help?

### Check if bash is available:
```bash
which bash
# Should show: /bin/bash or /usr/bin/bash
```

### Check if Python 3 is available (for robust Phase 2):
```bash
python3 --version
# Should show: Python 3.x.x
# If not available, use the original Phase 2 script instead
```

### Check if you're on the right branch:
```bash
git branch
# Should show: * feature/angular-20-migration
```

### Check if scripts are executable:
```bash
ls -la migration-scripts/
# Should show: -rwxr-xr-x (scripts with 'x' are executable)
```

### View script without running:
```bash
cat migration-scripts/phase1-preparation.sh
```

### Test Python migration script directly:
```bash
# Preview what changes would be made (dry-run)
python3 migration-scripts/migrate-flex-to-css.py --dry-run --verbose
```

---

## Alternative: Run Scripts from Anywhere

If you want to run scripts from a different directory:

```bash
# Instead of:
./migration-scripts/phase1-preparation.sh

# You can use absolute path:
bash /full/path/to/migration-scripts/phase1-preparation.sh

# Or use 'sh':
sh /full/path/to/migration-scripts/phase1-preparation.sh
```

---

## Summary

**Simplest way to run:**

1. Open Terminal/Git Bash
2. Go to your project: `cd /path/to/project`
3. Make executable: `chmod +x migration-scripts/*.sh`
4. Run Phase 1: `./migration-scripts/phase1-preparation.sh`
5. Run Phase 2: `./migration-scripts/phase2-flex-layout-to-css-nodejs.sh` ⭐ (Recommended - Node.js)
   - Or use Python: `./migration-scripts/phase2-flex-layout-to-css-robust.sh`
   - Or use original bash: `./migration-scripts/phase2-flex-layout-to-css.sh`
6. Continue with phase3, phase4, phase5, phase6

**That's all you need!** The scripts will guide you through everything else.

---

## Quick Reference: Phase 2 Options

| Feature | Node.js Version ⭐ | Python Version | Original Bash |
|---------|-------------------|----------------|---------------|
| **Script** | `phase2-...-nodejs.sh` | `phase2-...-robust.sh` | `phase2-flex-layout-to-css.sh` |
| **Dependencies** | ✅ Node.js (already installed!) | Python 3.x | ❌ None |
| **Windows compatible** | ✅ Yes (no PATH issues) | ⚠️ May have PATH issues | ✅ Yes |
| **Setup required** | ✅ None (Node.js pre-installed) | Python installation | ❌ None |
| **Dry-run mode** | ✅ Yes | ✅ Yes | ❌ No |
| **Dynamic bindings** | ✅ Full support | ✅ Full support | ⚠️ Limited |
| **Complex scenarios** | ✅ All handled | ✅ All handled | ⚠️ Some issues |
| **Class merging** | ✅ Perfect | ✅ Perfect | ⚠️ May duplicate |
| **HTML preservation** | ✅ Always | ✅ Always | ⚠️ May break |
| **Speed** | ✅ Fast | ✅ Fast | ✅ Fast |
| **Recommended for** | ✅ **All projects** | Python users | Simple projects only |

**🌟 Node.js version is recommended for everyone!** No additional setup needed.

**Need more details?** See [FLEX_MIGRATION_GUIDE.md](FLEX_MIGRATION_GUIDE.md)

---

*Last Updated: 2025-11-21*
