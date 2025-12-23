/* script.js - Firefighter Museum Kiosk - STATIC VERSION */

// ==================== DYNAMIC CONTENT DATA ====================
// Content loaded from generated manifest file
let contentData = {};

// Load content manifest from JSON file
async function loadContentManifest() {
    try {
        const response = await fetch('assets/content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        contentData = await response.json();
        console.log('✅ Content manifest loaded successfully');
        console.log(`📊 Total cantons with content: ${Object.keys(contentData).length}`);
        return contentData;
    } catch (error) {
        console.error('❌ Failed to load content manifest:', error);
        console.warn('Using empty content data');
        // Initialize empty structure for all cantons if fetch fails
        contentData = {
            "capellen": { "photos": [], "articles": [], "videos": [] },
            "clervaux": { "photos": [], "articles": [], "videos": [] },
            "diekirch": { "photos": [], "articles": [], "videos": [] },
            "echternach": { "photos": [], "articles": [], "videos": [] },
            "esch-sur-alzette": { "photos": [], "articles": [], "videos": [] },
            "grevenmacher": { "photos": [], "articles": [], "videos": [] },
            "luxembourg": { "photos": [], "articles": [], "videos": [] },
            "mersch": { "photos": [], "articles": [], "videos": [] },
            "redange": { "photos": [], "articles": [], "videos": [] },
            "remich": { "photos": [], "articles": [], "videos": [] },
            "vianden": { "photos": [], "articles": [], "videos": [] },
            "wiltz": { "photos": [], "articles": [], "videos": [] }
        };
        return contentData;
    }
}

// ==================== STATE ====================
const state = {
    currentLang: 'fr',
    currentMode: null,
    currentCanton: null,
    translations: {
        'fr': {
            homeTitle: 'Bienvenue sur le site du musée des pompiers',
            cardPhotosTitle: 'Photos', cardPhotosDesc: 'Explorez notre galerie',
            cardArticlesTitle: 'Articles', cardArticlesDesc: 'Découvrez nos archives',
            cardVideosTitle: 'Vidéos', cardVideosDesc: 'Visionnez nos reportages',
            btnBack: '← Retour', mapTitle: 'Carte du Luxembourg',
            instructionPhotos: 'Sélectionnez un canton pour voir les photos',
            instructionArticles: 'Sélectionnez un canton pour voir les articles',
            instructionVideos: 'Sélectionnez un canton pour voir les vidéos',
            btnBackToMap: '← Retour à la carte',
            modePhotos: 'Photos', modeArticles: 'Articles', modeVideos: 'Vidéos'
        },
        'de': {
            homeTitle: 'Willkommen auf der Website des Feuerwehrmuseums',
            cardPhotosTitle: 'Fotos', cardPhotosDesc: 'Erkunden Sie unsere Galerie',
            cardArticlesTitle: 'Artikel', cardArticlesDesc: 'Entdecken Sie unsere Archive',
            cardVideosTitle: 'Videos', cardVideosDesc: 'Sehen Sie sich unsere Berichte an',
            btnBack: '← Zurück', mapTitle: 'Karte von Luxemburg',
            instructionPhotos: 'Wählen Sie einen Kanton, um die Fotos zu sehen',
            instructionArticles: 'Wählen Sie einen Kanton, um die Artikel zu lesen',
            instructionVideos: 'Wählen Sie einen Kanton, um die Videos anzusehen',
            btnBackToMap: '← Zurück zur Karte',
            modePhotos: 'Fotos', modeArticles: 'Artikel', modeVideos: 'Videos'
        },
        'lb': {
            homeTitle: 'Wëllkomm op der Websäit vum Pompjeemusée',
            cardPhotosTitle: 'Fotoen', cardPhotosDesc: 'Entdeckt eis Galerie',
            cardArticlesTitle: 'Artikelen', cardArticlesDesc: 'Entdeckt eis Archiven',
            cardVideosTitle: 'Videoen', cardVideosDesc: 'Kuckt eis Reportagen',
            btnBack: '← Zréck', mapTitle: 'Kaart vu Lëtzebuerg',
            instructionPhotos: 'Wielt e Kanton fir d\'Fotoen ze gesinn',
            instructionArticles: 'Wielt e Kanton fir d\'Artikelen ze liesen',
            instructionVideos: 'Wielt e Kanton fir d\'Videoen ze kucken',
            btnBackToMap: '← Zréck op d\'Kaart',
            modePhotos: 'Fotoen', modeArticles: 'Artikelen', modeVideos: 'Videoen'
        },
        'en': {
            homeTitle: 'Welcome to the Firefighter Museum website',
            cardPhotosTitle: 'Photos', cardPhotosDesc: 'Explore our gallery',
            cardArticlesTitle: 'Articles', cardArticlesDesc: 'Discover our archives',
            cardVideosTitle: 'Videos', cardVideosDesc: 'Watch our reports',
            btnBack: '← Back', mapTitle: 'Map of Luxembourg',
            instructionPhotos: 'Select a canton to see the photos',
            instructionArticles: 'Select a canton to read the articles',
            instructionVideos: 'Select a canton to watch the videos',
            btnBackToMap: '← Back to map',
            modePhotos: 'Photos', modeArticles: 'Articles', modeVideos: 'Videos'
        }
    }
};

// ==================== DOM ELEMENTS ====================
const views = {
    home: document.getElementById('view-home'),
    map: document.getElementById('view-map'),
    details: document.getElementById('view-details')
};
const mainBg = document.getElementById('main-bg');
const langSelect = document.getElementById('lang-select');
const mapContainer = document.getElementById('luxembourg-map');
const mapInstruction = document.getElementById('map-instruction');
const carousel = document.getElementById('carousel');
const carouselWrapper = document.querySelector('.carousel-wrapper');
const detailsTitle = document.getElementById('details-title');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const closeModal = document.querySelector('.close-modal');

// ==================== CANTON DATA ====================
const cantonsList = [
    { name: 'Clervaux', top: '20%', left: '38%' },
    { name: 'Wiltz', top: '38%', left: '28%' },
    { name: 'Vianden', top: '38%', left: '52%' },
    { name: 'Diekirch', top: '48%', left: '50%' },
    { name: 'Redange', top: '54%', left: '28%' },
    { name: 'Echternach', top: '55%', left: '75%' },
    { name: 'Mersch', top: '58%', left: '50%' },
    { name: 'Grevenmacher', top: '65%', left: '75%' },
    { name: 'Capellen', top: '72%', left: '33%' },
    { name: 'Luxembourg', top: '75%', left: '55%' },
    { name: 'Remich', top: '82%', left: '68%' },
    { name: 'Esch-sur-Alzette', top: '85%', left: '40%' }
];

// ==================== CAROUSEL STATE ====================
let currentIndex = 0;
let autoScrollTimer = null;
let isTransitioning = false;

// ==================== CONTENT RETRIEVAL ====================
function getStaticContent(canton, mode) {
    const cantonKey = canton.toLowerCase().replace(/-/g, '-');
    if (contentData[cantonKey] && contentData[cantonKey][mode]) {
        return contentData[cantonKey][mode];
    }
    return [];
}

// ==================== HELPER FUNCTIONS ====================
function updateTexts() {
    const lang = state.currentLang;
    const data = state.translations[lang];

    // Update simple text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (data[key]) el.textContent = data[key];
    });

    // Update map instructions
    updateMapContext();
}

