document.getElementById("generateButton").addEventListener("click", generateGrid);
document.getElementById("startButton").addEventListener("click", startGameOfLife);
document.getElementById("resetButton").addEventListener("click", resetGrid);
document.getElementById("pauseButton").addEventListener("click", pauseGame);
const pause_btn=document.getElementById("pauseButton");
let isGameRunning = false;
let intervalId = null; 

window.addEventListener('DOMContentLoaded', (event) => {
    generateGrid();
    const url = new URL(window.location);
    const searchParams = url.searchParams;
    
    const widthParam = searchParams.get('width');
    const heightParam = searchParams.get('height');
    
    if (widthParam && heightParam) {
        // Set the input fields with the retrieved values
        const widthInput = document.getElementById("cols");
        const heightInput = document.getElementById("rows");
        
        widthInput.value = widthParam;
        heightInput.value = heightParam;
        console.log("confirm");
        // Generate the grid with the retrieved width and height
        
    }
});


function resetGrid() {
    if (!isGameRunning) {
        const cells = document.querySelectorAll(".cell");
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        let id = window.setTimeout(function() {}, 0);
        while (id--) {
            window.clearTimeout(id);
        }
        // Iterate over the cells and remove the "selected" class
        cells.forEach((cell) => {
            cell.classList.remove("selected");
        });

        // Reset the matrix
        reset_matrix(mat);

        // Update the check matrix
        check_mat = deepCopyArray(mat);
    } else {
        alert("Reset is only allowed when the game is over or paused.");
    }
}

function startGameOfLife() {
    if (isGameRunning===false) {
        isGameRunning=true;
        pause_btn.innerText='Pause';
        intervalId = setInterval(updateGameAndRender, 1000); // Call updateGameAndRender every 1 second
    }
    else{
        alert('game already running');
    }
    // else{
    //     clearInterval(intervalId);
    // }
}
function updateGameAndRender() {
    if (isGameRunning) {
        console.log("inside");
        temp_mat = deepCopyArray(mat);
        const rows = mat.length;
        const cols = mat[0].length;
        let same = true; // Assume the game will reach an equilibrium
        const direction = [
            [-1, 0], [0, 1], [1, 0], [0, -1],
            [-1, 1], [1, 1], [1, -1], [-1, -1]
        ];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const countList = checkNeighbours(direction, mat, i, j);
                const currentCell = mat[i][j];
                if (currentCell % 2) {
                    // Cell is alive
                    if (countList < 2 || countList > 3) {
                        // Cell dies
                        temp_mat[i][j] = 0;
                    }
                } else {
                    // Cell is dead
                    if (countList === 3) {
                        // Cell becomes alive
                        temp_mat[i][j] = 1;
                    }
                }

                if (same && temp_mat[i][j] !== mat[i][j]) {
                    // Check if the game is still in equilibrium
                    same = false;
                }
            }
        }

        mat = deepCopyArray(temp_mat);
        check_mat = deepCopyArray(mat);

        // Update the DOM after the entire matrix is updated
        animate_grid(mat);

        if (same) {
            pauseGame(); // The game has reached equilibrium, so pause it
        } 
        // else {
        //     setTimeout(updateGameAndRender, 1000); // Schedule the next update after 1000 milliseconds
        // }
    }
}


// function updateGameAndRender() {
//     if (isGameRunning) {
//         console.log("inside")
//         temp_mat = deepCopyArray(mat);
//         const rows = mat.length;
//         const cols = mat[0].length;
//         let same = true; // Assume the game will reach an equilibrium
//         const direction = [
//             [-1, 0], [0, 1], [1, 0], [0, -1],
//             [-1, 1], [1, 1], [1, -1], [-1, -1]
//         ];

//         for (let i = 0; i < rows; i++) {
//             for (let j = 0; j < cols; j++) {
//                 const countList = checkNeighbours(direction, mat, i, j);
//                 const currentCell = mat[i][j];
//                 if (currentCell % 2) {
//                     // Cell is alive
//                     if (countList < 2 || countList > 3) {
//                         // Cell dies
//                         temp_mat[i][j] = 0;
//                     }
//                 } else {
//                     // Cell is dead
//                     if (countList === 3) {
//                         // Cell becomes alive
//                         temp_mat[i][j] = 1;
//                     }
//                 }

//                 if (same && temp_mat[i][j] !== mat[i][j]) {
//                     // Check if the game is still in equilibrium
//                     same = false;
//                 }
//             }
//         }

//         convert(temp_mat);
//         animate_grid(temp_mat);

//         mat = deepCopyArray(temp_mat);
//         check_mat = deepCopyArray(mat);

//         if (same) {
//             pauseGame(); // The game has reached equilibrium, so pause it
//         } else {
//             setTimeout(updateGameAndRender, 1000); // Schedule the next update after 1000 milliseconds
//         }
//     }
// }




function pauseGame() {
    if (isGameRunning) {
        clearInterval(intervalId); // Clear the current interval
        pause_btn.innerText = "Paused";
        isGameRunning = false;
    } else {
        intervalId = setInterval(updateGameAndRender, 1000); // Restart the interval
        pause_btn.innerText = "Resumed";
        isGameRunning = true;
    }
}



let board=[];
let check_mat;
var mat;
 // Flag to track whether the game is running
