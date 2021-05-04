let db;

const request = indexedDB.open('budget_db', 6);

// Will trigger if db doesn't exist
request.onupgradeneeded = function (e) {
  db = e.target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('budget-collection', { autoIncrement: true });
  }
};

//Error request
request.onerror = function () {
  console.log('Error loading database.');
};

// On success
request.onsuccess = function (e) {
  db = e.target.result;
  if (navigator.onLine) {
    checkDB();
  }
};
// function
function checkDB() {
  const transaction = db.transaction(['budget-collection'], 'readwrite');
  const store = transaction.objectStore('budget-collection');
  const retrieved = store.getAll();
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
          const transaction = db.transaction(['budget-collection'], 'readwrite');
          const store = transaction.objectStore('budget-collection');

          // const storeState = transaction.objectStore("budget-collection");
          store.clear();
        });
    }
  };
}
const saveRecord = (record) => {
  const transaction = db.transaction(['budget-collection'], 'readwrite');
  const store = transaction.objectStore('budget-collection');

  store.add(record);
};

window.addEventListener('online', checkDB);
