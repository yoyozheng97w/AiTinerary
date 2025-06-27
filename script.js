// Google Maps API 配置
let map;
let marker;
let geocoder;
let infoWindow;

// 初始化地圖
function initMap() {
    // 預設顯示台灣
    const taiwan = { lat: 23.5, lng: 121 };
    
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: taiwan,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "on" }]
            }
        ]
    });
    
    geocoder = new google.maps.Geocoder();
    infoWindow = new google.maps.InfoWindow();
    
    // 綁定事件
    bindEvents();
}

// 綁定事件處理
function bindEvents() {
    const searchBtn = document.getElementById('searchBtn');
    const locationInput = document.getElementById('locationInput');
    
    searchBtn.addEventListener('click', searchLocation);
    locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchLocation();
        }
    });
}

// 搜尋地點
function searchLocation() {
    const locationInput = document.getElementById('locationInput');
    const query = locationInput.value.trim();
    
    if (!query) {
        showError('請輸入景點名稱');
        return;
    }
    
    showLoading(true);
    hideError();
    
    // 使用 Geocoding API 搜尋地點
    geocoder.geocode({ address: query }, (results, status) => {
        showLoading(false);
        
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            const place = results[0];
            
            // 清除之前的標記
            if (marker) {
                marker.setMap(null);
            }
            
            // 創建新標記
            marker = new google.maps.Marker({
                map: map,
                position: location,
                title: place.formatted_address,
                animation: google.maps.Animation.DROP
            });
            
            // 設置地圖中心點和縮放級別
            map.setCenter(location);
            map.setZoom(15);
            
            // 顯示資訊視窗
            const infoContent = `
                <div style="padding: 10px;">
                    <h3 style="margin: 0 0 5px 0; color: #333;">${place.formatted_address}</h3>
                    <p style="margin: 0; color: #666; font-size: 12px;">
                        經度: ${location.lng().toFixed(6)}<br>
                        緯度: ${location.lat().toFixed(6)}
                    </p>
                </div>
            `;
            
            infoWindow.setContent(infoContent);
            infoWindow.open(map, marker);
            
            // 顯示地點資訊
            showLocationInfo(place, location);
            
        } else {
            showError('無法找到該景點，請嘗試其他關鍵字');
            console.error('Geocoding failed:', status);
        }
    });
}

// 顯示地點資訊
function showLocationInfo(place, location) {
    const mapInfo = document.getElementById('mapInfo');
    const locationName = document.getElementById('locationName');
    const locationAddress = document.getElementById('locationAddress');
    const locationCoords = document.getElementById('locationCoords');
    
    locationName.textContent = place.formatted_address;
    locationAddress.textContent = `地址: ${place.formatted_address}`;
    locationCoords.textContent = `座標: ${location.lat().toFixed(6)}, ${location.lng().toFixed(6)}`;
    
    mapInfo.classList.remove('hidden');
}

// 顯示載入狀態
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

// 顯示錯誤訊息
function showError(message) {
    const error = document.getElementById('error');
    const errorText = error.querySelector('p');
    errorText.textContent = message;
    error.classList.remove('hidden');
}

// 隱藏錯誤訊息
function hideError() {
    const error = document.getElementById('error');
    error.classList.add('hidden');
}

// 處理 API 載入錯誤
function handleApiError() {
    showError('Google Maps API 載入失敗，請檢查網路連線');
}

// 全域錯誤處理
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    if (e.error && e.error.message && e.error.message.includes('Google Maps')) {
        handleApiError();
    }
});

// 當 DOM 載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    // 檢查 Google Maps API 是否已載入
    if (typeof google === 'undefined' || !google.maps) {
        handleApiError();
        return;
    }
    
    initMap();
}); 