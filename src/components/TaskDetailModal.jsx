import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.border};
  position: sticky;
  top: 0;
  background-color: ${props => props.theme.cardBackground};
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.secondaryText};
  padding: 0;
  line-height: 1;
  
  &:hover {
    color: ${props => props.theme.text};
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  flex: 1;
`;

const TaskTitle = styled.h2`
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  color: ${props => props.theme.text};
  line-height: 1.3;
`;

const TaskDescription = styled.p`
  margin: 0 0 20px 0;
  color: ${props => props.theme.text};
  line-height: 1.6;
`;

const MetadataSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const MetadataItem = styled.div`
  h4 {
    margin: 0 0 5px 0;
    font-size: 0.9rem;
    color: ${props => props.theme.secondaryText};
    font-weight: 500;
  }
  
  p {
    margin: 0;
    color: ${props => props.theme.text};
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .priority-indicator {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => 
      props.priority === 'high' ? props.theme.highPriority :
      props.priority === 'medium' ? props.theme.mediumPriority :
      props.theme.lowPriority};
  }
`;

const ProgressSection = styled.div`
  margin-bottom: 20px;
  
  h4 {
    margin: 0 0 10px 0;
    font-size: 0.9rem;
    color: ${props => props.theme.secondaryText};
    font-weight: 500;
  }
  
  .progress-container {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .progress-bar {
    flex: 1;
    height: 8px;
    background-color: ${props => props.theme.border};
    border-radius: 4px;
    overflow: hidden;
    
    .bar {
      height: 100%;
      background-color: ${props => props.theme.primary};
      width: ${props => props.progress}%;
    }
  }
  
  .progress-text {
    font-size: 0.9rem;
    color: ${props => props.theme.secondaryText};
  }
`;

const TimeTracking = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  
  button {
    background-color: ${props => props.theme.primary};
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    
    &:hover {
      background-color: ${props => props.theme.primary}dd;
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  .time-info {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: ${props => props.theme.secondaryText};
    
    span {
      margin: 0 5px;
    }
    
    strong {
      color: ${props => props.theme.text};
    }
  }
`;

const TimeLoggingInterface = styled.div`
  background-color: ${props => props.theme.background};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid ${props => props.theme.border};
  
  h4 {
    margin: 0 0 10px 0;
    font-size: 0.9rem;
    color: ${props => props.theme.text};
    font-weight: 500;
  }
  
  .time-input-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    
    input {
      width: 80px;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid ${props => props.theme.border};
      background-color: ${props => props.theme.cardBackground};
      color: ${props => props.theme.text};
      font-size: 0.9rem;
      
      &:focus {
        outline: none;
        border-color: ${props => props.theme.primary};
      }
    }
    
    label {
      color: ${props => props.theme.secondaryText};
      font-size: 0.9rem;
      margin-left: 5px;
    }
  }
  
  .description-input {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid ${props => props.theme.border};
    background-color: ${props => props.theme.cardBackground};
    color: ${props => props.theme.text};
    font-size: 0.9rem;
    margin-bottom: 12px;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.primary};
    }
  }
  
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    
    button {
      padding: 8px 15px;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      
      &.cancel {
        background-color: transparent;
        border: 1px solid ${props => props.theme.border};
        color: ${props => props.theme.secondaryText};
        
        &:hover {
          background-color: ${props => props.theme.hoverBackground};
        }
      }
      
      &.save {
        background-color: ${props => props.theme.primary};
        border: none;
        color: white;
        
        &:hover {
          background-color: ${props => props.theme.primary}dd;
        }
      }
    }
  }
`;

const CommentsSection = styled.div`
  margin-top: 30px;
  
  h3 {
    margin: 0 0 15px 0;
    font-size: 1.1rem;
    color: ${props => props.theme.text};
  }
`;

const CommentList = styled.div`
  margin-bottom: 20px;
`;

const Comment = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${props => props.theme.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  .comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .user-info {
      flex: 1;
      
      .name {
        font-weight: 500;
        color: ${props => props.theme.text};
      }
      
      .timestamp {
        font-size: 0.8rem;
        color: ${props => props.theme.secondaryText};
      }
    }
  }
  
  .comment-text {
    color: ${props => props.theme.text};
    line-height: 1.5;
  }
`;

const CommentInput = styled.div`
  display: flex;
  gap: 10px;
  
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .input-area {
    flex: 1;
    
    textarea {
      width: 100%;
      min-height: 80px;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid ${props => props.theme.border};
      background-color: ${props => props.theme.background};
      color: ${props => props.theme.text};
      resize: none;
      font-family: inherit;
      font-size: 0.9rem;
      margin-bottom: 10px;
      
      &:focus {
        outline: none;
        border-color: ${props => props.theme.primary};
      }
    }
    
    button {
      background-color: ${props => props.theme.primary};
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 0.9rem;
      cursor: pointer;
      float: right;
      
      &:hover {
        background-color: ${props => props.theme.primary}dd;
      }
    }
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
    margin-right: 8px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .name {
    color: ${props => props.theme.text};
  }
`;

function TaskDetailModal({ task, users, onClose, onUpdate }) {
  const [editedTask, setEditedTask] = useState({...task});
  const [comment, setComment] = useState('');
  const [isLoggingTime, setIsLoggingTime] = useState(false);
  const [timeToLog, setTimeToLog] = useState('');
  const [timeLogDescription, setTimeLogDescription] = useState('');
  
  const assignee = users.find(user => user.id === task.assignee);
  const progress = editedTask.estimatedHours > 0 
    ? Math.min(Math.round((editedTask.loggedHours / editedTask.estimatedHours) * 100), 100) 
    : 0;
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      user: users[0].id,
      text: comment,
      timestamp: new Date().toISOString(),
    };
    
    const updatedTask = {
      ...editedTask,
      comments: [...(editedTask.comments || []), newComment],
    };
    
    setEditedTask(updatedTask);
    onUpdate(updatedTask);
    setComment('');
  };

  const toggleTimeLogging = () => {
    setIsLoggingTime(!isLoggingTime);
    if (!isLoggingTime) {
      setTimeToLog('');
      setTimeLogDescription('');
    }
  };

  const saveLoggedTime = () => {
    const hours = parseFloat(timeToLog);
    if (isNaN(hours) || hours <= 0) return;

    const timeLogEntry = {
      id: Date.now().toString(),
      hours: hours,
      description: timeLogDescription,
      timestamp: new Date().toISOString(),
      user: users[0].id,
    };

    const updatedTask = {
      ...editedTask,
      loggedHours: editedTask.loggedHours + hours,
      timeLogs: [...(editedTask.timeLogs || []), timeLogEntry],
    };
    
    if (timeLogDescription.trim()) {
      const timeLogComment = {
        id: Date.now().toString() + '-auto',
        user: users[0].id,
        text: `Logged ${hours}h: ${timeLogDescription}`,
        timestamp: new Date().toISOString(),
        isSystem: true,
      };
      
      updatedTask.comments = [...(updatedTask.comments || []), timeLogComment];
    }
    
    setEditedTask(updatedTask);
    onUpdate(updatedTask);
    setIsLoggingTime(false);
    setTimeToLog('');
    setTimeLogDescription('');
  };
  
  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <TaskTitle>{task.title}</TaskTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <TaskDescription>{task.description}</TaskDescription>
          
          <MetadataSection>
            <MetadataItem priority={task.priority}>
              <h4>Priority</h4>
              <p>
                <span className="priority-indicator"></span>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </p>
            </MetadataItem>
            
            <MetadataItem>
              <h4>Assignee</h4>
              <p>
                <Assignee>
                  <div className="avatar">
                    <img src={assignee?.avatar} alt={assignee?.name} />
                  </div>
                  <span className="name">{assignee?.name}</span>
                </Assignee>
              </p>
            </MetadataItem>
            
            <MetadataItem>
              <h4>Deadline</h4>
              <p>{format(new Date(task.deadline), 'MMMM d, yyyy')}</p>
            </MetadataItem>
            
            <MetadataItem>
              <h4>Status</h4>
              <p>{task.status.charAt(0).toUpperCase() + task.status.slice(1).replace(/([A-Z])/g, ' $1')}</p>
            </MetadataItem>
          </MetadataSection>
          
          <ProgressSection progress={progress}>
            <h4>Progress</h4>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="bar" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="progress-text">{progress}%</div>
            </div>
          </ProgressSection>
          
          <TimeTracking>
            <button onClick={toggleTimeLogging}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
              </svg>
              {isLoggingTime ? 'Cancel' : 'Log Time'}
            </button>
            
            <div className="time-info">
              <strong>{editedTask.loggedHours}h</strong>
              <span>logged of</span>
              <strong>{editedTask.estimatedHours}h</strong>
              <span>estimated</span>
            </div>
          </TimeTracking>
          
          {isLoggingTime && (
            <TimeLoggingInterface>
              <h4>Log Time</h4>
              <div className="time-input-container">
                <input 
                  type="number" 
                  min="0.1" 
                  step="0.1" 
                  value={timeToLog} 
                  onChange={(e) => setTimeToLog(e.target.value)}
                  placeholder="Hours"
                />
                <label>hours</label>
              </div>
              <input 
                type="text"
                className="description-input" 
                placeholder="What did you work on?" 
                value={timeLogDescription}
                onChange={(e) => setTimeLogDescription(e.target.value)}
              />
              <div className="buttons">
                <button className="cancel" onClick={toggleTimeLogging}>Cancel</button>
                <button className="save" onClick={saveLoggedTime} disabled={!timeToLog}>Save</button>
              </div>
            </TimeLoggingInterface>
          )}
          
          <CommentsSection>
            <h3>Comments</h3>
            
            <CommentList>
              {(editedTask.comments || []).map(comment => {
                const commentUser = users.find(user => user.id === comment.user);
                return (
                  <Comment key={comment.id}>
                    <div className="comment-header">
                      <div className="avatar">
                        <img src={commentUser?.avatar} alt={commentUser?.name} />
                      </div>
                      <div className="user-info">
                        <div className="name">{commentUser?.name}</div>
                        <div className="timestamp">{format(new Date(comment.timestamp), 'MMM d, yyyy h:mm a')}</div>
                      </div>
                    </div>
                    <div className="comment-text">{comment.text}</div>
                  </Comment>
                );
              })}
            </CommentList>
            
            <CommentInput>
              <div className="avatar">
                <img src={users[0]?.avatar} alt={users[0]?.name} />
              </div>
              <div className="input-area">
                <textarea 
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <button onClick={handleAddComment}>Add Comment</button>
              </div>
            </CommentInput>
          </CommentsSection>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default TaskDetailModal;
