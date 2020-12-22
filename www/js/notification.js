	const pusher = new Pusher('55140bd5ad055d0a2d10',{
		appId: "984706",
		
		secret: "a7ed4ac1574e012c701f",
		cluster: "mt1",	  
	});
    pusher.unsubscribe('my-channel');
	const channel = pusher.subscribe('payment-received-432');
	console.log(channel);
	channel.bind('new-message', function (data) {
	  console.log(data.message);
	});
	
