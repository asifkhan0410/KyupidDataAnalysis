import { useEffect, useState } from 'react';
import './App.css';
import { MapContainer, TileLayer, Popup } from 'react-leaflet'
import { Polygon } from 'react-leaflet';

function App() {
  const [users, setUser] = useState();
  // const [area, setArea] = useState([]);
  const [areacoord, setAreaCoord] = useState([]);
  const [allarea, setAllArea] = useState([]);
  const [solution1, setSolution1] = useState([]);
  const [toggle, setToggle] = useState(-1);
  const center=[12.971599,77.594566];
  var maxuserinarea =0;
 useEffect(() => {
    fetch('https://kyupid-api.vercel.app/api/users').then(response => response.json())
    .then(data => {
        //console.log('Success:', data);
        setUser(data.users);
      })
      .catch((error) => {
          console.error('Error:', error);
        });
    fetch('https://kyupid-api.vercel.app/api/areas').then(response => response.json())
    .then(data => {
        //console.log('Success:', data.features);
        setAllArea(data.features)
      })
      .catch((error) => {
          console.error('Error:', error);
      }); 

 },[]);
// var areacoord2=[];
 useEffect(()=> {
  setAreaCoord(allarea.map(aa=> {
      return aa.geometry.coordinates[0].map(cc => {
        //  console.log(cc)
        return [cc[0], cc[1]] = [cc[1], cc[0]];
        //  return console.log(cc)
      })
    }))
    // console.log(allarea)
 },[allarea])

 function getData(){
  setToggle(0)
  const filteredusers= users.filter(user => (user.is_pro_user === true));
  const a4 = filteredusers.map(fu => {
    return  fu.area_id
  })
  
  const suminstance = a4.reduce((obj, item) => {
    if(!obj[item]){
      obj[item]= 0;
    }
    obj[item]++;
    return obj;
  },{});

  const temp = Object.values(suminstance)
  setSolution1(temp)
 }

 function getData2(){
  setToggle(1);
  
  const a3 = users.map(fu => {
    return  fu.area_id
  })
  
  const suminstance = a3.reduce((obj, item) => {
    if(!obj[item]){
      obj[item]= 0;
    }
    obj[item]++;
    return obj;
  },{})

  const temp = (Object.values(suminstance))
  maxuserinarea = Math.max(...Object.values(suminstance))
  setSolution1(temp.map(s1 => {
    return Math.floor((s1/maxuserinarea)*100)    
  }))
 }

function getData3(){
  setToggle(2);
  const maleusers= users.filter(user => (user.gender === 'M'));
  const femaleusers= users.filter(user => (user.gender === 'F'));
  
 const a1= maleusers.map(fu => {
    return fu.area_id
  })
  
  const suminstance1 = a1.reduce((obj, item) => {
    if(!obj[item]){
      obj[item]= 0;
    }
    obj[item]++;
    return obj;
  },{})

  const tempmalecount = (Object.values(suminstance1));
  
 const a2 = femaleusers.map(fu => {
    return fu.area_id
  })
  
 const suminstance2 = a2.reduce((obj, item) => {
    if(!obj[item]){
      obj[item]= 0;
    }
    obj[item]++;
    return obj;
  },{})

  const tempfemalecount = (Object.values(suminstance2));
  const ratio = tempmalecount.map((tmc,index) => {
    return Number((tempmalecount[index]/tempfemalecount[index]).toFixed(1))
  }) 

  setSolution1(ratio)
 }
 
  return (
    <div className="App">
      <div className="data_buttons">
        <h1>Locale.ai</h1>
        <button onClick={getData}>Areas with good revenue</button>
        <button onClick={getData2}>Areas which requires more UA campaigns</button>
        <button onClick={getData3}>Ratio of M/F</button>
        <p>⭐ How to Use :  Click on any button and then click on the area you want to case study depending upon the problem statement</p>
      </div>
      
    <MapContainer center={center} zoom={10} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {areacoord ? areacoord.map((ac,index) => {
     return <Polygon key ={index} pathOptions={{fillColor: `rgb(${255-index*2} ,0 ,0)`,color: `rgb(${255-index*2} ,0 ,0)`}} positions={ac} >
      <Popup><div>
        <p className="map__text">Area : {allarea? allarea[index].properties.name:''}</p>
        {toggle !== -1? <p>{toggle!== 2? (toggle===0 && toggle!==2?'No of people with pro' :  'Users compared to max user in a area(%)') : 'Ratio of M/F'} : {solution1.length>0? solution1[index]:''}</p> :''}
        </div></Popup>
    </Polygon>}):''}
  </MapContainer>
  </div>
  );
}

export default App;
