function createBoard(size) {
    let ins = document.getElementById("board");
    for (let i = 0; i < size; i++) {
        let sq = document.createElement('div');
        sq.className = "boardSquare";
        sq.innerHTML = "2";
        sq.setAttribute("data-id", i);
        ins.appendChild(sq);
    }
}

$(document).ready(function () {
    console.log("hello");
    alert("hello");
    createBoard(5);
});