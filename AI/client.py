import socket 
import json 

s = socket.socket(socket.AF_INET , socket.SOCK_STREAM) 
s.connect(("127.0.0.1" , 4000 ))

HEADER_LENGTH = 10 

command = {
    "input" : "1.png" 
}

command = json.dumps(command) 

command = f"{len(command):<{HEADER_LENGTH}}" + command 
s.send(bytes(command , "utf-8") )


result = s.recv(1024).decode("utf-8")
print(result)