// ─────────────────────────────────────────────────────────────
// 회의록 레코더 · 로그인 설정
// Firebase 콘솔 → 프로젝트 설정(톱니바퀴) → 일반 → 내 앱(웹 앱) → "SDK 설정 및 구성"의 값을
// 아래 따옴표 안에 그대로 붙여 넣으세요. 이 값은 공개되어도 괜찮습니다(보안은 firestore.rules가 담당).
// apiKey가 비어 있으면 로그인 없이 이 기기에서만 동작합니다.
// ─────────────────────────────────────────────────────────────
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyD602pY0RtUZxK5eCkYLUWd5KCQ8efmVLs",
  authDomain: "meeting-recorder-b4694.firebaseapp.com",
  projectId: "meeting-recorder-b4694",
  storageBucket: "meeting-recorder-b4694.firebasestorage.app",
  messagingSenderId: "476131026179",
  appId: "1:476131026179:web:9fefe037301af7095e7536"
};

// 관리자 메일 주소. 사용자 허가·요청 승인을 할 수 있습니다.
// firestore.rules 파일의 관리자 메일과 똑같이 적어 주세요(소문자).
window.APP_ADMINS = ["go2gnam2@gmail.com"];

if (window.FIREBASE_CONFIG.apiKey) document.documentElement.classList.add('auth-pending');
