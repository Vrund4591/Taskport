import React, { useState, useEffect, useRef } from 'react';
import { format, differenceInDays, addDays, isPast, isSameDay } from 'date-fns';
import styled from 'styled-components';
import TaskDetailModal from './TaskDetailModal';
import projects from '../data/mockProjects';

const TimelineContainer = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  
  h2 {
    margin: 0;
    color: ${props => props.theme.mode === 'light' ? '#000' : props.theme.text};
  }
`;

const ProjectDates = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.secondaryText};
  margin-bottom: 20px;
`;

const ProjectInfo = styled.div`
  margin-bottom: 30px;
  
  .progress-container {
    margin-top: 15px;
    
    .progress-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 0.9rem;
      color: ${props => props.theme.mode === 'light' ? '#000' : props.theme.text};
    }
    
    .progress-bar {
      height: 8px;
      background: ${props => props.theme.border};
      border-radius: 4px;
      overflow: hidden;
      
      .bar {
        height: 100%;
        background: ${props => props.theme.primary};
        width: ${props => props.progress}%;
      }
    }
  }
`;

const TimelineGrid = styled.div`
  display: flex;
  border: 2px solid #000;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  min-height: 0;
  flex: 1;
`;

const TimelineLabels = styled.div`
  width: 200px;
  flex-shrink: 0;
  border-right: 2px solid #000;
  overflow-y: auto;
  position: sticky;
  left: 0;
  z-index: 10;
  background: ${props => props.theme.secondaryBackground};
  
  .header {
    height: 50px;
    border-bottom: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    background: ${props => props.theme.secondaryBackground};
    color: ${props => props.theme.mode === 'light' ? '#000' : props.theme.text};
  }
  
  .task-row {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    border-bottom: 1px solid ${props => props.theme.border};
    background: ${props => props.theme.secondaryBackground};
    color: ${props => props.theme.mode === 'light' ? '#000' : props.theme.text};
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const TimelineContent = styled.div`
  flex-grow: 1;
  overflow-x: auto;
  overflow-y: auto;
  position: relative;
  min-width: 0;
  
  .days-container {
    display: flex;
  }
  
  .day-column {
    flex-shrink: 0;
    border-right: 1px solid ${props => props.theme.border};
    
    &:last-child {
      border-right: none;
    }
    
    .header {
      height: 50px;
      border-bottom: 2px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      flex-direction: column;
      background: ${props => props.theme.secondaryBackground};
    }
    
    .header.weekend {
      background: ${props => props.theme.background};
    }
    
    .header.today {
      background: ${props => props.theme.primary}33;
    }
    
    .day-value {
      font-weight: 500;
      color: ${props => props.theme.mode === 'light' ? '#000' : 'inherit'};
    }
    
    .month-value {
      font-size: 0.7rem;
      color: ${props => props.theme.mode === 'light' ? '#000' : props.theme.secondaryText};
    }
    
    .task-cell {
      height: 60px;
      border-bottom: 1px solid ${props => props.theme.border};
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
`;

const TaskBar = styled.div`
  position: absolute;
  height: 30px;
  top: calc(50px + ${props => props.taskIndex * 60}px + 15px);
  left: ${props => props.startOffset * props.columnWidth}px;
  width: ${props => props.duration * props.columnWidth}px;
  background-color: ${props => 
    props.priority === 'high' ? props.theme.highPriority :
    props.priority === 'medium' ? props.theme.mediumPriority :
    props.theme.lowPriority
  };
  opacity: 0.8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: white;
  cursor: pointer;
  border: 2px solid #000;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 1);
  transition: all 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 rgba(0, 0, 0, 1);
    opacity: 0.9;
  }
  
  &.completed {
    background-color: ${props => props.theme.lowPriority};
  }
  
  &.in-progress {
    background-color: ${props => props.theme.primary};
  }
  
  &.overdue {
    background-color: ${props => props.theme.highPriority};
  }
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  
  select {
    padding: 8px 12px;
    border: 2px solid #000;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
    border-radius: 6px;
    background: ${props => props.theme.secondaryBackground};
    cursor: pointer;
    transition: all 0.2s;
    color: ${props => props.theme.mode === 'light' ? '#000' : 'inherit'};
    
    &:focus {
      outline: none;
    }
    
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
    }
    
    option {
      color: ${props => props.theme.mode === 'light' ? '#000' : 'inherit'};
    }
  }
