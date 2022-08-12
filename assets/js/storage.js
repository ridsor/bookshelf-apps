const STORAGE_KEY = 'STORAGE_KEY';

function isStorageExist() {
    return typeof(Storage) !== undefined;
}

function showBook(){
    if(isStorageExist()) {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    return [];
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadDataFromStorage() {
    books = showBook();
    document.dispatchEvent(new Event(RENDER_EVENT));
}