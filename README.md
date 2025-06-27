# 景點地圖搜尋器

一個簡潔美觀的網頁應用程式，可以搜尋景點並在 Google Maps 上顯示位置。

## 功能特色

- 🗺️ 整合 Google Maps API
- 🔍 景點搜尋功能
- 📍 地圖標記和資訊視窗
- 📱 響應式設計，支援手機和平板
- 🎨 現代化 UI 設計
- ⚡ 即時搜尋結果

## 使用前準備

### 1. 取得 Google Maps API 金鑰

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用以下 API：
   - Maps JavaScript API
   - Geocoding API
4. 在「憑證」頁面建立 API 金鑰
5. 設定 API 金鑰的應用程式限制（建議設定為 HTTP 參照網址）

### 2. 設定 API 金鑰

在 `index.html` 文件中，將 `YOUR_API_KEY` 替換為您的實際 API 金鑰：

```html
<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
</script>
```

## 使用方法

1. 開啟 `index.html` 文件
2. 在搜尋框中輸入景點名稱（例如：台北101、阿里山、日月潭）
3. 點擊「搜尋」按鈕或按 Enter 鍵
4. 地圖會自動定位到該景點並顯示標記
5. 點擊標記可查看詳細資訊

## 檔案結構

```
AiTinerary/
├── index.html          # 主要 HTML 文件
├── styles.css          # CSS 樣式文件
├── script.js           # JavaScript 功能文件
└── README.md           # 說明文件
```

## 技術架構

- **HTML5**: 語義化標籤和現代化結構
- **CSS3**: Flexbox、Grid、動畫效果
- **JavaScript ES6+**: 模組化程式碼
- **Google Maps API**: 地圖顯示和地理編碼

## 瀏覽器支援

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事項

- 需要有效的 Google Maps API 金鑰
- 需要網路連線才能載入地圖
- API 使用量會計入您的 Google Cloud 配額

## 自訂功能

您可以根據需求修改以下功能：

- 地圖樣式：在 `script.js` 中修改 `map` 的 `styles` 屬性
- 預設位置：修改 `initMap()` 函數中的 `taiwan` 座標
- UI 設計：調整 `styles.css` 中的顏色和佈局
- 搜尋邏輯：在 `searchLocation()` 函數中添加額外的搜尋條件

## 授權

此專案僅供學習和個人使用。使用 Google Maps API 時請遵守 Google 的服務條款。