import React, { useEffect, useState } from 'react'
import {View,  InteractionManager} from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-material-ui'
import { get_allHistory as get_allHistoryApi} from '../../Api'
import History from '../History'

import TopContent from './TopContent'
import Charts from './Charts'

const TabsTrade = (props) => {
    const {darkmode,tabData} = props
    
    
    const [historyData,setHistory] = useState([])
    const [historyFinish, setHistoryFinish] = useState(false)
    const [chart_data, setChartData] = useState({x:[],y:[],min:0,max:0,percent:0})

    const resetLayoutData = () => {
        setHistory([])
        setHistoryFinish(false)
        loadHistory()
    }

    useEffect(() => {
        resetLayoutData()
    },[props.tabData])
    
    useEffect(() => {
      const interactionPromise =  InteractionManager.runAfterInteractions(() => {
            resetLayoutData()
        })
        return () => interactionPromise.cancel();
    },[])

    const loadHistory = async () => {
		const historydata = await get_allHistoryApi();
        const coin = tabData.history_t;
        setHistory(historydata.body[coin])
		setHistoryFinish(true)
    }

    useEffect(() => {
        if(props.trigger && historyFinish){
             resetLayoutData();
        }
           
    },[props.trigger])
   

    return(
        <View>
            <TopContent darkmode={darkmode} chart_data={chart_data} tabData={props.tabData}/>
            <Charts darkmode={darkmode} onFinishLoad={setChartData} 
                tabData={props.tabData} trigger={props.trigger}/>
        </View>
    )
}

function mapStateToProps(state) {
    return {
          balance: state.Auth.balance,
          darkmode: state.Auth.darkmode,
          get_address:state.Auth.get_address,
          price:state.Auth.price,
    };
  }
  
export default connect(mapStateToProps, {  })(withTheme(TabsTrade));