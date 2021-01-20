/**
 * A string to express language configuration.
 *
 * Languages should be expressed in the next format:
 * <localeID>:"<displayName>":"<translationsURL>"
 *
 *  * localeID - ISO 639-1 language codes with an ISO 3166 country code appended as needed,
 *  * displayName - name to display for this language,
 *  * translationsURL - optional URL to language translations.
 *
 * Example:
 * ```
 * fr:"French" el:"greek":"https://path.to/el.json" fr-CA:"French (Canada)":"https://path.to/fr-CA.json"
 * ```
 */
export const langConfigRE = new RegExp(/[\w\-]+:"[^"]+"(:"[^"]+")?/, 'g');

/**
 * Regular expression to extract certain parts of a single language from a language configuration.
 *
 * Usage example:
 * ```ts
 * const language = 'fr-CA:"French (Canada)":"https://path.to/fr-CA.json"'
 * const [_full, lang, name, _optionalGroup, url] = language.match(extractLangFromConfigRE);
 *
 * // lang = 'fr-CA';
 * // name = 'French (Canada)';
 * // url = 'https://path.to/fr-CA.json';
 * ```
 */
export const extractLangFromConfigRE = new RegExp(/([\w-]+):"([^"]+)"(:"([^"]+)")?/);
