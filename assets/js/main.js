var books = null;
const RENDER_EVENT = 'RENDER_EVENT';
const SEARCH_EVENT = 'SEARCH_EVENT';

document.addEventListener('DOMContentLoaded', function () {
  const formInput = document.getElementById('add-book');
  loadDataFromStorage();

  formInput.addEventListener('submit', function (e) {
    e.preventDefault();
    addBook();
  });

  document.getElementById('keyword').addEventListener('keypress', function (e) {
    if (e.which == 13) {
      document.dispatchEvent(new Event(SEARCH_EVENT));
    }
  });
  document.getElementById('search').addEventListener('click', function () {
    document.dispatchEvent(new Event(SEARCH_EVENT));
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

document.addEventListener(SEARCH_EVENT, function () {
  const keyword = document.getElementById('keyword');
  const filter = keyword.value.toLowerCase();
  const listItemBooks = document.getElementById('books');
  const listItemBooksCompleted = document.getElementById('completed-books');
  listItemBooksCompleted.innerHTML = '';
  listItemBooks.innerHTML = '';

  for (const book of books) {
    if (book.isCompleted) {
      if (book.judul.toLowerCase().indexOf(filter) > -1) {
        const bookElement = makeBook(book);
        listItemBooksCompleted.append(bookElement);
      }
    } else {
      if (book.judul.toLowerCase().indexOf(filter) > -1) {
        const bookElement = makeBook(book);
        listItemBooks.append(bookElement);
      }
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

  books.unshift(bookObject);

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
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'delete');
  deleteButton.innerHTML = '<i class="bi bi-x-circle"></i> Hapus';

  if (bookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('btn', 'belum-selesai-dibaca');
    undoButton.innerHTML = '<i class="bi bi-info-circle"></i> Belum selesai dibaca';

    undoButton.addEventListener('click', function () {
      undoTaskFormBook(bookObject.id);
    });

    container.append(judul, penulis, tahun, undoButton, deleteButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('btn', 'selesai-dibaca');
    checkButton.innerHTML = '<i class="bi bi-check-circle"></i> Selesai dibaca';

    checkButton.addEventListener('click', function () {
      addTaskFormBook(bookObject.id);
    });

    container.append(judul, penulis, tahun, checkButton, deleteButton);
  }

  deleteButton.addEventListener('click', function () {
    dialogConfirm();
    const content = document.getElementById('content');
    const confirm = document.getElementById('confirm');

    document.getElementById('btnYes').addEventListener('click', function () {
      removeTaskFormBook(bookObject.id);
      content.removeChild(confirm);
    });

    document.getElementById('btnNo').addEventListener('click', function () {
      content.removeChild(confirm);
    });

    document.getElementById('exit').addEventListener('click', function () {
      content.removeChild(confirm);
    });
  });

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

function dialogConfirm() {
  const content = document.getElementById('content');
  const confirm = document.createElement('div');
  confirm.classList.add('confirm');
  confirm.setAttribute('id', 'confirm');
  confirm.innerHTML +=
    '<div class="container"><div class="exit"><div class="brand">Bookshelf Apps</div><i class="bi bi-x-circle" id="exit"></i></div><div class="title">Apakah anda yakin melakukannya?</div><div class="btn-container"><button class="btnYes" id="btnYes">Yes</button><button class="btnNo" id="btnNo">No</button></div></div>';
  content.append(confirm);
}
