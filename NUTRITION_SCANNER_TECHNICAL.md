# 🛠️ Nutrition Scanner — Technical Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Health-Sync AI                           │
│                 Nutrition Scanner Module                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Camera API  │  │ Manual Entry │  │ OpenFoodFacts│    │
│  │ (getUserMedia)│ │    Input    │  │     API      │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                  │             │
│         └─────────────────┼──────────────────┘             │
│                           │                                │
│                    ┌──────▼──────┐                         │
│                    │Barcode/QR   │                         │
│                    │  Extraction │                         │
│                    └──────┬──────┘                         │
│                           │                                │
│                    ┌──────▼──────────┐                     │
│                    │NutritionScanner │                     │
│                    │ API Handler     │                     │
│                    └──────┬──────────┘                     │
│                           │                                │
│                    ┌──────▼──────┐                         │
│                    │  Data       │                         │
│                    │  Processing │                         │
│                    └──────┬──────┘                         │
│                           │                                │
│                    ┌──────▼──────┐                         │
│                    │ UI Rendering│                         │
│                    │ & Display   │                         │
│                    └──────┬──────┘                         │
│                           │                                │
│                    ┌──────▼──────────┐                     │
│                    │LocalStorage     │                     │
│                    │Health Logging   │                     │
│                    └─────────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Class Structure

### **NutritionScanner Class**

```javascript
class NutritionScanner {
  // Properties
  - video: HTMLVideoElement              // Camera video stream
  - canvas: HTMLCanvasElement             // Canvas for frame capture
  - isScanning: boolean                   // Scanning state
  - currentProduct: Object                // Current product data
  - scanningInterval: number              // Frame scanning interval

  // Methods
  + constructor()                         // Initialize scanner
  + init()                                // Setup event listeners
  + startCamera()                         // Request camera & begin scanning
  + stopCamera()                          // Stop camera & cleanup
  + scanFrames()                          // Scan video frames for QR
  + extractBarcode(canvas, ctx)           // Extract barcode from image
  + searchManual()                        // Manual barcode search
  + fetchProductInfo(barcode)             // Fetch from OpenFoodFacts
  + displayProductInfo(product)           // Render product data
  + formatValue(value, unit)              // Format nutritional values
  + getUnit(key)                          // Get unit for nutrient
  + logToHealth()                         // Log to health profile
  + resetScanner()                        // Reset for new scan
}
```

---

## API Integration

### **OpenFoodFacts API**

**Endpoint**: `https://world.openfoodfacts.org/api/v0/product/{barcode}.json`

**Request**:
```bash
GET /api/v0/product/5901234123457.json
```

**Response Structure**:
```json
{
  "status": 1,
  "product": {
    "code": "5901234123457",
    "product_name": "Example Food Product",
    "brands": "Brand Name",
    "image_url": "https://...",
    "allergens": "Milk, Gluten",
    "nutriscore_grade": "a",
    "nutriments": {
      "energy-kcal_100g": 250,
      "fat_100g": 12.5,
      "proteins_100g": 8.0,
      "carbohydrates_100g": 32.0,
      "sugars_100g": 5.0,
      "salt_100g": 0.5,
      "fiber_100g": 3.0,
      "calcium_100g": 200,
      "iron_100g": 2.5,
      "sodium_100g": 200,
      "potassium_100g": 150
    }
  }
}
```

---

## HTML Structure

### **Page Container**
```html
<section class="page" id="page-nutrition">
  <!-- Mode Selector -->
  <div class="nutrition-mode-selector">
    <button class="mode-btn active" data-mode="camera">Camera</button>
    <button class="mode-btn" data-mode="manual">Manual</button>
  </div>

  <!-- Camera Mode -->
  <div id="camera-mode">
    <div id="qr-scanner-container">
      <video id="qr-video"></video>
      <div id="scanner-overlay"></div>
    </div>
    <button id="start-camera-btn">Start Camera</button>
    <button id="stop-camera-btn" style="display:none">Stop</button>
    <p id="camera-status"></p>
  </div>

  <!-- Manual Mode -->
  <div id="manual-mode" style="display:none">
    <input type="text" id="manual-barcode" placeholder="Enter barcode..." />
    <button id="search-manual-btn">Search</button>
  </div>

  <!-- Results -->
  <div id="nutrition-results" style="display:none">
    <div id="nutrition-loading">Loading...</div>
    <div id="nutrition-data"><!-- Product data --></div>
    <div id="nutrition-error"><!-- Error handling --></div>
  </div>
</section>
```

---

## CSS Classes

### **Key CSS Classes**

| Class | Purpose |
|-------|---------|
| `.nutrition-mode-selector` | Mode selection buttons container |
| `.mode-btn` | Individual mode button |
| `.mode-btn.active` | Active mode button styling |
| `#qr-scanner-container` | Video stream container |
| `#scanner-overlay` | QR frame overlay |
| `.nutrition-grid` | Nutrition facts grid layout |
| `.nutrition-item` | Individual nutrient card |
| `.nutrition-facts` | Nutrition facts section |
| `.nutrient-row` | Detailed nutrient row |
| `#allergens-section` | Allergen warnings section |
| `#health-score-section` | Nutri-Score display |

---

## JavaScript Functions

### **Key Functions**

#### **1. Camera Access**
```javascript
startCamera() {
  // Request camera permission
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
  });
  this.video.srcObject = stream;
  this.video.play();
}
```

