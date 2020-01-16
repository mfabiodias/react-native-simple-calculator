import React, { Component } from 'react';
import { Plataform, StyleSheet, Text, View } from 'react-native'
import Button from './src/components/Button'
import Display from './src/components/Display'

const initialState = {
  displayValue: '0', // Valor inicial do visor
  clearDisplay: false, // Atributo para limpar o display
  operation: null, // Atributo que armazena o operador
  values: [0,0], // Explicação abaixo.
  current: 0, // Posição para adicionar valores no array values. Valores validos (0 e 1)
}

export default class APP extends Component {

  // Clona o estado inicial para utiliza-lo na classe
  state = {...initialState}

  replaceOperation = (operation) => {
    if(operation === '÷') return '/'
    else if(operation === 'x') return '*'
    else return operation
  }

  reverseSign = (num) => {
    return num - (num * 2)
  }

  getDisplayValue = (num) => {
    return num.toString().replace('.', ',')
  }

  // Adiciona os digitos pressionados no visor da calculadora
  addDigit = n => {

    // Limpa display quando valor do display for 0 ou clearDisplay for true
    const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay

    // Validação para apenas um ponto. Caso o ponto já esteja em displayValue ele é ignorado 
    if(n === ',' && !clearDisplay && this.state.displayValue.includes(',')) return

    // Insere o zero antes da vírgula quando número inteiro for menor que 1
    if(n === ',' && clearDisplay) n = '0,'

    // Armazena valor corrente quando clearDisplay !== true 
    const currentValue = clearDisplay ? '' : this.state.displayValue

    // Contatena currentValue com o numero pressionado
    const displayValue = currentValue + n

    // Salva o estado atual do displayValue e restaura clearDisplay para continuar concatenando os digitos
    this.setState({ displayValue,  clearDisplay: false })

    // Armazena o valor concatenado na posição do array correspondente (0 ou 1).
    if(n !== ',')
    {
      const newValue = parseFloat(displayValue.replace(',', '.'))
      const values = [...this.state.values]
      values[this.state.current] = newValue
      this.setState({ values })
    }
  }

  // Restaura a calculadora para seu estado inicial
  clearMemory = () => {
    this.setState({ ...initialState })
  }

  // Função realiza o total das operações
  setTotal = (clearValue) => {
    
    const values = [... this.state.values]

    // Opção para zerar o valor anterior da memória quando setTotal e invocada de setOperation
    values[1] = clearValue === true ? 0 : values[1]

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

    // Define o estado da calculadora após aplicar a lógica
    if(clearValue === true)
    {
      this.setState({ values })
    }
    else
    {
      this.setState({
        displayValue: this.getDisplayValue(values[0]),  
        values,
      })
    }
  }

  // Aplica a operação selecionada (Lógica da calculadora).
  setOperation = operation => {

    // Modifica o operador visual para seu correspondente antes da execução
    operation = this.replaceOperation(operation)

    const values = [... this.state.values]
    const current = this.state.current
      
    if(operation === '%' || operation === '+/-')
    {
      // Implementamos a lógica da função que muda o sinal do número recebido
      values[current] = operation === '+/-' ? this.reverseSign(values[current]) 
        // Implementada a lógica da porcentagem
        : current == 0 ? values[current] / 100 : values[0] * values[1] / 100

      // Define o estado da calculadora após aplicar a lógica
      this.setState({
        displayValue: this.getDisplayValue(values[current]), // Seta o resultado da operação como string para o display 
        operation: (operation === '%' && values[1] == 0) ? null : this.state.operation, // Seta ou redefine o atributo
        current, // Salva a posição do array values
        values, // Armazena o array atual no estado
      })
    }
    else
    {

      // Armazena o operador e incrementa o ponteiro de values através do atributo current
      if(current === 0)
      {
        this.setState({ operation, current: 1, clearDisplay: true})
      }
      // Aplica a lógica ao operador armazenado na etapa anterior no array values
      else
      {
        // Zera o values[1] quando o usuário clica em uma operação (+, -, *, /, %, +/-) e values[1] não está zerada
        this.setTotal(true)

        // Define o estado da calculadora após aplicar a lógica
        this.setState({
          operation: operation, // Seta ou redefine o atributo
          clearDisplay: true, // Limpa o display quando digitado os operadores (+, -, *, /)
          values, // Armasena o array atual no estado
        })
      }
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