const fs = require('fs');
const path = require('path');

// All 12 cantons in Luxembourg
const CANTONS = [
    'capellen',
    'clervaux',
    'diekirch',
    'echternach',
    'esch-sur-alzette',
    'grevenmacher',
    'luxembourg',
    'mersch',
    'redange',
    'remich',
    'vianden',
    'wiltz'
];

const MODES = ['photos', 'articles', 'videos'];

// File extension to type mapping
const FILE_TYPES = {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG'],
    pdf: ['.pdf', '.PDF'],
    video: ['.mp4', '.webm', '.ogg', '.MP4', '.mov', '.MOV']
};

function getFileType(filename) {
    const ext = path.extname(filename);

    if (FILE_TYPES.image.includes(ext)) return 'image';
    if (FILE_TYPES.pdf.includes(ext)) return 'pdf';
    if (FILE_TYPES.video.includes(ext)) return 'video';

    return 'unknown';
}

function scanDirectory(dirPath) {
    const files = [];

    try {
        if (!fs.existsSync(dirPath)) {
            return files;
        }

        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isFile()) {
                const type = getFileType(entry.name);
                if (type !== 'unknown') {
                    files.push({
                        fileName: entry.name,
                        type: type
                    });
                }
            }
        }
    } catch (err) {
        console.warn(`Warning: Could not read directory ${dirPath}:`, err.message);
    }

    return files;
}

function generateContentManifest() {
    const content = {};
    let totalFiles = 0;
    let idCounter = 1;

    console.log('🔍 Scanning asset directories...\n');

    // For each canton
    for (const canton of CANTONS) {
        content[canton] = {
            photos: [],
            articles: [],
            videos: []
        };

        // For each mode (photos, articles, videos)
        for (const mode of MODES) {
            const dirPath = path.join(__dirname, 'assets', mode, canton);
            const files = scanDirectory(dirPath);

            // Convert to content format
            for (const file of files) {
                const item = {
                    id: idCounter++,
                    type: file.type,
                    src: `assets/${mode}/${canton}/${file.fileName}`,
                    fileName: file.fileName,
                    isImage: file.type === 'image',
                    isPdf: file.type === 'pdf',
                    isVideo: file.type === 'video'
                };

                content[canton][mode].push(item);
                totalFiles++;
                console.log(`✓ Found: ${canton}/${mode}/${file.fileName} (${file.type})`);
            }
        }
    }

    console.log(`\n✅ Total files found: ${totalFiles}`);
    return content;
}

function writeManifest(content) {
    const outputPath = path.join(__dirname, 'assets', 'content.json');

    try {
        // Ensure assets directory exists
        const assetsDir = path.join(__dirname, 'assets');
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }

        // Write JSON file with pretty formatting
        fs.writeFileSync(outputPath, JSON.stringify(content, null, 2), 'utf8');
        console.log(`\n📝 Content manifest written to: ${outputPath}`);

        return true;
    } catch (err) {
        console.error(`❌ Error writing manifest:`, err.message);
        return false;
    }
}

// Main execution
console.log('🚀 Firefighter Museum - Content Manifest Generator\n');
console.log('='.repeat(60));

const content = generateContentManifest();
const success = writeManifest(content);

console.log('='.repeat(60));

if (success) {
    console.log('\n✅ Content manifest generated successfully!');
    console.log('\nNext steps:');
    console.log('  1. Review assets/content.json');
    console.log('  2. Test the website locally');
    console.log('  3. Commit and push to GitHub');
    process.exit(0);
} else {
    console.log('\n❌ Failed to generate manifest');
    process.exit(1);
}
