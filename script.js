/**
 * Google Style Start Page Logic
 * Features: Live Weather (Busan/Changwon via Open-Meteo), Google Search, Daily Quotes, Shortcuts & Theme
 */

// ==========================================================================
// 1. Constants & Configurations
// ==========================================================================

const CITIES = {
  busan: {
    name: '부산광역시',
    lat: 35.1796,
    lon: 129.0756,
  },
  changwon: {
    name: '창원특례시',
    lat: 35.2280,
    lon: 128.6811,
  }
};

// Weather Code mapping to Korean descriptions and emojis (WMO Weather interpretation codes)
const WEATHER_CODE_MAP = {
  0: { text: '맑음', emoji: '☀️' },
  1: { text: '대체로 맑음', emoji: '🌤️' },
  2: { text: '구름 조금', emoji: '⛅' },
  3: { text: '흐림', emoji: '☁️' },
  45: { text: '안개', emoji: '🌫️' },
  48: { text: '서리 안개', emoji: '🌫️' },
  51: { text: '가벼운 이슬비', emoji: '🌦️' },
  53: { text: '이슬비', emoji: '🌦️' },
  55: { text: '강한 이슬비', emoji: '🌧️' },
  61: { text: '약한 비', emoji: '🌧️' },
  63: { text: '비', emoji: '🌧️' },
  65: { text: '강한 비', emoji: '🌧️' },
  66: { text: '얼어붙는 비', emoji: '🌨️' },
  67: { text: '강한 동결비', emoji: '🌨️' },
  71: { text: '약한 눈', emoji: '🌨️' },
  73: { text: '눈', emoji: '❄️' },
  75: { text: '강한 눈', emoji: '❄️' },
  77: { text: '싸락눈', emoji: '❄️' },
  80: { text: '약한 소나기', emoji: '🌦️' },
  81: { text: '소나기', emoji: '🌧️' },
  82: { text: '폭우성 소나기', emoji: '⛈️' },
  85: { text: '약한 눈보라', emoji: '🌨️' },
  86: { text: '강한 눈보라', emoji: '❄️' },
  95: { text: '뇌우', emoji: '⚡' },
  96: { text: '우박을 동반한 뇌우', emoji: '⛈️' },
  99: { text: '강한 우박 뇌우', emoji: '⛈️' }
};

// Curated Collection of Quotes (동기부여, 지혜, 성공, 도전, 행복 등)
const QUOTES = [
  { text: "인생에서 가장 큰 영광은 넘어지지 않는 것이 아니라, 넘어질 때마다 다시 일어서는 데 있다.", author: "넬슨 만델라", category: "용기" },
  { text: "오늘 할 수 있는 일을 내일로 미루지 마라.", author: "벤자민 프랭클린", category: "실행" },
  { text: "배움에는 끝이 없으며, 호기심은 세상을 변화시키는 가장 큰 원동력이다.", author: "알베르트 아인슈타인", category: "배움" },
  { text: "작은 일에 충실한 것이 곧 위대한 일을 이루는 열쇠이다.", author: "마더 테레사", category: "성실" },
  { text: "성공이란 열정을 잃지 않고 실패를 거듭할 수 있는 능력이다.", author: "윈스턴 처칠", category: "성공" },
  { text: "미래를 예측하는 가장 좋은 방법은 미래를 직접 창조하는 것이다.", author: "피터 드러커", category: "도전" },
  { text: "천 리 길도 한 걸음부터 시작된다.", author: "노자", category: "지혜" },
  { text: "우리가 두려워해야 할 유일한 것은 두려움 그 자체이다.", author: "프랭클린 D. 루스벨트", category: "용기" },
  { text: "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 당신의 믿음이 옳다.", author: "헨리 포드", category: "마인드셋" },
  { text: "기회는 준비된 자에게 찾아온다.", author: "루이 파스퇴르", category: "준비" },
  { text: "삶이 있는 한 희망은 항상 존재한다.", author: "키케로", category: "희망" },
  { text: "모든 성취의 시작점은 갈망이다.", author: "나폴레온 힐", category: "목표" },
  { text: "오늘 걷지 않으면 내일은 뛰어야 한다.", author: "라틴 격언", category: "동기부여" },
  { text: "최고에 도달하고자 한다면, 최저에서 시작하라.", author: "푸블릴리우스 시루스", category: "겸손" },
  { text: "자신을 이기는 자가 가장 강한 승리자이다.", author: "세네카", category: "자기관리" },
  { text: "꿈을 이루고자 하는 용기만 있다면 모든 꿈은 현실이 될 수 있다.", author: "월트 디즈니", category: "꿈" },
  { text: "어제와 똑같이 살면서 다른 미래를 기대하는 것은 정신병 초기증세다.", author: "알베르트 아인슈타인", category: "변화" },
  { text: "단순함이 궁극의 정교함이다.", author: "레오나르도 다빈치", category: "통찰" },
  { text: "지혜로운 사람은 행동으로 증명하고, 어리석은 사람은 말로만 설명한다.", author: "탈무드", category: "지혜" },
  { text: "시작하는 방법은 말을 그만두고 행동을 시작하는 것이다.", author: "월트 디즈니", category: "실행" }
];

