function receive(currency){
    var currency_data = [['btc','bitcoin'],['atri','atri'],['eth','ethereum'],['ltc','litecoin'],['bch','bitcoincash']];
    $(".receive_address").html("");
    $(".receive_qr").html("");
    $("#receive_address_input").val();
    $.ajax
    ({
        type: "GET",
        url: 'https://www.ataritokens.com/myportal/api/request-payment/'+currency_data[currency][0],
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", token);
        },
        success: function (value){
            $(".receive_address").html(value.address);
            $(".receive_address_input").val(value.address);
            $(".receive_qr").qrcode({
                size: 200,
                mode: 0,
                // image: $(".logo-lg")[0],
                ecLevel: 'H',
                text: currency_data[currency][1]+":"+value.address
            });

        },
        error: function(xhr, status, error) {
            console.log("error",status,xhr,error);
        }
    });
}


$(".btn_receive").click(function(){
    $("#receive_modal").modal('show');
    receive(current_tab);
});

$(".receive_address_copy").click(function(){
    var copyText = document.getElementsByClassName("receive_address_input")[0];
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    alert("Copied to clipboard");
})
