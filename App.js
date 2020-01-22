import React, { Component } from 'react';
import { Plataform, StyleSheet, Text, View } from 'react-native'
import Button from './src/components/Button'
import Display from './src/components/Display'

const initialState = {
  displayValue: '0', // Valor inicial do visor
  clearDisplay: false, // Atributo para limpar o display
  operation: null, // Atributo que armazena o operador
  operationBasic: false, // Atributo para alternar operador sem executar operação
  values: [0,0], // Explicação abaixo.
  current: 0, // Posição para adicionar valores no array values. Valores validos (0 e 1)
}

export default class APP extends Component {

  // Clona o estado inicial para utiliza-lo na classe
  state = {...initialState}

  // Função que substitui sinal da calculadora para execução em JS
  replaceOperation = (operation) => {
    if(operation === '÷') return '/'
    else if(operation === 'x') return '*'
    else return operation
  }

  // Função que inverte o sinal
  reverseSign = (num) => {
    return num - (num * 2)
  }

  // Função para impressão do valor no display
  getDisplayValue = (num) => {
    return num.toString().replace('.', ',')
  }

  // Restaura a calculadora para seu estado inicial
  clearMemory = () => {
    this.setState({ ...initialState })
  }

  // Adiciona os digitos pressionados no visor da calculadora
  addDigit = n => {

    // Limpa display quando valor do display for 0 ou clearDisplay for true
    const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay

    // Validação para apenas uma vírgula. Caso a vírgula já esteja em displayValue ela será ignorada 
    if(n === ',' && !clearDisplay && this.state.displayValue.includes(',')) return

    // Insere o zero antes da vírgula quando número inteiro for menor que 1
    if(n === ',' && clearDisplay) n = '0,'

    // Armazena valor corrente quando clearDisplay !== true 
    const currentValue = clearDisplay ? '' : this.state.displayValue

    // Contatena currentValue com o numero pressionado
    const displayValue = currentValue + n

    // Salva o estado atual do displayValue e restaura clearDisplay para continuar concatenando os digitos
    this.setState({ displayValue,  clearDisplay: false, operationBasic: false })

    // Armazena o valor concatenado na posição do array values correspondente (0 ou 1).
    if(n !== ',')
    {
      const newValue = parseFloat(displayValue.replace(',', '.'))
      const values = [...this.state.values]
      values[this.state.current] = newValue
      this.setState({ values })
    }
  }

  // Aplica a operação selecionada (Lógica da calculadora).
  setOperation = operation => {

    // Modifica o operador visual para seu correspondente antes da execução
    operation = this.replaceOperation(operation)

    const values = [... this.state.values]
    const current = this.state.current
    let displayValue = 0

    if(operation === '+/-' || operation === '%')
    {
      if(operation === '+/-')
      {
        values[current] = this.reverseSign(values[current])
        displayValue = this.getDisplayValue(values[current])
      }
      else
      {
        if(current == 0)
        {
          values[0] = values[current] / 100
          displayValue = this.getDisplayValue(values[0])
        }
        else
        {
          values[1] = values[0] * values[1] / 100
          displayValue = this.getDisplayValue(values[1])
        }
      }

      // Define o estado da calculadora após aplicar a lógica
      this.setState({
        displayValue, // Seta o resultado da operação como string para o display 
        operation: (operation === '%' && values[1] == 0) ? null : this.state.operation, // Seta ou redefine o atributo
        operationBasic: false, 
        current, // Posição atual do array
        clearDisplay: true,
        values, // Armazena o array atual
      })
    }
    // Operações básicas (+, -, x, ÷)
    else
    {
      // Armazena o operador e incrementa o ponteiro de values através do atributo current
      if(current === 0)
      {
        this.setState({ operation, operationBasic: true, current: 1, clearDisplay: true})
      }
      // Aplica a lógica ao operador armazenado na etapa anterior no array values
      else
      {
        // Zera o values[1] quando o usuário clica em uma operação (+, -, x, ÷)
        values[0] = this.state.operationBasic ? values[0] : this.setTotal()

        // Define o estado da calculadora após aplicar a lógica
        this.setState({
          displayValue: this.getDisplayValue(values[0]), 
          operation, // Seta ou redefine o atributo
          operationBasic: true,
          clearDisplay: true, // Limpa o display quando digitado os operadores (+, -, x, ÷)
          values, // Armasena o array atual no estado
        })
      }
    }
  }

  // Função realiza o total das operações
  setTotal = (clearValue) => {

    const values = [... this.state.values]

    try{
      // Eval retorna o resultado da operação setada anteriomente e armazena em values[0]
      values[0] = parseFloat(eval(`${values[0]} ${this.state.operation} ${values[1]}`).toFixed(9));
      
      //Corrige o problema de divisão de 0/0 que retornava NaN 
      values[0] = Number.isNaN(values[0]) ? 0 : values[0]
    }
    // Em caso de falha restaura para o valor anterior
    catch(e){
      //console.debug(e)
      values[0] = this.state.values[0]
    }

    // Quando setTotal é invocada em setOperation 
    if(clearValue !== '=')
    {
      return values[0];
    }
    // Quando pressionado na calculadora
    else
    {
      this.setState({
        displayValue: this.getDisplayValue(values[0]),  
        operationBasic: true,
        values,
      })
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <Display value={this.state.displayValue} />
        <View style={styles.buttons}>
          <Button label='AC'  onClick={this.clearMemory} top ></Button>
          <Button label='+/-' onClick={this.setOperation} top ></Button>
          <Button label='%'   onClick={this.setOperation} top ></Button>
          <Button label='÷'   onClick={this.setOperation} operation ></Button>
          <Button label='7'   onClick={this.addDigit} ></Button>
          <Button label='8'   onClick={this.addDigit} ></Button>
          <Button label='9'   onClick={this.addDigit} ></Button>
          <Button label='x'   onClick={this.setOperation} operation ></Button>
          <Button label='4'   onClick={this.addDigit} ></Button>
          <Button label='5'   onClick={this.addDigit} ></Button>
          <Button label='6'   onClick={this.addDigit} ></Button>
          <Button label='-'   onClick={this.setOperation} operation ></Button>
          <Button label='1'   onClick={this.addDigit} ></Button>
          <Button label='2'   onClick={this.addDigit} ></Button>
          <Button label='3'   onClick={this.addDigit} ></Button>
          <Button label='+'   onClick={this.setOperation} operation ></Button>
          <Button label='0'   onClick={this.addDigit} double ></Button>
          <Button label=','   onClick={this.addDigit} ></Button>
          <Button label='='   onClick={this.setTotal} operation ></Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
})