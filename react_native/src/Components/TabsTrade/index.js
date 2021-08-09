import React, { useEffect, useState } from 'react'
import {View, Text, InteractionManager} from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-material-ui'
import History from '../History'
import TopContent from './TopContent'
import Charts from './Charts'

const TabsTrade = (props) => {
    const {darkmode,tabData,balance,currentTab, history,history_finish} = props
    const [chart_data, setChartData] = useState({x:[],y:[],min:0,max:0,percent:0})
    const resetLayoutData = () => {
    }
    useEffect(() => {
        resetLayoutData()
    },[props.tabData])
    useEffect(() => {
       InteractionManager.runAfterInteractions(() => {
            resetLayoutData()
        })
    },[])
  
   
    return(
        <View>
            <TopContent darkmode={darkmode} currentTab={currentTab} balance={balance} chart_data={chart_data} tabData={props.tabData}/>
            <Charts darkmode={darkmode} onFinishLoad={(data) => setChartData(data)} 
                tabData={props.tabData} trigger={props.trigger}
                />
            <History label={'Activity'} data={history.body.obj[tabData.history_t]} darkmode={darkmode}
                    isLoad={!history_finish}/>
        </View>
    )
}

function mapStateToProps(state) {
    return {
          darkmode: state.Auth.darkmode,
          get_address:state.Auth.get_address,
          price:state.Auth.price,
    };
  }
  
export default connect(mapStateToProps, {  })(withTheme(TabsTrade));