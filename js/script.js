// 隣接関係のマップ
const neighbors = {
    0: [1, 3], // 位置0は1,3と隣接
    1: [0, 2, 4], // 位置1は0,2,4と隣接
    2: [1, 5],
    3: [0, 4, 6],
    4: [1, 3, 5, 7],
    5: [2, 4, 8],
    6: [3, 7],
    7: [6, 4, 8],
    8: [5, 7]
};

const EMPTY = null;

// 現在の状態（どの位置にどのタイルがあるか）
let currentState = [1, 3, 2, 4, 7, 5, EMPTY, 8, 6];
let emptyPosition = currentState.indexOf(EMPTY);
// 初期状態を保存
let initialState = currentState.slice();

// ----------------- 描画関連 -----------------
function renderTile(pos) {
    if (typeof pos !== 'number') return;
    
    const tiles = document.querySelectorAll('.player-tile');

    const el = tiles[pos];
    if (!el) return;

    el.innerHTML = '';
    const val = currentState[pos];
    if (val !== EMPTY) {
        const num = document.createElement('div');
        num.className = 'tile-number';
        num.textContent = String(val);
        const img = document.createElement('img');
        img.src = `./img/tile_${val}.png`;
        img.alt = `タイル${val}`;
        el.appendChild(num);
        el.appendChild(img);
    }
}

function renderAll() {
    for (let i = 0; i < 9; i++) renderTile(i);
}

// ----------------- 移動関連 -----------------
function canMove(clickedPosition) {
    return neighbors[emptyPosition].includes(clickedPosition);
}

function moveTile(from, to) {
    // fromのタイルをto(空)に移し、fromを空にする）
    currentState[to] = currentState[from];
    currentState[from] = EMPTY;
    // 再描画
    renderTile(from);
    renderTile(to);
    // 空位置を更新
    emptyPosition = from;
}

function onTileClick(position) {
    if (canMove(position)) {
        moveTile(position, emptyPosition);
        if (currentState.join(',') === '1,2,3,4,5,6,7,8,') {
            const elapsed = startTime ? (Date.now() - startTime) : 0;
            const timeStr = formatTime(elapsed);
            // DOM描画よりも先にアラートを表示(確実性は保障されない)
            setTimeout(() => alert(`クリア！ 経過時間: ${timeStr}`), 50);
        }
    }
}

function resetGame() {
    currentState = initialState.slice();
    emptyPosition = currentState.indexOf(EMPTY);
    renderAll();
}

function shuffleMoves(times = 100) {
    for (let i = 0; i < times; i++) {
        const options = neighbors[emptyPosition];
        const choice = options[Math.floor(Math.random() * options.length)];
        moveTile(choice, emptyPosition);
    }
    
    // やり直し時に新しい盤面で再開できるように更新しておく
    initialState = currentState.slice();
    
    resetTimer();
}


// ----------------- タイマー関連 ----------------------------

let startTime = null;

function formatTime(ms) {
    const total = Math.max(0, Math.floor(ms));
    const minutes = Math.floor(total / 60000);
    const seconds = Math.floor((total % 60000) / 1000);
    const tenths = Math.floor((total % 1000) / 100);
    return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${tenths}`;
}

function startTimer() {
    startTime = Date.now();
}

function resetTimer() {
    startTime = null;
}


// ----------------- ボタン処理まとめ -----------------
function onShuffleClick() {
    shuffleMoves(100);
    if (!startTime) startTimer();
}

function onResetClick() {
    resetGame();
}

// ----------------- ページ読み込み後の初期化 -----------------
document.addEventListener('DOMContentLoaded', function() {
    // タイルクリックイベント登録
    const tiles = document.querySelectorAll('.player-tile');
    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => onTileClick(index));
    });

    // ボタンイベント登録
    const btnShuffle = document.getElementById('shuffle');
    const btnReset = document.getElementById('reset');

    if (btnShuffle) btnShuffle.addEventListener('click', onShuffleClick);
    if (btnReset) btnReset.addEventListener('click', onResetClick);

    // タイマー開始
    if (!startTime) startTimer();
});