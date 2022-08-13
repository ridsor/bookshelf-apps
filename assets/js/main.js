var books = [];
const RENDER_EVENT = 'RENDER_EVENT';

window.addEventListener('DOMContentLoaded', function () {
  const formInput = document.getElementById('add-book');
  const formSearch = document.getElementById('search-book');
  loadDataFromStorage();

  formInput.addEventListener('submit', function (e) {
    e.preventDefault();
    addBook();
  });

  formSearch.addEventListener('submit', function (e) {
    e.preventDefault();
    searchBook();
  });
});

window.addEventListener(RENDER_EVENT, function () {
  saveData();
});

function addBook() {
  const judul = document.getElementById('judul').value;
  const penulis = document.getElementById('penulis').value;
  const tahun = document.getElementById('tahun').value;
  const isCompleted = document.getElementById('check-selesai-dibaca').checked;
  const id = genereteId();

  if (isBookExist()) {
    const bookObject = {
      id: id,
      judul: judul,
      penulis: penulis,
      tahun: tahun,
      isComplete: isCompleted,
    };

    books.push(bookObject);
    makeBook(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function makeBook(boookObject) {}

function generateId() {
  return +new Date();
}

function isBookExist(judul) {
  for (const item of books) {
    if (item.judul === judul) {
      return false;
    }
  }

  return true;
}
