import assert from 'assert';
import {parseCode, deleteTable} from '../src/js/code-analyzer';

/*it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });*/

describe('The javascript parser', () => {
    //expressions
    testLiteral();
    testIdentifier();
    testMemberExpression();
    testBinaryExpression();
    testUnaryExpression();
    testLogicalExpression();
    testUpdateExpression();
    testUpdateExpressionPrefix();
    //statements
    testVariableDeclaration();
    testVariableDeclarationWithValue();
    testVariableDeclarationWithNegValue();
    testAssignmentExpression();
    testWhileStatement();
    testIfStatement();
    testIfElseStatement();
    testIfElseElseStatement();
    testForStatement();
    testForWithoutInit();
    testForWithoutUpdate()
    testFunctionDeclaration();
    testFunctionDeclarationWithParams();

    testDefaultBreak();
});

function testLiteral() {
    it('is parsing an literal expression', () => {
        assert.equal(
            JSON.stringify(parseCode('1;')),
            '[{"line":1,"type":"Literal","name":"","condition":"","value":"1"}]'
        );
        deleteTable();
    });
}

function testIdentifier() {
    it('is parsing an identifier expression', () => {
        assert.equal(
            JSON.stringify(parseCode('x;')),
            '[{"line":1,"type":"Identifier","name":"x","condition":"","value":""}]'
        );
        deleteTable();
    });
}

function testMemberExpression() {
    it('is parsing an member expression', () => {
        assert.equal(
            JSON.stringify(parseCode('x[1];')),
            '[{"line":1,"type":"MemberExpression","name":"","condition":"","value":"x[1]"}]'
        );
        deleteTable();
    });
}

function testBinaryExpression() {
    it('is parsing an binary expression', () => {
        assert.equal(
            JSON.stringify(parseCode('1>1;')),
            '[{"line":1,"type":"BinaryExpression","name":"","condition":"1 > 1","value":""}]'
        );
        deleteTable();
    });
}

function testUnaryExpression() {
    it('is parsing an unary expression', () => {
        assert.equal(
            JSON.stringify(parseCode('!x;')),
            '[{"line":1,"type":"UnaryExpression","name":"x","condition":"","value":"!x"}]'
        );
        deleteTable();
    });
}

function testLogicalExpression() {
    it('is parsing an logical expression', () => {
        assert.equal(
            JSON.stringify(parseCode('a && b')),
            '[{"line":1,"type":"LogicalExpression","name":"","condition":"","value":"a && b"}]'
        );
        deleteTable();
    });
}

function testUpdateExpression() {
    it('is parsing an update expression', () => {
        assert.equal(
            JSON.stringify(parseCode('x++;')),
            '[{"line":1,"type":"assignment expression","name":"x","condition":"","value":"x++"}]'
        );
        deleteTable();
    });
}

function testUpdateExpressionPrefix() {
    it('is parsing an update expression with prefix', () => {
        assert.equal(
            JSON.stringify(parseCode('++x;')),
            '[{"line":1,"type":"assignment expression","name":"x","condition":"","value":"++x"}]'
        );
        deleteTable();
    });
}

function testVariableDeclaration(){
    it('is parsing an variable declaration', () => {
        assert.equal(
            JSON.stringify(parseCode('let x;')),
            '[{"line":1,"type":"variable declaration","name":"x","condition":"","value":null}]'
        );
        deleteTable();
    });
}
function testVariableDeclarationWithValue(){
    it('is parsing an variable declaration with value', () => {
        assert.equal(
            JSON.stringify(parseCode('let x = 1;')),
            '[{"line":1,"type":"variable declaration","name":"x","condition":"","value":1}]'
        );
        deleteTable();
    });
}

function testVariableDeclarationWithNegValue(){
    it('is parsing an variable declaration with value', () => {
        assert.equal(
            JSON.stringify(parseCode('let x = -1;')),
            '[{"line":1,"type":"variable declaration","name":"x","condition":"","value":"-1"}]'
        );
        deleteTable();
    });
}

