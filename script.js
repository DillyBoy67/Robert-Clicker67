// --- Game Variables ---
let hairs = 0;
let hairsPerClick = 1;
let hairsPerSecond = 0;
let clickCount = 0;
let rebirths = 0;
let rebirthCost = 100000;
let multiplier = 1;
let autoInterval = 1000;

// --- Upgrades ---
let upgrades = [
  { name: "More Trimming", baseCost: 20, costScale: 5, clickBonus: 1, autoBonus: 0, level: 0 },
  { name: "Unsafety Scissors", baseCost: 200, costScale: 25, clickBonus: 5, autoBonus: 0, level: 0 },
  { name: "Razor Blade", baseCost: 500, costScale: 50, clickBonus: 0, autoBonus: 20, level: 0 },
  { name: "Safety Razor", baseCost: 5000, costScale: 200, clickBonus: 0, autoBonus: 100, level: 0 },
  { name: "Homer Simpson Automatic Razor", baseCost: 10000, costScale: 2000, clickBonus: 500, autoBonus: 500, level: 0 }
];

// --- Load Game ---
window.onload = () => {
  const save = JSON.parse(localStorage.getItem('robertClickerSave'));
  if (save) {
    hairs = save.hairs || 0;
    hairsPerClick = save.hairsPerClick || 1;
    hairsPerSecond = save.hairsPerSecond || 0;
    rebirths = save.rebirths || 0;
    multiplier = save.multiplier || 1;
    upgrades = save.upgrades || upgrades;
  }
  updateUpgrades();
  updateDisplay();
};

// --- Save Game ---
function saveGame() {
  localStorage.setItem('robertClickerSave', JSON.stringify({
    hairs,
    hairsPerClick,
    hairsPerSecond,
    rebirths,
    multiplier,
    upgrades
  }));
}

// --- Update Display ---
function updateDisplay() {
  document.getElementById("hairCount").innerText = `Arm Hairs: ${Math.floor(hairs)}`;
  document.getElementById("cps").innerText = `CPS: ${(hairsPerSecond * multiplier + clickCount * multiplier).toFixed(1)}`;
  document.getElementById("rebirthCount").innerText = `Rebirths: ${rebirths}`;
  document.getElementById("rebirthButton").innerText = `Rebirth (Cost: ${rebirthCost})`;
}

// --- Update Upgrades ---
function updateUpgrades() {
  upgrades.forEach((u, i) => {
    const btn = document.getElementById(`upgrade${i + 1}`);
    const cost = u.baseCost + u.level * u.costScale;
    btn.innerHTML = `${u.name} (Lvl ${u.level})<br>
      +${u.clickBonus} per click, +${u.autoBonus} per second<br>
      Cost: ${cost}<br>
      CPS: ${(u.autoBonus * multiplier).toFixed(1)}`;
  });
}

// --- Click Button ---
document.getElementById("clickButton").onclick = () => {
  hairs += hairsPerClick * multiplier;
  clickCount++;
  updateDisplay();
};

// --- Auto Click Hairs ---
setInterval(() => {
  hairs += hairsPerSecond * multiplier;
  updateDisplay();
  saveGame();
}, 1000);

// --- Upgrade Buttons ---
upgrades.forEach((u, i) => {
  document.getElementById(`upgrade${i + 1}`).onclick = () => {
    const cost = u.baseCost + u.level * u.costScale;
    if (hairs >= cost) {
      hairs -= cost;
      u.level++;
      hairsPerClick += u.clickBonus;
      hairsPerSecond += u.autoBonus;
      updateUpgrades();
      updateDisplay();
    }
  };
});

// --- Rebirth ---
document.getElementById("rebirthButton").onclick = () => {
  if (hairs >= rebirthCost) {
    hairs = 0;
    rebirths++;
    multiplier *= 2;
    rebirthCost *= 10;

    upgrades.forEach(u => {
      const lost = Math.floor(u.level * 0.5); // remove 50% of upgrades
      u.level -= lost;
      if (u.level < 0) u.level = 0;
    });

    hairsPerClick = 1 + upgrades.reduce((sum, u) => sum + u.level * u.clickBonus, 0);
    hairsPerSecond = upgrades.reduce((sum, u) => sum + u.level * u.autoBonus, 0);

    updateUpgrades();
    updateDisplay();
    saveGame();
  }
};

// --- Customize Menu ---
document.getElementById('bgColorPicker').oninput = e => {
  document.body.style.backgroundColor = e.target.value;
};

document.getElementById('btnColorPicker').oninput = e => {
  document.querySelectorAll('button').forEach(btn => {
    btn.style.backgroundColor = e.target.value;
  });
};

// --- Admin Panel ---
const adminBtn = document.getElementById("adminButton");
const adminPanel = document.getElementById("adminPanel");
const closeAdmin = document.getElementById("closeAdmin");

adminBtn.onclick = () => {
  const pass = prompt("Enter password:");
  if (pass === "I867") adminPanel.classList.remove("hidden");
};

closeAdmin.onclick = () => adminPanel.classList.add("hidden");

document.getElementById("giveMoney").onclick = () => {
  const amount = parseFloat(prompt("Enter amount of hairs to add:"));
  if (!isNaN(amount)) {
    hairs += amount;
    updateDisplay();
  }
};

document.getElementById("setClickInterval").onclick = () => {
  const newInterval = parseFloat(prompt("Enter new auto click interval (seconds):"));
  if (!isNaN(newInterval) && newInterval > 0) {
    clearInterval(autoInterval);
    autoInterval = setInterval(() => {
      hairs += hairsPerSecond * multiplier;
      updateDisplay();
    }, newInterval * 1000);
  }
};

document.getElementById("buyUpgrades").onclick = () => {
  const count = parseInt(prompt("Enter number of upgrades to buy for each type:"));
  if (!isNaN(count) && count > 0) {
    upgrades.forEach(u => {
      u.level += count;
      hairsPerClick += u.clickBonus * count;
      hairsPerSecond += u.autoBonus * count;
    });
    updateUpgrades();
    updateDisplay();
  }
};

document.getElementById("yameenMode").onclick = () => {
  document.querySelectorAll('*').forEach(el => {
    if (el.tagName !== "SCRIPT" && el.tagName !== "STYLE") {
      el.style.fontFamily = "Impact, sans-serif";
      el.innerText = "Yameen";
    }
  });
};
