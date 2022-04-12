## Google Docs [tidystats](https://www.tidystats.io/) add-in.

For information about _tidystats_, please visit the [tidystats](https://www.tidystats.io/) website.

This Google Docs add-in is written in [Google Apps Script](https://developers.google.com/apps-script/overview) (Google's Javascript-based development platform for building applications and add-ons for Google Sheets, Docs, Forms and other Google Apps), built on the boilerplate project available via [https://github.com/enuchi/React-Google-Apps-Script](https://github.com/enuchi/React-Google-Apps-Script), which can be consulted for details about the code structure.

### Installation

**1.** Make sure you are running at least [Node.js](https://nodejs.org/en/download/) v10 and `npm` v6.

**2.** You need to enable the Google Apps Script API. You can do that via [script.google.com/home/usersettings](https://script.google.com/home/usersettings).

**3.** Clone the repo and install the dependencies.

```bash
git clone https://github.com/enuchi/React-Google-Apps-Script.git
cd React-Google-Apps-Script
npm install
```

**4.** Next, you need to log in to [clasp](https://github.com/google/clasp) that allows managing Google Apps Script projects locally.

```bash
npm run login
```

**5.** Update the `.clasp.json` file in the root of this project with the following three key/value pairs:

```json
{
  "scriptId": "1PY037hPcy................................................",
  "parentId": ["1Df30......................................."],
  "rootDir": "./dist"
}
```

- `scriptId`: Your existing script project's `scriptId`. You can find it by opening your spreadsheet, selecting **Tools > Script Editor** from the menubar, then **File > Project properties**, and it will be listed as "Script ID".

- `parentId`: An array with a single string, the ID of the parent file (spreadsheet, doc, etc.) that the script project is bound to. You can get this ID from the url, where the format is usually `https://docs.google.com/spreadsheets/d/{id}/edit`. This allows you to run `npm run open` and open your file directly from the command line.

- `rootDir`: This should always be `"./dist"`, i.e. the local build folder that is used to store project files.


Now you can run the deploy command to compile and upload the scripts to the specified Google Document. (You may be prompted for confirmation to update your manifest file; select "yes".)

```bash
npm run deploy
```

The deploy command will build all necessary files using production settings, including all server code (Google Apps Script code), client code (React bundle), and config files. All bundled files will be saved to the `dist/` folder, and then pushed to the Google Apps Script project.

Now you can open or refresh the Google Document and you should see the new menu "_tidystats_". (You can also run `npm run open` to open the document.) You can also see the uploaded Google Apps Scripts via **Tools**/**Script editor**.


### Support

Found a bug or got an idea about how to improve the add-in? Please create a [Github issue](https://github.com/gasparl/tidystats-Google-Docs-add-in/issues). If you need some help figuring out how this works, see this support [page](https://help.github.com/en/articles/creating-an-issue) by Github or simply contact Willem Sleegers on [Twitter](https://twitter.com/willemsleegers) or via [e-mail](mailto:tidystats@gmail.com).
