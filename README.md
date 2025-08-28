# Noto Emoji Animations in .lottie Format

This repository provides a simple way to download the latest animated emoji from the [Noto Emoji Animation project](https://googlefonts.github.io/noto-emoji-animation/) and convert them into both individual `.lottie` files and a single combined `all.lottie` file.

The primary goal of this project is to make these excellent, open-licensed animations easily accessible in the modern [dotLottie](https://dotlottie.io/) / `.lottie` format, along with the Google-provided Lottie `.json` files.

Despite Google's generosity with the license and maintenance of these animations, finding an easy source of the collected original `.json` was surprisingly hard. Finding a source of these in the modern compressed `.lottie` format was a lesson in frustration, with lots of people gatekeeping them behind paywalls or outright selling bundles of some of them for large amounts. It was disappointing to see these resold as "Premium" assets by some of the big players in the space.

## Download

A `.zip` of the original Lottie `.json` files that Google provides:

-   [noto-anim-lottie.json.zip](https://downgit.github.io/#/home?url=https://github.com/quarrel/noto-emoji-dotlottie/tree/main/noto-anim-lottie.json)

A `.zip` of the individual files above converted to [dotLottie](https://dotlottie.io/) / `.lottie`:

-   [noto-anim.lottie.zip](https://downgit.github.io/#/home?url=https://github.com/quarrel/noto-emoji-dotlottie/tree/main/noto-anim.lottie)

Or `all.lottie` as a single file that includes all 700+ animations. This is useful for applications that can handle multi-animation `.lottie` files, allowing you to load all emojis at once and select them by their codepoint `id`. The combined file size is approximately 9 MB.

-   [all.lottie](https://github.com/quarrel/noto-emoji-dotlottie/raw/refs/heads/main/noto-anim.lottie/all.lottie)

If you are after specific emoji, these directories have them with 1 file per Unicode codepoint. If you search the [Animated Emoji](https://googlefonts.github.io/noto-emoji-animation/) page, it will show you the codepoint for any individual emoji.

-   [noto-anim-lottie.json/](./noto-anim-lottie.json/)
-   [noto-anim.lottie/](./noto-anim.lottie/)

## Build this for yourself

⚠️ This was quickly hacked together and worked, but is probably brittle. ⚠️

### Steps:

-   Downloads all available animated Noto emojis from the official source as `.json`.
-   Converts each emoji into an individual `.lottie` file.
-   Creates a single, combined `all.lottie` file containing all animations, with each emoji accessible by its codepoint `id`.
-   Provides a command-line interface for flexible conversion options.

## Prerequisites

-   [Node.js](https://nodejs.org/)
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

-   **Individual files:** Each `.lottie` file (e.g., 🆒 `1f192.lottie`) contains a single emoji animation.
-   **Combined file:** `all.lottie`

## CLI Usage

The `dotlottie-cli.js` script can also be used directly for more control over the conversion process.

### Options

-   `--input <directory>`: (Required) The directory containing the source Lottie `.json` files.
-   `--output <directory>`: The directory where the output `.lottie` files will be saved. Defaults to `./build`.
-   `--each`: Generate an individual `.lottie` file for each input `.json` file.
-   `--all`: Generate a single, combined `all.lottie` file. With the emoji codepoint as the `id` to reference them.

### Example

```bash
node dotlottie-cli.js --input noto-anim-lottie.json --output noto-anim.lottie --each --all
```

## License

The animated Noto Emoji are licensed under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode).

The code in this repository is licensed under the MIT License.
