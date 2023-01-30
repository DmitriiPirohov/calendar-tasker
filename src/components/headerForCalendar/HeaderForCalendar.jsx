import { useEffect } from 'react';
import * as React from 'react';
import PropTypes from 'prop-types';

import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

import './HeaderForCalendar.scss';

export const HeaderForCalendar = React.memo(({ month, changerDate, year, SetTaskHidden }) => {
  HeaderForCalendar.propTypes = {
    SetTaskHidden: PropTypes.bool,
    changerDate: PropTypes.func,
    month: PropTypes.number,
    year: PropTypes.number

  }

  const [value, setValue] = React.useState(dayjs(`${year}-${month}-07`));

  useEffect(() => {
    setValue(dayjs(`${year}-${month}-07`));
  }, [month, year]);

  const buttonStyle = {
    color: 'grey',
    'borderColor': 'black',
    'backgroundColor': 'rgb(227, 227, 226)',
    ':hover': {
      backgroundColor: '#fff'
    }
  };

  return (
    <>
      <section className='TableHeader'>
        <span>
          <Fab
            color="grey"
            aria-label="add"
            size='large'
            onClick={() => SetTaskHidden(prev => !prev)}
          >
            <AddIcon />
          </Fab>
        </span>

        <span className='TableHeader__daysMonth'>
          <Fab
            color="grey"
            aria-label="add"
            size='large'
            onClick={() => changerDate('<')}
          >
            <ArrowCircleLeftIcon />
          </Fab>

          <div style={{ width: '190px' }}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
            >
              <DatePicker
                views={['year', 'month']}
                minDate={dayjs('2012-03-01')}
                maxDate={dayjs('2030-01-01')}
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                  changerDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} helperText={null} />} />
            </LocalizationProvider>
          </div>

          <Fab
            color="grey"
            aria-label="add"
            size='large'
            onClick={() => changerDate('>')}
          >
            <ArrowCircleRightIcon />
          </Fab>
        </span>

        <Button
          variant="contained"
          onClick={() => changerDate('reset')}
          style={buttonStyle}
          size='medium'
        >
          today
        </Button>
      </section>
    </>
  );
});
