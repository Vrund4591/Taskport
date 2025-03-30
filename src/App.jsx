import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/CalendarView';
import TimelineView from './components/TimelineView';
import ProjectsPage from './components/ProjectsPage';
import { lightTheme, darkTheme, GlobalStyles } from './theme';
import mockData from './data/mockData';
import mockProjects from './data/mockProjects';
import SplashScreen from './components/SplashScreen';

// Custom hook to redirect to timeline when a project is selected
const useProjectRedirect = (selectedProject, setSelectedProject) => {
  const navigate = useNavigate();
  
  // Handle project selection and navigate to timeline
  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
    navigate('/timeline');
  };
  
  return handleProjectSelect;
};

// Main app component without router (to avoid hooks before Router)
const AppContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedProject, setSelectedProject] = useState('proj1');
  const [loading, setLoading] = useState(true);
  
  // Get the navigation handler
  const handleProjectSelect = useProjectRedirect(selectedProject, setSelectedProject);
  
  // Check system preference for dark mode
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  // Use mockData instead of hardcoded data
  const data = {
    users: mockData.users,
    projects: mockProjects, // This should be using the imported mockProjects
    tasks: mockData.tasks,
    statuses: mockData.statuses
  };
  
  const sidebarProps = {
    darkMode,
    toggleTheme,
    collapsed,
    setCollapsed,
    selectedProject,
    setSelectedProject: handleProjectSelect, // Use the navigation-aware handler
    projects: data.projects,
    users: data.users
  };
  
  // Function to handle when splash screen is finished
  const handleSplashFinished = () => {
    setLoading(false);
  };
  
  if (loading) {
    return <SplashScreen onFinished={handleSplashFinished} />;
  }
  
  return (
    <Layout {...sidebarProps}>
      <Routes>
        <Route path="/" element={<Dashboard data={data} />} />
        <Route path="/board" element={
          <KanbanBoard 
            tasks={data.tasks} 
            statuses={data.statuses} 
            users={data.users}
            updateTask={(task) => console.log('Update task:', task)}
            moveTask={(taskId, newStatus) => console.log('Move task:', taskId, newStatus)}
            addTask={(task) => console.log('Add task:', task)}
          />
        } />
        <Route path="/calendar" element={
          <CalendarView 
            tasks={data.tasks}
            users={data.users}
          />
        } />
        <Route path="/timeline" element={
          <TimelineView 
            selectedProject={selectedProject} 
            users={data.users}
            allProjects={data.projects}
          />
        } />
        <Route path="/projects" element={
          <ProjectsPage 
            onSelectProject={handleProjectSelect}
          />
        } />
      </Routes>
    </Layout>
  );
};

// Main App component with router
const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  // Check system preference for dark mode
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);
  
  return (
    <ThemeProvider theme={darkMode ? {...darkTheme, mode: 'dark'} : {...lightTheme, mode: 'light'}}>
      <GlobalStyles />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
