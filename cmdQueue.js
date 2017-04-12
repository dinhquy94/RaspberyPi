const Joi = require('joi'); 
const schema = Joi.object().keys({
    code: Joi.string().alphanum().min(0).max(30).required(),
    type: Joi.string(),
    data: Joi.object(), 
    looptime: Joi.number().integer()
});  
var cmdQueue = function() {
    var cmdQueueList = Array(); 
    var push = function(cmd_obj) {
        const valid = Joi.validate(cmd_obj, schema);
        if(valid.error === null) {
            cmdQueueList.push(cmd_obj);
        }else {
            console.log("input invalid !");
        }
    }
    var getTopQueue = function() {
        if (cmdQueueList.length > 0) { 
            return cmdQueueList[cmdQueueList.length -1];
        } else {
            return null;
        }
    }
    var removeQueue = function(code) {
        var count = -1;
        cmdQueueList.forEach(function(element) {
            count++;
            if(element.code === code) {}
                cmdQueueList.splice(count, 1);
            }, this);
    }
    var increaseLoop = function(code) {
        var count = -1;
        cmdQueueList.forEach(function(element) {
            count++;
            var pre_object = (element);
            if(pre_object.code === code) {}
                pre_object.looptime += 1;
                cmdQueueList[count] = pre_object; 
            }, this);
    }
    return {
        push: push,
        pop: getTopQueue,
        remove: removeQueue,
        increaseLoop: increaseLoop
    }
} 
module.exports.cmdQueue = cmdQueue;
