var books = null;
const RENDER_EVENT = 'RENDER_EVENT';

document.addEventListener('DOMContentLoaded', function () {
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

document.addEventListener(RENDER_EVENT, function () {
  saveData();
  const listItemBooks = document.getElementById('books');
  const listItemBooksCompleted = document.getElementById('completed-books');
  listItemBooksCompleted.innerHTML = '';
  listItemBooks.innerHTML = '';

  for (const book of books) {
    const bookElement = makeBook(book);

    if (book.isCompleted) {
      listItemBooksCompleted.append(bookElement);
    } else {
      listItemBooks.append(bookElement);
    }
  }
});

function addBook() {
  const judul = document.getElementById('judul').value;
  const penulis = document.getElementById('penulis').value;
  const tahun = document.getElementById('tahun').value;
  const isCompleted = document.getElementById('check-selesai-dibaca').checked;
  const id = generateId();

  const bookObject = {
    id: id,
    judul: judul,
    penulis: penulis,
    tahun: tahun,
    isCompleted: isCompleted,
  };

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const container = document.createElement('div');
  container.classList.add('container-book');
  const judul = document.createElement('h5');
  judul.classList.add('judul-book');
  judul.innerText = bookObject.judul;
  const penulis = document.createElement('p');
  penulis.innerText = 'Penulis ' + bookObject.penulis;
  const tahun = document.createElement('p');
  tahun.innerText = 'Tahun ' + bookObject.tahun;

  if (bookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('btn', 'belum-selesai-dibaca');
    undoButton.innerHTML = '<i class="bi bi-info-circle"></i> Belum selesai dibaca';
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'delete');
    deleteButton.innerHTML = '<i class="bi bi-x-circle"></i> Hapus';

    undoButton.addEventListener('click', function () {
      undoTaskFormBook(bookObject.id);
    });
    deleteButton.addEventListener('click', function () {
      removeTaskFormBook(bookObject.id);
    });

    container.append(judul, penulis, tahun, undoButton, deleteButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('btn', 'selesai-dibaca');
    checkButton.innerHTML = '<i class="bi bi-check-circle"></i> Selesai dibaca';
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'delete');
    deleteButton.innerHTML = '<i class="bi bi-x-circle"></i> Hapus';

    checkButton.addEventListener('click', function () {
      addTaskFormBook(bookObject.id);
    });
    deleteButton.addEventListener('click', function () {
      if (dialogRemove()) {
        removeTaskFormBook(bookObject.id);
      }
    });

    container.append(judul, penulis, tahun, checkButton, deleteButton);
  }

  return container;
}

function generateId() {
  return +new Date();
}

function addTaskFormBook(id) {
  const bookTarget = findBook(id);

  if (bookTarget === null) return;

  bookTarget.isCompleted = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFormBook(id) {
  const bookTarget = findBook(id);

  if (bookTarget === null) return;

  bookTarget.isCompleted = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTaskFormBook(id) {
  const bookTarget = findIndexBook(id);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findIndexBook(id) {
  for (const index in books) {
    if (books[index].id === id) {
      return index;
    }
  }

  return -1;
}

function findBook(id) {
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }

  return null;
}

function dialogRemove() {
  return confirm('Anda yakin menghapus?');
}
