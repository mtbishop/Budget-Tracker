let db;

const request = indexedDB.open("budget_db", 1);

request.onupgradeneeded = function (e) {
    db = e.target.result;
    const { version1 } = e;
    const version2 = e.version2 || db.version;


}