function setupLanguage() {
    langSelect.addEventListener('change', (e) => {
        state.currentLang = e.target.value;
        updateTexts();
    });
}

// ==================== INITIALIZATION ====================
async function init() {
    // Load content manifest first
    await loadContentManifest();

    // Then set up the rest of the app
    setupNavigation();
    setupLanguage();
    setupContentManager();
    updateTexts();
}

// ==================== NAVIGATION ====================
function setupNavigation() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            state.currentMode = target;
            renderMap();
            updateMapContext();
            switchView('map');
        });
    });

    document.querySelectorAll('[data-view="home"]').forEach(btn => {
        btn.addEventListener('click', () => {
            mainBg.src = 'assets/images/bg-home.jpg';
            switchView('home');
        });
    });

    document.querySelectorAll('[data-view="map"]').forEach(btn => {
        btn.addEventListener('click', () => switchView('map'));
    });

    // Handle "Retour" buttons
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentView = Array.from(Object.entries(views)).find(([name, el]) => el.classList.contains('active'));
            if (currentView) {
                const [viewName] = currentView;
                if (viewName === 'map') {
                    switchView('home');
                } else if (viewName === 'details') {
                    switchView('map');
                }
            }
        });
    });
}

function switchView(viewName) {
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[viewName].classList.add('active');
}

