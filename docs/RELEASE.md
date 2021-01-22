# Release procedure

To make a release, checkout to branch from which you want to make a release:
* for regular releases, checkout `master` branch,
* for urgent releases, checkout the branch where you have fixed a critical issue.

Open a new branch with name `release-1.5.2` where `1.5.2` is the version you want to release. After that, just push this branch to remote.
```shell
git checkout -b release-1.5.2
git push origin
```

This will set a new version to `package.json` and create two pull requests; one that merges to `release`, and one that merges back to `master` branch.
If there are some issues, fix them, and merge them to corresponding branches.
