var SerialPort = require("serialport").SerialPort; 
var libRFModule = require('./RFModule');
var cmdQueue = require('./cmdQueue');
var mqtt = require('mqtt');
var HangDoiLenh = new cmdQueue.cmdQueue();
/**
 * Khai báo các tham số trên phần mềm
 */
const MATHIETBI = "TB210494";
const THUTUBAINHAC = "1";
const GIATRIBIENLED = 0;
/**
 * Kết thúc các khai báo tham số
 */
var DeviceState = [{
    port: 12,
    value: 0
    }, {
    port: 13,
    value: 0
}];
/**
 * Khai báo các biến giá trị phần mềm
 */
var GIA_TRI_MUC_NUOC = 0;
/**
 * Khai báo địa chỉ thiết bị đo mực nước
 */
var address_water_level = new Buffer(3);
    address_water_level[0] = 0x00;
    address_water_level[1] = 0x41;
    address_water_level[2] = 0x17; 
/**
 * Khai báo địa chỉ bộ phát laser
 */
var address1 = new Buffer(3);
    address1[0] = 0x00;
    address1[1] = 0x21;
    address1[2] = 0x17; 
var address2 = new Buffer(3);
    address2[0] = 0x00;
    address2[1] = 0x22;
    address2[2] = 0x17;   
var address3 = new Buffer(3);
    address3[0] = 0x00;
    address3[1] = 0x23;
    address3[2] = 0x17; 
var address4 = new Buffer(3);
    address4[0] = 0x00;
    address4[1] = 0x24;
    address4[2] = 0x17; 
/**
 * Kết thúc Khai báo địa chỉ bộ phát 
 */
/**
 * Khai báo địa chỉ bộ thu laser
 */
var address_detector1 = new Buffer(3);
    address_detector1[0] = 0x00;
    address_detector1[1] = 0x11;
    address_detector1[2] = 0x17; 
var address_detector2 = new Buffer(3);
    address_detector2[0] = 0x00;
    address_detector2[1] = 0x12;
    address_detector2[2] = 0x17;   
var address_detector3 = new Buffer(3);
    address_detector3[0] = 0x00;
    address_detector3[1] = 0x13;
    address_detector3[2] = 0x17; 
var address_detector4 = new Buffer(3);
    address_detector4[0] = 0x00;
    address_detector4[1] = 0x14;
    address_detector4[2] = 0x17; 
/**
 * Kết thúc Khai báo địa chỉ bộ thu 
 */ 
/** Khai báo địa chỉ bộ phát cảnh báo 
 */
var address_speaker_led_out1 = new Buffer(3);
    address_speaker_led_out1[0] = 0x00;
    address_speaker_led_out1[1] = 0x31;
    address_speaker_led_out1[2] = 0x17; 
var address_speaker_led_out2 = new Buffer(3);
    address_speaker_led_out2[0] = 0x00;
    address_speaker_led_out2[1] = 0x32;
    address_speaker_led_out2[2] = 0x17;  
/**
 * Kết thúc Khai báo địa chỉ bộ phát cảnh báo 
 */ 