// ==================== MAP RENDERING ====================
function renderMap() {
    mapContainer.innerHTML = '';

    // Wrapper to ensure labels are positioned relative to the image size
    const mapWrapper = document.createElement('div');
    mapWrapper.style.position = 'relative';
    mapWrapper.style.height = '100%';
    mapWrapper.style.width = 'auto';
    mapWrapper.style.display = 'flex';
    mapWrapper.style.justifyContent = 'center';

    // Static Map Image
    const mapImg = document.createElement('img');
    mapImg.src = 'assets/images/cantons-map.png';
    mapImg.alt = 'Luxembourg Cantons Map';
    mapImg.style.height = '100%';
    mapImg.style.width = 'auto';
    mapImg.style.maxWidth = '100%';
    mapImg.style.objectFit = 'contain';

    // Fallback if image load fails
    mapImg.onerror = () => {
        mapContainer.innerHTML = '<div style="color:white;text-align:center;padding-top:40%;">Map Image Not Found.<br>Please ensure "assets/images/cantons-map.png" exists.</div>';
    };

    mapWrapper.appendChild(mapImg);
    mapContainer.appendChild(mapWrapper);

    // Render labels on top of the wrapper
    renderMapLabels(mapWrapper);
}

function renderMapLabels(targetContainer) {
    if (!targetContainer) targetContainer = mapContainer;

    // Clear previous labels
    const existingLabels = targetContainer.querySelectorAll('.canton-label');
    existingLabels.forEach(l => l.remove());

    cantonsList.forEach(c => {
        const label = document.createElement('div');
        label.className = 'canton-label';
        label.textContent = c.name;
        Object.assign(label.style, {
            position: 'absolute', top: c.top, left: c.left,
            transform: 'translate(-50%, -50%)', cursor: 'pointer',
            padding: '4px 8px', background: 'rgba(255, 255, 255, 0.4)',
            color: '#000', borderRadius: '8px', fontSize: '0.9rem',
            fontWeight: '700', textShadow: '0 0 5px white',
            zIndex: '100', transition: 'all 0.2s',
            boxShadow: 'none', border: 'none'
        });

        label.addEventListener('click', () => openCantonDetails(c.name));
        label.addEventListener('mouseenter', () => {
            label.style.transform = 'translate(-50%, -50%) scale(1.2)';
            label.style.background = 'var(--primary-red)';
            label.style.color = 'white';
            label.style.textShadow = 'none';
            label.style.zIndex = '101';
        });
        label.addEventListener('mouseleave', () => {
            label.style.transform = 'translate(-50%, -50%) scale(1)';
            label.style.background = 'rgba(255, 255, 255, 0.4)';
            label.style.color = '#000';
            label.style.textShadow = '0 0 5px white';
            label.style.zIndex = '100';
        });

        targetContainer.appendChild(label);
    });
}

function updateMapContext() {
    const langData = state.translations[state.currentLang];
    const key = 'instruction' + state.currentMode.charAt(0).toUpperCase() + state.currentMode.slice(1);
    if (langData[key]) mapInstruction.textContent = langData[key];
}

