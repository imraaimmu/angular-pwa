import paho.mqtt.client as paho
import time
# from smbus2 import SMBus //uncomment it
# from mlx90614 import MLX90614 //uncomment it
import sched,time
import random

s = sched.scheduler(time.time, time.sleep);
broker="localhost"
port=1883
client= paho.Client("client-socks",transport="websockets")       #create client object
def on_subscribe(client, userdata, mid, granted_qos):   #create function for callback
   print("subscribed with qos",granted_qos, "\n")
   pass
def on_message(client, userdata, message):
    print("message received  "  ,str(message.payload.decode("utf-8")))
def on_publish(client,userdata,mid):   #create function for callback
   print("data published",mid, "\n")
   pass
def on_disconnect(client, userdata, rc):
   print("client disconnected ok")
def get_from_device():
   # bus = SMBus(1)
   # sensor = MLX90614(bus, address=0x5A)
   # print "Ambient Temperature :", sensor.get_ambient()
   # print "Object Temperature :", sensor.get_object_1()
   # bus.close() 
   return random.randint(31,39);
def connectToBroker():
   client.on_subscribe = on_subscribe       #assign function to callback
   client.on_publish = on_publish        #assign function to callback
   client.on_message = on_message        #assign function to callback
   client.on_disconnect = on_disconnect
   print("connecting to broker ",broker,"on port ",port)
   client.connect(broker,port)           #establish connection
def publish_data():
   # client.loop_start()
   # print("subscribing to ","my/topic")
   # client.subscribe("my/topic") // subscribe
   client.publish("my/topic",str(get_from_device()))    #publish
   s.enter(5, 1, publish_data);
   s.run();

connectToBroker();
publish_data();

# client.disconnect()

