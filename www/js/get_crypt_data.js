var token = localStorage.getItem('token');
var token = localStorage.getItem('token');
var btc_v = localStorage.getItem('b_btc');
var atri_v = localStorage.getItem('b_atri');
var eth_v = localStorage.getItem('b_eth');
var ltc_v = localStorage.getItem('b_ltc');
var bch_v = localStorage.getItem('b_bch');
var sum_v = localStorage.getItem('b_sum');
var currency_data = [['btc',btc_v,'#f7931a'],['atri',atri_v,'#c42626'],['eth',eth_v,'aqua'],['ltc',ltc_v,'#345c9c'],['bch',bch_v,'green']];
var usd_value = 0;
function get_crypt_data (tab_count){
    $(".total_balance_text").html("$"+parseFloat(sum_v).toFixed(2));
    get_transaction_history(tab_count);
    get_graph_data(tab_count);
}
function get_graph_data(index){
    currency_data = [['btc',btc_v,'#f7931a'],['atri',atri_v,'#c42626'],['eth',eth_v,'aqua'],['ltc',ltc_v,'#345c9c'],['bch',bch_v,'green']];

    usd_value = currency_convert(currency_data[index][0],1);  
    $("."+currency_data[index][0]+"_price_text").html(currency_data[index][0].toUpperCase() +" $"+usd_value.toFixed(2));
    var crypt_usd_value = parseFloat(currency_data[index][1]) * usd_value;
    if(index==2)
        fixed_number = 2;
    else   
        fixed_number = 5;
    $("."+currency_data[index][0]+"_balance").html(parseFloat(currency_data[index][1]).toFixed(fixed_number) + " "+ currency_data[index][0].toUpperCase());

    $("."+currency_data[index][0]+"_usd_balance").html("$"+crypt_usd_value.toFixed(2));
    draw_graph(index,'1h');
}
function currency_convert(currency,value){
    var return_value;
    $.ajax
    ({
        type: "GET",
        url: 'https://www.ataritokens.com/myportal/api/currency-convert/'+value+'/'+currency+'/usd',
        dataType: 'json',
        async:false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", token);
        },
        success: function (result){
            return_value= result['result'];
        },
        error: function(xhr, status, error) {
            console.log("error",status,xhr,error);
        }
    });
    return return_value;
}


function get_transaction_history(index){
    $("#history_div_second").html("");
    $.ajax
    ({
        type: "GET",
        url: 'https://www.ataritokens.com/myportal/api/transactions/'+currency_data[index][0],
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", token);
        },
        success: function (value){
            var result = value['result'];
            var history_div = "";

            for(var i=0; i<result.length; i++){
                history_div+=`<div class="m-b-10" style="display:flex; color:white">
                    <div style="width: 10%; align-items: center; align-self:center">`;
                if(result[i]['type']=="received")
                {
                    history_div+=`<i class="fa fa-arrow-down" aria-hidden="true"></i>
                        </div>
                        <div class="history_status" style="width: 45%;">
                            <p class="fs-15">Received</p>
                            <p class="fs-11">`+result[i]['created_at']+`</p></div>
                        <div style="width: 45%; text-align: right;">
                            
                                <p class="fs-15" style="color:rgb(70,155,74)">`+result[i]['amount']+` `+result[i]['currency'].toUpperCase()+`</p>
                                <p class="fs-14 history_amount_usd">$`+result[i]['amount_usd']+`</p>
                            </div>
                        </div>`;
                }
                else{
                    history_div+=`<i class="fa fa-arrow-up" aria-hidden="true"></i>
                        </div>
                        <div class="history_status"  style="width: 45%;">
                            <p class="fs-15">Sent</p>
                            <p class="fs-11">`+result[i]['created_at']+`</p></div>
                        <div style="width: 45%; text-align: right;">
                            
                                <p class="fs-15" style='color:rgb(244,67,54)'>`+result[i]['amount']+` `+result[i]['currency'].toUpperCase()+`</p>
                                <p class="fs-14 history_amount_usd">$`+result[i]['amount_usd']+`</p>
                            </div>
                        </div>`;
                }
                    
            }
            $("#history_div_second").html(history_div);
        },
        error: function(xhr, status, error) {
            console.log("error",status,xhr,error);
        }
    });
}

function draw_graph(index,period){  
    var chart_data = {x:[],y:[]};

    $.ajax
    ({
        type: "GET",
        url: 'https://www.ataritokens.com/myportal/api/graph/'+currency_data[index][0]+'/'+period,
        dataType: 'json',
        async:false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", token);
        },
        success: function (value){
            var result = value['data'];
            for(var i=0; i<result.length; i++){
                chart_data.x.push(result[i]['date']);
                chart_data.y.push(result[i]['value']);
            }
            var percentage = (usd_value -  chart_data.y[chart_data.y.length-2])/usd_value*100;
            $("."+currency_data[index][0]+"_percent_text").html(percentage.toFixed(2)+"%");
            var spark1 = {
                chart: {
                    type: 'area',
                    height: 130,
                    sparkline: {
                        enabled: true
                    },
                },
                stroke: {
                    width: 2,
                    curve: 'smooth'
                },
                fill: {
                    opacity: 0.2,
                },
                series:[{
                    name: "series A",
                    data: chart_data.y
                    }],
                xaxis: {
                        categories: chart_data.x
                },
                colors: [currency_data[index][2]],
                tooltip: {
                  fixed: {
                      enabled: true
                  },
                  x: {
                    formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
                                        
                      return value
                    }
                  },
                  y: {
                    formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
                        console.log(dataPointIndex);
                        var percentage = (((chart_data['y'][dataPointIndex]-chart_data['y'][dataPointIndex-1])/chart_data['y'][dataPointIndex])*100).toFixed(2);
                        $("."+currency_data[index][0]+"_price_text").html(currency_data[index][0].toUpperCase()+" $"+ value);
                        $("."+currency_data[index][0]+"_percent_text").html(percentage+"%");
        
                    }
                  }
              }
              }
              new ApexCharts(document.querySelector("#"+currency_data[index][0]+"_graph"), spark1).render();
              $(".loading").css("display","none");
        },
        error: function(xhr, status, error) {
            console.log("error",status,xhr,error);
        }
    });

   
    
}