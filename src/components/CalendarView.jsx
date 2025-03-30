import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import styled from 'styled-components';
import TaskDetailModal from './TaskDetailModal';

const CalendarContainer = styled.div`
  padding: 20px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MonthNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  button {
    background-color: ${props => props.theme.secondaryBackground};
    border: 2px solid #000;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    color: ${props => props.theme.text}; /* Ensure SVG inherits this color */

    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
    }
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
`;

const DayHeader = styled.div`
  text-align: center;
  font-weight: 500;
  padding: 10px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const DayCell = styled.div`
  min-height: 100px;
  padding: 8px;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
  background-color: ${props => props.isCurrentMonth ? props.theme.secondaryBackground : props.theme.background};
  transition: all 0.2s;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
  }

  .day-number {
    font-weight: ${props => props.isToday ? 'bold' : 'normal'};
    background-color: ${props => props.isToday ? props.theme.primary : 'transparent'};
    color: ${props => props.isToday ? 'white' : props.theme.text};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
  }

  .tasks-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

const TaskItem = styled.div`
  padding: 4px 6px;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => 
    props.priority === 'high' ? `${props.theme.highPriority}33` :
    props.priority === 'medium' ? `${props.theme.mediumPriority}33` :
    `${props.theme.lowPriority}33`
  };
  border-left: 3px solid ${props => 
    props.priority === 'high' ? props.theme.highPriority :
    props.priority === 'medium' ? props.theme.mediumPriority :
    props.theme.lowPriority
  };
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:hover {
    filter: brightness(0.95);
  }
`;

const CalendarView = ({ tasks, users }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Fill the beginning and end of the calendar to complete weeks
  const startDay = monthStart.getDay();
  const endDay = 6 - monthEnd.getDay();
  
  const prevMonthDays = [];
  const nextMonthDays = [];
  
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (i + 1));
    prevMonthDays.push(date);
  }
  
  for (let i = 1; i <= endDay; i++) {
    const date = new Date(monthEnd);
    date.setDate(date.getDate() + i);
    nextMonthDays.push(date);
  }
  
  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
  
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return isSameDay(taskDate, date);
    });
  };
  
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };
  
  const handleCloseModal = () => {
    setSelectedTask(null);
  };
  
  const handleUpdateTask = (updatedTask) => {
    // This would typically update the task in your data store
    console.log('Task updated:', updatedTask);
  };
  
  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthNavigator>
          <button onClick={handlePrevMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </button>
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={handleNextMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </MonthNavigator>
      </CalendarHeader>
      
      <CalendarGrid>
        {weekdays.map(day => (
          <DayHeader key={day}>
            {day.substring(0, 3)}
          </DayHeader>
        ))}
        
        {allDays.map(day => {
          const dayTasks = getTasksForDate(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <DayCell key={day.toISOString()} isToday={isToday} isCurrentMonth={isCurrentMonth}>
              <div className="day-number">{format(day, 'd')}</div>
              <div className="tasks-container">
                {dayTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    priority={task.priority}
                    onClick={() => handleTaskClick(task)}
                  >
                    {task.title}
                  </TaskItem>
                ))}
              </div>
            </DayCell>
          );
        })}
      </CalendarGrid>
      
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          users={users} 
          onClose={handleCloseModal} 
          onUpdate={handleUpdateTask}
        />
      )}
    </CalendarContainer>
  );
};

export default CalendarView;
