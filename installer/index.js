#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ora = require('ora');
const execa = require('execa');
const {yellow: y, green: g, dim: d, cyan: c} = require('chalk');
const download = require('download');
const clear = require('clear-any-console');
const checkNode = require('cli-check-node');
const handleError = require('./utils/handleError');
const printNextSteps = require('./utils/printNextSteps');
const unhandledError = require('cli-handle-unhandled');
const { collectPrompts } = require('./utils/collectPrompts');

const spinner = ora({text: ''});

(async () => {
	clear();
	unhandledError();
	checkNode('20');

	const CWD = process.cwd();
	const CWDArray = CWD.split('/');
	const installDir = CWDArray[CWDArray.length - 1];

	// Start.
	console.log();
	console.log(g(`WPGulpPro Installer`));
	console.log(d(`Modern Gulp workflow for WordPress\n`));

	// Interactive Prompts - BEFORE downloads
	console.log(y(`Let's configure your project:`));
	console.log();

	const userConfig = await collectPrompts(installDir);

	// Show summary and confirm
	console.log();
	console.log(g(`Project Summary:`));
	console.log(d(`─────────────────`));
	console.log(`  Name:        ${c(userConfig.projectName)}`);
	console.log(`  Description: ${d(userConfig.description)}`);
	console.log(`  Author:      ${d(userConfig.author || 'Not specified')}`);
	console.log(`  JS Dir:      ${c(userConfig.jsDir)}`);
	console.log(`  CSS Dir:     ${c(userConfig.cssDir)}`);
	console.log(`  Sourcemaps:  ${userConfig.sourceMaps ? g('yes') : d('no')}`);
	console.log(`  RTL:         ${userConfig.rtl ? g('yes') : d('no')}`);
	console.log();

	const { confirm } = await require('prompts')([{
		type: 'confirm',
		name: 'confirm',
		message: 'Proceed with installation?',
		initial: true
	}]);

	if (!confirm) {
		console.log(d('\nInstallation cancelled.'));
		process.exit(0);
	}

	console.log();

	// Files to download from faisalahammad/WPGulpPro repository.
	const filesToDownload = [
		`https://raw.githubusercontent.com/faisalahammad/WPGulpPro/master/WPGulpPro/.editorconfig`,
		`https://raw.githubusercontent.com/faisalahammad/WPGulpPro/master/WPGulpPro/.eslintignore`,
		`https://raw.githubusercontent.com/faisalahammad/WPGulpPro/master/WPGulpPro/.eslintrc.js`,
		`https://raw.githubusercontent.com/faisalahammad/WPGulpPro/master/WPGulpPro/.gitignore`,
		`https://raw.githubusercontent.com/faisalahammad/WPGulpPro/master/WPGulpPro/gulpfile.babel.js`,
		`https://raw.githubusercontent.com/faisalahammad/WPGulpPro/master/WPGulpPro/wpgulp.config.js`
	];

	// Dotfiles (need to be renamed with leading dot).
	const dotFiles = [
		{src: 'editorconfig', dest: '.editorconfig'},
		{src: 'eslintignore', dest: '.eslintignore'},
		{src: 'eslintrc.js', dest: '.eslintrc.js'},
		{src: 'gitignore', dest: '.gitignore'}
	];

	console.log(d(`This might take a couple of minutes.\n`));

	spinner.start(`${y(`DOWNLOADING`)} WPGulpPro files…`);

	try {
		// Download all files (except package.json - we'll generate it).
		await Promise.all(filesToDownload.map(x => download(x, CWD)));
		spinner.succeed(`${g(`DOWNLOADED`)} WPGulpPro files`);

		// Rename dotfiles.
		for (const file of dotFiles) {
			const srcPath = path.join(CWD, file.src);
			const destPath = path.join(CWD, file.dest);
			if (fs.existsSync(srcPath)) {
				await fs.promises.rename(srcPath, destPath);
			}
		}

		// Generate custom package.json based on user input.
		spinner.start(`${y(`GENERATING`)} package.json…`);
		const { generatePackageJson } = require('./utils/collectPrompts');
		const packageJsonContent = generatePackageJson(userConfig);
		await fs.promises.writeFile(
			path.join(CWD, 'package.json'),
			packageJsonContent,
			'utf8'
		);
		spinner.succeed(`${g(`GENERATED`)} package.json`);

		// Generate custom wpgulp.config.js based on user input.
		spinner.start(`${y(`GENERATING`)} wpgulp.config.js…`);
		const { generateConfigContent } = require('./utils/collectPrompts');
		const configContent = generateConfigContent(userConfig);
		await fs.promises.writeFile(
			path.join(CWD, 'wpgulp.config.js'),
			configContent,
			'utf8'
		);
		spinner.succeed(`${g(`GENERATED`)} wpgulp.config.js`);

		// Install dependencies.
		spinner.start(`${y(`INSTALLING`)} npm packages…`);
		await execa('npm', ['install'], {stdio: 'inherit'});
		spinner.succeed(`${g(`INSTALLED`)} npm packages`);

		// Save telemetry config if enabled.
		if (userConfig.telemetry) {
			const configData = {
				telemetry: true,
				telemetryId: 'wppt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
				firstInstall: new Date().toISOString(),
				projectName: userConfig.projectName
			};
			await fs.promises.writeFile(
				path.join(CWD, '.wpgulppro-config.json'),
				JSON.stringify(configData, null, '\t'),
				'utf8'
			);
		}

		printNextSteps();
	} catch (error) {
		handleError(error);
	}
})();
