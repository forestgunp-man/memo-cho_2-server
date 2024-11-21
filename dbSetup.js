const sqlite3 = require('sqlite3').verbose();

// データベースファイルを作成（既に存在する場合は開く）
const db = new sqlite3.Database('./memoCho.db', (err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

//テーブルを作る
db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS memoTable(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, 
            text TEXT
          )`
    )
});


//テーブル一覧を返すやつ。あとで理解しましょ
function tableList(){
  db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
    if (err) {
      console.error('Error fetching table names', err);
    } else {
      console.log('Tables in database :', rows.map(row => row.name));
    }
});
}



//データベースを消す
function removeDbTest(table){
  db.run(`DROP TABLE IF EXISTS ${table}`, (err) => {
    if (err) {
      console.error('Error deleting table:', err.message);
    } else {
      console.log('Table deleted successfully.');
    }
  });

}

//テスト用めも挿入
function insertTest(title, text){
  db.run('INSERT INTO memoTable (title, text) VALUES (?, ?)', [title, text], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  console.log("insertTest... " + title + " / " + text);
}


//removeDbTest("testTable");
insertTest("初期テストメモ１", "dbセットアップ時に追加されるテスト用めも。その１");
insertTest("お天気めも","今日はすごくいい天気");
insertTest("予定メモ","4/5 映画を見に行く\n4/9 メソポタミア文明を興す\n4/12 友達を作る");
insertTest("買い物メモ","胡椒\n牛乳\nたまねぎ");
tableList();


//   {title:"お天気めも",text:"今日はすごくいい天気"},
//   {title:"買い物メモ",text:"胡椒\n牛乳\nたまねぎ"},
//   {title:"予定メモ",text:"4/5 映画を見に行く\n4/9 メソポタミア文明を興す\n4/12 友達を作る"}