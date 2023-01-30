import * as React from 'react';
import { useState, useEffect } from 'react';
import { HeaderForCalendar } from './components/headerForCalendar/HeaderForCalendar';
import { Calendar } from './components/calendar/Calendar';
import classNames from 'classnames';

import './App.scss';
import { AdderTask } from './components/adderTask/AdderTask';

function App() {
  const monthForStart = Number(new Date().getMonth()) > 11 ? 0 : (Number(new Date().getMonth()) + 1);
  const [month, SetMonth] = useState(Number(localStorage.getItem('month')) || monthForStart);
  const [year, SetYear] = useState(Number(localStorage.getItem('year')) || Number(new Date().getUTCFullYear()));
  const [taskHidden, SetTaskHidden] = useState(false);
  const [taskArray, SetTaskArray] = useState(JSON.parse(localStorage.getItem('task')) || []);
  const [choosenTask, SetChoosenTask] = useState('');

  useEffect(() => {
    if (!taskHidden) {
      SetChoosenTask('')
    }
  }, [taskHidden]);

  function save(value, dataToSave, newMonth = 0, newYear = Number(new Date().getUTCFullYear())) {
    switch (dataToSave) {
      case 'month':
        localStorage.setItem('month', (value));

        break;

      case 'task':
        let arr = [];

        if (value.name === 'delete') {
          arr = JSON.parse(localStorage.getItem('task')).filter(a => a.id !== value.id);
          localStorage.setItem('task', JSON.stringify([...arr]));

          break;
        }

        if (JSON.parse(localStorage.getItem('task')) !== null) {
          arr = JSON.parse(localStorage.getItem('task'));
        }

        if (`${value.id}`.length > 1) {
          arr = JSON.parse(localStorage.getItem('task')).filter(a => a.id !== value.id);
          localStorage.setItem('task', JSON.stringify([...arr, value]));
          break;
        }

        value.id = new Date().toLocaleString().replace(/[, ]/g, '-');
        arr.push(value);

        localStorage.setItem('task', JSON.stringify(arr));

        break;

      case 'year':
        SetYear(prev => prev += value);
        localStorage.setItem('year', (year + (value)));

        break;

      case 'newParameter':
        SetMonth(prev => prev = newMonth);
        localStorage.setItem('month', newMonth);
        SetYear(prev => prev = newYear);
        localStorage.setItem('year', newYear);

        break;

      default:
        break;
    }
  }

  function changerDate(parametr) {
    if (typeof (parametr) === 'object') {
      if (`${parametr.$d}` !== 'Invalid Date') {
        return (
          save(0, 'newParameter', parametr.$M + 1, parametr.$y)
        )
      }
    }

    switch (parametr) {
      case '<':
        SetMonth(prev => month === 0 ? 11 : prev -= 1);
        save(month === 0 ? 11 : month - 1, 'month');

        if (month === 0) {
          save(-1, 'year')
        }
        break;

      case '>':
        SetMonth(prev => month === 11 ? 0 : prev += 1);
        save(month === 11 ? 0 : month + 1, 'month');

        if (month === 11) {
          save(1, 'year')
        }
        break;

      case 'reset':
        SetMonth(monthForStart);
        SetYear(Number(new Date().getUTCFullYear()));
        save(0, 'newParameter', monthForStart, Number(new Date().getUTCFullYear()))

        break;

      default:
        break;
    }
  }

  useEffect(() => {
    SetTaskArray(JSON.parse(localStorage.getItem('task')) || [])
  }, [taskHidden])

  return (
    <>
      <div className={
        classNames('App',
          (taskHidden) && 'App__back-hidden'
        )
      }
      >

        <HeaderForCalendar
          month={month}
          changerDate={changerDate}
          year={year}
          SetTaskHidden={SetTaskHidden}
        />

        <Calendar
          month={month}
          year={year}
          taskArray={taskArray}
          SetTaskHidden={SetTaskHidden}
          SetChoosenTask={SetChoosenTask}
        />
      </div>

      {(taskHidden) &&
        <AdderTask
          SetTaskHidden={SetTaskHidden}
          save={save}
          choosenTask={choosenTask}
          taskArray={taskArray}
        />
      }
    </>
  );
}

export default App;
