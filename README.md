# Firefighter Museum - Static Website

A static version of the firefighter museum kiosk website, ready for deployment on GitHub Pages.

## Overview

This is a pure HTML/CSS/JavaScript static website featuring:
- Interactive Luxembourg canton map
- Multi-language support (French, German, Luxembourgish, English)
- Media galleries for photos, articles, and videos organized by canton
- Carousel navigation with swipe gestures and keyboard controls
- PDF viewer with zoom functionality
- Modal image/video viewer with zoom and pan

## Structure

```
/firefighter_museum_static
├── index.html          # Main HTML file
├── style.css           # Styles
├── script.js           # Application logic with embedded content data
└── /assets
    ├── /images         # Background and card images
    ├── /photos         # Photo galleries by canton
    ├── /articles       # Article PDFs and images by canton
    └── /videos         # Videos by canton
```

## Deployment

### GitHub Pages

1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select  branch: `main` and folder: `/ (root)`
5. Save and wait for deployment

Your site will be available at: `https://yourusername.github.io/repository-name/`

### Local Testing

Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari).

**Note**: Some browsers may block local file access to media files. Use a local web server for testing:

```bash
# Python 3
python -m http.server 8000

# Node.js (using npx)
npx http-server

# Visit http://localhost:8000
```

## Content Management

The website automatically detects content added to the `assets/` subdirectories.

### Adding New Content (Two Methods)

#### Option 1: Via GitHub (Recommended)
1. **Upload files** directly to the appropriate folder in your GitHub repository:
   - `assets/photos/<canton>/`
   - `assets/articles/<canton>/`
   - `assets/videos/<canton>/`
2. **Wait ~30 seconds**: A GitHub Action will automatically run, detect your new files, and update the website configuration.
3. **Done!** Your changes will appear on the live site.

#### Option 2: Local Development
If you are running the site locally:
1. Add files to the `assets/` folders.
2. Run the build script:
   ```bash
   npm run build
   # or
   node generate-content.js
   ```
3. Commit and push your changes (including the updated `assets/content.json`).

### File Organization
**Important:** All canton folders must be **lowercase** (e.g., `assets/photos/clervaux/`, not `Clervaux`).

- **Photos**: JPG, JPEG, PNG, WEBP
- **Articles**: PDF, JPG images of articles
- **Videos**: MP4, WEBM

### Carousel Features
- **Robust Centering**: Always keeps the active item centered.
- **Autoplay**: 5-second interval, pauses on interaction.
- **Duplicate Prevention**: No ghost frames or duplicate items in view.
- **Touch Support**: Swipe to navigate.
- **Zoom**: Click any item to inspect in high detail.

### User-Facing
- ✅ Language selection
- ✅ Interactive canton map
- ✅ Carousel with infinite scroll
- ✅ Arrow navigation buttons
- ✅ Swipe/drag gesture support
- ✅ Keyboard navigation (arrow keys)
- ✅ PDF rendering via pdf.js
- ✅ Modal zoom (1x → 2x → 4x)
- ✅ Video playback support

### Removed (Admin Features)
- ❌ Content upload functionality
- ❌ Delete buttons
- ❌ Edit mode
- ❌ Admin PIN authentication
- ❌ Background image upload
- ❌ Database/API dependencies
- ❌ Node.js/Express server
- ❌ SQLite database

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Touch gesture support

## Technical Details

- **No build process required** - pure static HTML/CSS/JS
- **No server dependencies** - runs entirely client-side
- **External CDN dependencies**:
  - Google Fonts (Inter, Oswald)
  - PDF.js v3.11.174 for PDF rendering
- **Total size**: ~35MB (mostly media files)

## Future Content Updates

To add/modify content:
1. Add media files to appropriate `assets/` subdirectory
2. Update the `STATIC_CONTENT` object in `script.js`
3. Follow the existing data structure format

## License

Internal museum project - All rights reserved.
