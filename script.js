const newCallBtn = document.getElementById("newCallBtn");
const callScreen = document.getElementById("callScreen");
const message = document.getElementById("message");
const scoreSpan = document.getElementById("score");
const eventIcon = document.getElementById("eventIcon");

const places = document.querySelectorAll(".place");
const commandButtons = document.querySelectorAll("#commandPanel button");

let score = 0;
let currentMission = null;

const missions = [
  {
    text: "은행에 도둑이 나타났어요!",
    place: "bank",
    icon: "😈💰",
    answer: "arrest",
    success: "👮 도둑 체포 성공!"
  },
  {
    text: "도로에서 차 사고가 났어요!",
    place: "road",
    icon: "🚗💥",
    answer: "tow",
    success: "🚛 견인차 출동 완료!"
  },
  {
    text: "신호등이 고장났어요!",
    place: "road",
    icon: "🚦",
    answer: "traffic",
    success: "🚦 교통정리 성공!"
  },
  {
    text: "경찰차가 고장났어요!",
    place: "garage",
    icon: "🔧",
    answer: "repair",
    success: "👨‍🔧 경찰차 수리 완료!"
  },
  {
    text: "공원에 수상한 사람이 있어요!",
    place: "park",
    icon: "🕵️",
    answer: "patrol",
    success: "🚓 순찰 완료!"
  },
  {
    text: "학교 앞에 민원이 들어왔어요!",
    place: "school",
    icon: "📝",
    answer: "help",
    success: "📝 민원 처리 완료!"
  }
];

newCallBtn.addEventListener("click", makeNewCall);

commandButtons.forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    handleAction(action);
  });
});

function makeNewCall() {
  clearHighlights();

  currentMission = missions[Math.floor(Math.random() * missions.length)];

  callScreen.textContent = "☎ 신고 접수: " + currentMission.text;
  message.textContent = "지도에서 빨간색으로 표시된 장소를 보고 알맞은 출동 명령을 눌러주세요.";

  const place = document.getElementById(currentMission.place);
  place.classList.add("highlight");

  const rect = place.getBoundingClientRect();
  const mapRect = document.getElementById("cityMap").getBoundingClientRect();

  eventIcon.textContent = currentMission.icon;
  eventIcon.style.left = rect.left - mapRect.left + rect.width / 2 + "px";
  eventIcon.style.top = rect.top - mapRect.top + rect.height / 2 + "px";
}

function handleAction(action) {
  if (!currentMission) {
    message.textContent = "먼저 신고 전화를 받아주세요!";
    return;
  }

  if (action === currentMission.answer) {
    score++;
    scoreSpan.textContent = score;
    message.textContent = currentMission.success + " 다음 신고를 받아보세요!";
    callScreen.textContent = "✅ 사건 해결 완료!";
    currentMission = null;
    clearHighlights();
    eventIcon.textContent = "🚓";
    eventIcon.style.left = "50%";
    eventIcon.style.top = "48%";
  } else {
    message.textContent = "❌ 다른 명령이에요. 신고 내용을 다시 보고 알맞은 버튼을 눌러주세요!";
  }
}

function clearHighlights() {
  places.forEach(place => {
    place.classList.remove("highlight");
  });
}
