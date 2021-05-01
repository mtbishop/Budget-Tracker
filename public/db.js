let db;

const request = indexedDB.open('budget_db', 1);

// Will trigger if db doesn't exist
request.onupgradeneeded = function (e) {
  db = e.target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('MoneyStore', { autoIncrement: true });
  }
};

//Error request
request.onerror = function (e) {
  console.log('Error loading database.');
};

// On success
request.onsuccess = function () {
  db = target.result;
  if (navigator.onLine) {
    checkDB();
  }
};
// function
function checkDB() {
  const store = transaction.objectStore('pending');
  const retrieved = store.getAll();
  const transaction = db.transaction(['pending...'], 'readwrite');
  // onsuccess it will take you to the url on 34 and display the results of the database
  retrieved.onsuccess = function () {
    if (retrieved.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(retrieved.result),
        headers: {
          Accept: "application/json, text/plain, '/'",
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          return response.json();
        })
        .then(() => {
          store.clear();
        });
    }
  };
}
const saveRecord = (record) => {
  const transaction = db.transaction(['pending...'], 'readwrite');
  const store = transaction.objectStore('pending');

  store.add(record);
};

window.addEventListener("online", checkDB);