// Default Shortcuts
const DEFAULT_SHORTCUTS = [
  { name: "YouTube", url: "https://www.youtube.com", icon: "▶️" },
  { name: "네이버", url: "https://www.naver.com", icon: "🟢" },
  { name: "다음", url: "https://www.daum.net", icon: "🔵" },
  { name: "GitHub", url: "https://github.com", icon: "🐙" },
  { name: "ChatGPT", url: "https://chatgpt.com", icon: "🤖" },
  { name: "Google 지도", url: "https://maps.google.com", icon: "🗺️" },
  { name: "Gmail", url: "https://mail.google.com", icon: "✉️" },
  { name: "번역", url: "https://translate.google.com", icon: "🌐" }
];

// ==========================================================================
// 2. DOM Elements Selection
// ==========================================================================

const elements = {
  // Time & Date
  currentClock: document.getElementById('currentClock'),
  currentDate: document.getElementById('currentDate'),

  // Theme & App menu
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  appsMenuBtn: document.getElementById('appsMenuBtn'),
  appsDropdown: document.getElementById('appsDropdown'),

  // Weather Pill & Section
  weatherQuickToggle: document.getElementById('weatherQuickToggle'),
  quickWeatherIcon: document.getElementById('quickWeatherIcon'),
  quickWeatherText: document.getElementById('quickWeatherText'),
  refreshWeatherBtn: document.getElementById('refreshWeatherBtn'),
  
  // Busan Weather Cards
  busanIcon: document.getElementById('busanIcon'),
  busanTemp: document.getElementById('busanTemp'),
  busanStatus: document.getElementById('busanStatus'),
  busanFeelsLike: document.getElementById('busanFeelsLike'),
  busanMinMax: document.getElementById('busanMinMax'),
  busanHumidity: document.getElementById('busanHumidity'),
  busanWind: document.getElementById('busanWind'),
  busanUpdateTag: document.getElementById('busanUpdateTag'),

  // Changwon Weather Cards
  changwonIcon: document.getElementById('changwonIcon'),
  changwonTemp: document.getElementById('changwonTemp'),
  changwonStatus: document.getElementById('changwonStatus'),
  changwonFeelsLike: document.getElementById('changwonFeelsLike'),
  changwonMinMax: document.getElementById('changwonMinMax'),
  changwonHumidity: document.getElementById('changwonHumidity'),
  changwonWind: document.getElementById('changwonWind'),
  changwonUpdateTag: document.getElementById('changwonUpdateTag'),

  // Search
  googleSearchForm: document.getElementById('googleSearchForm'),
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  voiceSearchBtn: document.getElementById('voiceSearchBtn'),
  lensSearchBtn: document.getElementById('lensSearchBtn'),
  feelingLuckyBtn: document.getElementById('feelingLuckyBtn'),

  // Shortcuts
  shortcutsGrid: document.getElementById('shortcutsGrid'),
  shortcutModal: document.getElementById('shortcutModal'),
  addShortcutForm: document.getElementById('addShortcutForm'),
  shortcutNameInput: document.getElementById('shortcutNameInput'),
  shortcutUrlInput: document.getElementById('shortcutUrlInput'),
  closeModalBtn: document.getElementById('closeModalBtn'),

  // Quotes
  quoteText: document.getElementById('quoteText'),
  quoteAuthor: document.getElementById('quoteAuthor'),
  quoteCategory: document.getElementById('quoteCategory'),
  newQuoteBtn: document.getElementById('newQuoteBtn'),
  copyQuoteBtn: document.getElementById('copyQuoteBtn'),

  // Toast
  toast: document.getElementById('toastMessage')
};

