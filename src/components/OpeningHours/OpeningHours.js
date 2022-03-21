//react
import { useState, useEffect } from 'react';

//axios
import axios from 'axios'

//mui
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';

//styles
import './OpeningHours.scss';

//endpoint for saving opening hours (API Gateway onto Lambda)
const endpoint = "https://20x6ak1030.execute-api.eu-west-2.amazonaws.com/opening-hours";

function OpeningHours() {
  //define opening times 
  const [dayFields, setDayFields] = useState([
        {name: 'Monday', open: null, close: null, isChecked: false},
        {name: 'Tuesday', open: null, close: null, isChecked: false},
        {name: 'Wednesday', open: null, close: null, isChecked: false},
        {name: 'Thursday', open: null, close: null, isChecked: false},
        {name: 'Friday', open: null, close: null, isChecked: false},
        {name: 'Saturday', open: null, close: null, isChecked: false},
        {name: 'Sunday', open: null, close: null, isChecked: false},
    ])

    //loading states
    const [putLoading, setPutLoading] = useState(false);
    const [getLoading, setGetLoading] = useState(true);

    //alerts
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    //get opening times and set them.
    useEffect(() => {
        axios.get(endpoint)
        .then((response) => {
          setDayFields(JSON.parse(response.data.openingHours));
          setGetLoading(false);
        }).catch(error => {
            setAlertSeverity("error");
            setAlertMessage("Error getting opening times!");
            setSnackbarOpen(true);
            setGetLoading(false);
        });
      }, []);
    
    //when user selects a time
    const handleTimeChange = (index, time, type) => {
        let days = [...dayFields];

        //set the time into our days data
        days[index][type] = time

        //update dayFields.
        setDayFields(days);
    }

    //when user checks or unchecks a checkbox
    const handleCheckboxChange = (e, index) => {
        let days = [...dayFields];

        //set isChecked to current checkbox state
        days[index].isChecked = e.target.checked
        
        //if user is deselecting a day, clear out any selected times
        if(days[index].isChecked === false) {
            days[index].close = null;
            days[index].open = null;
        }

        //update dayFields
        setDayFields(days);
    }

    //save opening hours
    const putOpeningHours = (data) => {
        setPutLoading(true);
        axios
          .put(endpoint, {
            openingHours: data
          })
          .then((response) => {
            setAlertSeverity("success");
            setAlertMessage("Successfully saved opening times!");
            setSnackbarOpen(true);
            setPutLoading(false);
          })
          .catch(error => {
              setAlertSeverity("error");
              setAlertMessage("Error saving opening times!");
              setSnackbarOpen(true);
              setPutLoading(false);
          });
      }

    //user submitting form
    const handleFormSubmit = (event) => {
        for(let day of dayFields) {
            console.log(day);
            if(day.isChecked && (day.open === null || day.close === null)) {
                setAlertSeverity("error");
                setAlertMessage(day.name + " must have both an opening time and closing time.");
                setSnackbarOpen(true);
                //stop the page from refreshing
                event.preventDefault();
                return false;
            }
        }
        //into json for saving
        let openingHours = JSON.stringify(dayFields);
        //execute the put
        putOpeningHours(openingHours);
        //stop the page from refreshing
        event.preventDefault();
    }

    const handleClose = () => {
        setSnackbarOpen(false);
    }

    return (
        <div className="opening-hours">
            <h4>Opening Hours</h4>
            {getLoading ? <div className="loading"><CircularProgress /></div> :
            <form onSubmit={handleFormSubmit}>
            {dayFields.map((day, index) => {
                return (
                    <div className="opening-hours__day" key={index}>
                        <div className="opening-hours__day__checkbox">
                            <FormControlLabel control={<Checkbox color="success" checked={day.isChecked} onChange={e => handleCheckboxChange(e, index)} inputProps={{ 'aria-label': day.name }}/>} label={day.name} />
                        </div>
                        <div className={"opening-hours__day__times " + (day.isChecked ? 'show' : undefined)}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    label="Open"
                                    value={day.open}
                                    disabled={putLoading}
                                    onChange={(newTime) => {handleTimeChange(index, newTime, "open");}}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    label="Close"
                                    value={day.close}
                                    disabled={putLoading}
                                    onChange={(newTime) => {
                                    handleTimeChange(index, newTime, "close");
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                </div>
                    )
                })}
                <div className="opening-hours__save">  
                    <LoadingButton id="submit" startIcon={<SaveIcon />} loading={putLoading} type="submit" color="success" variant="contained">Save Changes</LoadingButton>
                </div>
                <Snackbar open={snackbarOpen} onClose={handleClose} autoHideDuration={6000}>
                    <Alert severity={alertSeverity}>{alertMessage}</Alert>
                </Snackbar>
            </form>
            }
        </div>
    );
}

export default OpeningHours;
