# Razer Chroma MQTT 

Turn your Razer Chroma devices into an MQTT light entity in home assistant.

# Features
  - Allows you to control the colours of all your Chromalink devices through the Razer Chroma API, I found that some devices don't seem to work via the REST API, couldn't be bothered to figure out why 
  - Saves the last state and restores it upon startup

# How to get it going

On the machine where Razer Chroma is installed
  - Install nodejs
  - Install requirements 
 ``` npm install ```
  - Create config.json containing your MQTT endpoint and configured device in Home Assistant
  ```json
      {
        "url": "mqtt://<mqtt endpoint>",
        "client_id": "<client identifier>"
      }
  ```
  - Run it ```node razer-mqtt.js```

On home assistant:
  - Add an entity on the configuration as per below, not that the topic name must match the name you've picked on the last step.
```
    light:
      - platform: mqtt
        name: "Razer Chroma"
        schema: json
        command_topic: "<client identifier>/set"
        state_topic: "<client identifier>/state"
        rgb: true
        brightness: false
```

You can use something like [NSSM](https://nssm.cc/) to run the code a service that starts up with your computer. 

There's also the option to package it up as an exe by using [pkg](https://www.npmjs.com/package/pkg)

# Todo
  - Support effects
  - Write tests