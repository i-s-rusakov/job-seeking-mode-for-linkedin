# Job Seeking Mode for LinkedIn

A powerful browser extension and userscript that declutters your LinkedIn feed by hiding all posts except those advertising open vacancies. Keep your feed clean and focused purely on job opportunities from your connections and followed companies.

## Features

- **Vacancy Filtering:** Automatically detects and shows posts containing job opportunity keywords while hiding everything else.
- **Multilingual Support:** Scans for keywords in English, Russian, Spanish, German, French, and Chinese.
- **Smart Detection:** Uses advanced keyword matching (positive and negative keywords) to avoid false positives.
- **Performance Optimized:** Uses native `MutationObserver` to process feed items dynamically without slowing down the page.
- **Toggleable UI:** Clean native settings menu to easily switch UI language and toggle which languages to filter for.

## Installation

You can use Job Seeking Mode either as a standalone Chrome Extension or as a Userscript (via Tampermonkey).

### Option 1: Userscript (Recommended for Firefox/Safari/Edge users)

1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/).
2. Click the link below to install the script directly:
   **[Install Job Seeking Mode Userscript](https://raw.githubusercontent.com/i-s-rusakov/job-seeking-mode-for-linkedin/master/userscript/job-seeking-mode-for-linkedin.user.js)**
3. The script will automatically update whenever a new version is released here on GitHub.
4. To configure settings, click the Tampermonkey extension icon while on LinkedIn and select **Language Settings**.

### Option 2: Chrome Extension (Recommended for Chrome users)

*Note: The extension is currently pending review on the Chrome Web Store. For now, you can load it manually.*

1. Download or clone this repository to your computer.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top right corner.
4. Click **Load unpacked** in the top left corner.
5. Select the `extension` folder from the downloaded repository.
6. Pin the extension to your toolbar. Click the briefcase icon to open the settings menu.

## How it Works

The script operates entirely locally in your browser. It does not send any data to external servers. When you scroll through LinkedIn, it checks the text of each new post against a carefully curated dictionary of vacancy-related keywords (e.g., "hiring", "looking for", "вакансия", "ищем"). If a match is found, the post remains visible. If no match is found, the post is visually collapsed (with a button to expand it if you wish to read it anyway).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
