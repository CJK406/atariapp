import React, { useEffect, useState } from 'react'
import {View, Text, InteractionManager} from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-material-ui'
import { get_allHistory as get_allHistoryApi} from '../../Api'
import History from '../History'
import TopContent from './TopContent'
import Charts from './Charts'
const TabsTrade = (props) => {
    const {darkmode,tabData,balance,currentTab} = props
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
       InteractionManager.runAfterInteractions(() => {
            resetLayoutData()
        })
        
    },[])

    const loadHistory = async () => {
		const historydata = await get_allHistoryApi();
        const coin = tabData.history_t;
        setHistory(historydata.body.obj[coin])
		setHistoryFinish(true)
    }

    useEffect(() => {
        if(props.trigger && historyFinish){
             resetLayoutData();
        }
           
    },[props.trigger])
   
    console.log("bbb",balance);
    return(
        <View>
            <TopContent darkmode={darkmode} currentTab={currentTab} balance={balance} chart_data={chart_data} tabData={props.tabData}/>
            <Charts darkmode={darkmode} onFinishLoad={(data) => setChartData(data)} 
                tabData={props.tabData} trigger={props.trigger}
                />
            <History label={'Activity'} data={historyData} darkmode={darkmode}
                    isLoad={!historyFinish}/>
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