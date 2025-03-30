import React, { useState, useEffect, useRef } from 'react';
import { format, differenceInDays, addDays, isPast, isSameDay } from 'date-fns';
import styled from 'styled-components';
import TaskDetailModal from './TaskDetailModal';
import projects from '../data/mockProjects';
import { findProjectById } from '../utils/projectUtils';

const TimelineContainer = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  flex-direction: column;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
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
  max-height: fit-content; /* Limit height to content */
`;

const TimelineLabels = styled.div`
  width: 180px;
  flex-shrink: 0;
  border-right: 2px solid #000;
  overflow: hidden;
  position: sticky;
  left: 0;
  z-index: 10;
  background: ${props => props.theme.secondaryBackground};
  
  @media (max-width: 576px) {
    width: 120px;
  }
  
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
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    @media (max-width: 576px) {
      font-size: 0.8rem;
      padding: 0 8px;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const TimelineContent = styled.div`
  flex-grow: 1;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  min-width: 0;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  .days-container {
    display: flex;
    min-width: fit-content;
    overflow: visible;
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
    
    .task-cell {
      height: 60px;
      min-height: 60px;
      border-bottom: 1px solid ${props => props.theme.border};
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: ${props => props.theme.cardBackground};
  border: 2px solid #000;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.75rem;
  color: ${props => props.theme.text};
  z-index: 20;
  
  &:after {
    content: '⟷ Scroll Timeline';
  }
  
  @media (max-width: 992px) {
    display: block;
  }
  
  @media (min-width: 993px) {
    display: none;
  }
`;

const TaskBar = styled.div`
  position: absolute;
  height: ${props => props.priority === 'high' ? '38px' : 
          props.priority === 'medium' ? '34px' : '30px'};
  top: calc(50px + ${props => props.taskIndex * 60}px + ${props => 
          props.priority === 'high' ? '11px' : 
          props.priority === 'medium' ? '13px' : '15px'});
  left: ${props => props.startOffset * props.columnWidth}px;
  width: ${props => Math.max(props.duration * props.columnWidth, 10)}px; /* Ensure minimum width */
  background-color: ${props => 
    props.priority === 'high' ? props.theme.highPriority :
    props.priority === 'medium' ? props.theme.mediumPriority :
    props.theme.lowPriority
  };
  opacity: 0.9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: ${props => props.priority === 'high' ? '0.9rem' : '0.85rem'};
  font-weight: ${props => props.priority === 'high' ? '600' : '500'};
  color: white;
  cursor: pointer;
  border: 2px solid #000;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.8);
  transition: all 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
  z-index: ${props => props.priority === 'high' ? '7' : 
             props.priority === 'medium' ? '6' : '5'};
  
  @media (max-width: 768px) {
    font-size: ${props => props.priority === 'high' ? '0.8rem' : '0.75rem'};
    padding: 0 6px;
  }
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.8);
    opacity: 1;
    z-index: 10;
  }
  
  &.completed {
    background-color: ${props => props.theme.lowPriority};
    text-decoration: none;
    border-style: solid;
    height: 30px !important;
    top: calc(50px + ${props => props.taskIndex * 60}px + 15px) !important;
    
    &::before {
      content: "✓";
      margin-right: 5px;
      font-weight: bold;
    }
  }
  
  &.in-progress {
    background-color: ${props => props.theme.primary};
    border-style: solid;
    
    &::before {
      content: "→";
      margin-right: 5px;
      font-weight: bold;
    }
  }
  
  &.overdue {
    background-color: ${props => props.theme.highPriority};
    border-style: solid;
    animation: pulse 2s infinite;
    height: 38px !important;
    top: calc(50px + ${props => props.taskIndex * 60}px + 11px) !important;
    font-weight: 600;
    z-index: 8;
    
    &::before {
      content: "!";
      margin-right: 5px;
      font-weight: bold;
    }
  }
  
  @keyframes pulse {
    0% { opacity: 0.9; }
    50% { opacity: 1; }
    100% { opacity: 0.9; }
  }

  .task-info {
    display: none;
    position: absolute;
    background: ${props => props.theme.cardBackground};
    border: 2px solid #000;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.8);
    border-radius: 6px;
    padding: 10px;
    top: ${props => props.top < window.innerHeight / 2 ? '40px' : 'auto'};
    bottom: ${props => props.top >= window.innerHeight / 2 ? '40px' : 'auto'};
    left: 0;
    z-index: 100;
    width: 220px;
    color: ${props => props.theme.text};
    font-size: 0.8rem;
    font-weight: normal;
    
    @media (max-width: 576px) {
      width: 180px;
      font-size: 0.75rem;
      max-width: calc(100vw - 40px);
      left: ${props => props.left > window.innerWidth / 2 ? 'auto' : '0'};
      right: ${props => props.left > window.innerWidth / 2 ? '0' : 'auto'};
    }
  }
  
  &:hover .task-info {
    display: block;
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

const TimelineView = ({ selectedProject: projectId, users = [], allProjects }) => {
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [project, setProject] = useState(null);
  const [columnWidth, setColumnWidth] = useState(40);
  const [minColumnWidth, setMinColumnWidth] = useState(20);
  const [maxColumnWidth, setMaxColumnWidth] = useState(100);
  const timelineContentRef = useRef(null);
  const timelineGridRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const prevProjectIdRef = useRef(null);
  
  // Use the passed allProjects prop if available, otherwise fallback to imported projects
  const projectsSource = allProjects || projects;
  
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 576) {
        setMinColumnWidth(15);
        setMaxColumnWidth(60);
        
        if (columnWidth > 60) {
          setColumnWidth(60);
        } else if (columnWidth < 15) {
          setColumnWidth(15);
        }
      } else {
        setMinColumnWidth(20);
        setMaxColumnWidth(100);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [columnWidth]);
  
  useEffect(() => {
    console.log("Available projects:", projects);
    console.log("Projects length:", projects.length);
    setProjectsLoaded(true);
  }, []);
  
  // Log when component mounts and unmounts to debug rendering
  useEffect(() => {
    console.log("TimelineView mounted/updated with projectId:", projectId);
    return () => {
      console.log("TimelineView unmounted");
    };
  }, [projectId]);
  
  // Enhanced project selection effect with more debugging
  useEffect(() => {
    console.log("Project selection changed. Current projectId:", projectId, "Type:", typeof projectId);
    console.log("Available projects:", projectsSource);
    console.log("Previous projectId:", prevProjectIdRef.current);
    
    // Always run the find project logic when projectId changes, not just when prevProjectIdRef is different
    const findProject = () => {
      if (!projectId) {
        console.log("No projectId provided, clearing selected project");
        setProject(null);
        return;
      }
      
      const projectIdStr = String(projectId).trim();
      
      if (!projectIdStr) {
        console.log("Empty projectId, clearing selected project");
        setProject(null);
        return;
      }
      
      console.log("Searching for project with ID:", projectIdStr);
      console.log("Available project IDs:", projectsSource.map(p => p.id));
      
      let foundProject = null;
      
      // Try different matching strategies
      // 1. Direct ID match
      foundProject = projectsSource.find(p => String(p.id) === projectIdStr);
      
      // 2. With 'proj' prefix/suffix
      if (!foundProject) {
        foundProject = projectsSource.find(p => 
          p.id === `proj${projectIdStr}` || 
          String(p.id).replace('proj', '') === projectIdStr
        );
      }
      
      // 3. By name (exact match)
      if (!foundProject) {
        foundProject = projectsSource.find(p => 
          p.name.toLowerCase() === projectIdStr.toLowerCase()
        );
      }
      
      // 4. By name (includes)
      if (!foundProject) {
        foundProject = projectsSource.find(p => 
          p.name.toLowerCase().includes(projectIdStr.toLowerCase())
        );
      }
      
      // 5. By numeric index (if projectIdStr is a number)
      if (!foundProject && !isNaN(projectIdStr)) {
        const index = parseInt(projectIdStr) - 1;
        if (index >= 0 && index < projectsSource.length) {
          foundProject = projectsSource[index];
        }
      }
      
      if (foundProject) {
        console.log("Project found:", foundProject.name, "with ID:", foundProject.id);
        // Create a fresh copy to ensure state update
        const projectCopy = JSON.parse(JSON.stringify(foundProject));
        setProject(projectCopy);
      } else {
        console.log("Project not found for ID:", projectIdStr);
        
        // Only use fallback if no project is currently displayed
        if (projectsSource.length > 0) {
          console.log("Using first project as fallback");
          setProject(JSON.parse(JSON.stringify(projectsSource[0])));
        }
      }
    };
    
    findProject();
    setSelectedTask(null);
    prevProjectIdRef.current = projectId;
    
    if (timelineContentRef.current) {
      timelineContentRef.current.scrollLeft = 0;
    }
  }, [projectId, projectsSource]); // Remove project dependency to prevent circular updates
  
  const scrollToToday = () => {
    if (!timelineContentRef.current || !project) return;
    
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
  }, [project, columnWidth]);
  
  const zoomIn = () => {
    setColumnWidth(prev => Math.min(prev + 10, maxColumnWidth));
  };
  
  const zoomOut = () => {
    setColumnWidth(prev => Math.max(prev - 10, minColumnWidth));
  };

  const calculateTimelineHeight = (tasksCount) => {
    return 50 + (tasksCount * 60);
  };

  const handleScroll = () => {
    if (!isScrolling) {
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  useEffect(() => {
    const contentElement = timelineContentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [timelineContentRef.current]);
  
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

  const getTaskStatusLabel = (task) => {
    if (task.status === 'completed') return 'Completed';
    if (task.status === 'inprogress') return 'In Progress';
    if (task.status === 'review') return 'In Review';
    if (isPast(new Date(task.deadline)) && task.status !== 'completed') return 'Overdue';
    return 'To Do';
  };

  const getTaskProps = (task, taskIndex, statusClass, columnWidth, isOverdue) => {
    return {
      key: task.id,
      taskIndex,
      startOffset: calculateTaskPosition(task).startOffset,
      duration: calculateTaskPosition(task).duration,
      priority: isOverdue ? 'high' : task.priority,
      className: statusClass,
      columnWidth,
      onClick: () => handleTaskClick(task)
    };
  };
  
  return (
    <TimelineContainer key={`timeline-${project?.id || 'no-project'}-${projectId}`}>
      <TimelineHeader>
        <div>
          <h2>{project?.name || 'Select a Project'}</h2>
          {project && (
            <ProjectDates>
              {format(new Date(project.startDate), 'MMM d, yyyy')} - {format(new Date(project.endDate), 'MMM d, yyyy')}
            </ProjectDates>
          )}
        </div>
        {project && (
          <FilterContainer>
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Tasks</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </FilterContainer>
        )}
      </TimelineHeader>
      
      {project ? (
        <>
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
          
          <TimelineGrid 
            ref={timelineGridRef}
            style={{ height: `${calculateTimelineHeight(filteredTasks.length)}px` }}
          >
            <TimelineLabels>
              <div className="header">Tasks</div>
              {filteredTasks.map(task => (
                <div key={task.id} className="task-row">
                  {task.title}
                </div>
              ))}
            </TimelineLabels>
            
            <TimelineContent ref={timelineContentRef}>
              <div className="days-container" style={{ height: `${calculateTimelineHeight(filteredTasks.length)}px` }}>
                {days.map((day, index) => {
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const isToday = isSameDay(day, today);
                  
                  return (
                    <div 
                      key={index} 
                      className="day-column"
                      style={{ 
                        width: `${columnWidth}px`, 
                        height: '100%'
                      }}
                    >
                      <div className={`header ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}>
                        <div className="day-value">{format(day, 'd')}</div>
                        <div className="month-value">{format(day, 'MMM')}</div>
                      </div>
                      {filteredTasks.map((task, taskIdx) => (
                        <div 
                          key={`${task.id}-cell-${index}`}
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
                const statusLabel = getTaskStatusLabel(task);
                const isOverdue = isPast(new Date(task.deadline)) && task.status !== 'completed';
                
                const taskProps = getTaskProps(task, taskIndex, statusClass, columnWidth, isOverdue);
                
                return (
                  <TaskBar
                    {...taskProps}
                  >
                    {task.title}
                    <div className="task-info">
                      <div><strong>Task:</strong> {task.title}</div>
                      <div><strong>Status:</strong> {statusLabel}</div>
                      <div><strong>Dates:</strong> {format(new Date(task.startDate), 'MMM d')} - {format(new Date(task.deadline), 'MMM d')}</div>
                      <div><strong>Priority:</strong> {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</div>
                      {task.assignee && <div><strong>Assigned to:</strong> {task.assignee}</div>}
                    </div>
                  </TaskBar>
                );
              })}
              
              {isScrolling && <ScrollIndicator />}
            </TimelineContent>
          </TimelineGrid>
        </>
      ) : (
        <div>
          <h3>Please select a project from the sidebar</h3>
        </div>
      )}
      
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
