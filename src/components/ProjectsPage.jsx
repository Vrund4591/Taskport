import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import projects from '../data/mockProjects';

const ProjectsContainer = styled.div`
  padding: 20px;
`;

const ProjectsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
    font-size: 2rem;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ProjectCard = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border: 2px solid #000;
  border-radius: 8px;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
  padding: 16px;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
  }
  
  .project-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .project-description {
    color: ${props => props.theme.secondaryText};
    font-size: 0.9rem;
    margin-bottom: 12px;
  }
  
  .project-dates {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    color: ${props => props.theme.secondaryText};
    margin-bottom: 12px;
  }
  
  .project-progress {
    margin-top: 12px;
  }
  
  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    margin-bottom: 4px;
  }
  
  .progress-bar {
    height: 6px;
    background-color: ${props => props.theme.border};
    border-radius: 3px;
    overflow: hidden;
    
    .bar {
      height: 100%;
      background-color: ${props => props.theme.primary};
      width: ${props => props.progress}%;
    }
  }
  
  .task-count {
    margin-top: 12px;
    font-size: 0.8rem;
  }
  
  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    background-color: ${props => {
      switch(props.status) {
        case 'completed': return `${props.theme.lowPriority}33`;
        case 'in-progress': return `${props.theme.primary}33`;
        case 'planning': return `${props.theme.mediumPriority}33`;
        default: return props.theme.secondaryBackground;
      }
    }};
    color: ${props => {
      switch(props.status) {
        case 'completed': return props.theme.lowPriority;
        case 'in-progress': return props.theme.primary;
        case 'planning': return props.theme.mediumPriority;
        default: return props.theme.text;
      }
    }};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  
  select {
    padding: 8px 12px;
    border: 2px solid #000;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
    border-radius: 6px;
    background: ${props => props.theme.secondaryBackground};
    cursor: pointer;
    transition: all 0.2s;
    
    &:focus {
      outline: none;
    }
    
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
    }
  }
`;

const ProjectsPage = ({ onSelectProject }) => {
  const [filter, setFilter] = useState('all');
  
  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });
  
  return (
    <ProjectsContainer>
      <ProjectsHeader>
        <h2>Projects</h2>
      </ProjectsHeader>
      
      <FilterContainer>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Projects</option>
          <option value="planning">Planning</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </FilterContainer>
      
      <ProjectsGrid>
        {filteredProjects.map(project => {
          const startDate = new Date(project.startDate);
          const endDate = new Date(project.endDate);
          
          return (
            <ProjectCard 
              key={project.id} 
              status={project.status}
              onClick={() => onSelectProject && onSelectProject(project.id)}
            >
              <div className="project-name">{project.name}</div>
              <div className="status-badge">
                {project.status === 'in-progress' ? 'In Progress' : 
                  project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </div>
              <div className="project-description">{project.description}</div>
              <div className="project-dates">
                <span>{format(startDate, 'MMM d, yyyy')}</span>
                <span>→</span>
                <span>{format(endDate, 'MMM d, yyyy')}</span>
              </div>
              <div className="project-progress">
                <div className="progress-label">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="bar" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
              <div className="task-count">
                {project.tasks.length} tasks
              </div>
            </ProjectCard>
          );
        })}
      </ProjectsGrid>
    </ProjectsContainer>
  );
};

export default ProjectsPage;
