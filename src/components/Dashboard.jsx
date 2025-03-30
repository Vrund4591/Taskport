import React, { useState, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import TaskDetailModal from './TaskDetailModal';
import ResponsiveTaskGrid from './TaskGrid';

const DashboardContainer = styled.div`
  width: 100%; /* Take full width in the grid layout */
  height: 100vh;
  overflow-y: auto;
  padding: 1.5rem;
  transition: none; /* Remove transitions */
  position: relative;
  background-color: ${props => props.theme.background};
  
  @media (max-width: 768px) {
    padding: 1rem;
    padding-bottom: calc(1rem + 70px);
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  width: 100%;
`;

const HeaderInfo = styled.div`
  h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme.secondaryText};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const IconButton = styled.button`
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
  background-color: ${props => props.theme.secondaryBackground};
  transition: all 0.2s;
  color: ${props => props.theme.text}; /* Use theme's text color directly */
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
  }
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
  transition: all 0.2s;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
  width: 100%;
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.cardBackground};
  padding: 1.5rem;
  border-radius: 0.375rem;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
  transition: all 0.2s;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
  }
  
  h3 {
    color: ${props => props.theme.secondaryText};
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1.875rem;
    font-weight: bold;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const TaskItem = styled.div`
  background-color: ${props => props.theme.background};
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 0.375rem;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
  cursor: grab;
  transition: all 0.2s;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
  }
  
  &:active {
    cursor: grabbing;
  }
  
  h5 {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.875rem;
    color: ${props => props.theme.secondaryText};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
`;

const TaskTag = styled.span`
  background-color: ${props => `${props.theme.primary}20`};
  border: 1px solid ${props => `${props.theme.primary}40`};
  color: ${props => props.theme.primary};
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.25rem;
`;

const TaskRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Avatar = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TaskDate = styled.span`
  font-size: 0.75rem;
  color: ${props => props.$isOverdue ? props.theme.highPriority : props.theme.secondaryText};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.375rem;
  background-color: ${props => `${props.theme.border}`};
  border-radius: 9999px;
  margin-top: 0.25rem;
  overflow: hidden;
  
  .progress {
    height: 100%;
    background-color: ${props => props.theme.primary};
    border-radius: 9999px;
  }
`;

const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${props => props.theme.secondaryText};
  margin-top: 0.5rem;
`;

const Dashboard = ({ data, sidebarCollapsed }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const dashboardRef = useRef(null);
  
  // Get current theme from context
  const theme = useTheme();

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      setIsMobile(newWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const sidebarWidth = isMobile ? 0 : (sidebarCollapsed ? 70 : 240);

  const [tasks, setTasks] = useState({
    todo: [
      {
        id: '1',
        title: 'Design System Update',
        description: 'Update color palette and components for the new brand guidelines',
        status: 'todo',
        priority: 'high',
        assignee: 'user1',
        deadline: new Date('2023-12-30').toISOString(),
        estimatedHours: 8,
        loggedHours: 0,
        comments: [],
        tag: 'Design',
      },
    ],
    inProgress: [
      {
        id: '2',
        title: 'API Integration',
        description: 'Connect backend services with the new REST API endpoints',
        status: 'inProgress',
        priority: 'medium',
        assignee: 'user2',
        deadline: new Date('2023-12-31').toISOString(),
        estimatedHours: 12,
        loggedHours: 4,
        comments: [],
        tag: 'Development',
      },
    ],
    done: [
      {
        id: '3',
        title: 'User Research',
        description: 'Conduct user interviews and analyze feedback',
        status: 'done',
        priority: 'low',
        assignee: 'user3',
        deadline: new Date('2023-12-15').toISOString(),
        estimatedHours: 10,
        loggedHours: 10,
        comments: [],
        tag: 'Research',
      },
    ],
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const users = data?.users || [];

  const onDragStart = (e, task, sourceColumn) => {
    e.dataTransfer.setData('task', JSON.stringify({ task, sourceColumn }));
    e.target.style.opacity = '0.5';
  };

  const onDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetColumn) => {
    e.preventDefault();
    const { task, sourceColumn } = JSON.parse(e.dataTransfer.getData('task'));
    
    if (sourceColumn !== targetColumn) {
      const updatedTask = {...task, status: targetColumn};
      
      setTasks(prev => ({
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter(t => t.id !== task.id),
        [targetColumn]: [...prev[targetColumn], updatedTask],
      }));
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleUpdateTask = (updatedTask) => {
    const columnId = updatedTask.status;
    
    setTasks(prev => ({
      ...prev,
      [columnId]: prev[columnId].map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    }));
  };

  const getDueDateDisplay = (dateString) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', isOverdue: true };
    if (diffDays === 0) return { text: 'Today', isOverdue: false };
    if (diffDays === 1) return { text: 'Tomorrow', isOverdue: false };
    return { text: `${diffDays}d`, isOverdue: false };
  };

  const renderTaskItem = (task, columnId) => {
    const progress = Math.min(Math.round((task.loggedHours / task.estimatedHours) * 100), 100);
    const dueDate = getDueDateDisplay(task.deadline);
    const assignedUser = users.find(user => user.id === task.assignee);
    
    return (
      <TaskItem
        key={task.id}
        draggable
        onDragStart={(e) => onDragStart(e, task, columnId)}
        onDragEnd={onDragEnd}
        onClick={() => handleTaskClick(task)}
      >
        <h5>{task.title}</h5>
        <p>{task.description}</p>
        <TaskMeta>
          <TaskTag>{task.tag}</TaskTag>
          <TaskRight>
            {assignedUser && (
              <Avatar>
                <img src={assignedUser.avatar} alt={assignedUser.name} />
              </Avatar>
            )}
            <TaskDate $isOverdue={dueDate.isOverdue}>{dueDate.text}</TaskDate>
          </TaskRight>
        </TaskMeta>
        <ProgressMeta>
          <span>Progress</span>
          <span>{progress}%</span>
        </ProgressMeta>
        <ProgressBar>
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </ProgressBar>
      </TaskItem>
    );
  };

  return (
    <DashboardContainer 
      ref={dashboardRef}
    >
      <DashboardHeader>
        <HeaderInfo>
          <h2>Project Dashboard</h2>
          <p>Welcome back, {users[0]?.name || "User"}!</p>
        </HeaderInfo>
        <HeaderActions>
          <IconButton>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </IconButton>
          <PrimaryButton>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Task
          </PrimaryButton>
        </HeaderActions>
      </DashboardHeader>

      <StatsGrid>
        {[
          { title: 'Total Tasks', value: '12' },
          { title: 'In Progress', value: '5' },
          { title: 'Completed', value: '7' },
          { title: 'Team Members', value: '8' },
        ].map((stat, index) => (
          <StatCard key={index}>
            <h3>{stat.title}</h3>
            <p>{stat.value}</p>
          </StatCard>
        ))}
      </StatsGrid>

      <SectionTitle>Current Tasks</SectionTitle>
      
      <ResponsiveTaskGrid
        tasks={tasks}
        isMobile={isMobile}
        onDragOver={onDragOver}
        onDrop={onDrop}
        renderTaskItem={renderTaskItem}
      />
      
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          users={users} 
          onClose={handleCloseModal} 
          onUpdate={handleUpdateTask}
        />
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