console.log(parseInt(address_detector2[1]).toString());
var RFModule = new libRFModule.RFModule();
    var serialPort = new SerialPort("/dev/ttyUSB0", {
        baudrate: 9600,
        parser: SerialPort.parsers.readline("\n")
    }); 
	serialPort.on('data', function(data) {
		console.log(data);
		 try {
	    	object_dulieu = JSON.parse(data);   
	    	if(object_dulieu.A) {
               HangDoiLenh.remove(object_dulieu.A);
            }
            if(object_dulieu.A == parseInt(address_detector1[1]) || object_dulieu.A == parseInt(address_detector2[1]) || object_dulieu.A == parseInt(address_detector3[1]) || object_dulieu.A == parseInt(address_detector4[1])) {
                console.log("Recieve data From Laser detector !");
                var data_laser = {
                    mathietbi: MATHIETBI,
                    EventName: "laserDetected", 
                    data: [0,0,0,0]
                } 
                switch(object_dulieu.A) {
                    case parseInt(address_detector1[1]): {
                        console.log("LaserDetector1"); 
                        if(object_dulieu.W == 1) {
                            data_laser.data[0] = 1;  
                        } 
                        serialPort.write(RFModule.sendRFData(address_detector1, data ));  
                    }
                    break;
                    case parseInt(address_detector2[1]): {
                        console.log("LaserDetector2");
                        if(object_dulieu.W == 1) {
                            data_laser.data[1] = 1;  
                        } 
                        serialPort.write(RFModule.sendRFData(address_detector2, data ));
                    }
                    break;
                    case parseInt(address_detector3[1]): {
                        console.log("LaserDetector3");
                        if(object_dulieu.W == 1) {
                            data_laser.data[2] = 1;  
                        } 
                         serialPort.write(RFModule.sendRFData(address_detector3, data ));
                    }
                    break;
                    case parseInt(address_detector4[1]): {
                        console.log("LaserDetector4");
                        if(object_dulieu.W == 1) {
                            data_laser.data[3] = 1;  
                        }
                        serialPort.write(RFModule.sendRFData(address_detector4, data ));
                    }
                    case parseInt(address_water_level[1]): {
                        console.log("Recieve value from water level");
                        if(object_dulieu.H) {
                            GIA_TRI_MUC_NUOC =  object_dulieu.H
                        }
                        //serialPort.write(RFModule.sendRFData(address_detector4, data ));
                    }
                    break; 
                }
                if(object_dulieu.W == 1) {   
                    if(object_dulieu.A == parseInt(address_detector1[1]) || object_dulieu.A == parseInt(address_detector2[1])) {
                            SpeakerOut("thuongluu", 1);
                            DeviceState[0].value = 1;
                            updateDevice();
                    }
                    if(object_dulieu.A == parseInt(address_detector3[1]) || object_dulieu.A == parseInt(address_detector4[1])) {
                            SpeakerOut("haluu", 1);
                            DeviceState[1].value = 1;
                            updateDevice();
                    }
                }
                console.log(data); 
                client.publish('event/data/'+ MATHIETBI, JSON.stringify(data_laser));
            }         

		  } catch (e) {
		 	console.log("Can not parse Recieve RF String ");
		  }
	}); 
	serialPort.on("open", function () {
		console.log("SerialPort connected"); 
        
	}); 
    var client  = mqtt.connect('mqtt://125.212.207.51:1883',
    {
        username: 'owntracks',
        password: '123456'
    }
    );  
    client.on('connect', function () {
        console.log("client connected"); 
        client.subscribe('device/laser/'+MATHIETBI , { qos: 2 }); 
        client.subscribe('device/command/'+ MATHIETBI , { qos: 2 }); 
       
    });
    client.on('message', function (topic, message) {
        console.log("topic: " + topic);
        console.log("message: " + message);
        var data = JSON.parse(message);
        if(topic == 'device/laser/'+ MATHIETBI) {
            var code; 
            if(data.laser_num == 1) code = address1[1];
            if(data.laser_num == 2) code = address2[1];
            if(data.laser_num == 3) code = address3[1];
            if(data.laser_num == 4) code = address4[1];
            HangDoiLenh.push({
                code: parseInt(code).toString(),
                type: "changeLaserPower",
                data: data, 
                looptime: 0
                }
            );
        }
        if(topic == 'device/command/'+ MATHIETBI) {
            if(data.id == 1) {
                DeviceState[0].value = data.value;
                if(data.value == 0) {
                    SpeakerOut("thuongluu", 2);
                }else {
                    SpeakerOut("thuongluu", 1);
                }
            }
            if(data.id == 2) {
                DeviceState[1].value = data.value;
                if(data.value == 0) {
                    SpeakerOut("haluu", 2);
                }else {
                    SpeakerOut("haluu", 1);
                }
            } 
            updateDevice();
        }
    });
    doCmdQueue();
    function doCmdQueue() { 
        var DuLieuHangDoi = HangDoiLenh.pop();
        console.log("Get data from queue !"); 
        if(DuLieuHangDoi != null) { 
            console.log("Do cmd from queue !");   
             console.log((DuLieuHangDoi)); 
            if(DuLieuHangDoi.type == "changeLaserPower") {  
                if(DuLieuHangDoi.data.laser_num == 1) {
                    serialPort.write(RFModule.sendRFData(address1, "{ 'A': "+ address1[1].toString() +" ,'P': "+ DuLieuHangDoi.data.val +"}" ));
                }
                if(DuLieuHangDoi.data.laser_num == 2) {
                    serialPort.write(RFModule.sendRFData(address2, "{ 'A': "+ address2[1].toString() +" ,'P': "+ DuLieuHangDoi.data.val +"}" ));
                }
                if(DuLieuHangDoi.data.laser_num == 3) {
                    serialPort.write(RFModule.sendRFData(address3, "{ 'A': "+ address3[1].toString() +" ,'P': "+ DuLieuHangDoi.data.val +"}" ));
                }
                if(DuLieuHangDoi.data.laser_num == 4) {
                    serialPort.write(RFModule.sendRFData(address4, "{ 'A': "+ address4[1].toString() +" ,'P': "+ DuLieuHangDoi.data.val +"}" ));
                } 
            }
            if(DuLieuHangDoi.type == "speaker_led_out") { 
                if(DuLieuHangDoi.data.position == 'thuongluu') {
                    console.log("thuongluu");
                    serialPort.write(RFModule.sendRFData(address_speaker_led_out1, "{ 'A': "+ address_speaker_led_out1[1].toString() +" ,'M': "+ DuLieuHangDoi.data.thutubainhac +"}" ));
                }else if(DuLieuHangDoi.data.position == 'haluu') {
                   console.log("haluu");
                    serialPort.write(RFModule.sendRFData(address_speaker_led_out2, "{ 'A': "+ address_speaker_led_out2[1].toString() +" ,'M': "+ DuLieuHangDoi.data.thutubainhac +"}" ));
                }
            } 
            HangDoiLenh.increaseLoop(DuLieuHangDoi.looptime);
            if(DuLieuHangDoi.looptime > 5) {
                HangDoiLenh.remove(DuLieuHangDoi.code);
                console.log("Đã xóa");
            }  
      }else  console.log("Queue is Empty !");
        setTimeout(doCmdQueue, 1000);
    }
