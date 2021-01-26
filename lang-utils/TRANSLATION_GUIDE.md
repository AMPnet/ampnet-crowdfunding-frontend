# Translation guide

To translate words from the frontend application, a translator will be provided by Excell file (`.xslx`) that contains:

1. Language abbreviations in the first row (should not be touched),
2. Key (labels) in the first column (should not be touched),
3. Reference English translations in the second column (should not be touched),
4. **Targeted language translations in the third column (should be edited)**.

## Features

There are a few important features which help programmers to express and style translation values. To translate values to
a targeted language, **always** consider checking the form of the English value.

## String interpolation (variable injection)

The platform supports injecting variables in translations with double curly braces (`{{ value }}`).

For example, an English translation landing page message could look like this:

```
Welcome to {{ platformName }} investing platform.
```

If the platform name is `My company`, the previous English translation will
become `Welcome to My company investing platform.`.

### Variables

Variables inside the curly braces **must not be renamed**. They are used internally inside the code to fetch the
appropriate. Using string interpolation is optional and can be omitted.

```
# english translation
Welcome to {{ platformName }} investing platform.

# wrong Croatian translation
Dobrodošli u {{ imePlatforme }} investicijsku platformu.

# correct Croatian translation
Dobrodošli u {{ platformName }} investicijsku platformu.

# correct Croatian translation with omitted string interpolation
Dobrodošli u investicijsku platformu.

```

### Split parts

Translation values can be split into multiple parts. This is useful if a particular word inside the sentence needs to be
accentuated or extracted. These rules are defined inside the code, and a translator cannot change them, only change
their order in a sentence.

For example, if a particular word needs to be a link to an external page, the English value can look like this:

```
Click | here | to see the news.
```

> Click [here]() to see the news.


The sentence is split into 3 parts with vertical bars (`|`). When looking at the English translation, we see that
programmers assume that the second part needs to be a link.

If a word with a link needs to be in a different part of the sentence, it must be done in a way to obey the part ordering.

For a link at the beginning of the sentence, use this:

```
| Here | is the link that will show you the news.
```

> [Here]() is the link that will show you the news.

For a link at the end of the sentence, use this:

```
To stay informed, look at | the news | .
```

> To stay informed, look at [the news]() .

A translator needs to assure that important parts are always filled out with some words. If an important part (e.g.
link in the second part) is omitted, the application will not have the desired functionality.

Example 1
```
# wrong
To stay informed, look at the news
```

> To stay informed, look at the news

Example 2
```
# wrong
To stay informed, look at | | the news
```

> To stay informed, look at the news

Example 3
```
# correct
To stay informed, look at | the news |
```

> To stay informed, look at [the news]()
