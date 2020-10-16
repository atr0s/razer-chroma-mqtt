const mqtt = require('mqtt');
const store = require('data-store')({ path: process.cwd() + '/state.json' });

const config = require(process.cwd() + '/config.json');
const Chroma = require("razer-chroma-nodejs");
let devicesColor;
const url = config.url;
const clientId = config.client_id;
const options = {
  clientId: clientId
}

var client = mqtt.connect(url,options)


function initChroma(){
   Chroma.util.init(() => {
    console.log("Chroma Editing Started");
    setTimeout(() => {
      let previousState = JSON.stringify(store.data);
      if(previousState) {
        console.log("Restoring previous state");
        updateChroma('state_restore',previousState,'');
      }
    }, 2000);
  });
  setTimeout(() => {},2000);
}

function closeConnection(){
  if(Chroma.util.isActive()) {
    Chroma.util.uninit(() => {
      console.log("Chroma Editing Stopped");
    });
  }
  client.end();
  process.exit(1);
}


client.on("connect",function(){	
  console.log(`Connected to ${url}`);
  initChroma();
});

client.on("error",function(error){
  console.log("Can't connect" + error);
  process.exit(1);
});

async function setChromaState(payload) {
  if(Chroma.util.isNotActive()){
    console.log("Initializing razer chroma");
    await initChroma();
  }
  if(payload.state) {
    store.set('state',payload.state);
  }
  if(payload.state === 'ON') {
    if(devicesColor) {
      Chroma.effects.all.setColor(devicesColor);
    } else {
      Chroma.effects.all.setColor(store.get('colors'));
    }
  }
  if(payload.state === 'OFF') {
    Chroma.effects.all.off();
  }

  if (payload.color) {
    const c = payload.color;
    devicesColor = Chroma.colors.rgb(c.r,c.g,c.b);
    store.set('color',payload.color);
    Chroma.effects.all.setColor(devicesColor);
  }

  


}

async function updateChroma(topic, message, packet){
    const payload = JSON.parse(message);
    await setChromaState(payload);
    client.publish(`${clientId}/state`,JSON.stringify(store.data));
    
    
}

client.subscribe([`${clientId}/set`]);
client.on('message',updateChroma);

process.on('SIGKILL', closeConnection);
process.on('SIGINT', closeConnection);

