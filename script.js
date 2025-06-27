// Google Maps API 配置
let map;
let marker;
let geocoder;
let infoWindow;
let directionsService;
let directionsRenderer;

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
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false
    });
    
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
    const queries = locationInput.value.split('\n').map(s => s.trim()).filter(Boolean);
    if (queries.length < 2) {
        showError('請至少輸入兩個景點，每行一個');
        return;
    }
    showLoading(true);
    hideError();
    // 依序 geocode
    Promise.all(queries.map(q => geocodePlace(q))).then(results => {
        if (results.some(r => !r)) {
            showLoading(false);
            showError('有景點無法找到，請檢查名稱');
            return;
        }
        // 規劃路線
        planRoute(results);
    });
}

function geocodePlace(query) {
    return new Promise(resolve => {
        geocoder.geocode({ address: query }, (results, status) => {
            if (status === 'OK' && results[0]) {
                resolve({
                    location: results[0].geometry.location,
                    address: results[0].formatted_address
                });
            } else {
                resolve(null);
            }
        });
    });
}

function planRoute(places) {
    // 第一個為起點，最後一個為終點，中間為途經點
    const origin = places[0].location;
    const destination = places[places.length - 1].location;
    const waypoints = places.slice(1, -1).map(p => ({ location: p.location, stopover: true }));
    directionsService.route({
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true
    }, (result, status) => {
        showLoading(false);
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            showRouteInfo(result, places);
        } else {
            showError('路線規劃失敗，請稍後再試');
        }
    });
}

function showRouteInfo(result, places) {
    // 顯示路線資訊，可擴充
    const mapInfo = document.getElementById('mapInfo');
    if (!result.routes[0]) return;
    const route = result.routes[0];
    let html = `<h3>最佳路線順序</h3><ol>`;
    route.waypoint_order.forEach((idx, i) => {
        html += `<li>${places[idx+1].address}</li>`;
    });
    html = `<li>${places[0].address}（起點）</li>` + html + `<li>${places[places.length-1].address}（終點）</li></ol>`;
    mapInfo.innerHTML = html;
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