#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ora = require('ora');
const execa = require('execa');
const {yellow: y, green: g, dim: d} = require('chalk');
const download = require('download');
const clear = require('clear-any-console');
const checkNode = require('cli-check-node');
const handleError = require('./utils/handleError');
const printNextSteps = require('./utils/printNextSteps');
const unhandledError = require('cli-handle-unhandled');

const spinner = ora({text: ''});

(async () => {
	clear();
	unhandledError();
	checkNode('20');

	const CWD = process.cwd();
	const CWDArray = CWD.split('/');
	const installDir = CWDArray[CWDArray.length - 1];

	// Files to download from faisalahammad/WPGulp repository.
	const filesToDownload = [
		`https://raw.githubusercontent.com/faisalahammad/WPGulp/master/WPGulp/.editorconfig`,
		`https://raw.githubusercontent.com/faisalahammad/WPGulp/master/WPGulp/.eslintignore`,
		`https://raw.githubusercontent.com/faisalahammad/WPGulp/master/WPGulp/.eslintrc.js`,
		`https://raw.githubusercontent.com/faisalahammad/WPGulp/master/WPGulp/.gitignore`,
		`https://raw.githubusercontent.com/faisalahammad/WPGulp/master/WPGulp/gulpfile.babel.js`,
		`https://raw.githubusercontent.com/faisalahammad/WPGulp/master/WPGulp/package.json`,
		`https://raw.githubusercontent.com/faisalahammad/WPGulp/master/WPGulp/wpgulp.config.js`
	];

	// Dotfiles (need to be renamed with leading dot).
	const dotFiles = [
		{src: 'editorconfig', dest: '.editorconfig'},
		{src: 'eslintignore', dest: '.eslintignore'},
		{src: 'eslintrc.js', dest: '.eslintrc.js'},
		{src: 'gitignore', dest: '.gitignore'}
	];

	// Start.
	console.log();
	console.log(g(`Installing WPGulpPro in directory:`), d(installDir));
	console.log(d(`This might take a couple of minutes.\n`));

	spinner.start(`${y(`DOWNLOADING`)} WPGulp files…`);

	try {
		// Download all files.
		await Promise.all(filesToDownload.map(x => download(x, CWD)));
		spinner.succeed(`${g(`DOWNLOADED`)} WPGulp files`);

		// Rename dotfiles.
		for (const file of dotFiles) {
			const srcPath = path.join(CWD, file.src);
			const destPath = path.join(CWD, file.dest);
			if (fs.existsSync(srcPath)) {
				await fs.promises.rename(srcPath, destPath);
			}
		}

		// Install dependencies.
		spinner.start(`${y(`INSTALLING`)} npm packages…`);
		await execa('npm', ['install'], {stdio: 'inherit'});
		spinner.succeed(`${g(`INSTALLED`)} npm packages`);

		printNextSteps();
	} catch (error) {
		handleError(error);
	}
})();
