import React, { Component } from 'react';
import { Plataform, StyleSheet, Text, View } from 'react-native'
import Button from './src/components/Button'
import Display from './src/components/Display'

const initialState = {
  displayValue: '0', // Valor inicial do visor
  clearDisplay: false, // Atributo para limpar o display
  operation: null, // Armazena o operador pressionado
  values: [0,0], // Explicação abaixo.
  current: 0, // Posição para adicionar valores no array values. Valores validos (0 e 1)
}

/**
 * initialState->values: Este array armazena os valores digitados pelo usuário em dois estágios. Exe:
 * 
 * Parte 1
 * A medida que o usuário pressiona os dígitos na calculadora (0~9 e .), estes são concatenados e armazenados em values[0].
 * 
 * Parte 2
 * No momento que o usuário pressiona um operador (+, -, *, /) o ponteiro do values passa de 0 para 1 através do atributo current.
 * Nesse momento values[0] tem um valor armazenado e o operador passa de null para o operador pressionado e o display é limpo.
 * 
 * Parte 3
 * Identico a Parte 1, os valores digitados são concatenados e armazenados em values[1]
 * 
 * Parte 4 
 * Similar a Parte 2, com a diferença que nesse momento podemos receber um novo operador (=) que irá apresentar o resultado. 
 * No caso de outro operador ser pressionado, o cálculo é realizado, armazenado em values[0], enquanto values[1] ficará no 
 * aguardo de um novo valor para aplicar a lógica do operador ou finalizar com o operador (=)
 */

export default class APP extends Component {

  // Clona o estado inicial para utiliza-lo na classe
  state = {...initialState}

  // Adiciona os digitos pressionados no visor da calculadora
  addDigit = n => {

    //console.debug(typeof this.state.displayValue)

    // Limpa display quando valor do display for 0 ou clearDisplay for true
    const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay

    // Validação para apenas um ponto. Caso o ponto já esteja em displayValue ele é ignorado 
    if(n === '.' && !clearDisplay && this.state.displayValue.includes('.')) return

    // Armazena valor corrente quando clearDisplay !== true 
    const currentValue = clearDisplay ? '' : this.state.displayValue

    // Contatena currentValue com o numero pressionado
    const displayValue = currentValue + n

    // Salva o estado atual do displayValue e restaura clearDisplay para continuar concatenando os digitos
    this.setState({ displayValue,  clearDisplay: false })

    // Armazena o valor concatenado na posição do array correspondente (0 ou 1).
    if(n !== '.')
    {
      const newValue = parseFloat(displayValue)
      const values = [...this.state.values]
      values[this.state.current] = newValue
      this.setState({ values })
    }
  }

  // Restaura a calculadora para seu estado inicial
  clearMemory = () => {
    this.setState({ ...initialState })
  }

  // Aplica a operação selecionada (Lógica da calculadora).
  setOperation = operation => {
    
    // Armazena o operador e incrementa o ponteiro de values através do atributo current
    if(this.state.current === 0)
    {
      this.setState({ operation, current: 1, clearDisplay: true})
    }
    // Aplica a lógica ao operador armazenado na etapa anterior no array values
    else
    {
      // Inicia constantes para aplicação da lógica
      const equals = operation === '='
      const values = [... this.state.values]

      // Eval retorna o resultado da operação setada anteriomente e armazena em values[0]
      try{
        values[0] = eval(`${values[0]} ${this.state.operation} ${values[1]}`)
      }
      // Em caso de falha restaura para o valor anterios
      catch(e){
        values[0] = this.state.values[0]
      }

      // Zera values[1] após aplicação do operador acima, estando apto a receber nova sequencia de digitos
      values[1] = 0

      // Define o estado da calculadora após aplicar a lógica
      this.setState({
        displayValue: `${values[0]}`, // Seta o resultado da operação como string para o display 
        operation: equals ? null : operation, // Seta ou redefine o atributo
        current: equals ? 0 : 1, // Salva a posição do array values
        clearDisplay: !equals, // Limpa o display quando digitado os operadores (+, -, *, /)
        values, // Armasena o array atual no estado
      })


    }
  }

  render() {
    return(
      <View style={styles.container}>
        <Display value={this.state.displayValue} />
        <View style={styles.buttons}>
          <Button label='AC'onClick={this.clearMemory} triple ></Button>
          <Button label='/' onClick={this.setOperation} operation ></Button>
          <Button label='7' onClick={this.addDigit} ></Button>
          <Button label='8' onClick={this.addDigit} ></Button>
          <Button label='9' onClick={this.addDigit} ></Button>
          <Button label='*' onClick={this.setOperation} operation ></Button>
          <Button label='4' onClick={this.addDigit} ></Button>
          <Button label='5' onClick={this.addDigit} ></Button>
          <Button label='6' onClick={this.addDigit} ></Button>
          <Button label='-' onClick={this.setOperation} operation ></Button>
          <Button label='1' onClick={this.addDigit} ></Button>
          <Button label='2' onClick={this.addDigit} ></Button>
          <Button label='3' onClick={this.addDigit} ></Button>
          <Button label='+' onClick={this.setOperation} operation ></Button>
          <Button label='0' onClick={this.addDigit} double ></Button>
          <Button label='.' onClick={this.addDigit} ></Button>
          <Button label='=' onClick={this.setOperation} operation ></Button>
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