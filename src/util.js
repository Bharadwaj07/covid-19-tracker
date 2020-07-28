import React from 'react';
import {Circle,Popup} from 'react-leaflet';
import numeral from 'numeral';


const caseTypeColors ={
    cases:{
        hex:"#CC1034",
        multiplier:1000,
    },
    recovered:{
        hex:"#7dd71d",
        multiplier:800,
    },
    deaths:{
        hex:"#fb443",
        multiplier:2000,
    },
};
export const sortData = (data) =>{
    const sortedData = [...data];

    sortedData.sort((a,b) =>{
        if(a.cases>b.cases){
            return -1;
        }
        else {
            return 1;
        }
        
    });

    return sortedData;
}

export const prettyPrintStat = (stat) =>
        stat ?`+${numeral(stat).format("0.0a")}`:"No Cases found"

export const showDataOnMap = (data, caseType='cases') =>(
    data.map(country =>(
      <Circle
        center={[country.countryInfo.lat,country.countryInfo.long]}
        fillOpacity={0.4}
        color={caseTypeColors[caseType].hex}
        fillColor={caseTypeColors[caseType].hex}
        radius={
            Math.sqrt(country[caseType]) * caseTypeColors[caseType].multiplier 
        }
      >
          <Popup>
                <div className='info-container'>
                    <div
                        className='info-flag'
                        style={{
                            backgroundImage:`url(${country.countryInfo.flag})`
                        }}
                    />
                    <div
                        className='info-name'
                    >
                        {country.country}
                    </div>
                    <div
                        className='info-confirmed'
                    >
                        Cases:{numeral(country.cases).format("0,0")}
                    </div>
                    <div
                        className='info-recovered'
                    >
                        Recovered:{numeral(country.recovered).format("0,0")}
                    </div>
                    <div
                        className='info-deaths'
                    >
                        Deaths:{numeral(country.deaths).format("0,0")}
                    </div>
                </div>
          </Popup>

      </Circle>  
    ))
)