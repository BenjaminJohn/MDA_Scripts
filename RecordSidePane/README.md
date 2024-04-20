# RecordSidePane

## What is the RecordSidePane?
It is a Javascript for editable grids in Model Driven Apps, that opens a [Side Pane](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/reference/xrm-app-sidepanes) to show the selected record in it.
![Screenshot](https://github.com/BenjaminJohn/MDA_Scripts/blob/e110d80b82b9611d0b9e8b70d0670d672f72a4b0/RecordSidePane/RecordSidePane_Screenshot.png)

## Installation
1. Upload the Javascript 'RecordSidePane.js' into a new webresource.
2. Add an editable grid under 'the Controls' section of to the entity, where you want to use the RecordSidePane.
3. Under 'Events' of the entity, add the webresource as form library.
4. Under 'Event Handlers' select the event 'oinRecordSelect'
5. Add a new event handler
   -  With the created webresource as 'Library'
   -  The 'Function': Ben.JS.RecordSidePane.onRecordSelect
   -  Make sure to have the checkbox 'Pass execution context as first parameter' enabled
   -  Pass your desired width of the RecordSidePane in the additional Parameter list as string ("404" or "666" or "30%" or "50%" or something like that).
6. Save & Publish

## How to use the RecordSidePane?
Navigate to the 'View' section of the entity and make sure you selected the editable grid. Now, just select a record and a new Side Pane should show you the record in the same window.
