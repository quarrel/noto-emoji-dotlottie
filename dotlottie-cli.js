#!/usr/bin/env node

import { DotLottie } from '@dotlottie/dotlottie-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ProgressBar from 'cli-progress';

async function main() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Parse CLI args
    const args = process.argv.slice(2);
    const argMap = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith('--')) {
            const key = arg.substring(2);
            if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
                argMap[key] = args[i + 1];
                i++;
            } else {
                argMap[key] = true;
            }
        }
    }

    const INPUT_DIR = argMap.input;
    const OUTPUT_DIR = argMap.output || './build';
    const CREATE_EACH = 'each' in argMap;
    const CREATE_ALL = 'all' in argMap;

    if (!INPUT_DIR) {
        console.error('❌ --input is required');
        process.exit(1);
    }

    if (!CREATE_EACH && !CREATE_ALL) {
        console.warn('⚠️ Use --each, --all or both.');
        process.exit(0);
    }

    if (!fs.existsSync(INPUT_DIR)) {
        console.error(`❌ Input directory not found: ${INPUT_DIR}`);
        process.exit(1);
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log(`📁 Input: ${path.resolve(INPUT_DIR)}`);
    console.log(`📁 Output: ${path.resolve(OUTPUT_DIR)}`);
    console.log(
        `⚙️  Options: ${CREATE_EACH ? 'individual ' : ''}${
            CREATE_ALL ? 'combined' : ''
        }`
    );
    console.log('');

    const files = fs
        .readdirSync(INPUT_DIR)
        .filter((file) => path.extname(file).toLowerCase() === '.json')
        .sort();

    console.log(`📦 Found ${files.length} Lottie JSON files.\n`);

    const multiBar = new ProgressBar.MultiBar(
        {
            clearOnComplete: false,
            hideCursor: true,
            format: '{bar} | {percentage}% | {value}/{total} | {name}',
        },
        ProgressBar.Presets.shades_classic
    );

    if (CREATE_EACH) {
        const bar = multiBar.create(files.length, 0, {
            name: 'Individual files',
        });

        const promises = files.map(async (file) => {
            const baseName = path.basename(file, '.json');
            const inputPath = path.join(INPUT_DIR, file);
            const outputPath = path.join(OUTPUT_DIR, `${baseName}.lottie`);

            try {
                const rawData = fs.readFileSync(inputPath, 'utf-8');
                const jsonData = JSON.parse(rawData);

                if (typeof jsonData !== 'object' || !('v' in jsonData)) {
                    throw new Error('Invalid Lottie JSON (missing "v" field)');
                }

                const dotLottie = new DotLottie();

                dotLottie.manifest.author = 'Noto Project';
                dotLottie.manifest.version = '1.0';

                dotLottie.addAnimation({
                    id: baseName,
                    data: structuredClone(jsonData),
                });

                await dotLottie.build();
                const uint8Array = await dotLottie.toArrayBuffer();

                fs.writeFileSync(outputPath, Buffer.from(uint8Array));
            } catch (err) {
                console.error(`❌ ${file}: ${err.message}`);
            } finally {
                bar.increment();
            }
        });

        await Promise.all(promises);

        multiBar.remove(bar);
        console.log('');
    }

    if (CREATE_ALL) {
        const bar = multiBar.create(files.length, 0, {
            name: 'Building all.lottie',
        });

        const dotLotties = [];

        for (const file of files) {
            const baseName = path.basename(file, '.json');
            const inputPath = path.join(INPUT_DIR, file);

            try {
                const jsonData = JSON.parse(
                    fs.readFileSync(inputPath, 'utf-8')
                );
                if (typeof jsonData !== 'object' || !('v' in jsonData)) {
                    throw new Error('Invalid structure');
                }

                const dotLottie = new DotLottie();
                dotLottie.addAnimation({
                    id: baseName,
                    data: structuredClone(jsonData),
                });
                dotLotties.push(dotLottie);
            } catch (err) {
                console.error(`❌ Failed to load ${file}: ${err.message}`);
            } finally {
                bar.increment();
            }
        }

        if (dotLotties.length === 0) {
            console.error('❌ No valid animations to bundle.');
            process.exit(1);
        }

        try {
            const author = 'Google Inc. Noto Animated Emoji Project';
            const version = '1.0';
            const description = `Bundle of ${dotLotties.length} emoji animations`;

            const mergedDotLottie = await new DotLottie().merge(...dotLotties);

            mergedDotLottie.manifest.author = author;
            mergedDotLottie.manifest.version = version;
            mergedDotLottie.manifest.description = description;

            await mergedDotLottie.build();
            const uint8Array = await mergedDotLottie.toArrayBuffer();

            const outputPath = path.join(OUTPUT_DIR, 'all.lottie');
            fs.writeFileSync(outputPath, Buffer.from(uint8Array));

            const sizeKB = (uint8Array.byteLength / 1024).toFixed(1);
            console.log(`\n✅ Created all.lottie (${sizeKB} KB)\n`);
        } catch (err) {
            console.error('❌ Failed to build all.lottie:', err.message);
            process.exit(1);
        }

        multiBar.remove(bar);
        console.log('');
    }

    multiBar.stop();
    console.log('🎉 Done!');
}

main().catch((err) => {
    console.error('An unexpected error occurred:', err);
    process.exit(1);
});
