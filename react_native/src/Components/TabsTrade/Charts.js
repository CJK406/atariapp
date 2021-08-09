import React, { useEffect, useState } from 'react'
import {View, Text,TouchableOpacity, ActivityIndicator, InteractionManager} from 'react-native'
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import {
	LineChart,
  } from "react-native-chart-kit";
import { get_Graph, get_percent} from '../../Api'
const Charts = (props) => {
    const [currTabPeriod, setCurrTabPeriod] = useState('1')
    const [chart_data,setChartData] = useState({x:[],y:[],min:0,max:0,percent:0})
	const [finishLoad, setFinishLoad] = useState(false);
	const {tabData} = props;
    const resetChart = () => {
        setChartData({x:[],y:[],min:0,max:0})
        getGraphData()
		setFinishLoad(false);
    }
    useEffect(() => {
       InteractionManager.runAfterInteractions(() => {
			resetChart()
		})
    },[])
    useEffect(() => {
        resetChart()
    },[currTabPeriod, props.tabData])
	useEffect(() => {
		if(props.trigger){
			resetChart()
		}
	},[props.trigger])
    const getGraphData = async () => {
        const _data = {x:[],y:[],min:0,max:0};
		const percent_data = {'1' : ['24h','price_change_percentage_24h_in_currency'], 
							  '7' : ['7d','price_change_percentage_7d_in_currency'], 
							  '30':['30d','price_change_percentage_30d_in_currency']};
		const graph_data = await get_Graph(tabData.graph_text, currTabPeriod) 
		const graph_percent = await get_percent(tabData.graph_text,percent_data[currTabPeriod][0]);
		try {
			if(graph_data.length <= 0){
				//Toast.show('No chart data.', Toast.SHORT);
				props.onFinishLoad(_data)
				setChartData(_data);
				setFinishLoad(true);
				return;
			}
			let min = graph_data[0][4];
			let max = 0;
			for(var i=0; i<graph_data.length; i++){
				_data.x.push(graph_data[i][0]);
				_data.y.push(graph_data[i][4]); 
				if(graph_data[i][4]<min)
					min = 	graph_data[i][4];
				if(graph_data[i][4] > max)
					max = graph_data[i][4];
			}
			_data.min=min;
			_data.max=max;
			_data.percent = graph_percent[0][percent_data[currTabPeriod][1]]
			props.onFinishLoad(_data)
			setChartData(_data)
			setFinishLoad(true);
		} catch (error) {
			props.onFinishLoad(_data)
			setChartData(_data);
			setFinishLoad(true);
		}
	}
    const perTabLabel = {'1' : '1 day', '7' : '7 day', '30':'1 month'}
     const chartConfig = {
		color: (opacity = 1) => tabData.color,
		fillShadowGradient: tabData.color,
		fillShadowGradientOpacity:'1',
		strokeWidth: 2, // optional, default 3
		barPercentage: 0.5,
		useShadowColorFromDataset: false, // optional
		backgroundGradientFrom: "#1E2923",
		backgroundGradientFromOpacity: 0,
		backgroundGradientTo: "#08130D",
		backgroundGradientToOpacity: 0,
	  };
    const periodeTab = (period) => {
        return(<TouchableOpacity key={period} onPress={() => setCurrTabPeriod(period)} style={[currTabPeriod===period ? {backgroundColor:'#d24646'} : {backgroundColor:'#c42626'}, { borderRadius:5,width:'21%',height:29,marginLeft:10, borderWidth:0.8,borderColor:'white',alignItems:'center',alignSelf:'center',justifyContent:'center'}]}>
            <Text style={{color:'white',fontSize:11}}>{perTabLabel[period]}</Text>
        </TouchableOpacity>)
    }
    return (
        <View>
            <View style={{height:130, marginTop:20}}>
					{chart_data.y.length>0 ? (
						<LineChart
							data={{
								datasets: [
								  {
									data:chart_data.y,
									color: (opacity = 1) => tabData.color, // optional
									strokeWidth: 2
								  }
								]
							  }}
							width={screenWidth}
							height={130}
							chartConfig={chartConfig}
							withDots={false}
							withInnerLines={false}
							yLabelsOffset={10}
							withVerticalLabels={false}
							segments={4}
							bezier
							/>
						
					):
					finishLoad ? 
					(
						<View style={{marginTop:50}}>
							<Text style={{textAlign:"center", color:"white", fontWeight:"600"}}>No chart data</Text>
						</View>
					)
					:
					(
						<View style={{marginTop:50}}>
							<ActivityIndicator size="large" color={props.darkmode?"white":'black'} />
						</View>
					)}
				</View>
				<View style={{flexDirection:'row',alignSelf:'center',alignItems:'center', textAlign:'center',justifyContent:'center', borderBottomColor:props.darkmode?'white':'black', borderBottomWidth:1, width:'100%', paddingBottom:30,marginTop:20}}>
                    {Object.keys(perTabLabel).map(item => periodeTab(item))}
				</View>
        </View>
    )
}
export default Charts