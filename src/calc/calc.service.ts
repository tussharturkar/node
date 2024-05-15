import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const expression = calcBody.expression;

    // Validate expression
    if (!expression || !this.isValidExpression(expression)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Evaluate the expression
    const result = this.evaluate(expression);
    return result;
  }

  isValidExpression(exp: string): boolean {
    const validChars = [
      '+',
      '-',
      '*',
      '/',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ];
    const validOperators = ['+', '-', '*', '/'];
    for (let i = 0; i < exp.length; i++) {
      if (!validChars.includes(exp[i])) {
        return false;
      }
      if (
        validOperators.includes(exp[i]) &&
        (isNaN(parseInt(exp[i + 1])) || isNaN(parseInt(exp[i - 1])))
      ) {
        console.log(exp[i]);
        return false;
      }
    }
    return true;
  }
  evaluate(expression: string): number {
    const operatorsStack = [];
    const operandsStack = [];

    const precedence = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
    };

    let currentNumber = '';

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      if ('0123456789'.includes(char)) {
        currentNumber += char;
      } else if ('+-*/'.includes(char) && currentNumber !== '') {
        operandsStack.push(parseFloat(currentNumber));
        currentNumber = '';

        while (
          operatorsStack.length > 0 &&
          precedence[operatorsStack[operatorsStack.length - 1]] >=
            precedence[char]
        ) {
          const operator = operatorsStack.pop();
          const secondOperand = operandsStack.pop();
          const firstOperand = operandsStack.pop();
          operandsStack.push(
            this.performOperation(firstOperand, secondOperand, operator),
          );
        }
        operatorsStack.push(char);
      }
    }

    if (currentNumber !== '') {
      operandsStack.push(parseFloat(currentNumber));
    }

    while (operatorsStack.length > 0) {
      const operator = operatorsStack.pop();
      const secondOperand = operandsStack.pop();
      const firstOperand = operandsStack.pop();
      operandsStack.push(
        this.performOperation(firstOperand, secondOperand, operator),
      );
    }

    return operandsStack[0];
  }

  // Helper function to perform arithmetic operations
  performOperation(
    firstOperand: number,
    secondOperand: number,
    operator: string,
  ): number {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        if (secondOperand === 0) {
          throw new Error('Division by zero');
        }
        return firstOperand / secondOperand;
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  }
}
