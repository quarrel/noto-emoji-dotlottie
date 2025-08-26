# Noto Emoji Animations in .lottie Format

This repository provides a simple way to download the latest animated emoji from the [Noto Emoji Animation project](https://googlefonts.github.io/noto-emoji-animation/) and convert them into both individual `.lottie` files and a single combined `all.lottie` file.

The primary goal of this project is to make these excellent, open-licensed animations easily accessible in the modern [dotLottie](https://dotlottie.io/) / `.lottie` format, along with the Google provided Lottie `.json` files.

All files that the scripts below generate are included for conveniance.

See:

-   `noto-anim-lottie.json/`
-   `noto-anim.lottie/`

## Features

-   Downloads all available animated Noto emojis from the official source.
-   Converts each emoji into an individual `.lottie` file.
-   Creates a single, combined `all.lottie` file containing all animations, with each emoji accessible by its codepoint `id`.
-   Provides a command-line interface for flexible conversion options.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or later)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)
-   [curl](https://curl.se/)
-   [jq](https://stedolan.github.io/jq/)

## Usage

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/quarrel/noto-emoji-dotlottie.git
    cd noto-emoji-dotlottie
    ```

2.  **Run the download and build script:**

    ```bash
    ./download_noto.sh
    ```

    This script will:

    1.  Fetch the list of all available animations.
    2.  Download the source `.json` for each animation into the `noto-anim-lottie.json/` directory.
    3.  Install the necessary Node.js dependencies.
    4.  Run the conversion process to generate the `.lottie` files.

## Output

After the script completes, the generated files will be available in the `noto-anim.lottie/` directory:

```
noto-anim.lottie/
├── 1f192.lottie
├── 1f193.lottie
├── ...
└── all.lottie
```

-   **Individual files:** Each `.lottie` file (e.g., `1f192.lottie`) contains a single emoji animation.
-   **Combined file:** `all.lottie` is a single file that includes all 700+ animations. This is useful for applications that can handle multi-animation `.lottie` files, allowing you to load all emojis at once and select them by their codepoint `id`. The combined file size is approximately 9 MB.

## CLI Usage

The `dotlottie-cli.js` script can also be used directly for more control over the conversion process.

### Options

-   `--input <directory>`: (Required) The directory containing the source Lottie `.json` files.
-   `--output <directory>`: The directory where the output `.lottie` files will be saved. Defaults to `./build`.
-   `--each`: Generate an individual `.lottie` file for each input `.json` file.
-   `--all`: Generate a single, combined `all.lottie` file.

### Example

```bash
node dotlottie-cli.js --input noto-anim-lottie.json --output noto-anim.lottie --each --all
```

## License

The animated Noto Emoji are licensed under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

The code in this repository is licensed under the MIT License.
