const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const invalidPuzzle = '1.5..2.84.a63.12.7.2..5.f..b9..1..e.8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const not81CharLongPuzzle = '1.5..2.84..63.12.7.2..5...9..1...8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

    // #1
    test('Logic handles a valid puzzle string of 81 characters', function () {
        assert.isTrue(solver.validate(validPuzzle), 'The puzzle is not valid')
    })

    // #2
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
        assert.isFalse(solver.validate(invalidPuzzle), 'Puzzle is actually valid');
    })

    // #3
    test('Logic handles a puzzle string that is not 81 characters in length', function () {
        assert.isFalse(solver.validate(not81CharLongPuzzle), 'Puzzle has 81 char long');
    })

    // #4
    test('Logic handles a valid row placement', function () {
        assert.isTrue(solver.checkRowPlacement(validPuzzle, 'A', '2', '3'), 'The value is not a valid row placement');
    })

    // #5
    test('Logic handles an invalid row placement', function () {
        assert.isFalse(solver.checkRowPlacement(validPuzzle, 'A', '2', '4'), 'This value is actually a valid row placement');
    })

    // #6
    test('Logic handles a valid column placement', function () {
        assert.isTrue(solver.checkColPlacement(validPuzzle, 'A', '2', '3'), 'The value is not a valid column placement');
    })

    // #7
    test('Logic handles an invalid column placement', function () {
        assert.isFalse(solver.checkColPlacement(validPuzzle, 'A', '2', '7'), 'The value is actually a valid column placement');
    })

    // #8
    test('Logic handles a valid region (3x3 grid) placement', function () {
        assert.isTrue(solver.checkRegionPlacement(validPuzzle, 'A', '2', '3'), 'The value is not a valid region placement');
    })

    // #9
    test('Logic handles an invalid region (3x3 grid) placement', function () {
        assert.isFalse(solver.checkRegionPlacement(validPuzzle, 'A', '2', '1'), 'The value is actually a valid region placement');
    })

    // #10
    test('Valid puzzle strings pass the solver', function () {
        assert.isDefined(solver.solve(validPuzzle), 'Puzzle does not pass the solver');
    })

    // #11
    test('Invalid puzzle strings fail the solver', function () {
        assert.isFalse(solver.solve(invalidPuzzle), 'Puzzle can actually be solved');
    })

    // #12
    test('Solver returns the expected solution for an incomplete puzzle', function () {
        assert.isString(solver.solve(validPuzzle), 'Solution is not a string');
        assert.match(solver.solve(validPuzzle), /^[1-9]*$/, 'Solution should contain only digits 1-9')
    })

});
