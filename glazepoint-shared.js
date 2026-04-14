// ============================================================
// GLAZEPOINT SHARED FUNCTIONS
// ============================================================
// Shared across all product HTML files (resi door, casement,
// French doors, tilt & turn, patio, vertical slider, etc.)
//
// Hosted on GitHub Pages:
//   https://greenfrog75.github.io/glazepointpro-products/glazepoint-shared.js
//
// Include in each product HTML via:
//   <script src="https://greenfrog75.github.io/glazepointpro-products/glazepoint-shared.js"></script>
//
// IMPORTANT: Update this file once → all products pick up the change.
// After committing, wait 5 minutes for GitHub Pages cache to clear.
// ============================================================


// ============================================
// COLOUR HELPER FUNCTIONS
// Used by all products for bevel calculation,
// stroke colours, and colour manipulation.
// ============================================

function hexToRgb(hex) {
    return {
        r: parseInt(hex.slice(1,3), 16),
        g: parseInt(hex.slice(3,5), 16),
        b: parseInt(hex.slice(5,7), 16)
    };
}

// Returns perceived luminance (0–255) using standard weighted formula
function getLuminance(hex) {
    var rgb = hexToRgb(hex);
    return (rgb.r * 0.299) + (rgb.g * 0.587) + (rgb.b * 0.114);
}

function getBevelColours(hex) {
    var rgb = hexToRgb(hex);
    var lum = getLuminance(hex) / 255;
    var darkFactor  = 0.55 + Math.pow(lum, 0.5) * 0.30;
    var lightFactor = 0.3 + Math.pow(lum, 1.5) * 0.5;
    var dark  = '#' + [rgb.r,rgb.g,rgb.b].map(function(v){ return Math.round(v * darkFactor).toString(16).padStart(2,'0'); }).join('');
    var light = lum > 0.9 ? '#ffffff'
              : '#' + [rgb.r,rgb.g,rgb.b].map(function(v){ return Math.min(255,Math.round(v+(255-v)*lightFactor)).toString(16).padStart(2,'0'); }).join('');
    return { dark: dark, light: light };
}

function lightenColour(hex, percent) {
    var rgb = hexToRgb(hex);
    var r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * (percent / 100)));
    var g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * (percent / 100)));
    var b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * (percent / 100)));
    return '#' + [r,g,b].map(function(x){ var h = x.toString(16); return h.length === 1 ? '0'+h : h; }).join('');
}

function darkenColour(hex, percent) {
    var rgb = hexToRgb(hex);
    var r = Math.max(0, Math.round(rgb.r * (1 - percent / 100)));
    var g = Math.max(0, Math.round(rgb.g * (1 - percent / 100)));
    var b = Math.max(0, Math.round(rgb.b * (1 - percent / 100)));
    return '#' + [r,g,b].map(function(x){ var h = x.toString(16); return h.length === 1 ? '0'+h : h; }).join('');
}

function isLightColour(hex) {
    return getLuminance(hex) > 128;
}

function getStrokeColour(hex) {
    return isLightColour(hex) ? darkenColour(hex, 20) : lightenColour(hex, 30);
}


// ============================================
// WELD / JOINT DISPLAY
// Toggles between welded (SVG diagonal line)
// and mechanical (CSS border line) display.
// Used by all products with weld/joint toggles.
// ============================================

function setWeldDisplay(element, type, borderSide, strokeColour) {
    strokeColour = strokeColour || '#a0a0a0';
    var svg = element.querySelector('svg');
    if (svg) {
        svg.style.display = type === 'welded' ? 'block' : 'none';
        svg.querySelectorAll('line').forEach(function(line) {
            line.setAttribute('stroke', strokeColour);
            line.setAttribute('vector-effect', 'non-scaling-stroke');
        });
    }
    element.style.borderTop = 'none';
    element.style.borderBottom = 'none';
    element.style.borderLeft = 'none';
    element.style.borderRight = 'none';
    if (type === 'mechanical') {
        element.style['border' + borderSide] = '1px solid ' + strokeColour;
    }
}
