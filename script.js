let notes =
  JSON.parse(localStorage.getItem("vesperNotes")) || [];

let favoritesOnly = false;

function setupPIN() {
  let pin = localStorage.getItem("vesperPIN");

  if (!pin) {
    pin = prompt("اختاري رمز قفل من 4 أرقام:");

    if (pin && /^\d{4}$/.test(pin)) {
      localStorage.setItem("vesperPIN", pin);
    } else {
      alert("لازم يكون الرمز 4 أرقام.");
      setupPIN();
    }
  }
}

function unlockApp() {
  const enteredPIN =
    document.getElementById("pinInput").value;

  const savedPIN =
    localStorage.getItem("vesperPIN");

  if (enteredPIN === savedPIN) {
    document.getElementById("lockScreen")
      .classList.add("hidden");

    document.getElementById("app")
      .classList.remove("hidden");

    document.getElementById("pinInput").value = "";
    document.getElementById("lockMessage").textContent = "";

  } else {
    document.getElementById("lockMessage").textContent =
      "الرمز غير صحيح 🤍";
  }
}

function lockApp() {
  document.getElementById("app")
    .classList.add("hidden");

  document.getElementById("lockScreen")
    .classList.remove("hidden");

  document.getElementById("pinInput").value = "";
}

function saveNote() {
  const title =
    document.getElementById("title").value.trim();

  const text =
    document.getElementById("note").value.trim();

  if (title === "") {
    document.getElementById("message").textContent =
      "اكتبي عنوان الملاحظة أولاً 🤍";
    return;
  }

  if (text === "") {
    document.getElementById("message").textContent =
      "اكتبي الملاحظة أولاً 🤍";
    return;
  }

  const newNote = {
    id: Date.now(),
    title: title,
    text: text,
    favorite: false
  };

  notes.unshift(newNote);

  saveData();

  document.getElementById("title").value = "";
  document.getElementById("note").value = "";

  document.getElementById("message").textContent =
    "تم حفظ الملاحظة 🤍";

  displayNotes();
}

function displayNotes() {
  const list =
    document.getElementById("notesList");

  const search =
    document.getElementById("search")
      .value
      .toLowerCase();

  list.innerHTML = "";

  let filteredNotes =
    notes.filter(note =>
      note.title.toLowerCase().includes(search) ||
      note.text.toLowerCase().includes(search)
    );

  if (favoritesOnly) {
    filteredNotes =
      filteredNotes.filter(note => note.favorite);
  }

  if (filteredNotes.length === 0) {
    list.innerHTML =
      "<p style='text-align:center;'>ما في ملاحظات هون 🤍</p>";
    return;
  }

  filteredNotes.forEach(note => {
    const card =
      document.createElement("div");

    card.className = "note-card";

    card.innerHTML = `
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
      ">

        <h3>${escapeHTML(note.title)}</h3>

        <button
          class="favorite"
          onclick="toggleFavorite(${note.id})">

          ${note.favorite ? "⭐" : "☆"}

        </button>

      </div>

      <p>${escapeHTML(note.text)}</p>

      <div class="note-buttons">

        <button
          class="edit"
          onclick="editNote(${note.id})">
          تعديل ✏️
        </button>

        <button
          class="delete"
          onclick="deleteNote(${note.id})">
          حذف 🗑️
        </button>

      </div>
    `;

    list.appendChild(card);
  });
}

function deleteNote(id) {
  notes =
    notes.filter(note => note.id !== id);

  saveData();
  displayNotes();
}

function editNote(id) {
  const note =
    notes.find(note => note.id === id);

  if (!note) return;

  document.getElementById("title").value =
    note.title;

  document.getElementById("note").value =
    note.text;

  deleteNote(id);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function toggleFavorite(id) {
  const note =
    notes.find(note => note.id === id);

  if (!note) return;

  note.favorite =
    !note.favorite;

  saveData();
  displayNotes();
}

function showFavorites() {
  favoritesOnly =
    !favoritesOnly;

  displayNotes();
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  const dark =
    document.body.classList.contains("dark");

  localStorage.setItem(
    "vesperDarkMode",
    dark
  );
}

function saveData() {
  localStorage.setItem(
    "vesperNotes",
    JSON.stringify(notes)
  );
}

function escapeHTML(text) {
  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

window.onload = function() {
  setupPIN();

  const darkMode =
    localStorage.getItem("vesperDarkMode");

  if (darkMode === "true") {
    document.body.classList.add("dark");
  }

  displayNotes();
};
