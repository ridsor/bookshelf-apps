const BOOKSHELF_APPS = 'BOOKSHELF_APPS';

function isStorageExist() {
  return typeof(Storage) !== undefined;
}

function showBook() {
  if (isStorageExist()) {
    return JSON.parse(localStorage.getItem(BOOKSHELF_APPS)) || [];
  }

  return [];
}

function saveData() {
  localStorage.setItem(BOOKSHELF_APPS, JSON.stringify(books));
}

function loadDataFromStorage() {
  books = showBook();
  document.dispatchEvent(new Event(RENDER_EVENT));
}
