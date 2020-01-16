import React from 'react'
import { 
    StyleSheet, 
    Text, 
    Dimensions, 
    TouchableHighlight
} from 'react-native'

const style = StyleSheet.create({
    button: {
        fontSize: 40,
        height: Dimensions.get('window').width / 4,
        width: Dimensions.get('window').width / 4,
        padding: 20,
        color: '#fff',
        backgroundColor: '#5E6773',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#333F4F',

        justifyContent: 'center',
        
        alignItems: 'flex-end',  
    },
    activeButton: {
        borderWidth: 2,
    },
    topButton: {
        backgroundColor: '#45515F',
    },
    operationButton: {
        backgroundColor: '#ff9f08',
    },
    buttonDouble: {
        width: Dimensions.get('window').width / 2,
    },
    buttonTriple: {
        width: (Dimensions.get('window').width / 4) * 3,
    }
})

export default props => {

    const StyleButton = [style.button]
    
    if(props.double) StyleButton.push(style.buttonDouble)
    else if(props.triple) StyleButton.push(style.buttonTriple)
    else if(props.operation) StyleButton.push(style.operationButton)
    else if(props.top) StyleButton.push(style.topButton)
    
    return (
        <TouchableHighlight onPress={() => props.onClick(props.label)} >
            <Text style={StyleButton}>{props.label}</Text>
        </TouchableHighlight>
    )
}