// 회의록 레코더 서비스 워커 — 앱 화면을 저장해 두어 설치 후 빠르게 열리고, 오프라인에서도 녹음·기록 열람이 가능하게 합니다.
// API 호출(Gemini·OpenAI·Claude)은 절대 저장하지 않고 그대로 통과시킵니다.
const VERSION = 'mr-v7';
const SHELL = ['./', './index.html', './firebase-config.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 글꼴: 한 번 받으면 저장해 두고 사용
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(VERSION + '-fonts').then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') c.put(req, res.clone());
      return res;
    }));
    return;
  }
  // 로그인 라이브러리(Firebase SDK): 버전이 주소에 들어 있어 한 번 받으면 그대로 사용 → 오프라인에서도 앱이 열림
  if (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) {
    e.respondWith(caches.open(VERSION + '-sdk').then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    }));
    return;
  }
  if (url.origin !== location.origin) return; // API·로그인 서버 등 외부 요청은 관여하지 않음
  // 앱 화면: 최신 버전을 먼저 시도하고, 오프라인이면 저장본 사용
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html'))));
});
