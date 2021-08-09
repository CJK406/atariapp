import * as React from 'react';
import { SafeAreaView, FlatList,View } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-material-ui';
import { CustomStyles,Headers } from '../Constant';
import { Header, TradeHeaderTab,   TabsTrade} from '../Components'
import { updateBallance,setAllHistory,authSetToken} from '../Redux/Actions';

// import PTRView from '../Components/PullToRefreshCustom';
import PTRView from 'react-native-pull-to-refresh';

class TradeScreen extends React.Component {

	state = {
		currentTab: 0,
        tabData:Headers[0],
        history: {body:{ATARI:[],ETH:[],USDT:[],BTC:[],BNB:[],LTC:[]},arr:[]},
		history_finish:true,
		darkmode:true,
		triggerRefresh : false,
		balance:null
	}
	
	static getDerivedStateFromProps(props, state) {
		return {
			balance:props.balance,
			darkmode:props.darkmode,
			get_address:props.get_address,
			price:props.price,
			history:props.all_history,
			notification_Flag:props.notification_Flag
		};
	}
	shouldComponentUpdate(nextProps, nextState) {
		return this.state.history != nextState.history ||
			   this.state.triggerRefresh != nextState.triggerRefresh ||
			   this.state.currentTab != nextState.currentTab ||
			   this.state.darkmode != nextState.darkmode ||
			   this.state.balance != nextState.balance ||
			   this.state.triggerRefresh != nextState.triggerRefresh;
	}
	
	refresh(){
		this.setState({
			triggerRefresh:true,
			history_finish:false
		},() => {
			    this.props.authSetToken();
				if(this.state.notification_Flag){
					this.props.updateBallance();
					this.props.setAllHistory();
				}
				this.setState({
					triggerRefresh:false,
					history_finish:true
				})
		})
	}
  render() {
		const { currentTab,balance,darkmode,history,history_finish } = this.state;
		const themeBG = darkmode?'rgb(33,33,33)':'white'
		const txtColor = darkmode?'white':'black';
		const renderItem = ({ item }) => (
			<View>
				<Header darkmode={darkmode} />
				<TradeHeaderTab darkmode={darkmode} 
					balance={balance} 
					activeTab={currentTab}
					onPressTab={(index, tab) => {this.setState({currentTab:index,tabData:tab}),this.props.authSetToken()}}/>
				<TabsTrade currentTab={currentTab} history_finish={history_finish} history={history} balance={balance} tabData={this.state.tabData} trigger={this.state.triggerRefresh}/>
				
			</View>
			);
    return (
      <SafeAreaView style={{...CustomStyles.container, backgroundColor: themeBG }}>
          <PTRView onRefresh={()=>this.refresh()} >
			<FlatList
                data={[1]}
                renderItem={renderItem}
            />
		</PTRView>
	  </SafeAreaView>
    );
  }

}



function mapStateToProps(state) {
  return {
		balance: state.Auth.balance,
		darkmode: state.Auth.darkmode,
		get_address:state.Auth.get_address,
		price:state.Auth.price,
        all_history:state.Auth.all_history,
		notification_Flag:state.Auth.notification_Flag,

  };
}

export default connect(mapStateToProps, { updateBallance,setAllHistory,authSetToken })(withTheme(TradeScreen));