var updateDevice = function() {
    var object_dulieu = {
                type: "dataDevice",
                mathietbi: MATHIETBI,
                devices: DeviceState
    };
    console.log(JSON.stringify(object_dulieu));
    client.publish('device/state/'+ MATHIETBI, JSON.stringify(object_dulieu)); 
    
}
/**
 * Processing of update data by time to server 
 * 
 */
var updateValueToServer = function() {
    var object_dulieu = {
                type: "dataDevice",
                mathietbi: MATHIETBI,
                devices: DeviceState
    };
    console.log(JSON.stringify(object_dulieu));
    client.publish('data/data/'+ MATHIETBI, JSON.stringify(object_dulieu));
    setTimeout(updateValueToServer, 60000);
    
}
var SpeakerOut = function(position, value) {
    var code;
    if(position == "thuongluu") {
        code = address_speaker_led_out1[2].toString();
    }else if(position == "haluu") {
        code = address_speaker_led_out2[2].toString();
    }
    var value;
    if(value == 1) {
        value = THUTUBAINHAC;
    }else {
        value = 2;
    }
    var DATA_SPEAKER_LED_OUT = {
        position: position,
        thutubainhac: value
    };
    HangDoiLenh.push({
        code: code,
        type: "speaker_led_out",
        data: DATA_SPEAKER_LED_OUT, 
        looptime: 0
        }
    );
}