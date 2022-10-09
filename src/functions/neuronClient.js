const net = require("net");
const events = require("events")

// header length = 10 
const HEADER_LENGTH = 10

export default (request) => {
    let responseEvent = new events.EventEmitter()

    var client_socket = net.connect(4000, "127.0.0.1", () => {
        console.log("Connected to neuron server");
        // convert the json request to string 
        // and calculate the length for the header
        var json_request = JSON.stringify(request);
        const request_length = json_request.length;
        // build the request with the header 
        json_request = request_length + " ".repeat(HEADER_LENGTH - String(request_length).length) + json_request;
        // send the request and wait for the resposne
        client_socket.write(json_request)
    });
    // log in the console whene connection is done 
    client_socket.on("close", () => {
        console.log("connection closed")
    });
    // whene recive data emit the data in the response event emitter 
    // and desconnect from the server  
    client_socket.on("data", (data) => {
        responseEvent.emit("done", data.toString("utf-8"))

        client_socket.destroy()
    })
    return responseEvent;
}