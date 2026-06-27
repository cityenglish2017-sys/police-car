const callBtn = document.getElementById("callBtn");
const dispatchBtn = document.getElementById("dispatchBtn");
const phoneBox = document.getElementById("phoneBox");
const message = document.getElementById("message");
const movingCar = document.getElementById("movingCar");
const cityObjects = document.getElementById("cityObjects");
const scoreSpan = document.getElementById("score");

const towBtn = document.getElementById("towBtn");
const mechanicBtn = document.getElementById("mechanicBtn");
const trafficBtn = document.getElementById("trafficBtn");
const repairPanel = document.getElementById("repairPanel");

let score = 0;
let carX = 45;
let currentMission = null;
let gameRunning = false;
let obstacleTimer = null;

const missions = [
  {
    type: "robber",
    call: "☎ 신고! 은행 근처에 도둑이 나타났어요!",
    success: "👮 도둑 체포 성공! Owen 경찰 최고!"
  },
  {
    type: "lostDog",
    call: "☎ 민원! 길 잃은 강아지를 찾아주세요!",
    success: "🐶 강아지를 가족에게 돌려줬어요!"
  },
  {
    type: "accident",
    call: "☎ 교통사고 발생! 견인차가 필요해요!",
    success: "🚛 사고 차량을 견인했어요!"
  },
  {
    type: "traffic",
    call: "☎ 신호등 고장! 교통정리가 필요해요!",
    success: "🚦 교통정리 완료! 차들이 안전하게 지나갔어요!"
  },
  {
    type: "suspicious",
    call: "☎ 수상한 사람이 보여요! 순찰이 필요해요!",
    success: "👮 순찰 완료! Owen City가 안전해졌어요!"
  }
];

callBtn.addEventListener("click", receiveCall);
dispatchBtn.addEventListener("click", dispatchPoliceCar);
towBtn.addEventListener("click", callTowTruck);
mechanicBtn.addEventListener("click", callMechanic);
trafficBtn.addEventListener("click", controlTraffic);

document.addEventListener("keydown", moveCar);

document.querySelectorAll("#repairPanel button").forEach(btn => {
  btn.addEventListener("click", () => {
    message.textContent = `👨‍🔧 ${btn.dataset.repair} 수리 완료! 다시 출동할 수 있어요!`;
    repairPanel.classList.add("hidden");
    gameRunning = true;
  });
});

function receiveCall() {
  clearCity();
  currentMission = missions[Math.floor(Math.random() * missions.length)];
  phoneBox.textContent = currentMission.call;
  message.textContent = "어디로 출동할지 확인했어요. 경찰차 출동 버튼을 눌러주세요!";
}

function dispatchPoliceCar() {
  if (!currentMission) {
    message.textContent = "먼저 신고 전화를 받아야 해요!";
    return;
  }

  gameRunning = true;
  carX = 45;
  movingCar.style.left = carX + "%";
  message.textContent = "🚨 WEEOO WEEOO! 경찰차 출동! 장애물을 피하세요!";
  clearCity();
  spawnMissionTarget();

  obstacleTimer = setInterval(spawnObstacle, 1200);

  setTimeout(() => {
    if (gameRunning) {
      finishMission();
    }
  }, 8500);

  maybeCarTrouble();
}

function spawnMissionTarget() {
  const target = document.createElement("div");
  target.className = "robber";

  if (currentMission.type === "robber") target.textContent = "😈💰";
  else if (currentMission.type === "lostDog") target.textContent = "🐶";
  else if (currentMission.type === "accident") target.textContent = "🚗💥";
  else if (currentMission.type === "traffic") target.textContent = "🚦";
  else target.textContent = "🕵️";

  cityObjects.appendChild(target);
}

function spawnObstacle() {
  if (!gameRunning) return;

  const obstacle = document.createElement("div");
  obstacle.className = "object";

  const items = ["🚧", "🪨", "🚛", "🌳", "🚗"];
  obstacle.textContent = items[Math.floor(Math.random() * items.length)];
  obstacle.style.left = Math.floor(Math.random() * 75 + 10) + "%";
  obstacle.style.top = "-50px";

  cityObjects.appendChild(obstacle);

  let y = -50;
  const fall = setInterval(() => {
    if (!gameRunning) {
      clearInterval(fall);
      obstacle.remove();
      return;
    }

    y += 8;
    obstacle.style.top = y + "px";

    const obsX = parseInt(obstacle.style.left);
    if (y > 310 && y < 390 && Math.abs(obsX - carX) < 12) {
      message.textContent = "💥 장애물과 부딪혔어요! 정비공을 불러 수리하세요!";
      gameRunning = false;
      clearInterval(obstacleTimer);
      repairPanel.classList.remove("hidden");
    }

    if (y > 450) {
      clearInterval(fall);
      obstacle.remove();
    }
  }, 60);
}

function moveCar(e) {
  if (!gameRunning) return;

  if (e.key === "ArrowLeft") {
    carX -= 8;
  } else if (e.key === "ArrowRight") {
    carX += 8;
  }

  if (carX < 5) carX = 5;
  if (carX > 82) carX = 82;

  movingCar.style.left = carX + "%";
}

function maybeCarTrouble() {
  const trouble = Math.random();

  if (trouble < 0.25) {
    setTimeout(() => {
      if (gameRunning) {
        gameRunning = false;
        clearInterval(obstacleTimer);
        message.textContent = "⚠ 경찰차 수리 문제 발생! 정비공을 불러주세요!";
        repairPanel.classList.remove("hidden");
      }
    }, 3500);
  }
}

function finishMission() {
  gameRunning = false;
  clearInterval(obstacleTimer);

  if (!currentMission) return;

  message.textContent = currentMission.success;
  score++;
  scoreSpan.textContent = score;

  currentMission = null;
  phoneBox.textContent = "☎ 신고 대기 중...";
}

function callTowTruck() {
  if (currentMission && currentMission.type === "accident") {
    message.textContent = "🚛 견인차 출동! 사고 차량을 안전하게 옮겼어요!";
    finishMission();
  } else {
    message.textContent = "🚛 지금은 견인차가 꼭 필요하지 않아요.";
  }
}

function callMechanic() {
  message.textContent = "👨‍🔧 정비공이 왔어요. 고칠 곳을 선택하세요!";
  repairPanel.classList.remove("hidden");
  gameRunning = false;
}

function controlTraffic() {
  if (currentMission && currentMission.type === "traffic") {
    message.textContent = "🚦 STOP! GO! 교통정리 성공!";
    finishMission();
  } else {
    message.textContent = "👮 지금은 교통정리가 필요하지 않아요.";
  }
}

function clearCity() {
  cityObjects.innerHTML = "";
  clearInterval(obstacleTimer);
}