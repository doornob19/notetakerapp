const addNotesButtons = document.querySelectorAll(".add-notes-btn");
const closeButton = document.querySelector(".close-btn");
const cancelButton = document.querySelector(".cancel-btn");
const dialog = document.getElementById("note-dialog");
const dialogForm = document.getElementById("dialog-form");
let notes = [];

addNotesButtons.forEach((button) => {
    button.addEventListener("click", () => {
        dialog.showModal();
    });
});

dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
        dialog.close();
    }
});

closeButton.addEventListener("click", () => {
    dialog.close();
});

cancelButton.addEventListener("click", () => {
    dialog.close();
    dialogForm.reset();
});

dialogForm.addEventListener("submit", saveNote);

function saveNote(e) {
    e.preventDefault();

    const title = document.getElementById("note-title").value.trim();
    const content = document.getElementById("note-content").value.trim();
    
    notes.unshift({
        id: generateId(),
        title: title,
        content: content,
    });

    saveNotes();
    dialog.close();
    dialogForm.reset();
}

function generateId() {
    return Date.now().toString();
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}