`;

const TimelineControls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  gap: 10px;
  
  button {
    background-color: ${props => props.theme.cardBackground};
    border: 2px solid #000;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    color: ${props => props.theme.mode === 'light' ? '#000' : 'inherit'};
    
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const ScrollToTodayButton = styled.button`
  font-weight: 500;
  color: ${props => props.theme.mode === 'light' ? '#000' : 'inherit'};
`;

const ZoomControls = styled.div`
  display: flex;
  gap: 5px;
  
  button {
    min-width: 36px;
    color: ${props => props.theme.mode === 'light' ? '#000' : 'inherit'};
    
    svg {
      fill: ${props => props.theme.mode === 'light' ? '#000' : 'currentColor'};
    }
  }
`;

const TimelineView = ({ selectedProject: projectId, users = [] }) => {
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [project, setProject] = useState(null);
  const [columnWidth, setColumnWidth] = useState(40); // Control zoom level with column width
  const timelineContentRef = useRef(null);
  
  useEffect(() => {
    // Debug log to see what projectId is being received
    console.log("Current projectId:", projectId);
    
    const findProject = () => {
      // Better handling of the project ID comparison
      if (projectId) {
        // Try different strategies to find the project
        let foundProject = null;
        
        // Strategy 1: Direct ID match (handles both string 'proj4' and number 4)
        foundProject = projects.find(p => 
          p.id === projectId || 
          p.id === `proj${projectId}` || 
          String(p.id) === String(projectId)
        );
        
        // Strategy 2: Check if the projectId is the same as 'Marketing Campaign'
        if (!foundProject && projectId === 'Marketing Campaign') {
          foundProject = projects.find(p => p.name === 'Marketing Campaign');
        }
        
        // Strategy 3: Look for 'proj4' which is the Marketing Campaign in the mock data
        if (!foundProject && (projectId === 4 || projectId === '4')) {
          foundProject = projects.find(p => p.id === 'proj4');
        }
        
        // Strategy 4: Check by name for direct or partial matches
        if (!foundProject) {
          const searchTerm = String(projectId).toLowerCase();
          foundProject = projects.find(p => 
            p.name.toLowerCase() === searchTerm || 
            p.name.toLowerCase().includes(searchTerm)
          );
        }
        
        if (foundProject) {
          console.log("Found project:", foundProject.name);
          setProject(foundProject);
          return;
        }
      }
      
      // If we get here, set the first project as a fallback
      if (projects.length > 0) {
        console.log("Using first project as fallback");
        setProject(projects[0]);
      }
    };
    
    findProject();
    
    // Reset selected task when project changes
    setSelectedTask(null);
  }, [projectId]);
  
  const scrollToToday = () => {
    if (!timelineContentRef.current) return;
    
    const today = new Date();
    const projectStartDate = new Date(project.startDate);
    const daysSinceStart = differenceInDays(today, projectStartDate);
    
    if (daysSinceStart >= 0) {
      const position = daysSinceStart * columnWidth;
      timelineContentRef.current.scrollLeft = position - timelineContentRef.current.clientWidth / 2;
    }
  };
  
  useEffect(() => {
    if (project) {
      setTimeout(scrollToToday, 100);
    }
  }, [project]);
  
  const zoomIn = () => {
    setColumnWidth(prev => Math.min(prev + 10, 100));
  };
  
  const zoomOut = () => {
    setColumnWidth(prev => Math.max(prev - 10, 20));
  };
  
  if (!project) {
    return (
      <TimelineContainer>
        <h2>Please select a project from the sidebar</h2>
      </TimelineContainer>
    );
  }
  
  const projectStartDate = new Date(project.startDate);
  const projectEndDate = new Date(project.endDate);
  const today = new Date();
  
  const daysCount = differenceInDays(projectEndDate, projectStartDate) + 1;
  const days = Array.from({ length: daysCount }, (_, i) => addDays(projectStartDate, i));
  
  const filteredTasks = project.tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'in-progress') return task.status === 'inprogress' || task.status === 'review';
    if (filter === 'todo') return task.status === 'todo';
    return true;
  });
  
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };
  
  const handleCloseModal = () => {
    setSelectedTask(null);
  };
  
  const handleUpdateTask = (updatedTask) => {
    console.log('Task updated:', updatedTask);
  };
  
  const calculateTaskPosition = (task) => {
    const taskStartDate = new Date(task.startDate);
    const taskEndDate = new Date(task.deadline);
    
    const effectiveStartDate = taskStartDate < projectStartDate ? projectStartDate : taskStartDate;
    const effectiveEndDate = taskEndDate > projectEndDate ? projectEndDate : taskEndDate;
    
    const startOffset = Math.max(0, differenceInDays(effectiveStartDate, projectStartDate));
    const duration = Math.max(1, differenceInDays(effectiveEndDate, effectiveStartDate) + 1);
    
    return { startOffset, duration };
  };
  
  const getTaskStatusClass = (task) => {
    if (task.status === 'completed') return 'completed';
    if (task.status === 'inprogress' || task.status === 'review') return 'in-progress';
    if (isPast(new Date(task.deadline)) && task.status !== 'completed') return 'overdue';
    return '';
  };
  
  return (
    <TimelineContainer>
      <TimelineHeader>
        <div>
          <h2>{project.name}</h2>
          <ProjectDates>
            {format(projectStartDate, 'MMM d, yyyy')} - {format(projectEndDate, 'MMM d, yyyy')}
          </ProjectDates>
        </div>
        <FilterContainer>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </FilterContainer>
      </TimelineHeader>
      
      <ProjectInfo>
        <div className="progress-container">
          <div className="progress-label">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="bar" style={{ width: `${project.progress}%` }}></div>
          </div>
        </div>
      </ProjectInfo>
      
      <TimelineControls>
        <ScrollToTodayButton onClick={scrollToToday}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
          </svg>
          Scroll to Today
        </ScrollToTodayButton>
        <ZoomControls>
          <button onClick={zoomOut}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <button onClick={zoomIn}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </ZoomControls>
      </TimelineControls>
      
      <TimelineGrid>
        <TimelineLabels>
          <div className="header">Tasks</div>
          {filteredTasks.map(task => (
            <div key={task.id} className="task-row">
              {task.title}
            </div>
          ))}
        </TimelineLabels>
        
        <TimelineContent ref={timelineContentRef}>
          <div className="days-container">
            {days.map((day, index) => {
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              const isToday = isSameDay(day, today);
              
              return (
                <div 
                  key={index} 
                  className="day-column"
                  style={{ width: `${columnWidth}px` }}
                >
                  <div className={`header ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}>
                    <div className="day-value">{format(day, 'd')}</div>
                    <div className="month-value">{format(day, 'MMM')}</div>
                  </div>
                  {filteredTasks.map(() => (
                    <div 
                      key={`cell-${index}`} 
                      className="task-cell"
                    ></div>
                  ))}
                </div>
              );
            })}
          </div>
          
          {filteredTasks.map((task, taskIndex) => {
            const { startOffset, duration } = calculateTaskPosition(task);
            const statusClass = getTaskStatusClass(task);
            
            return (
              <TaskBar
                key={task.id}
                taskIndex={taskIndex}
                startOffset={startOffset}
                duration={duration}
                priority={task.priority}
                className={statusClass}
                columnWidth={columnWidth}
                onClick={() => handleTaskClick(task)}
              >
                {task.title}
              </TaskBar>
            );
          })}
        </TimelineContent>
      </TimelineGrid>
      
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          users={users} 
          onClose={handleCloseModal} 
          onUpdate={handleUpdateTask}
        />
      )}
    </TimelineContainer>
  );
};

export default TimelineView;
