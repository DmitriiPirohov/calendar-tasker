import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SettingsPowerIcon from '@mui/icons-material/SettingsPower';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import './AdderTask.scss';

export const AdderTask = ({ SetTaskHidden, save, choosenTask, taskArray }) => {
  AdderTask.propTypes = {
    SetTaskHidden: PropTypes.func,
    save: PropTypes.func,
    choosenTask: PropTypes.string,
    taskArray: PropTypes.array
  }
  const taskForView = taskArray.filter(a => a.id === choosenTask);
  const dateForDayjs = taskForView.length === 1 ? taskArray.filter(a => a.id === choosenTask)[0].name : '';

  const [title, SetTitle] = useState((choosenTask && taskForView[0].title) || '');
  const [description, SetDescription] = useState((choosenTask && taskForView[0].description) || '');
  const [date, SetDate] = React.useState(dayjs(`${dateForDayjs.slice(3, 5)}.${dateForDayjs.slice(0, 2)}.${dateForDayjs.slice(6, 10)}`));
  const [time, SetTime] = useState({ $H: ' ', $m: ' ' });
  const [activeSaveButton, SetActiveSaveButton] = useState(true);

  function handleSubmit(action = '') {
    const newWay = ['', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const day = Number(date.$D) <= 9 ? `0${date.$D}` : date.$D;
    const month = newWay.indexOf(date.$M) <= 9 ? `0${newWay.indexOf(date.$M)}` : newWay.indexOf(date.$M);

    if (action !== 'delete') {
      save({ "id": choosenTask, "name": `${day}-${month}-${date.$y}`, "title": title, "description": description, "time": (`${time.$H}:${time.$m}`) !== 'undefined:undefined' ? `${time.$H}:${time.$m}` : `${taskForView[0].time}` }, 'task');
    } else {
      save({ "id": choosenTask, "name": `delete`, "title": title, "description": description, "time": (`${time.$H}:${time.$m}`) !== 'undefined:undefined' ? `${time.$H}:${time.$m}` : `${taskForView[0].time}` }, 'task');
    }

    SetTaskHidden(prev => !prev);
  };

  useEffect(() => {
    if (title) {
      if (`${date}` === 'null') {
        alert(`Wrong 'date format'`);
        return SetActiveSaveButton(true);
      }

      if (`${date.$d}` !== `Invalid Date`) {
        SetActiveSaveButton(false);
      }
    }
    if (!title) {
      return SetActiveSaveButton(true);
    }
  }, [title, date]);

  const handleChange = (newValue) => {
    SetDate(newValue);
  };

  const handleChangeTime = (newValue) => {
    SetTime(newValue);
  };

  useEffect(() => {
    if (dateForDayjs) {
      SetTime(`${taskForView[0].time}`.length !== 0 ? (`2014-08-18T${taskForView[0].time}`) : '');
    }
  }, [choosenTask]);

  return (
    <span className='AdderTasker'>
      <div className='AdderTasker__fill'>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '32ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div className='AdderTasker__fill__form'>
            <div className='AdderTasker__fill__created'>
              {choosenTask && `Created ${choosenTask.replace(/[-]/g, ' ').slice(0, 12)} at: ${choosenTask.replace(/[-]/g, ' ').slice(12, 17)}`}
            </div>


            <TextField
              required
              error={title ? false : true}
              color='grey'
              id="standard-required"
              label="Title"
              defaultValue={title}
              variant="standard"
              onChange={(event) => SetTitle(event.target.value)} />

            <TextField
              color='grey'
              id="filled-multiline-static"
              label="Description"
              multiline
              rows={4}
              defaultValue={description}
              variant="filled"
              onChange={(event) => SetDescription(event.target.value)} />

            <span className='AdderTasker__fill__time'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  required
                  id="filled-multiline-static"
                  label="Date *"
                  inputFormat="MM/DD/YYYY"
                  value={date}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />} />

                <TimePicker
                  label="Time"
                  color='grey'
                  value={time}
                  onChange={handleChangeTime}
                  renderInput={(params) => <TextField {...params} readOnly />} />
              </LocalizationProvider>
            </span>

            <span className='AdderTasker__fill__button'>
              <Button
                variant="outlined"
                startIcon={<SettingsPowerIcon />}
                color="inherit"
                onClick={() => SetTaskHidden(prev => !prev)}
              >
                Cancel
              </Button>

              {(choosenTask) &&
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => handleSubmit('delete')}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>}

              <Button
                disabled={activeSaveButton}
                color={'grey'}
                variant="contained"
                endIcon={<AssignmentTurnedInIcon />}
                onClick={() => handleSubmit()}
              >
                Save
              </Button>
            </span>
          </div>
        </Box>
      </div>
    </span>
  );
};