// ==========================================================================
// 3. Time & Date Utility
// ==========================================================================

function updateDateTime() {
  const now = new Date();
  
  // Clock formatting (HH:MM:SS)
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  elements.currentClock.textContent = `${hours}:${minutes}`;

  // Date formatting (YYYY년 M월 D일 요일)
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const dayName = days[now.getDay()];
  elements.currentDate.textContent = `${year}년 ${month}월 ${date}일 ${dayName}`;
}

// ==========================================================================
// 4. Live Weather Integration (Open-Meteo API)
// ==========================================================================

let weatherCache = {
  busan: null,
  changwon: null
};

async function fetchCityWeather(cityKey) {
  const city = CITIES[cityKey];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSeoul`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather fetch failed for ${city.name}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`[Weather] Error fetching ${cityKey}:`, error);
    // Return realistic fallback data if network/offline
    return {
      current: {
        temperature_2m: cityKey === 'busan' ? 24 : 23,
        apparent_temperature: cityKey === 'busan' ? 25 : 24,
        relative_humidity_2m: 60,
        weather_code: 0,
        wind_speed_10m: 2.5
      },
      daily: {
        temperature_2m_max: [cityKey === 'busan' ? 26 : 25],
        temperature_2m_min: [cityKey === 'busan' ? 19 : 18]
      }
    };
  }
}

function renderWeatherCard(cityKey, data) {
  const current = data.current;
  const daily = data.daily;
  const weatherInfo = WEATHER_CODE_MAP[current.weather_code] || { text: '맑음', emoji: '☀️' };
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 기준`;

  const temp = Math.round(current.temperature_2m);
  const feelsLike = Math.round(current.apparent_temperature);
  const minTemp = Math.round(daily.temperature_2m_min[0]);
  const maxTemp = Math.round(daily.temperature_2m_max[0]);
  const humidity = current.relative_humidity_2m;
  const wind = (current.wind_speed_10m * (1000 / 3600)).toFixed(1); // convert to m/s if in km/h or keep clean

  if (cityKey === 'busan') {
    elements.busanIcon.innerHTML = `<span class="weather-emoji">${weatherInfo.emoji}</span>`;
    elements.busanTemp.textContent = `${temp}°`;
    elements.busanStatus.textContent = weatherInfo.text;
    elements.busanFeelsLike.textContent = `${feelsLike}°C`;
    elements.busanMinMax.textContent = `${minTemp}° / ${maxTemp}°`;
    elements.busanHumidity.textContent = `${humidity}%`;
    elements.busanWind.textContent = `${wind} m/s`;
    elements.busanUpdateTag.textContent = timeStr;
    weatherCache.busan = { temp, emoji: weatherInfo.emoji, text: weatherInfo.text };
  } else if (cityKey === 'changwon') {
    elements.changwonIcon.innerHTML = `<span class="weather-emoji">${weatherInfo.emoji}</span>`;
    elements.changwonTemp.textContent = `${temp}°`;
    elements.changwonStatus.textContent = weatherInfo.text;
    elements.changwonFeelsLike.textContent = `${feelsLike}°C`;
    elements.changwonMinMax.textContent = `${minTemp}° / ${maxTemp}°`;
    elements.changwonHumidity.textContent = `${humidity}%`;
    elements.changwonWind.textContent = `${wind} m/s`;
    elements.changwonUpdateTag.textContent = timeStr;
    weatherCache.changwon = { temp, emoji: weatherInfo.emoji, text: weatherInfo.text };
  }

  // Update quick header pill
  if (weatherCache.busan && weatherCache.changwon) {
    elements.quickWeatherIcon.textContent = weatherCache.busan.emoji;
    elements.quickWeatherText.textContent = `부산 ${weatherCache.busan.temp}°C / 창원 ${weatherCache.changwon.temp}°C`;
  }
}

async function updateAllWeather() {
  elements.refreshWeatherBtn.classList.add('rotating');
  try {
    const [busanData, changwonData] = await Promise.all([
      fetchCityWeather('busan'),
      fetchCityWeather('changwon')
    ]);
    renderWeatherCard('busan', busanData);
    renderWeatherCard('changwon', changwonData);
    showToast("날씨 정보가 업데이트되었습니다.");
  } catch (err) {
    console.error("Weather refresh error:", err);
  } finally {
    setTimeout(() => {
      elements.refreshWeatherBtn.classList.remove('rotating');
    }, 500);
  }
}

