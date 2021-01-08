# Language utilities

Utilities to import and export language translations.

## Export

Languages are always exported from `<lang>.json` files to a single `.xlsx` file. Generated `.xlsx` file is meant to be
sent to a translator to translate it for a specific language.

To export a single language (e.g. Croatian - hr), use the next command:

```shell
npm run lang-gen-xls hr
```

To export all languages, use the next command:

```shell
npm run lang-gen-xls
```

## Import

When `.xlsx` file is successfully translated, use the next command to import the values:

```shell
npm run xls-to-json /absolute/path/to/filename.xlsx
```
