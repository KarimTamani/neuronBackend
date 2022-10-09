
from main import process
from threading import * 
import json 
import urllib.parse
class HandleThread(Thread) : 

    def __init__(self , connection , header_length) : 
        super().__init__() 
        # init out costum thread with the client socket connection 
        # make it daemon to save memory whene the handle is done 
        # init the header length to extract the message length from the input
        self.connection = connection 
        self.daemon = True 
        self.header_length = header_length 
    
    def run(self) : 
        while True : 
            try : 
                # extract command and watch for any exception raised
                command = self._extract_command() 
                
                command = urllib.parse.unquote(command) 
                command = json.loads(command) 

                output = process(command)
                self.connection.send(bytes(json.dumps(output) , "utf-8"))

            except Exception as error : 
                # if exception raised from _extract_command function 
                # or from any function print the error message 
                # and break 
                print("[ERROR] " + str ( error )) 
                break 

        # close connection 
        self.connection.close() 

    def _extract_command(self) :
        # extract the header from the begining of the stream 
        # convert it into number that's the size of the message 
        header = self.connection.recv(self.header_length) 
        
        
        if not len(header) :
            raise Exception("No header was found!") 

        command_length = int(header) 
        
        # read the message based on the command length 
        return self.connection.recv(command_length).decode("utf-8")  
