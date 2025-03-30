import React from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.$isMobile ? '200px' : '240px'}, 1fr));
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.25rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  background-color: ${props => props.theme.cardBackground};
  padding: 1rem;
  border-radius: 0.375rem;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
  min-height: 250px;
  height: fit-content;
  max-height: calc(100vh - ${props => props.$isMobile ? '280px' : '250px'});
  overflow-y: auto;
  position: relative;
  
  h4 {
    font-weight: bold;
    margin-bottom: 0.75rem;
    position: sticky;
    top: 0;
    background-color: ${props => props.theme.cardBackground};
    padding-bottom: 0.5rem;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .column-counter {
    background-color: ${props => props.theme.secondaryBackground};
    color: ${props => props.theme.secondaryText};
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 12px;
    border: 1px solid ${props => props.theme.border};
  }
`;

const ResponsiveTaskGrid = ({ 
  tasks, 
  isMobile, 
  onDragOver, 
  onDrop, 
  renderTaskItem 
}) => {
  return (
    <Grid $isMobile={isMobile}>
      {Object.entries(tasks).map(([columnId, columnTasks]) => (
        <Column
          key={columnId}
          $isMobile={isMobile}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, columnId)}
        >
          <h4>
            {columnId === 'todo' ? 'To Do' : columnId === 'inProgress' ? 'In Progress' : 'Done'}
            <span className="column-counter">{columnTasks.length}</span>
          </h4>
          
          {columnTasks.map(task => renderTaskItem(task, columnId))}
          
          {columnTasks.length === 0 && (
            <div style={{ 
              color: '#999', 
              textAlign: 'center', 
              padding: '2rem 1rem',
              fontSize: '0.9rem',
              fontStyle: 'italic'
            }}>
              No tasks in this column
            </div>
          )}
        </Column>
      ))}
    </Grid>
  );
};

export default ResponsiveTaskGrid;
