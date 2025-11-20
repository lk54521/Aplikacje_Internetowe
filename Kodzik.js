const map = L.map('map').setView([53.67422762513735, 15.11668794926524], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

const grid = document.getElementById("target-grid");

for (let i = 0; i < 16; i++) {
  const slot = document.createElement("div");
  slot.classList.add("target-slot");
  slot.dataset.index = i;

  slot.addEventListener("dragover", handleDragOver);
  slot.addEventListener("drop", handleDrop);

  grid.appendChild(slot);
}

const puzzleContainer = document.getElementById("puzzle-container");
if (puzzleContainer) {
  puzzleContainer.addEventListener("dragover", handleDragOver);
  puzzleContainer.addEventListener("drop", handleDrop);
}

let draggedPiece = null;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(myLocalization);
  }
}

function myLocalization(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  map.setView([lat, lon], 15);
}

function saveAndCreatePuzzle() {

  leafletImage(map, function (err, canvas) {
    if (err) {
      console.error(err);
      return;
    }

    createPuzzleFromCanvas(canvas);
  });
}

function createPuzzleFromCanvas(sourceCanvas) {
  const rows = 4;
  const cols = 4;

  const pieceWidth = sourceCanvas.width / cols;
  const pieceHeight = sourceCanvas.height / rows;

  const pieces = [];
  totalPieces = rows * cols;   
  correctPieces = 0;          
  

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {

      const pieceCanvas = document.createElement('canvas');
      pieceCanvas.width = pieceWidth;
      pieceCanvas.height = pieceHeight;
      const ctx = pieceCanvas.getContext('2d');

      ctx.drawImage(
        sourceCanvas,
        col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight,
        0, 0, pieceWidth, pieceHeight
      );

      const img = new Image();
      img.src = pieceCanvas.toDataURL('image/png');
      img.classList.add('puzzle-piece');

      const index = row * cols + col;
      img.dataset.index = index;

      img.draggable = true;
      img.addEventListener("dragstart", handleDragStart);
      img.addEventListener("dragend", handleDragEnd);

      pieces.push(img);
    }
  }

  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }

  const container = document.getElementById('puzzle-container');
  if (!container) {
    console.error("Brak elementu #puzzle-container");
    return;
  }

  container.innerHTML = '';
  pieces.forEach(piece => container.appendChild(piece));
}

function handleDragStart(e) {
  draggedPiece = e.target;
  draggedPiece.classList.add("dragging");
}

function handleDragEnd(e) {
  if (draggedPiece) {
    draggedPiece.classList.remove("dragging");
    draggedPiece = null;
  }
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  if (!draggedPiece) return;

  const dropZone = e.currentTarget;

  if (dropZone.classList.contains("target-slot")) {

    if (dropZone.firstElementChild) {
      return;
    }

    dropZone.appendChild(draggedPiece);

    const slotIndex = dropZone.dataset.index;
    const pieceIndex = draggedPiece.dataset.index;

    if (slotIndex === pieceIndex) {

      draggedPiece.draggable = false;
      draggedPiece.classList.add("locked");

      correctPieces++;
      checkWinCondition();
    }

  }

  else if (dropZone.id === "puzzle-container") {
    dropZone.appendChild(draggedPiece);
  }
}


function checkWinCondition() {
  if (correctPieces === totalPieces && totalPieces > 0) {
    notifyWin();
  }
}

function notifyWin() {
  const message = "Brawo! Ułożyłeś wszystkie puzzle.";

  if (!("Notification" in window)) {
    alert(message);
    return;
  }

  if (Notification.permission === "granted") {
    new Notification("Puzzle ułożone poprawnie", { body: message });
  }

  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("Puzzle ułożone poprawnie", { body: message });
      } else {
        alert(message);
      }
    });
  } else {
    alert(message);
  }
}