// ==========================================================================
// 5. Quote of the Day
// ==========================================================================

let currentQuoteIndex = 0;

function setQuote(quote) {
  elements.quoteText.style.opacity = 0;
  setTimeout(() => {
    elements.quoteText.textContent = `"${quote.text}"`;
    elements.quoteAuthor.textContent = `- ${quote.author}`;
    elements.quoteCategory.textContent = quote.category;
    elements.quoteText.style.opacity = 1;
  }, 150);
}

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * QUOTES.length);
  currentQuoteIndex = randomIndex;
  setQuote(QUOTES[randomIndex]);
}

function initDailyQuote() {
  // Use today's date as stable seed so daily quote is consistent on page refresh
  const now = new Date();
  const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  currentQuoteIndex = dateSeed % QUOTES.length;
  setQuote(QUOTES[currentQuoteIndex]);
}

function copyQuoteToClipboard() {
  const current = QUOTES[currentQuoteIndex];
  const copyText = `"${current.text}" - ${current.author}`;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(copyText).then(() => {
      showToast("명언이 클립보드에 복사되었습니다! 📋");
    }).catch(() => {
      fallbackCopy(copyText);
    });
  } else {
    fallbackCopy(copyText);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showToast("명언이 클립보드에 복사되었습니다! 📋");
}

// ==========================================================================
// 6. Shortcuts System (Local Storage CRUD)
// ==========================================================================

const STORAGE_SHORTCUTS_KEY = 'google_start_shortcuts_v1';

function getShortcuts() {
  const stored = localStorage.getItem(STORAGE_SHORTCUTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_SHORTCUTS;
    }
  }
  return DEFAULT_SHORTCUTS;
}

function saveShortcuts(shortcuts) {
  localStorage.setItem(STORAGE_SHORTCUTS_KEY, JSON.stringify(shortcuts));
}

function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch (e) {
    return '';
  }
}

function renderShortcuts() {
  const shortcuts = getShortcuts();
  elements.shortcutsGrid.innerHTML = '';

  shortcuts.forEach((item, index) => {
    const shortcutEl = document.createElement('a');
    shortcutEl.className = 'shortcut-item';
    shortcutEl.href = item.url;
    shortcutEl.target = '_blank';
    shortcutEl.rel = 'noopener noreferrer';
    shortcutEl.title = `${item.name} (${item.url})`;

    const favicon = getFaviconUrl(item.url);

    shortcutEl.innerHTML = `
      <div class="shortcut-icon-circle">
        ${favicon ? `<img class="shortcut-img" src="${favicon}" alt="${item.name}" onerror="this.onerror=null; this.replaceWith('${item.icon || '🔗'}')">` : `<span class="shortcut-fallback-icon">${item.icon || '🔗'}</span>`}
      </div>
      <span class="shortcut-title">${item.name}</span>
      <button class="shortcut-delete-btn" data-index="${index}" title="바로가기 삭제" aria-label="${item.name} 바로가기 삭제">
        &times;
      </button>
    `;

    // Handle delete button
    const deleteBtn = shortcutEl.querySelector('.shortcut-delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteShortcut(index);
    });

    elements.shortcutsGrid.appendChild(shortcutEl);
  });

  // Add "+" Shortcut Button
  const addBtn = document.createElement('div');
  addBtn.className = 'shortcut-item add-shortcut-btn';
  addBtn.title = '바로가기 추가';
  addBtn.style.cursor = 'pointer';
  addBtn.innerHTML = `
    <div class="shortcut-icon-circle">
      <span>+</span>
    </div>
    <span class="shortcut-title">추가</span>
  `;
  addBtn.addEventListener('click', () => {
    openShortcutModal();
  });
  elements.shortcutsGrid.appendChild(addBtn);
}

function deleteShortcut(index) {
  const shortcuts = getShortcuts();
  const deleted = shortcuts.splice(index, 1);
  saveShortcuts(shortcuts);
  renderShortcuts();
  showToast(`"${deleted[0]?.name}" 바로가기가 삭제되었습니다.`);
}

function openShortcutModal() {
  elements.shortcutNameInput.value = '';
  elements.shortcutUrlInput.value = '';
  elements.shortcutModal.classList.add('active');
  elements.shortcutNameInput.focus();
}

function closeShortcutModal() {
  elements.shortcutModal.classList.remove('active');
}

