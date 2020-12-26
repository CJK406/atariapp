$(".send_continue").click(function(){
    var send_amount = $(".send_amount").val();
    var send_address = $(".send_address").val();
    if(send_amount!=0 && send_address!=""){
        localStorage.setItem("send_amount",send_amount);
        localStorage.setItem("send_address",send_address);
		window.location.href = "../../component/send_confirm/index.html";
    }
})


$(".btn_send").click(function(){
    $(".send_amount_currency").html(currency_data[current_tab][0].toUpperCase());
    $(".send_amount").val();
    $(".send_amount_usd").val();
    $("#send_modal").modal('show');
});

$(".send_amount").keyup(function(){
    var send_a = $(this).val();
    $(".send_amount_usd").val((usd_value*send_a).toFixed(4));
});

$(".send_amount_usd").keyup(function(){
    var send_a = $(this).val();
    $(".send_amount").val((send_a/usd_value).toFixed(7));
});


$(".scan_qr").click(function(){
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                console.log(result);
                if(!result.cancelled)
                {
                    console.log(result);
                    var qr_address;
                    var split = result.text.split(":");
                    if(split.length>1)
                        qr_address=split[1];
                    else    
                        qr_address = split[0];
                    $(".send_address").val(qr_address);
                }
                else{
	                // window.location.href = "../../component/balance/index.html";
                }
            },
            function (error) {
                alert("Scanning failed: " + error);
                // window.location.href = "../../component/balance/index.html";
            }
    );
})