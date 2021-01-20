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
    for (let i = 1; i < Object.entries(secondaries).length + 3; i++) {
        worksheet.column(i).setWidth(50);
    }
    const style = workbook.createStyle({
        alignment: {
            wrapText: true,
        }
    });

    const [primKey, primEntries] = Object.entries(primary)[0];

    let x = 1;
    for (const [primEntry, primVal] of Object.entries(primEntries)) {
        let headerRow: boolean;
        if (x === 1) {
            headerRow = true;
            x++;
        }

        if (headerRow) {
            worksheet.cell(x - 1, 2).string(primKey).style(style);
        }

        worksheet.cell(x, 1).string(primEntry).style(style);
        worksheet.cell(x, 2).string(primVal).style(style);

        const secLangs = Object.entries(secondaries);
        for (let secIndex = 0; secIndex < secLangs.length; secIndex++) {
            const [secKey, secEntries] = secLangs[secIndex];
            if (headerRow) {
                worksheet.cell(x - 1, 3 + secIndex).string(secKey).style(style);
            }
            worksheet.cell(x, 3 + secIndex).string(secEntries[primEntry] || '').style(style);
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
    const Excel = require('exceljs');
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    const getCell = (i: number, j: number): string => worksheet.getRow(i).getCell(j).text;

    const langs: string[] = [];

    for (let j = 3; ; j++) {
        const lang = getCell(1, j);
        if (lang) {
            langs.push(lang);
            continue;
        }

        break;
    }

    for (let langIndex = 0; langIndex < langs.length; langIndex++) {
        const lang = {};

        for (let i = 2; ; i++) {
            const key = getCell(i, 1);
            if (key) {
                const val = getCell(i, 3 + langIndex);
                if (val) {
                    lang[key] = val;
                }
                continue;
            }

            break;
        }

        fs.writeFileSync(`${__dirname}/../src/assets/i18n/${langs[langIndex]}.json`, JSON.stringify(lang, null, 2) + '\n');
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