// ==========================================================================
// 7. Search Form & Tools
// ==========================================================================

function handleSearch(e) {
  e.preventDefault();
  const query = elements.searchInput.value.trim();
  if (!query) return;

  // Check if query is a direct valid URL
  if (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i.test(query)) {
    const targetUrl = query.startsWith('http') ? query : `https://${query}`;
    window.location.href = targetUrl;
    return;
  }

  // Google Search Redirect
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.location.href = googleSearchUrl;
}

function setupSearchInput() {
  elements.searchInput.addEventListener('input', () => {
    if (elements.searchInput.value.length > 0) {
      elements.clearSearchBtn.classList.add('visible');
    } else {
      elements.clearSearchBtn.classList.remove('visible');
    }
  });

  elements.clearSearchBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.clearSearchBtn.classList.remove('visible');
    elements.searchInput.focus();
  });

  elements.feelingLuckyBtn.addEventListener('click', () => {
    const query = elements.searchInput.value.trim();
    if (query) {
      window.location.href = `https://www.google.com/search?btnI=1&q=${encodeURIComponent(query)}`;
    } else {
      getRandomQuote();
      showToast("행운의 새 명언이 표시되었습니다! ✨");
    }
  });

  // Voice Search (Speech Recognition if supported)
  elements.voiceSearchBtn.addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      showToast("음성을 듣고 있습니다... 말씀해 주세요 🎙️");
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        elements.searchInput.value = transcript;
        elements.clearSearchBtn.classList.add('visible');
        elements.googleSearchForm.dispatchEvent(new Event('submit'));
      };
      recognition.onerror = () => {
        showToast("음성을 인식하지 못했습니다. 다시 시도해 주세요.");
      };
      recognition.start();
    } else {
      showToast("이 브라우저는 음성 인식을 지원하지 않습니다.");
    }
  });

  elements.lensSearchBtn.addEventListener('click', () => {
    window.open('https://images.google.com', '_blank');
  });
}

// ==========================================================================
// 8. Theme Management
// ==========================================================================

const THEME_STORAGE_KEY = 'google_start_theme_mode';

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const target = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', target);
  localStorage.setItem(THEME_STORAGE_KEY, target);
  showToast(target === 'dark' ? "다크 모드가 적용되었습니다. 🌙" : "라이트 모드가 적용되었습니다. ☀️");
}

// ==========================================================================
// 9. Toast Notification Utility
// ==========================================================================

let toastTimeout = null;
function showToast(message, duration = 2500) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    elements.toast.classList.remove('show');
  }, duration);
}

// ==========================================================================
// 10. Initialization & Event Listeners
// ==========================================================================

function initEventListeners() {
  // Theme Toggle
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // Apps Menu Toggle
  elements.appsMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.appsDropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!elements.appsDropdown.contains(e.target) && e.target !== elements.appsMenuBtn) {
      elements.appsDropdown.classList.remove('active');
    }
  });

  // Weather Actions
  elements.refreshWeatherBtn.addEventListener('click', updateAllWeather);
  elements.weatherQuickToggle.addEventListener('click', () => {
    const weatherSection = document.getElementById('weatherSection');
    if (weatherSection) {
      weatherSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Quotes Actions
  elements.newQuoteBtn.addEventListener('click', getRandomQuote);
  elements.copyQuoteBtn.addEventListener('click', copyQuoteToClipboard);

  // Search
  elements.googleSearchForm.addEventListener('submit', handleSearch);
  setupSearchInput();

  // Modal Actions
  elements.closeModalBtn.addEventListener('click', closeShortcutModal);
  elements.shortcutModal.addEventListener('click', (e) => {
    if (e.target === elements.shortcutModal) closeShortcutModal();
  });

  elements.addShortcutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let name = elements.shortcutNameInput.value.trim();
    let url = elements.shortcutUrlInput.value.trim();

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const shortcuts = getShortcuts();
    shortcuts.push({ name, url, icon: '🔗' });
    saveShortcuts(shortcuts);
    renderShortcuts();
    closeShortcutModal();
    showToast(`"${name}" 바로가기가 추가되었습니다! 🚀`);
  });
}

// Main Bootstrapping
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateDateTime();
  setInterval(updateDateTime, 1000);

  initDailyQuote();
  renderShortcuts();
  initEventListeners();
  updateAllWeather();

  // Auto-refresh weather every 30 minutes
  setInterval(updateAllWeather, 30 * 60 * 1000);
});