#### **2. Frame Scanning**
```javascript
scanFrames() {
  // Continuously scan video frames
  // Extract barcode using image processing
  // Call extractBarcode() on each frame
}
```

#### **3. API Fetch**
```javascript
fetchProductInfo(barcode) {
  fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    .then(r => r.json())
    .then(data => this.displayProductInfo(data.product))
}
```

#### **4. Data Display**
```javascript
displayProductInfo(product) {
  // Extract nutrients from product.nutriments
  // Format and display in UI
  // Handle allergens and Nutri-Score
}
```

#### **5. Health Logging**
```javascript
logToHealth() {
  const log = {
    timestamp: new Date().toISOString(),
    type: 'nutrition_scan',
    product_name: product.product_name,
    nutrients: { energy, protein, fat, carbs }
  };
  localStorage.setItem('nutrition_logs', JSON.stringify(logs));
}
```

---

## Data Flow

### **Camera Mode Flow**
```
1. User taps "Start Camera"
2. Browser requests camera permission
3. Camera stream starts in <video> element
4. scanFrames() extracts frames every 500ms
5. extractBarcode() analyzes frame for barcode
6. If barcode found:
   → fetchProductInfo() via API
   → displayProductInfo() shows results
   → User can log to health
7. User taps "Stop" or scans another product
```

### **Manual Mode Flow**
```
1. User enters barcode in input field
2. User clicks "Search"
3. searchManual() validates barcode
4. fetchProductInfo() via API
5. displayProductInfo() shows results
6. User can log to health
```

---

## Nutrient Data Mapping

```javascript
{
  'energy-kcal_100g': 'Energy (kcal)',
  'fat_100g': 'Fat (g)',
  'proteins_100g': 'Protein (g)',
  'carbohydrates_100g': 'Carbohydrates (g)',
  'sugars_100g': 'Sugars (g)',
  'salt_100g': 'Salt (g)',
  'fiber_100g': 'Fiber (g)',
  'calcium_100g': 'Calcium (mg)',
  'iron_100g': 'Iron (mg)',
  'sodium_100g': 'Sodium (mg)',
  'potassium_100g': 'Potassium (mg)'
}
```

---

## Error Handling

### **Error Scenarios**

| Error | Cause | Resolution |
|-------|-------|-----------|
| Camera not available | No camera hardware | Show Manual Mode |
| Permission denied | User blocked camera | Show Manual Mode |
| Product not found | Barcode not in database | Show error message |
| Network error | No internet | Suggest retry |
| Invalid barcode | Wrong format | Validate input |

### **Error Handling Code**
```javascript
try {
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error('Product not found');
  const product = await response.json();
  this.displayProductInfo(product.product);
} catch (err) {
  document.getElementById('nutrition-error').style.display = 'block';
  document.getElementById('error-message').textContent = err.message;
}
```

---

## Extensions & Enhancements

### **Possible Improvements**

1. **Real QR Code Library**
   - Integrate `jsQR` or `Quagga.js`
   - Better barcode detection accuracy

2. **Barcode Format Support**
   - EAN-13, EAN-8, UPC-A, UPC-E, Code128, etc.
   - Format validation

3. **Image Processing**
   - Contrast enhancement for poor lighting
   - Barcode region detection

4. **Caching**
   - Cache API responses locally
   - Faster repeat scans

5. **Offline Support**
   - Service Worker integration
   - Pre-cache common products

6. **Health Integration**
   - Auto-log to daily dashboard
   - Nutritional goal tracking
   - Meal planning integration

7. **Analytics**
   - Track scanned products
   - Nutrition trends
   - Weekly/monthly reports

8. **Multi-Language**
   - Product names in different languages
   - Localized UI

---

## Browser Compatibility

### **Required APIs**
- ✅ `getUserMedia` (Camera access)
- ✅ `Canvas API` (Frame capture)
- ✅ `Fetch API` (HTTP requests)
- ✅ `LocalStorage` (Data persistence)

### **Supported Browsers**
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 14.1+
- ✅ Edge 80+

### **Mobile Compatibility**
- ✅ iOS 14.5+ (Safari)
- ✅ Android 5.0+ (Chrome)
- ✅ Progressive Web App (PWA)

---

## Performance Considerations

### **Optimization Tips**

1. **Frame Rate**: Scan every 500ms (balance speed vs. CPU)
2. **Canvas Size**: Match video resolution for accuracy
3. **API Caching**: Store recent searches locally
4. **Image Size**: Resize large product images
5. **Memory**: Clear old data after scan completes

---

## Testing Checklist

- [ ] Camera access works
- [ ] Manual barcode entry works
- [ ] API returns valid data
- [ ] Nutrition display is correct
- [ ] Allergens display properly
- [ ] Nutri-Score shows correctly
- [ ] Logging to health works
- [ ] Error handling works
- [ ] Mobile responsiveness works
- [ ] Offline caching works (if implemented)

---

## Resources

- **OpenFoodFacts API**: https://world.openfoodfacts.org/api
- **MDN Web APIs**: https://developer.mozilla.org/en-US/docs/Web/API
- **Camera API**: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- **Canvas API**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- **QR Code Libraries**:
  - jsQR: https://github.com/cozmo/jsQR
  - Quagga.js: https://github.com/serratus/quaggaJS
  - ZXing: https://github.com/zxing-js/library

---

**Last Updated**: 2026-05-20  
**Version**: 1.0  
**Status**: Active Development
