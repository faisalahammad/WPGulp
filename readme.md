<div align="center">

  <small><p><em>📟 Learn to <a href="https://nodecli.com/?utm_source=github.com&utm_medium=referral&utm_campaign=faisalahammad/WPGulp" rel="nofollow">build CLI DevTools</a>, like WPGulp with me at <a href="https://nodecli.com/?utm_source=github.com&utm_medium=referral&utm_campaign=faisalahammad/WPGulp">NodeCLI.com</a>.</em></p></small>

  <img src="https://a.cl.ly/o0uy14NY/c" alt="WP Gulp · WordPress Gulp" />

  <h1><code>WordPress Gulp Workflow</code></h1>

[![GitHub](https://img.shields.io/wordpress/v/akismet.svg?colorA=D14543&colorB=21759B&maxAge=2592000&style=flat&label=WordPress)](https://github.com/faisalahammad/WPGulp/)
[![emoji-log](https://img.shields.io/badge/🚀%20Emoji-Log-gray.svg?colorA=D14543&colorB=21759B&style=flat)](https://github.com/ahmadawais/Emoji-Log/) [![GitHub stars](https://img.shields.io/github/stars/faisalahammad/WPGulp.svg?style=social&label=Stars)](https://github.com/faisalahammad/WPGulp/stargazers) [![GitHub followers](https://img.shields.io/github/followers/faisalahammad.svg?style=social&label=Follow)](https://github.com/faisalahammad?tab=followers)  [![Tweet for help](https://img.shields.io/twitter/follow/faisalahammad.svg?style=social&label=Tweet%20@faisalahammad)](https://twitter.com/faisalahammad/) [![VSCode.pro](https://img.shields.io/badge/Supported%20by-VSCode%20Power%20User%20Course%20%E2%86%92-gray.svg?colorA=D14543&colorB=21759B)](https://VSCode.pro "This open source project is supported by VSCode.pro")

</div>

<table width='100%' align="center">
    <tr>
        <td align='left' width='100%' colspan='2'>
            <strong>WPGulpPro (WordPress Gulp)</strong><br />
            🎯 An advanced & extensively documented Gulp WordPress workflow. Kick-start a build-workflow for your WordPress plugins and themes with Gulp.
            <br/><br/>
            🔥 <strong>Node 20/22/24 LTS Compatible</strong>
        </td>
    </tr>
    <tr>
        <td>
            A FOSS (Free & Open Source Software) project. Maintained by <a href='https://github.com/faisalahammad'>@faisalahammad</a>.
        </td>
        <td align='center'>
            <a href='https://twitter.com/faisalahammad/'>
                <img src='https://img.shields.io/badge/→-FAISAL%20AHMAD-gray.svg?colorA=D14543&colorB=21759B&style=flat' width='150' />
            </a>
        </td>
    </tr>
</table>

<br>

## 📦 WPGulpPro Can Do `THAT™`

`WPGulpPro` is an advanced & extensively documented `Gulp.js` + `WordPress` workflow. It can help you kick-start a build-workflow for your WordPress plugins and themes with `Gulp.js`, save you a lot of grunt work time, follow the DRY (Don't Repeat Yourself) principle, and `#0CJS` Zero-config JavaScript startup but still configurable via `wpgulp.config.js` file. It is:

- 🥞 Versioned ✓
- 🤠 Updatable ✓
- 🗃 Set of sane-defaults ✓
- 🔥 Node 20/22/24 Compatible ✓

<br>

💻 **DEV ENVIRONMENT**

>- _Live reload browser with BrowserSync_
>- _Hotloading styles with CSS Injection_

🎨 **STYLES**

>- _Sass to CSS conversion (Dart Sass)_
>- _Merging media queries_
>- _Error handling_
>- _Auto-prefixing_
>- _Minification_
>- _Sourcemaps_

🌋 **JavaScript**

>- _Concatenation_
>- _Minification/uglification_
>- _Babel transpilation for ESNext_
>- _Separate vendor and custom JS files handling_

🌁 **IMAGES**

>- _Minification/optimization of images_
>- _File types: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`_

💯 **TRANSLATION**

>- _Generates `.pot` translation file for i18n and l10n_

👀 **WATCHING**

>- _For changes in files to recompile_
>- _File types: `.css`, `.html`, `.php`, `.js`_

<br>

![Start](https://a.cl.ly/83f7dd38eb83/c)

## Getting Started

#### ⚡️ Quick Overview

Run step `#1`, `#2`, and `#3` quickly in one go — Run inside local WP install's theme/plugin folder E.g. `/wp.local/wp-content/plugins/your-plugin` or `/wp.local/wp-content/themes/your-theme` directory.

```sh
# 1— Install WPGulpPro in your WordPress theme/plugin.
npx wpgulppro
# 2— Now configure variables inside the `wpgulp.config.js` file.
# 3— Start your npm build workflow.
npm start
```

([npx](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner) is a package runner tool that comes with npm 5.2+ and higher).

> 🎛   _If you want to study the detailed installation of step `#1` , `#2`,  and `#3` — then take a look at the steps below_.

<br>
<details>
 <summary><strong><code>STEP #0</code></strong> — Don't have <code>Node.js</code> + <code>npm</code> installed? Read this. (CLICK TO EXPAND!)</summary>

In case you are an absolute beginner to the world of `Node.js`, JavaScript, and `npm` packages — all you need to do is go to the Node's site [download + install](https://nodejs.org/en/download/) Node on your system. This will install both `Node.js` and `npm`, i.e., node package manager — the command line interface of Node.js.

You can verify the install by opening your terminal app and typing...

```sh
node -v
# Results into v20.0.0 or higher — make sure you have Node >= 20 installed.

npm -v
# Results into 10.0.0 or higher — make sure you have npm >= 9 installed.
```

</details>

### → `STEP #1` — Download the Required Files

1. In the terminal go to the root folder of your WordPress plugin/theme
2. Run the following command to download all the files in the [WPGulp/src](/WPGulp) folder

_It'll take a couple of minutes to install._

```sh
npx wpgulppro
```

([npx](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner) is a package runner tool that comes with npm 5.2+ and higher).

![wpgulp install gif](https://a.cl.ly/c846c265e03a/c)

> ⚠️  I'm assuming that there are no previously present similar files in the root of your folder. Otherwise, you need to merge these very carefully. E.g. You can include the `scripts`, `devDependencies` in your current `package.json` file and so on for other files. If you run the above command all similar files will be overwritten.

### → `STEP #2` — Editing the Project Variables

Configure the project paths and other variables inside the `wpgulp.config.js` file. This is a compulsory step.

![wpgulp config](https://a.cl.ly/f2ca9bb4a740/c)

### → `STEP #3` — Start your project

Once the installation is done, you can open your project (WordPress plugin/theme) folder and run the start script.

```sh
npm start

# To stop press CTRL (⌃) + C
```

![wpgulp start](https://a.cl.ly/d64abd87de1f/c)

### → `OPTIONAL STEP #4` — More Scripts/Tasks

To optimize images and generate WP POT translation file, or generate a RTL stylesheet you can run the following commands

```sh
# To optimize images.
npm run images

# To generate WP POT translation file.
npm run translate

# To generate RTL stylesheets and Sourcemap.
npm run styles-rtl

# To generate theme/plugin zip file without extranious files.
npm run zip
```

<br>

![Update](https://a.cl.ly/d0b586da13cc/c)

## How to Update?

1. Download all the latest files in the [WPGulp/src](/WPGulp) folder inside the root folder of your WordPress plugin/theme by running `npx wpgulppro` it will overwrite all the wpgulp files.
2. Open terminal and Install WPGulp's node dependencies by running the `npm install` commands in the root folder of your WordPress plugin/theme.

<br>

![Log](https://a.cl.ly/61b20ca44b08/c)

## Changelog

Read what's 📦 new, 👌 improved, 🐛 fixed, and if 📖 docs got updated.

👉 Go read the entire changelog at this link — [WPGulpPro Changelog →](/changelog.md)

Nothing's ever complete, so bear with us while we keep iterating towards a better future.

> ```html
> 'Coz every night I lie in bed
> The brightest colors fill my head
> A million dreams are keeping me awake
> I think of what the world could be
> A vision of the one I see
> A million dreams is all it's gonna take
> A million dreams for the world we're gonna make ...
> ```
> ... _listen to → [A million dreams!](https://www.youtube.com/watch?v=pSQk-4fddDI)_

<br>

![Hello](https://a.cl.ly/4guJenpQ/c)

## Sponsor

This project is maintained by [Faisal Ahammad](https://twitter.com/faisalahammad/). If you or your company use any of my projects or like what I'm doing then consider backing me. I'm in this for the long run. An open-source developer advocate.

[![Faisal on Twitter](https://img.shields.io/twitter/follow/faisalahammad.svg?style=social&label=Follow%20@faisalahammad)](https://twitter.com/faisalahammad/)

[![Awais on Twitter](https://raw.githubusercontent.com/ahmadawais/stuff/master/sponsor/sponsor.jpg)](https://github.com/AhmadAwais/sponsor)

### 🙌 [THEDEVCOUPLE PARTNERS](https://TheDevCouple.com/partners)

This open source project is supported by the help of awesome businesses listed below. What? [Read more about it →](https://TheDevCouple.com/partners)

<table width='100%'>
	<tr>
		<td width='500'><a target='_blank' href='https://kinsta.com/?kaid=WMDAKYHJLNJX&utm_source=TheDevCouple&utm_medium=Partner'><img src='https://a.cl.ly/4guJenp9' /></a>
		<td width='500'><a target='_blank' href='https://ipapi.com/?utm_source=TheDevCouple&utm_medium=Partner'><img src='https://a.cl.ly/z8uYQO2O'/></a></td>
	</tr>
</table>
<br>

![Update](https://a.cl.ly/NQu1joGO)

## License & Attribution

MIT © [Faisal Ahammad](https://twitter.com/faisalahammad/).

This project is a modernized fork of [ahmadawais/WPGulp](https://github.com/ahmadawais/WPGulp) — inspired by the work of many awesome developers especially those who contribute to this project, Gulp.js, Babel, and many other dependencies as listed in the `package.json` file. FOSS (Free & Open Source Software) for the win.

[<img alt="faisalahammad" src="https://avatars1.githubusercontent.com/u/960133?v=4&s=117" width="117">](https://github.com/faisalahammad) |[<img alt="ahmadawais" src="https://avatars1.githubusercontent.com/u/960133?v=4&s=117" width="117">](https://github.com/ahmadawais) |[<img alt="MaedahBatool" src="https://avatars2.githubusercontent.com/u/12712988?v=4&s=117" width="117">](https://github.com/MaedahBatool) |
:---: |:---: |:---: |
[faisalahammad](https://github.com/faisalahammad) |[ahmadawais](https://github.com/ahmadawais) |[MaedahBatool](https://github.com/MaedahBatool) |

[![Faisal on Twitter](https://img.shields.io/twitter/follow/faisalahammad.svg?style=social&label=Follow%20@faisalahammad)](https://twitter.com/faisalahammad/)

[n]: https://nodecli.com/?utm_source=github.com&utm_medium=referral&utm_campaign=faisalahammad/WPGulp
