const fs = require('fs');

const dirPath = 'src/assets/i18n';
const primaryLangFileName = 'en.json';

enum Command {
    GENERATE_XLS = 'genxls',
    XLS_TO_JSON = 'xlstojson',
}

const extractKeys = (from: object, to: object, prefix = '') => {
    for (const [key, value] of Object.entries(from)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'string' || value instanceof String) {
            to[newKey] = value;
        } else if (typeof value === 'object' && value !== null) {
            extractKeys(value, to, newKey);
        }
    }
};

const getLang = (fileName: string): object => {
    const keys = JSON.parse(fs.readFileSync(`${dirPath}/${fileName}`, 'utf8'));
    const entries = {};
    extractKeys(keys, entries);

    return {[fileName.replace('.json', '')]: entries};
};

const getSecondaryLangs = (specificLang = ''): object[] => {
    return fs.readdirSync(dirPath)
        .filter(fileName => fileName !== primaryLangFileName)
        .filter(fileName => specificLang ? fileName.replace('.json', '') === specificLang : true)
        .map(fileName => getLang(fileName))
        .reduce((map, lang) => {
            const [key, val] = Object.entries(lang)[0];
            return {
                ...map,
                [key]: val
            };
        });
};

const generateXls = (lang: string) => {
    const excel = require('excel4node');

    const primary = getLang(primaryLangFileName);
    const secondaries = getSecondaryLangs(lang ? lang : '');

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    const style = workbook.createStyle({
        // numberFormat: '$#,##0.00; ($#,##0.00); -'
    });

    const [primKey, primEntries] = Object.entries(primary)[0];

    let x = 1;
    for (const [primEntry, primVal] of Object.entries(primEntries)) {
        if (x === 1) {
            worksheet.cell(x, 2).string(primKey).style(style);
        } else {
            worksheet.cell(x, 1).string(primEntry).style(style);
            worksheet.cell(x, 2).string(primVal).style(style);
        }

        const secLangs = Object.entries(secondaries);
        for (let secIndex = 0; secIndex < secLangs.length; secIndex++) {
            const [secKey, secEntries] = secLangs[secIndex];
            if (x === 1) {
                worksheet.cell(x, 3 + secIndex).string(secKey).style(style);
            } else {
                worksheet.cell(x, 3 + secIndex).string(secEntries[primEntry] || '').style(style);
            }
        }

        x++;
    }

    const fileName = [
        'export_lang',
        lang ? lang : 'all',
        new Date().toISOString()
    ].join('_');

    workbook.write(`lang-utils/${fileName}.xlsx`);
};

const xlsToJson = async (filePath: string) => {
    console.log('xlsToJson');

    const Excel = require('exceljs');
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    const getIJ = (i: number, j: number): string => worksheet.getRow(i).getCell(j).value;

    console.log(getIJ(1, 2));
    console.log(getIJ(1, 3));

    const langs: string[] = [];

    for (let j = 3; ; j++) {
        console.log(j);
        const lang = getIJ(1, j);
        console.log(lang);
        if (lang) {
            langs.push(lang);
            continue;
        }

        break;
    }

    console.log(langs);
    for (let langIndex = 0; langIndex < langs.length; langIndex++) {
        const lang = {};

        for (let i = 2; ; i++) {
            const key = getIJ(i, 1);
            if (key) {
                const val = getIJ(i, 3 + langIndex);
                if (val) {
                    lang[key] = val;
                }
                continue;
            }

            break;
        }

        console.log(JSON.stringify(lang));

        fs.writeFileSync(`${__dirname}/../src/assets/i18n/${langs[langIndex]}.json`, JSON.stringify(lang));
    }
};

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
    case Command.GENERATE_XLS:
        generateXls(arg);
        break;
    case Command.XLS_TO_JSON:
        xlsToJson(arg);
        break;
    default:
        console.log('unknown command.');
}
