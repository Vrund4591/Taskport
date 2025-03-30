import React, { useState, useEffect, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Sidebar from './Sidebar';
import { lightTheme, darkTheme } from '../theme';
import { forceLayoutRecalculation } from '../utils/LayoutSync';
import { normalizeProjectId } from '../utils/projectUtils';

// Basic display:grid layout to prevent conflicts
const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Layout = ({ users, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedProject, setSelectedProject] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const layoutRef = useRef(null);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const handleProjectSelect = (projectId) => {
    console.log("Layout handling project selection:", projectId);
    const normalizedId = normalizeProjectId(projectId);
    setSelectedProject(normalizedId);
  };

  // Apply theme class to body for global styling
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    // Force layout recalculation when sidebar is toggled
    forceLayoutRecalculation();
  }, [collapsed]);

  const projects = [
    { id: 1, name: 'Marketing Campaign' },
    { id: 2, name: 'Website Redesign' },
    { id: 3, name: 'Mobile App Development' },
    { id: 4, name: 'Customer Research' },
  ];

  // Select theme based on darkMode state
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <LayoutContainer ref={layoutRef}>
        <Sidebar
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={handleProjectSelect}
          toggleTheme={toggleTheme}
          darkMode={darkMode}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          users={users}
        />
        {React.cloneElement(children, { 
          sidebarCollapsed: collapsed,
          key: `dashboard-${collapsed ? 'collapsed' : 'expanded'}-${selectedProject}`
        })}
      </LayoutContainer>
    </ThemeProvider>
  );
};

export default Layout;
