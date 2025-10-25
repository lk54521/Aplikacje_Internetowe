document.addEventListener("DOMContentLoaded", function () {

  class Todo {
    constructor(listaSelector) {
      this.editingIndex = null;
      this._outsideHandler = null;
      this.lista = document.querySelector(listaSelector);
      this.term = "";
      this.searchInput = document.querySelector('input[type="search"][role="search"]');
      this.bindSearch();

      this.tasks = [
        { text: "Zadanie 1", date: "2025-10-25" },
        { text: "Zadanie 2", date: "2025-10-28" },
      ];
      this.loadFromStorage();

      this.draw();
      this.initAddTask();
    }

    // --- Pomocnicze / walidacja ---
    todayYMD() {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
    isValidFutureDateOrEmpty(dateStr) {
      if (!dateStr) return true;
      return dateStr > this.todayYMD();
    }
    validateText(text) {
      const len = (text || "").trim().length;
      return len >= 3 && len <= 255;
    }

    saveToStorage() {
      try { localStorage.setItem("todoTasks", JSON.stringify(this.tasks)); }
      catch (e) { console.warn("localStorage zapis:", e); }
    }
    loadFromStorage() {
      try {
        const raw = localStorage.getItem("todoTasks");
        if (!raw) return;
        const data = JSON.parse(raw);
        if (Array.isArray(data)) this.tasks = data;
      } catch (e) { console.warn("localStorage odczyt:", e); }
    }

    // --- Wyszukiwarka (≥2 znaki) ---
    bindSearch() {
      if (!this.searchInput) return;
      this.searchInput.addEventListener("input", () => {
        this.term = this.searchInput.value || "";
        this.draw();
      });
    }
    get filteredTasks() {
      const q = this.term.trim().toLowerCase();
      if (q.length < 2) return this.tasks;
      return this.tasks.filter((t) => {
        const text = (t.text || "").toLowerCase();
        const date = (t.date || "").toLowerCase();
        return text.includes(q) || date.includes(q);
      });
    }

    // --- Rysowanie listy ---
    draw() {
      this.lista.innerHTML = "";
      const q = this.term.trim();
      const highlight = q.length >= 2;
      const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      this.filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");

        if (index === this.editingIndex) {
          const textInput = document.createElement("input");
          textInput.type = "text";
          textInput.value = task.text || "";
          textInput.placeholder = "do zrobienia…";
          textInput.style.marginRight = "8px";

          const dateInput = document.createElement("input");
          dateInput.type = "date";
          dateInput.value = task.date || "";
          dateInput.style.marginRight = "8px";

          const saveBtn = document.createElement("button");
          saveBtn.textContent = "Zapisz";
          saveBtn.style.marginRight = "6px";
          saveBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.saveEdit(index, textInput.value, dateInput.value);
          });

          const keyHandler = (e) => {
            if (e.key === "Enter") this.saveEdit(index, textInput.value, dateInput.value);
            if (e.key === "Escape") this.cancelEdit();
          };
          textInput.addEventListener("keydown", keyHandler);
          dateInput.addEventListener("keydown", keyHandler);

          li.appendChild(textInput);
          li.appendChild(dateInput);
          li.appendChild(saveBtn);
        } else {
          const textSpan = document.createElement("span");
          const dateSpan = document.createElement("span");

          if (highlight) {
            const regex = new RegExp(`(${esc(q)})`, "gi");
            textSpan.innerHTML = (task.text || "—").replace(regex, "<mark>$1</mark>");
            dateSpan.innerHTML = (task.date || "").replace(regex, "<mark>$1</mark>");
          } else {
            textSpan.textContent = task.text || "—";
            dateSpan.textContent = task.date || "";
          }

          textSpan.style.marginRight = "10px";
          dateSpan.style.fontWeight = "700";
          dateSpan.style.marginRight = "10px";

          const delBtn = document.createElement("button");
          delBtn.textContent = "🗑️";
          delBtn.style.marginLeft = "5px";
          delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.removeTask(index);
          });

          li.appendChild(textSpan);
          li.appendChild(dateSpan);
          li.appendChild(delBtn);

          li.addEventListener("click", (e) => {
            if (e.target.closest("button, input")) return;
            this.startInlineEdit(index);
          });
        }

        this.lista.appendChild(li);
      });
    }

    // --- Edycja inline + klik poza = zapis ---
    startInlineEdit(index) {
      if (this.editingIndex === index) return;
      this.editingIndex = index;
      this.draw();

      const li = this.lista.querySelectorAll("li")[index];
      if (!li) return;

      const textInput = li.querySelector("input[type='text']");
      if (textInput) textInput.focus();

      this._outsideHandler = (e) => {
        if (!li.contains(e.target)) {
          const t = li.querySelector("input[type='text']")?.value ?? "";
          const d = li.querySelector("input[type='date']")?.value ?? "";
          this.saveInlineEdit(index, t, d);
        }
      };
      document.addEventListener("mousedown", this._outsideHandler, true);
    }
    saveInlineEdit(index, newText, newDate) {
      if (!this.validateText(newText)) { alert("Tekst 3–255 znaków."); return; }
      if (!this.isValidFutureDateOrEmpty(newDate)) { alert("Data pusta albo w przyszłości."); return; }

      this.tasks[index] = { text: newText.trim(), date: (newDate || "").trim() };
      this.saveToStorage();
      this.stopOutsideWatch();
      this.editingIndex = null;
      this.draw();
    }
    stopOutsideWatch() {
      if (this._outsideHandler) {
        document.removeEventListener("mousedown", this._outsideHandler, true);
        this._outsideHandler = null;
      }
    }

    // --- CRUD ---
    addTask(text, date) {
      if (!this.validateText(text)) { alert("Tekst 3–255 znaków."); return; }
      if (!this.isValidFutureDateOrEmpty(date)) { alert("Data pusta albo w przyszłości."); return; }

      this.tasks.push({ text: text.trim(), date: (date || "").trim() });
      this.saveToStorage();
      this.draw();
    }
    removeTask(index) {
      if (this.editingIndex !== null && this.editingIndex >= index) {
        this.editingIndex = null;
        this.stopOutsideWatch();
      }
      this.tasks.splice(index, 1);
      this.saveToStorage();
      this.draw();
    }
    saveEdit(index, newText, newDate) {
      if (!this.validateText(newText)) { alert("Tekst 3–255 znaków."); return; }
      if (!this.isValidFutureDateOrEmpty(newDate)) { alert("Data pusta albo w przyszłości."); return; }

      this.tasks[index] = { text: newText.trim(), date: (newDate || "").trim() };
      this.saveToStorage();
      this.editingIndex = null;
      this.draw();
    }
    cancelEdit() {
      this.editingIndex = null;
      this.draw();
    }

    initAddTask() {
      const textInput = document.getElementById("TaskText");
      const dateInput = document.getElementById("Data");
      const btn = document.querySelector("button[type='button']");

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.addTask(textInput.value, dateInput.value);
        textInput.value = "";
        dateInput.value = "";
      });
    }
  }

  window.todo = new Todo("ul");
});
