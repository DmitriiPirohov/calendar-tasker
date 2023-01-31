import * as React from 'react';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './Calendar.scss';

export const Calendar = React.memo(({ month, year, taskArray, SetTaskHidden, SetChoosenTask }) => {
  Calendar.propTypes = {
    SetTaskHidden: PropTypes.bool,
    taskArray: PropTypes.array,
    SetChoosenTask: PropTypes.array,
    month: PropTypes.number,
    year: PropTypes.number
  }
  const [howManyDays, SetHowManyDays] = useState([]);
  const [toDay, SetToDay] = useState(0);

  const weekForRender = ['Sun', 'Sat', 'Fri', 'Thu', 'Wed', 'Tue', 'Mon'];

  const handleSubmit = (index) => {
    SetTaskHidden(prev => !prev);
    SetChoosenTask(index);
  }

  useEffect(() => {
    function daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    }

    function spliter() {
      const arr = Array.from({ length: daysInMonth(month, year) }).map((_, i) => [i + 1, new Date(year, month - 1, i + 1).toString().split(' ')[0], year]);
      let visibleArray = [];

      if ((new Date().getMonth() + 1 === month) && new Date().getFullYear() === year) {
        SetToDay(new Date().toLocaleString().split('.')[0]);
      } else {
        SetToDay(0);
      }

      for (let i = 0; i <= 6; i++) {
        if (i === 0) {
          visibleArray[i] = [Array.from({ length: 7 - (weekForRender.indexOf(arr[i][1]) + 1) }), arr.splice(0, weekForRender.indexOf(arr[i][1]) + 1)].flat(); //.fill([])
        } else {
          visibleArray[i] = arr.splice(0, 7);
        }
      }
      SetHowManyDays(visibleArray);
    }
    spliter();
  }, [month, year]);

  return (
    <section className='Calendar'>
      <table className='Calendar__body'>
        <tbody>
          {howManyDays.map((week, index) => (
            <tr
              key={index}
              className='Calendar__row'
            >
              {week.map((date, index) => date ? (
                <td
                  key={index}
                  className={
                    classNames('Calendar__day',
                      (`${date.slice(0, 1)}` === `${toDay}`) && 'Calendar__day--toDay'
                    )}
                >
                  <span className='Calendar__container'>
                    <span className='Calendar__title'>
                      <span
                        className={classNames(
                          date.slice(1, 2).includes('Sun') && 'Calendar__text--red',
                          'Calendar__text'
                        )}
                      >
                        {date.slice(0, 1)}
                      </span>

                      <span>
                        {date.slice(1, 2)}
                      </span>
                    </span>

                    {
                      taskArray.sort((a, b) => +a.time.replace(':', '') - (+b.time.replace(':', ''))).map((task) => (
                        <div
                          key={task.id}
                          className='Calendar__list'
                        >
                          {
                            (
                              date.map((a) => typeof (a) !== 'number'
                                ? month <= 9
                                  ? `0${month}`
                                  : a
                                : a <= 9 ? `0${a}`
                                  : a)
                                .join('-') === `${task.name.slice(0, 2)}-${task.name.slice(3, 5)}-${task.name.slice(6, 10)}`
                            ) ?
                              <section
                                className='Calendar__list__text'
                                onClick={() => handleSubmit(task.id)}
                              >
                                <span>
                                  {task.title}
                                </span>

                                <span>
                                  {(`${task.time}` !== ' : ') && `${task.time}`.replace(/[^0-9,:]/g, '.')}
                                </span>
                              </section>
                              : <></>
                          }
                        </div>
                      ))
                    }
                  </span>
                </td>
              ) : <td key={index} className='Calendar__day Calendar__day--none' />)}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
});
