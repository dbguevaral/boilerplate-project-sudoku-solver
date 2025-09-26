class SudokuSolver {

  validate(puzzleString) {
    const regex = /^[1-9.]*$/

    return regex.test(puzzleString) && puzzleString.length === 81
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowNum = row.charCodeAt(0) - 65;
    const colNum = parseInt(column) - 1;
    const slicedPuzzle = puzzleString.split('').filter((_, i) => Math.floor(i / 9) === rowNum);

    if (slicedPuzzle[colNum] === value) slicedPuzzle[colNum] = '.';

    return !slicedPuzzle.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const rowNum = row.charCodeAt(0) - 65;
    const colNum = parseInt(column) - 1;
    const slicedPuzzle = puzzleString.split('').filter((_, i) => i % 9 === colNum);

    if (slicedPuzzle[rowNum] === value) slicedPuzzle[rowNum] = '.';

    return !slicedPuzzle.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowNum = row.charCodeAt(0) - 65; //starting from A which is equal 0
    const colNum = parseInt(column) - 1;
    const regionRowStart = Math.floor(rowNum / 3) * 3;
    const regionColStart = Math.floor(colNum / 3) * 3;
    const pos = (rowNum % 3) * 3 + (colNum % 3);

    const slicedPuzzle = puzzleString.split('').filter((_, i) => {
      const r = Math.floor(i / 9);
      const c = i % 9;
      return r >= regionRowStart && r < regionRowStart + 3 && c >= regionColStart && c < regionColStart + 3;
    });

    if (slicedPuzzle[pos] === value) slicedPuzzle[pos] = '.';

    return !slicedPuzzle.includes(value);
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) return false
    const data = puzzleString.split('');
    

    const solveRecursive = (data, i) => {      
      const row = String.fromCharCode(Math.floor(i / 9) + 65);
      const column = (i % 9 + 1).toString();
      const puzzle = data.join('');
      
      if (i >= data.length) return true; //when puzzle is solved;
      if (data[i] !== '.') {
        const value = data[i];
        if (
          this.checkRowPlacement(puzzle, row, column, value) &&
          this.checkColPlacement(puzzle, row, column, value) &&
          this.checkRegionPlacement(puzzle, row, column, value)
        ) return solveRecursive(data, i + 1);

        return false;
      }

      for (let n = 1; n <= 9 ; n++) {
        const value = n.toString();
        data[i] = value;
        if (
          this.checkRowPlacement(puzzle, row, column, value) &&
          this.checkColPlacement(puzzle, row, column, value) &&
          this.checkRegionPlacement(puzzle, row, column, value)
        ) if (solveRecursive(data, i + 1)) return true;
        data[i] = '.';
      }
      return false;
    }

    if (solveRecursive(data, 0)) return data.join('');
    return false; // Return error if unsolvable 
  }
}

module.exports = SudokuSolver;


