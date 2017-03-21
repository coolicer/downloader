var fs = require('fs');
var data;

function MJson(filename) {
    this.filename = filename;
    this.load(filename);
}

MJson.prototype.load = function(filename) {
    data = fs.readFileSync(filename);
}

MJson.prototype.set = function(email, id, filename) {
    this.load(this.filename);
    try {
        var jsonArray = JSON.parse(data);
    } catch(err) {
        jsonArray = [];
    }
    var _data;
    jsonArray.push( { "email": email, "id": id, "filename": filename} );
    this._write(jsonArray);
}

MJson.prototype._write = function(json) {
    var _data = JSON.stringify(json, null, 2);
    fs.writeFile(this.filename, _data, function() {});
}

MJson.prototype.get = function(id) {
    this.load(this.filename);
    try {
        var jsonArray = JSON.parse(data);
    } catch(err) {
        jsonArray = [];
    }
    if(jsonArray.length === 0) return -1;
    var _data;
    for(var i = 0; i < jsonArray.length; i++) {
        var item = jsonArray[i];
        if( item['id'] === id) {
            return {
                filename: item['filename'],
                email: item['email']
            };
        }
    }
}

MJson.prototype.del = function(id) {
    this.load(this.filename);
    try {
        var jsonArray = JSON.parse(data);
    } catch(err) {
        jsonArray = [];
    }
    if(jsonArray.length === 0) return;
    var key = this.get(id);
    if(key < 0) return;
    var _data;
    jsonArray.splice(key,1);
    this._write(jsonArray);
}

module.exports = MJson;