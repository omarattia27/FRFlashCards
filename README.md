# FRFlashCards

## `.gitignore` notes

If `.gitignore` seems not to work, make sure the file exists in the repository root (this repo now includes one).

Also note: `.gitignore` only affects untracked files. If a file was already committed, remove it from tracking once, then commit:

```bash
git rm --cached .env
git commit -m "Stop tracking ignored file"
```