function testAssignmentExpression() {
    it('is parsing an assignment expression', () => {
        assert.equal(
            JSON.stringify(parseCode('x = 0;')),
            '[{"line":1,"type":"assignment expression","name":"x","condition":"","value":"0"}]'
        );
        deleteTable();
    });
}


function testWhileStatement() {
    it('is parsing an while statement', () => {
        assert.equal(
            JSON.stringify(parseCode('while(true){}')),
            '[{"line":1,"type":"while statement","name":"","condition":"true","value":""}]'
        );
        deleteTable();
    });
}

function testIfStatement(){
    it('is parsing an if statement', () => {
        assert.equal(
            JSON.stringify(parseCode('if(true){}')),
            '[{"line":1,"type":"if statement","name":"","condition":"true","value":""}]'
        );
        deleteTable();
    });
}

function testIfElseStatement() {
    it('is parsing an if else statement', () => {
        assert.equal(
            JSON.stringify(parseCode('if(x==1){}\n' +
                'else if(x>1){}')),
            '[{"line":1,"type":"if statement","name":"","condition":"x == 1","value":""},' +
            '{"line":2,"type":"else if statement","name":"","condition":"x > 1","value":""}]'
        );
        deleteTable();
    });
}

function testIfElseElseStatement() {
    it('is parsing an if else statement', () => {
        assert.equal(
            JSON.stringify(parseCode('if(x==1){}\n' +
                'else if(x>1){}\n'+
                'else {let x = 0;}')),
            '[{"line":1,"type":"if statement","name":"","condition":"x == 1","value":""},' +
            '{"line":2,"type":"else if statement","name":"","condition":"x > 1","value":""},'+
            '{"line":3,"type":"variable declaration","name":"x","condition":"","value":0}]'
        );
        deleteTable();
    });
}
/*function testReturnStatement(){
    it('is parsing an return statement', () => {
        assert.equal(
            JSON.stringify(parseCode('while(true){}')),
            '[{"line":1,"type":"while statement","name":"","condition":"true","value":""}]'
        );
        deleteTable();
    });
}*/
function testForStatement(){
    it('is parsing an for statement', () => {
        assert.equal(
            JSON.stringify(parseCode('for(i=0; i<3; i++){}')),
            '[{"line":1,"type":"for statement","name":"","condition":"i < 3","value":""},' +
            '{"line":1,"type":"assignment expression","name":"i","condition":"","value":"0"},' +
            '{"line":1,"type":"assignment expression","name":"i","condition":"","value":"i++"}]'
        );
        deleteTable();
    });
}

function testForWithoutInit() {
    it('is parsing an for statement', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(){\n' +
                '    for(; i<2; i++){}\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"test","condition":"","value":""},' +
            '{"line":2,"type":"for statement","name":"","condition":"i < 2","value":""},' +
            '{"line":2,"type":"assignment expression","name":"i","condition":"","value":"i++"}]'
        );
        deleteTable();
    });
}

function testForWithoutUpdate() {
    it('is parsing an for statement', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(){\n' +
                '    for(; i<2;){}\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"test","condition":"","value":""},' +
            '{"line":2,"type":"for statement","name":"","condition":"i < 2","value":""}]'
        );
        deleteTable();
    });
}

function testFunctionDeclaration() {
    it('is parsing an function declaration', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(){\n' +
                '    return -1;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"test","condition":"","value":""},' +
            '{"line":2,"type":"return statement","name":"","condition":"","value":"-1"}]'
        );
        deleteTable();
    });
}

function testFunctionDeclarationWithParams() {
    it('is parsing an function declaration', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(x){\n' +
                '    return -1;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"test","condition":"","value":""},' +
            '{"line":1,"type":"variable declaration","name":"x","condition":"","value":""},'+
            '{"line":2,"type":"return statement","name":"","condition":"","value":"-1"}]'
        );
        deleteTable();
    });
}

function testDefaultBreak() {
    it('is parsing an function declaration', () => {
        assert.equal(
            JSON.stringify(parseCode(';')),
            '[]'
        );
        deleteTable();
    });
}