function create2DArray(rows, cols) {
    const array = new Array(rows);
    for (let i = 0; i < rows; i++) {
      array[i] = new Array(cols);
    }
    return array;
  }
    
  function reset_matrix(arr){
    const r = arr.length;
    const c = arr[0].length;
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
          arr[i][j] = 0; // You can set any initial value here
        }
      }
    }

function generateGrid() {
   if(!isGameRunning) {const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);
    const matrix = create2DArray(rows, cols);
    mat=create2DArray(rows,cols)
    reset_matrix(matrix);
    console.log("made", matrix);
    mat=matrix;
    console.log("mat",mat);
    if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) {
        alert("Please enter valid row and column numbers.");
        return;
    }

    const gridContainer = document.getElementById("gridContainer");
    gridContainer.innerHTML = ""; // Clear the existing grid

    const grid = document.createElement("div");
    grid.classList.add("grid");
    grid.style.gridTemplateColumns = `repeat(${cols}, 0fr)`;
    grid.style.gridAutoRows = "1fr";
    grid.style.gridAutoColumns="1fr";

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row; // Add row and col data attributes
            cell.dataset.col = col;
            cell.dataset.index = row * cols + col; // Add index based on row and column
            cell.addEventListener("click", () => toggleCell(cell, row, col)); // Pass row and col to toggleCell
            grid.appendChild(cell);
        }
    }
    updateURLParams(cols, rows);
    console.log("grid",grid);
    gridContainer.appendChild(grid);
    check_mat=deepCopyArray(mat);}
    else {
        alert("Generate Grid is only allowed when the game is paused.");
    }
}

function updateURLParams(width, height) {
    // Update URL with width and height values
    const url = new URL(window.location);
    const searchParams = url.searchParams;
    searchParams.set('width', width.toString());
    searchParams.set('height', height.toString());
    history.pushState({}, '', url.toString());
}

function toggleCell(cell) {
    if(isGameRunning===false){
    // Toggle the cell's selected state by adding/removing a CSS class
    if (cell.classList.contains("selected")) {
        cell.classList.remove("selected");
        // Update the corresponding value in your matrix (matrix[row][col])
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        mat[row][col] = 0; // Unselected
    } else {
        cell.classList.add("selected");
        // Update the corresponding value in your matrix
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        mat[row][col] = 1; // Selected
    }
    console.log(mat);
    
    check_mat=deepCopyArray(mat);
}
}


document.getElementById("selectCellsButton").addEventListener("click", selectRandomCells);

function selectRandomCells() {
    if(isGameRunning===true){
        alert('Pause the game first');
    }
    else
    {// console.log("inside");
    reset_matrix(mat)
    const selectCount = parseInt(document.getElementById("selectCount").value);
    if (isNaN(selectCount) || selectCount < 1) {
        alert("Please enter a valid count.");
        return;
    }

    const cells = document.querySelectorAll(".cell");
    const cellCount = cells.length;

    if (selectCount > cellCount) {
        alert("Count exceeds the number of cells.");
        return;
    }

    // Reset all cells to their default state
    cells.forEach((cell) => {
        cell.classList.remove("selected");
        mat[cell.dataset.row][cell.dataset.col]=0;
    });

    // Randomly select cells and highlight them in green
    const selectedIndices = [];
    while (selectedIndices.length < selectCount) {
        const random_row = Math.floor(Math.random() * mat.length);
        const random_col = Math.floor(Math.random() * mat[0].length);
        const randomIndex = random_row*mat[0].length+random_col;
        mat[random_row][random_col]=1;
        if (!selectedIndices.includes(randomIndex)) {
            selectedIndices.push(randomIndex);
            cells[randomIndex].classList.add("selected");
        }
    }
    console.log('changed',mat)
    check_mat=deepCopyArray(mat);}
}

console.log("before",mat);

function checkNeighbours(direction, board, i, j) {
    let aliveNeighbor = 0;
    const row = board.length - 1;
    const cols = board[0].length - 1;

    for (const [di, dj] of direction) {
        const newI = i + di;
        const newJ = j + dj;

        if (newI < 0 || newI > row || newJ < 0 || newJ > cols) {
            continue;
        }

        if (board[newI][newJ] % 2) {
            aliveNeighbor++;
        }
    }

    return aliveNeighbor;
}

function deepCopyArray(arr) {
    const copy = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            copy[i] = deepCopyArray(arr[i]);
        } else {
            copy[i] = arr[i];
        }
    }
    return copy;
}


function areSame(a, b) 
{ 
    let i, j; 
    let r, c;
    r=a.length;
    c=a[0].length;
    for (i = 0; i < r; i++) 
        for (j = 0; j < c; j++) 
            if (a[i][j] != b[i][j]) 
                return false; 
    return true; 
} 


function convert(g){
    const rows= g.length;
    const cols= g[0].length;
    for(let i=0;i<rows;i++)
        {
            for (let j = 0; j < cols; j++)
            {
                if(g[i][j]===2)
                g[i][j]=1;
                else
                {
                    if(g[i][j]===3)
                    {
                        g[i][j]=0;
                    }
                }
            }
        }}

function animate_grid(g){
    const rows= mat.length;
    const cols= mat[0].length;
    const cells= document.querySelectorAll(".cell");
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(g[i][j]===1){
                cells[i*cols+j].classList.add("selected");
            }
            else{
                cells[i*cols+j].classList.remove("selected");
            }
        }
    }
}