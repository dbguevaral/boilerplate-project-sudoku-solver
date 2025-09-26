'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      try {
        const {puzzle, coordinate, value} = req.body;

        if (!puzzle || !coordinate || !value) return res.json({error: 'Required field(s) missing'});
        
        const regex = /^[1-9.]*$/
        if (!regex.test(puzzle)) return res.json({error: 'Invalid characters in puzzle'});

        const validPuzzle = solver.validate(puzzle);
        if (!validPuzzle) return res.json({error: 'Expected puzzle to be 81 characters long'});

        const regexCoor = /^[A-I][1-9]$/;
        if (!regexCoor.test(coordinate)) return res.json({error: 'Invalid coordinate'});

        if (!/^[1-9]$/.test(value)) return res.json({error: 'Invalid value'});

        

        const row = coordinate.slice(0, 1);
        const column = coordinate.slice(1, 2);

        const checkRow = solver.checkRowPlacement(puzzle, row, column, value) ? '' : 'row';
        const checkCol = solver.checkColPlacement(puzzle, row, column, value) ? '' : 'column';
        const checkRegion = solver.checkRegionPlacement(puzzle, row, column, value) ? '' : 'region';
        const conflicts = [checkRow, checkCol, checkRegion].filter(conflict => conflict !== '');

        if (conflicts.length === 0) return res.json({valid: true})

        return res.json({valid: false, conflict: conflicts})
      } catch (err) {
        console.error(err);
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      try {
        const puzzle = req.body.puzzle;
        if (!puzzle) return res.json({error: 'Required field missing'});

        const regex = /^[1-9.]*$/
        if (!regex.test(puzzle)) return res.json({error: 'Invalid characters in puzzle'});

        const validPuzzle = solver.validate(puzzle);
        if (!validPuzzle) return res.json({error: 'Expected puzzle to be 81 characters long'});
        
        const solved = solver.solve(puzzle);
        if(!solved) return res.json({error: "Puzzle cannot be solved"});
        
        res.json({solution: solved})
      } catch (err) {
        console.error(err);
      }
    });
};
