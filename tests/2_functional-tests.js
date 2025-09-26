const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const cannotBeSolvedPuzzle = '125..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const solutionValidPuzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    const invalidPuzzle = '1.5..2.84.a63.12.7.2..5.f..b9..1..e.8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const not81CharLongPuzzle = '1.5..2.84..63.12.7.2..5...9..1...8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

    // #1
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: validPuzzle})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, solutionValidPuzzle);
                done();
            });
    });

    // #2
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: ''})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field missing');
                done();
            });
    });

    // #3
    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: invalidPuzzle})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });

    // #4
    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: not81CharLongPuzzle})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });

    // #5
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({puzzle: cannotBeSolvedPuzzle})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done();
            });
    });

    // #6
    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A4',
                value: '7'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, true);
                done();
            });
    });

    // #7
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A4',
                value: '6'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {valid: false, conflict: ['column']});
                done();
            });
    });

    // #8
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A5',
                value: '4'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {valid: false, conflict: ['row', 'column']});
                done();
            });
    });

    // #9
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A5',
                value: '5'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {valid: false, conflict: ['row', 'column', 'region']});
                done();
            });
    });

    // #10
    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: ''
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body.error, 'Required field missing');
                done();
            });
    });

    // #11
    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: invalidPuzzle
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });

    // #12
    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: not81CharLongPuzzle,
                coordinate: 'A5',
                value: '5'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });

    // #13
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'K45',
                value: '5'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body.error, 'Invalid coordinate');
                done();
            });
    });

    // #14
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzle,
                coordinate: 'A5',
                value: 'a'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body.error, 'Invalid value');
                done();
            });
    });
});

