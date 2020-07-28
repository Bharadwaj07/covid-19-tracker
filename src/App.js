import React,{useState,useEffect}from 'react';
import './App.css';
import {FormControl, Select, MenuItem,Card,CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';
function App() {

  const baseUrl ="https://disease.sh"
  const [countries,setCountries] =useState([]);
  const [country,setCountry] =useState('worldwide')
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter,setMapCenter] = useState({
    lat:	21.146633,
    lng:79.088860
  });
  const [mapZoom,setMapZoom] = useState(3);
  const [mapCountries,setMapCountries] = useState([]); 
  const [casesType,setCasesType] = useState("cases") 

  useEffect(() =>{
    fetch(`${baseUrl}/v3/covid-19/all`)
          .then(response => response.json())
          .then(data =>{
            setCountryInfo(data);
          })
  },[])
  useEffect(() =>{
      const getCountries = async () =>{
        await fetch(`${baseUrl}/v3/covid-19/countries`)
        .then(response => response.json())
        .then(data =>{
          const countries = data.map(country =>({
            name:country.country,
            value:country.countryInfo.iso2
          }));
          setCountries(countries);
          setMapCountries(data);
          const sortedData = sortData(data)
          setTableData(sortedData);
          //console.log(data)
        });
      };

      getCountries();
  },[])   

  const onCountryChange = async (event) =>{
    const countryCode = event.target.value;
    setCountry(countryCode)
    const url = countryCode === 'worldwide'?`${baseUrl}/v3/covid-19/all`:`${baseUrl}/v3/covid-19/countries/${countryCode}`

    await fetch(url)
          .then(response => response.json())
          .then(data =>{
            setCountryInfo(data);
            //console.log("lat and lng ===>>",data.countryInfo.lat,data.countryInfo.long);
            setMapCenter({lat:data.countryInfo.lat,lng:data.countryInfo.long});
            setMapZoom(4);
          })
  }

  //console.log(countryInfo);
  return (
    <div className="app">
      <div className="app__left">
          <div className='app__header'>
              <h1>COVID-19 TRACKER</h1>
              <FormControl className="app__dropdown">
                <Select
                  variant='outlined'
                  value={country}
                  onChange={onCountryChange}
                > 
                  <MenuItem value="worldwide">WorldWide</MenuItem>
                  {
                    countries.map(country =>
                      <MenuItem 
                        value={country.value}
                        >
                          {country.name}
                        </MenuItem>
                    )
                  }
                </Select>
              </FormControl>
          </div>
          <div className="app__stats">
              <InfoBox 
                  isRed
                  active={casesType==="cases"}
                  title="Corona virus Cases" 
                  cases={prettyPrintStat(countryInfo.todayCases)} 
                  total={prettyPrintStat(countryInfo.cases)}
                  onClick={(e)=> setCasesType("cases")}
              />

              <InfoBox 
                  active={casesType==="recovered"}
                  title="Recovered" 
                  cases={prettyPrintStat(countryInfo.todayRecovered)} 
                  total={prettyPrintStat(countryInfo.recovered)}
                  onClick={(e)=> setCasesType("recovered")}
              />

              <InfoBox 
                  isRed
                  active={casesType==="deaths"}
                  title="Deaths" 
                  cases={prettyPrintStat(countryInfo.todayDeaths)} 
                  total={prettyPrintStat(countryInfo.deaths)}
                  onClick={(e)=> setCasesType("deaths")}
                />
          </div>
          <Map
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
            caseType={casesType}
          />
      </div>
      <Card className="app__right">
          <CardContent>
            <div className='app__table'>
              <h3>Live Cases  by Country</h3>
              <Table countries={tableData}/>
            </div>
          
                <h3 className='app__graphtitle'>Worldwide New {casesType}</h3>
                <LineGraph 
                  className="app__graph"
                  caseType={casesType}
                />
            
          </CardContent>
      </Card>
    </div>
  );
}

export default App;
