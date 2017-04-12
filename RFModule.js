var myBuffer = []; 
String.prototype.hexEncode = function(){
    var hex, i; 
    var result = new Buffer(this.length);
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(10); 
        result[i] = (hex);
    }
    return result
}
var RFModule = function() {
    var sendRFData = function(address, data) {
        var Data_byte_Send = data.hexEncode();  
        var HEX_RF_CODE = new Buffer(Data_byte_Send.length + 5);
        HEX_RF_CODE[0] = address[0];
        HEX_RF_CODE[1] = address[1];
        HEX_RF_CODE[2] = address[2];
        for(var i = 3; i < (Data_byte_Send.length + 3); i++) {
            HEX_RF_CODE[i] = Data_byte_Send[i-3]; 
        }
        HEX_RF_CODE[Data_byte_Send.length + 3] = 0x0D;
        HEX_RF_CODE[Data_byte_Send.length + 4] = 0x0A;
        return HEX_RF_CODE; 
    }
    return {
        sendRFData: sendRFData
    }
}

module.exports.RFModule = RFModule;