function openCantonDetails(cantonName) {
    state.currentCanton = cantonName;
    const langData = state.translations[state.currentLang];
    const modeKey = 'mode' + state.currentMode.charAt(0).toUpperCase() + state.currentMode.slice(1);
    const modeLabel = langData[modeKey] || state.currentMode;
    detailsTitle.textContent = cantonName + " - " + modeLabel;

    // Reset carousel state when switching context
    currentIndex = 0;

    loadCarouselContent();
    switchView('details');
}

// ==================== CAROUSEL LOGIC ====================

function stopAutoScroll() {
    if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
    }
}

function startAutoScroll() {
    stopAutoScroll();
    autoScrollTimer = setInterval(() => {
        // Stop at last item (Finite requirement)
        const totalItems = parseInt(carousel.dataset.realItemCount) || 0;
        if (currentIndex < totalItems - 1) {
            currentIndex++;
            updateCarousel();
        } else {
            // Stop if at end
            stopAutoScroll();
        }
    }, 4000); // 4 seconds interval
}

function updateCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track || !track.children.length) return;

    const items = Array.from(track.children);
    const firstItem = items[0];
    const itemWidth = firstItem.offsetWidth + 30; // 30 is gap
    const containerWidth = carousel.offsetWidth;
    const totalItems = items.length;

    // Bounds check
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= totalItems) currentIndex = totalItems - 1;

    // Centering Math
    const centerOffset = (containerWidth / 2) - (firstItem.offsetWidth / 2);
    const translateVal = centerOffset - (currentIndex * itemWidth);

    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    track.style.transform = `translateX(${translateVal}px)`;

    // Update Buttons State
    const btnPrev = document.querySelector('.carousel-nav-btn.prev');
    const btnNext = document.querySelector('.carousel-nav-btn.next');

    if (btnPrev) {
        if (currentIndex === 0) btnPrev.classList.add('disabled');
        else btnPrev.classList.remove('disabled');
    }

    if (btnNext) {
        if (currentIndex === totalItems - 1) btnNext.classList.add('disabled');
        else btnNext.classList.remove('disabled');
    }
}

