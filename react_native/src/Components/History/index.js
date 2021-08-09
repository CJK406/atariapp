import React from 'react'
import {View, FlatList, ActivityIndicator, Text} from 'react-native'
import styles from './style'
import HistoryItem from './Item'

const History = (props) => {
    const color = props.darkmode ? 'white':'black'
    return (
        <View style={{...styles.container}}>
            <FlatList
                ListHeaderComponent={() => (
                    <Text style={{fontSize:16,color:color,marginBottom:10}}>{props.label}</Text>
                    )}
                nestedScrollEnabled 
                data={props.data}
                keyExtractor={(item, index) => index }
                renderItem={({ item }) => <HistoryItem darkmode={props.darkmode} item={item}/>}
                ListHeaderComponent={() => (
                    <View>
                        {props.isLoad && 
                        <ActivityIndicator size="large" color={color} />}
                    </View>
                )}
            />
        </View>
    )
}

export default History