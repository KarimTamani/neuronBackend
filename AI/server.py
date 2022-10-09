import socket 
from handle import HandleThread 
# init IP , PORT and the length of header
IP = "127.0.0.1" 
PORT = 4000 
HEADER_LENGTH = 10 
CLIENTS_NUMBER = 10

# init out socket server with ruesable address option 
socket_server = socket.socket(socket.AF_INET , socket.SOCK_STREAM) 
socket_server.setsockopt(socket.SOL_SOCKET , socket.SO_REUSEADDR , True) 

# bind to the given IP and port 
# listen to the maximum clients number  
socket_server.bind((IP , PORT)) 
socket_server.listen(CLIENTS_NUMBER) 

print(f"[INFO] Server is running on address {IP}:{PORT}")
while True :
    # accept new client 
    client_socket , client_address = socket_server.accept() 
    print(f"[INFO] New Connection with {client_address} establish!")
    
    # handle client connection 
    handle_thread = HandleThread(client_socket , HEADER_LENGTH) 
    handle_thread.start() 
