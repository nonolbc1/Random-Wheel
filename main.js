const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
let entries = [];
let angle = 0;
let spinning = false;
let rotationSpeed = 0;
const colors = ["red", "orange", "yellow", "green", "blue", "violet"];

function addEntry() {
  const label = document.getElementById("labelInput").value;
  const imageFile = document.getElementById("imageInput").files[0];

  const entry = { label: label || null, image: null };
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function () {
      entry.image = new Image();
      entry.image.onload = () => {
        entries.push(entry);
        updateEntryList();
        drawWheel();
      };
      entry.image.src = reader.result;
    };
    reader.readAsDataURL(imageFile);
  } else {
    entries.push(entry);
    updateEntryList();
    drawWheel();
  }

  document.getElementById("labelInput").value = "";
  document.getElementById("imageInput").value = "";
}

function updateEntryList() {
  const list = document.getElementById("entryList");
  list.innerHTML = "";
  entries.forEach((entry, i) => {
    const div = document.createElement("div");
    div.className = "entryItem";
    div.innerText = entry.label || "Image";
    div.onclick = () => {
      entries.splice(i, 1);
      updateEntryList();
      drawWheel();
    };
    list.appendChild(div);
  });
}

function drawWheel() {
  const radius = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  if (entries.length === 0) return;

  const arc = (2 * Math.PI) / entries.length;
  entries.forEach((entry, i) => {
    const startAngle = angle + i * arc;
    const endAngle = startAngle + arc;

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.fill();

    const midAngle = startAngle + arc / 2;
    const textX = centerX + Math.cos(midAngle) * (radius / 2);
    const textY = centerY + Math.sin(midAngle) * (radius / 2);

    if (entry.image) {
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(midAngle);
      ctx.drawImage(entry.image, -20, -20, 40, 40);
      ctx.restore();
    } else if (entry.label) {
      ctx.fillStyle = "white";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;

      let fontSize = 18;
      ctx.font = `bold ${fontSize}px sans-serif`;

      while (ctx.measureText(entry.label).width > 250 && fontSize > 10) {
        fontSize--;
        ctx.font = `bold ${fontSize}px sans-serif`;
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(midAngle);
      ctx.strokeText(entry.label, 0, 0);
      ctx.fillText(entry.label, 0, 0);
      ctx.restore();
    }
  });

  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
}

function spinWheel() {
  if (spinning || entries.length === 0) return;
  spinning = true;
  rotationSpeed = Math.random() * 0.2 + 0.3;

  const interval = setInterval(() => {
    angle += rotationSpeed;
    rotationSpeed *= 0.98;
    drawWheel();

    if (rotationSpeed < 0.002) {
      clearInterval(interval);
      spinning = false;
    }
  }, 20);
}

function toggleFullscreen() {
  document.body.classList.toggle("fullscreen");
  drawWheel();
}

drawWheel();