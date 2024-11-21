const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3002; // PORT環境変数を使い、ない場合はローカル用の3001番を使う
const path = require('path'); //なんか、path結合に使ってる よ

const dbPath = "./" //dbを置く場所をかく よ





// JSONのリクエストボディを解析するミドルウェア
app.use(express.json());

// CORSの設定
app.use(cors());



//----データベース----

//dbを定義
const sqlite3 = require('sqlite3').verbose();

// データベースファイルを作成（既に存在する場合は開く）
const db = new sqlite3.Database(`${dbPath}memoCho.db`, (err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

//テーブルを作る
db.run(
  `CREATE TABLE IF NOT EXISTS memoTable(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT, 
      text TEXT
    )`
)



//----リクエスト----

//getMemoList
app.get('/getMemoList', (req, res) =>{
  console.log("getMemoList!");
  //データベースからとってくる
  db.all('SELECT id, title FROM memoTable', [], (err, rows) => {
    if (err) {
      throw err;
    }
    
    console.log("getmemoList... ", rows);
    res.send(rows);
  });
})


//newRecordMemo
app.post('/newRecordMemo', (req, res) => {
  console.log("recordMemo! req... ",req.body)

  const title = req.body.title;
  const text = req.body.text;

  //データ追加
  db.run('INSERT INTO memoTable (title, text) VALUES (?, ?)', [title, text], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`dataAdded! id... ${this.lastID}`);
    res.status(200).send({"id":this.lastID}); // レスポンスを返す
  });
})


//deleteMemo
app.post("/deleteMemo", (req, res) => {
  
  const id = req.body.id;
  console.log("deleteMemo req... ", id);

  //データ追加
  db.run('DELETE FROM memoTable WHERE id = ?', [id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log("data deleted!! id... ",id);
    res.status(200).send()
  });

})


//getMemoData
app.get('/getMemoData', (req, res) =>{
  console.log("getMemoData! id...", req.query);
  const id = req.query.id

  //データベースからとってくる
  db.all('SELECT * FROM memoTable WHERE id = ?', [id], (err, rows) => {
    if (err) {
      throw err;
    }
    
    console.log("memoData... ", rows);
    res.send(rows);
  });
})

//recordMemoUpdate
app.post("/recordMemoUpdate", (req, res) => {
  console.log("recordMemoUpdate! id...", req.body);
  const data = req.body
  db.run('UPDATE memoTable SET title = ?, text = ? WHERE id = ?', [data.title, data.text, data.id], (err, rows) => {
    if (err) {
      throw err;
    }
    res.status(200).send()
  })
})



//----reactapp----

// ビルド済みのフロントエンドファイルを提供
app.use(express.static(path.join(__dirname, 'build')));

// すべてのリクエストに対してindex.htmlを返す
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



//----sabakidou----
// サーバーを起動
app.listen(port, () => {
  //console.log(`Server running at http://localhost:${port}`);
  console.log("a!tuita!");
});




