import { format, isAfter } from 'date-fns';
import styled from 'styled-components';

const Card = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: ${props => props.isDragging ? '0 5px 15px rgba(0, 0, 0, 0.15)' : props.theme.shadow};
  border-left: 3px solid ${props => 
    props.priority === 'high' ? props.theme.highPriority :
    props.priority === 'medium' ? props.theme.mediumPriority :
    props.theme.lowPriority};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TaskTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 0.95rem;
  color: ${props => props.theme.text};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 0.8rem;
`;

const DeadlineTag = styled.div`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: ${props => props.isOverdue ? 'rgba(255, 107, 107, 0.15)' : 'rgba(74, 111, 255, 0.15)'};
  color: ${props => props.isOverdue ? props.theme.highPriority : props.theme.primary};

  svg {
    width: 12px;
    height: 12px;
  }
`;

const Assignee = styled.div`
  display: flex;
  align-items: center;
  
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const TaskProgress = styled.div`
  margin-top: 8px;
  height: 4px;
  width: 100%;
  background-color: ${props => props.theme.border};
  border-radius: 2px;
  overflow: hidden;
  
  .progress-bar {
    height: 100%;
    background-color: ${props => props.theme.primary};
    width: ${props => props.progress}%;
  }
`;

const PriorityLabel = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  gap: 4px;
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => 
      props.priority === 'high' ? props.theme.highPriority :
      props.priority === 'medium' ? props.theme.mediumPriority :
      props.theme.lowPriority};
  }
`;

function TaskCard({ task, users, isDragging }) {
  const assignee = users.find(user => user.id === task.assignee);
  const deadline = new Date(task.deadline);
  const isOverdue = isAfter(new Date(), deadline);
  const progress = task.loggedHours > 0 
    ? Math.min(Math.round((task.loggedHours / task.estimatedHours) * 100), 100)
    : 0;

  return (
    <Card 
      isDragging={isDragging} 
      priority={task.priority}
    >
      <TaskTitle>{task.title}</TaskTitle>
      
      <PriorityLabel priority={task.priority}>
        <span className="dot"></span>
        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
      </PriorityLabel>
      
      <TaskProgress progress={progress}>
        <div className="progress-bar"></div>
      </TaskProgress>
      
      <TaskMeta>
        <DeadlineTag isOverdue={isOverdue}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          {format(deadline, 'MMM d')}
        </DeadlineTag>
        
        <Assignee>
          <div className="avatar">
            <img src={assignee?.avatar} alt={assignee?.name} />
          </div>
        </Assignee>
      </TaskMeta>
    </Card>
  );
}

export default TaskCard;
