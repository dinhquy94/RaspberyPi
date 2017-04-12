var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost:1883',
{
	username: 'owntracks',
	password: '123456'
}
);   
client.on('connect', function () {
	console.log("client connected"); 
	client.subscribe('device/command/TB210494', { qos: 2 }, function(err, granted) {
      if (err)
        console.log(err);
      else
        console.log("dawng ky nhan command : ", granted);
    }); 
    client.subscribe('device/laser/TB210494', { qos: 2 }, function(err, granted) {
      if (err)
        console.log(err);
      else
        console.log("dawng ky nhan command : ", granted);
    }); 
	 client.subscribe('security/mode/TB210494', { qos: 2 }, function(err, granted) {
	  if (err)
	    console.log(err);
	  else
	    console.log("dawng ky nhan command : ", granted);
    });
});
var SerialPort = require("serialport").SerialPort; 
    var serialPort = new SerialPort("/dev/ttyUSB0", {
        baudrate: 9600,
        parser: SerialPort.parsers.readline("\n")
    }); 
	serialPort.on('data', function(data) {  
		console.log(data);
		 try {
	    	object_dulieu = JSON.parse(data);   
	    	var MATHIETBI = object_dulieu.mathietbi;
	    	console.log("DL nhan duoc:" + data);
	    	if(object_dulieu.type == "dataEvent" ){ 
	    		if(object_dulieu.EventName == "laserDetected" ){	    			
	    			client.publish('event/data/'+ MATHIETBI, JSON.stringify(object_dulieu));
	    			LaserEventFlag = {
	    				flag_name: "LaserEventFlag",
	    				flag_value: 1
	    			};
	    			//serialPort.write("Q"+ JSON.stringify(LaserEventFlag) +"K \n", function(err, results) {
					  //  console.log("Thay doi co trang thai laser");
					 // }); 
	    		}
	    		if(object_dulieu.EventName == "beepWarning" ){
	    			beepWarningFlag = {
	    				flag_name: "beepWarningFlag",
	    				flag_value: 1 
	    			};
	    			//serialPort.write("S"+ JSON.stringify(beepWarningFlag) +"E \n", function(err, results) {
					//    console.log("ghi du lieu nhan duoc ra Serial ");
					 // });
	    		}
	    	} else if (object_dulieu.type == "dataSystem"){
	    		client.publish('data/data/'+ MATHIETBI, JSON.stringify(object_dulieu)); 
	    	} else if (object_dulieu.type == "dataDevice") {
	    		client.publish('device/state/'+ MATHIETBI, JSON.stringify(object_dulieu)); 
	    	}
		 } catch (e) {
		 	console.log("cant parse");
		 } 
	/*
		try {
	    	object_dulieu = JSON.parse(data);
	    	var MATHIETBI = object_dulieu.mathietbi;
	    	//console.log(object_dulieu);
	    	for(var i = 0; i < object_dulieu.cambienlaser.length; i++ ){
	    		if(object_dulieu.cambienlaser[i] < 100){
	    			client.publish('system/warning/'+ MATHIETBI, i.toString());
	    		}
	    	}
	    	console.log(object_dulieu.thongtincanhbao); 
	    	//prepare data warning info 
	    	var canhbao = {
	    		thongtincanhbao: object_dulieu.thongtincanhbao,
	    		noidungled: object_dulieu.noidungbienled,
	    		mathietbi: MATHIETBI
	    	}; 
	    	client.publish('warning/info/'+ MATHIETBI, JSON.stringify(canhbao));
	     
	    	 client.subscribe("device/command/" + MATHIETBI , { qos: 2 }, function(err, granted) {
			    if (err)
			      console.log(err);
			    else
			      console.log("re-subcribed", granted);
			});
	    	client.publish('sensors/value/'+ MATHIETBI, data);
	    	console.log(MATHIETBI);
		} catch (e) {
			console.log("cant parse");
		}
		*/
	});
	serialPort.on("open", function () {
		console.log("SerialPort connected");

	});
	client.on('message', function (topic, message) {   
		console.log(topic + "-" + message); 
		if(topic.startsWith("device/command/")) {
		var command = JSON.parse(message);
		var control_obj = {
				command: command.type,
				value: command.value,
				port: command.port
		};
		console.log( control_obj);
		serialPort.write("Q"+ (control_obj) +"K \n", function(err, results) {
		    console.log("ghi du lieu nhan duoc ra Serial ");
		  }); 
		} 
		if(topic.startsWith("device/laser")) { 
		serialPort.write("Q"+ message +"K \n", function(err, results) {
		    console.log("dieu khien laser ");
		  }); 
		} 
		if(topic.startsWith("security/mode/")) {
		var command = JSON.parse(message);
		var control_obj = {
				command: command.type,
				chedo: command.chedo,
				 
		};
		console.log( control_obj);
		serialPort.write("Q"+ JSON.stringify(control_obj) +"K \n", function(err, results) {
		    console.log("ghi du lieu nhan duoc ra Serial ");
		  }); 
		} 
		
	  client.subscribe(topic , { qos: 2 }, function(err, granted) {
	    if (err)
	      console.log(err);
	    else
	      console.log("re-subcribed", granted);
	  });
	});