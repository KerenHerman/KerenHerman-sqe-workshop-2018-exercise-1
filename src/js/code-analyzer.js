import * as esprima from 'esprima';

//add location to the tokens.
const parseCode = (codeToParse) => {
    return createTable(esprima.parseScript(codeToParse,  { loc: true }));
};
export {parseCode};

//each row is: <line, type, name, condition, value>
let tableRows = [];
/*
const getTableRows = () => {
    return tableRows;
};
export {getTableRows};*/

const createTable = (parsedCode) => {
    analyzeJson(parsedCode);
    return tableRows;
};
export {createTable};

const deleteTable = () => {
    tableRows = [];
};
export {deleteTable};

function analyzeJson(parsedCode){
    switch (parsedCode.type) {
    case 'Program':analyzeJson(parsedCode.body[0]);break;
    case 'FunctionDeclaration':functionDeclarationCase(parsedCode);analyzeJson(parsedCode.body);break;
    case 'BlockStatement':parsedCode.body.forEach(function (x) {analyzeJson(x);});break;
    case 'VariableDeclaration':parsedCode.declarations.forEach(function (x) {analyzeJson(x);});break;
    default: analyzeJsonCon(parsedCode); break;
    }
}

function analyzeJsonCon(parsedCode) {
    switch (parsedCode.type) {
    case 'VariableDeclarator':variableDeclaratorCase(parsedCode);break;
    case 'AssignmentExpression':expressionStatementCase(parsedCode); break;
    case 'ExpressionStatement':analyzeJson(parsedCode.expression);break;
    case 'WhileStatement':whileStatementCase(parsedCode);analyzeJson(parsedCode.body);break;
    default: analyzeJsonCon1(parsedCode); break;
    }
}

function analyzeJsonCon1(parsedCode) {
    switch (parsedCode.type) {
    case 'IfStatement':ifStatementCase(parsedCode);break;
    case 'ReturnStatement':returnStatementCase(parsedCode);break;
    case 'ForStatement': forStatementCase(parsedCode);analyzeJson(parsedCode.body); break;
    default: analyzeExpInsert(parsedCode);
    }
}

function analyzeExpInsert(parsedCode){
    switch (parsedCode.type) {
    case 'Literal':createLineInTable(parsedCode.loc.start.line, parsedCode.type, '', '', analyzeExp(parsedCode));break;
    case 'Identifier':createLineInTable(parsedCode.loc.start.line, parsedCode.type, analyzeExp(parsedCode), '', '');break;
    case 'MemberExpression':createLineInTable(parsedCode.loc.start.line, parsedCode.type, '', '', analyzeExp(parsedCode));break;
    case 'BinaryExpression':createLineInTable(parsedCode.loc.start.line, parsedCode.type, '', analyzeExp(parsedCode), ''); break;
    default:analyzeExpInsertCon(parsedCode); break;
    }
}

function analyzeExpInsertCon(parsedCode) {
    switch (parsedCode.type) {
    case 'UnaryExpression':createLineInTable(parsedCode.loc.start.line, parsedCode.type, analyzeExp(parsedCode.argument), '',  analyzeExp(parsedCode));break;
    case 'LogicalExpression':createLineInTable(parsedCode.loc.start.line, parsedCode.type, '', '', analyzeExp(parsedCode)); break;
    case 'UpdateExpression':createLineInTable(parsedCode.loc.start.line, 'assignment expression', analyzeExp(parsedCode.argument), '',  analyzeExp(parsedCode)); break;
    default: break;
    }
}

function createLineInTable(line, type, name, condition, value) {
    tableRows.push({'line': line, 'type': type, 'name': name, 'condition': condition, 'value': value});
}

function functionDeclarationCase(parsedCode) {
    createLineInTable(parsedCode.id.loc.start.line, 'function declaration', parsedCode.id.name, '', '');
    parsedCode.params.forEach(function (x) {
        createLineInTable(x.loc.start.line, 'variable declaration', x.name, '', '');
    });
}


function variableDeclaratorCase(parsedCode) {
    if(parsedCode.init == null)
        createLineInTable(parsedCode.loc.start.line, 'variable declaration', parsedCode.id.name, '', parsedCode.init);
    else {
        if( parsedCode.init.type === 'UnaryExpression')
            createLineInTable(parsedCode.loc.start.line, 'variable declaration', parsedCode.id.name, '', ''+parsedCode.init.operator +analyzeExp(parsedCode.init.argument));
        else
            createLineInTable(parsedCode.loc.start.line, 'variable declaration', parsedCode.id.name, '', parsedCode.init.value);
    }
}

function expressionStatementCase(parsedCode) {
    createLineInTable(parsedCode.loc.start.line, 'assignment expression', ''+analyzeExp(parsedCode.left), '', ''+analyzeExp(parsedCode.right));
}

function whileStatementCase(parsedCode){
    createLineInTable(parsedCode.loc.start.line,'while statement', '', ''+analyzeExp(parsedCode.test), '');
}

function ifStatementCase(parsedCode) {
    createLineInTable(parsedCode.loc.start.line,'if statement', '', ''+analyzeExp(parsedCode.test) ,'');
    analyzeJson(parsedCode.consequent);
    //there is if else or else statement.
    if(parsedCode.alternate != null){
        //else if.
        createLineInTable(parsedCode.alternate.loc.start.line, 'else if statement', '', ''+analyzeExp(parsedCode.alternate.test), '');
        analyzeJson(parsedCode.alternate.consequent);
        if(parsedCode.alternate.alternate != null)
            analyzeJson(parsedCode.alternate.alternate);

    }
}

function returnStatementCase(parsedCode) {
    createLineInTable(parsedCode.loc.start.line,'return statement', '', '', ''+analyzeExp(parsedCode.argument));
}

function forStatementCase(parsedCode){
    createLineInTable(parsedCode.loc.start.line,'for statement', '', ''+analyzeExp(parsedCode.test), '');
    if(parsedCode.init != null) {
        analyzeJson(parsedCode.init);
    }
    if(parsedCode.update != null) {
        analyzeJson(parsedCode.update);
    }
}



function analyzeExp(exp){
    let ans = '';
    switch(exp.type){
    case 'Literal': ans = ans + exp.value;break;
    case 'Identifier': ans = ans +exp.name;break;
    case 'MemberExpression': ans = ans + memberExp(exp);break;
    case 'BinaryExpression': ans = ans + binaryExp(exp); break;
    default: ans = ans + analyzeExpCon(exp) ;break;
    }
    return ans;
}

function analyzeExpCon(exp) {
    let ans = '';
    switch(exp.type) {
    case 'UnaryExpression': ans = ans + unaryExp(exp);break;
    case 'LogicalExpression': ans = ans + analyzeExp(exp.left)+ ' ' + exp.operator + ' ' + analyzeExp(exp.right); break;
        //updateExpression
    default:ans = ans + updateExp(exp);break;
    }
    return ans;
}

function binaryExp(exp){
    return ''+analyzeExp(exp.left) +' '+ exp.operator +' ' +analyzeExp(exp.right);
}

function memberExp(exp){
    return ''+ analyzeExp(exp.object) + '[' + analyzeExp(exp.property) + ']';
}

function unaryExp(exp) {
    return ''+ exp.operator+ analyzeExp(exp.argument);
}

function  updateExp(exp) {
    if(exp.prefix == true)
        return ''+ exp.operator + exp.argument.name;
    else
        return '' + exp.argument.name+ exp.operator;
}
