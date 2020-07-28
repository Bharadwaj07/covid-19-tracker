import React from 'react';
import {Card,CardContent,Typography} from '@material-ui/core';
import './InfoBox.css';
function InfoBox({title,cases,total,isRed,active,...props}) {
    return (
        <Card 
            className={`infobox ${active && "infobox--selected"}
            ${isRed && 'infobox--red'}`}
            onClick={props.onClick}
        >
            <CardContent> 
                <Typography className="infobox__title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`infobox__cases ${!isRed && 'infobox__cases--green'}`}>
                    {cases}
                </h2> 
                <Typography className="infobox__total" color="textSecondary">
                    {total} total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;
