# Development

On this project, there are some rules that should be followed.

On `master` branch are the most recent changes. From this branch developers make new features. Branch naming is not defined, but keep it short and concise. When changes are pushed to this branch, Github Action will make a production build, generate Docker image with tag latest.

On `release` branch we track changes between release versions. 


### New features
To make a new feature, create a new branch from `master` branch. When you are finished, create a pull request to `master` branch.

If you have a task with task number `123` and title `Landing page image`, set pull request title to `[Fixes AB#123] Landing page image` for tasks defined in Azure Boards,
and `[Fixes #123] Landing page image` for tasks defined on GitHub.

### Urgent bug fixes
To make a bug fix, checkout the most recent commit in `release` branch, create a new branch from it and fix the issue. When you are finished, make a release (see [release procedure](./RELEASE.md)).