function createCarouselItem(itemData, index, cantonName) {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.dataset.id = itemData.id;
    item.id = `carousel-item-${index}`;

    // ARIA attributes for accessibility
    item.setAttribute('role', 'listitem');
    item.setAttribute('aria-label', `Media item ${index + 1}`);

    const contentDiv = document.createElement('div');
    Object.assign(contentDiv.style, {
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#444'
    });

    if (itemData.isImage) {
        contentDiv.innerHTML = `<img src="${itemData.src}" alt="User content">`;
    } else if (itemData.isPdf) {
        const canvasId = `pdf-canvas-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        contentDiv.innerHTML = `
            <div id="loading-${canvasId}" style="position:absolute;color:white;">📄 Chargement PDF...</div>
            <canvas id="${canvasId}" style="width:100%;height:100%;object-fit:contain;position:relative;z-index:10;"></canvas>
        `;
        setTimeout(() => renderPdfToCanvas(itemData.src, canvasId), 100);
    } else if (itemData.isVideo) {
        contentDiv.innerHTML = '<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;background:#000;color:white;"><span style="font-size:4rem;">▶️</span></div>';
    } else {
        contentDiv.innerHTML = `<div style="color:red;padding:20px;">Unknown Type</div>`;
    }

    item.appendChild(contentDiv);

    // Track click vs swipe
    let itemClickStartX = 0;
    let itemClickStartY = 0;

    item.addEventListener('mousedown', (e) => {
        itemClickStartX = e.clientX;
        itemClickStartY = e.clientY;
        stopAutoScroll();
    });

    item.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
            itemClickStartX = e.touches[0].clientX;
            itemClickStartY = e.touches[0].clientY;
        }
        stopAutoScroll();
    }, { passive: true });

    item.addEventListener('click', (e) => {
        const deltaX = Math.abs(e.clientX - itemClickStartX);
        const deltaY = Math.abs(e.clientY - itemClickStartY);

        if (deltaX < 10 && deltaY < 10) {
            openModalWithData(itemData);
        }
    });

    return item;
}

function loadCarouselContent(scrollToEnd = false) {
    stopAutoScroll();
    carousel.innerHTML = '';

    const cantonName = state.currentCanton || 'Luxembourg';
    let itemsList = getStaticContent(cantonName, state.currentMode);

    if (itemsList.length === 0) {
        carousel.innerHTML = '<div style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; color:rgba(255,255,255,0.5); font-size:1.5rem;">Aucun contenu.</div>';
        return;
    }

    // Finite Loop Strategy: Just render current items.
    // No clones.
    const renderList = itemsList;

    const track = document.createElement('div');
    track.className = 'carousel-track';

    renderList.forEach((data, i) => {
        const item = createCarouselItem(data, i, cantonName);
        track.appendChild(item);
    });

    carousel.appendChild(track);

    carousel.dataset.realItemCount = renderList.length;

    // Start at 0
    currentIndex = 0;

    setTimeout(() => {
        updateCarousel();
        startAutoScroll();
    }, 50);
}

function setupContentManager() {
    // Buttons
    const btnPrev = document.querySelector('.carousel-nav-btn.prev');
    const btnNext = document.querySelector('.carousel-nav-btn.next');

    // Mapped Logic:
    // Left Arrow / Prev Button -> Previous (currentIndex--)
    const handlePrev = (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        stopAutoScroll();
        const totalItems = parseInt(carousel.dataset.realItemCount) || 0;
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
        startAutoScroll();
    };

    // Right Arrow / Next Button -> Next (currentIndex++)
    const handleNext = (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        stopAutoScroll();
        const totalItems = parseInt(carousel.dataset.realItemCount) || 0;
        if (currentIndex < totalItems - 1) {
            currentIndex++;
            updateCarousel();
        }
        startAutoScroll();
    };

    if (btnPrev) {
        btnPrev.onclick = handlePrev;
        btnPrev.ontouchend = handlePrev;
    }
    if (btnNext) {
        btnNext.onclick = handleNext;
        btnNext.ontouchend = handleNext;
    }

    // Swipe
    let swipeStartX = 0;
    let swipeStartY = 0;
    let isDragging = false;

    const handleSwipeStart = (e) => {
        if (e.type === 'mousedown' && e.button !== 0 && e.button !== 2) return;
        stopAutoScroll();
        const touch = e.touches ? e.touches[0] : e;
        swipeStartX = touch.clientX;
        swipeStartY = touch.clientY;
        isDragging = true;
    };

    const handleSwipeMove = (e) => {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();
    };

    const handleSwipeEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;

        const touch = e.changedTouches ? e.changedTouches[0] : e;
        const deltaX = touch.clientX - swipeStartX;
        const deltaY = touch.clientY - swipeStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            // MAPPING:
            // DeltaX < 0 (Finger moved Left) -> Swipe Left -> Previous (as requested)
            // DeltaX > 0 (Finger moved Right) -> Swipe Right -> Next (as requested)
            if (deltaX < 0) {
                // Swipe Left => Previous
                handlePrev();
            } else {
                // Swipe Right => Next
                handleNext();
            }
        } else {
            startAutoScroll();
        }
    };

    if (carousel) {
        carousel.addEventListener('touchstart', handleSwipeStart, { passive: true });
        carousel.addEventListener('touchmove', handleSwipeMove, { passive: false });
        carousel.addEventListener('touchend', handleSwipeEnd, { passive: true });

        carousel.addEventListener('mousedown', handleSwipeStart);
        carousel.addEventListener('mousemove', handleSwipeMove);
        carousel.addEventListener('mouseup', handleSwipeEnd);
        carousel.addEventListener('mouseleave', () => {
            isDragging = false;
            startAutoScroll();
        });
    }

    // Resize listener
    window.addEventListener('resize', updateCarousel);

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!views.details.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') {
            // Left Arrow => Previous
            handlePrev();
        } else if (e.key === 'ArrowRight') {
            // Right Arrow => Next
            handleNext();
        }
    });
}

// ==================== PDF RENDERING ====================
async function renderPdfToCanvas(pdfDataUrl, canvasId) {
    try {
        if (typeof pdfjsLib === 'undefined') return;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const pdf = await pdfjsLib.getDocument(pdfDataUrl).promise;
        const page = await pdf.getPage(1);
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 2 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
    } catch (error) {
        console.error('Error rendering PDF:', error);
    }
}

// ==================== MODAL & ZOOM ====================
const zoomLevels = [1, 2, 4];
let currentZoomIndex = 0;
let modalZoom = 1;
let modalPanX = 0;
let modalPanY = 0;

function openModalWithData(itemData) {
    modalContent.innerHTML = '';
    modal.classList.remove('hidden');

    // Reset Zoom State
    currentZoomIndex = 0;
    modalZoom = zoomLevels[currentZoomIndex];
    modalPanX = 0;
    modalPanY = 0;

    // Show/Hide Reset Button
    const btnReset = document.getElementById('btn-reset-zoom');
    if (btnReset) {
        btnReset.style.display = 'none';
        btnReset.onclick = resetZoom;
    }

    let mediaElement;
    if (itemData.isImage) {
        mediaElement = document.createElement('img');
        mediaElement.src = itemData.src;
    } else if (itemData.isPdf) {
        mediaElement = document.createElement('canvas');
        mediaElement.id = `modal-pdf-${Date.now()}`;
        mediaElement.style.width = '100%';
        modalContent.appendChild(mediaElement);
        renderPdfToCanvas(itemData.src, mediaElement.id);
    } else if (itemData.isVideo) {
        mediaElement = document.createElement('video');
        mediaElement.src = itemData.src;
        mediaElement.controls = true;
    }

    if (mediaElement) {
        Object.assign(mediaElement.style, {
            maxWidth: '90%', maxHeight: '90vh',
            cursor: 'zoom-in', transformOrigin: 'center center',
            transition: 'transform 0.3s ease'
        });

        if (!itemData.isVideo) {
            setupZoomInteractions(mediaElement);
        }

        if (!itemData.isPdf) modalContent.appendChild(mediaElement);
    }

    updateModalState();
}

function setupZoomInteractions(element) {
    let isClick = true;
    element.addEventListener('mousedown', () => isClick = true);
    element.addEventListener('mousemove', () => isClick = false);

    element.addEventListener('click', (e) => {
        if (!isClick) return;
        currentZoomIndex = (currentZoomIndex + 1) % zoomLevels.length;
        modalZoom = zoomLevels[currentZoomIndex];
        updateModalState();
    });
}

function resetZoom(e) {
    if (e) e.stopPropagation();
    currentZoomIndex = 0;
    modalZoom = 1;
    modalPanX = 0;
    modalPanY = 0;
    updateModalState();
}

function updateModalTransform() {
    const mediaElement = modalContent.querySelector('img, canvas, video');
    if (mediaElement) {
        mediaElement.style.transform = `translate(${modalPanX}px, ${modalPanY}px) scale(${modalZoom})`;
    }
}

function updateModalState() {
    updateModalTransform();
    const mediaElement = modalContent.querySelector('img, canvas');
    if (mediaElement) {
        mediaElement.style.cursor = modalZoom > 1 ? 'grab' : 'zoom-in';
    }
    const btnReset = document.getElementById('btn-reset-zoom');
    if (btnReset) {
        btnReset.style.display = modalZoom > 1 ? 'block' : 'none';
    }
}

// Global modal close logic
closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    modalContent.innerHTML = '';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
        modalContent.innerHTML = '';
    }
});

// Start the application
init();
