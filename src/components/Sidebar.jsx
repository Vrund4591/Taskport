import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { normalizeProjectId } from '../utils/projectUtils';

// Desktop navigation link styles
const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 8px;
  text-decoration: none;
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
  background-color: ${props => props.theme.cardBackground};
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
    background-color: ${props => props.theme.hoverBackground};
  }
  
  &.active {
    background-color: ${props => props.theme.primary};
    color: white;
  }
  
  svg {
    min-width: 20px;
    min-height: 20px;
    margin-right: ${props => (props.$collapsed) ? '0' : '10px'};
    transition: margin-right 0.3s ease;
  }
  
  span {
    white-space: nowrap;
    overflow: hidden;
    font-size: ${props => (props.$collapsed) ? '0' : 'inherit'};
    opacity: ${props => (props.$collapsed) ? '0' : '1'};
    max-width: ${props => (props.$collapsed) ? '0' : '200px'};
    transition: all 0.3s ease, opacity 0.2s ease;
    font-weight: 500;
    padding-top: 1px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Desktop sidebar link wrapper
const NavItem = ({ $collapsed, children, ...rest }) => {
  return (
    <StyledNavLink $collapsed={$collapsed} {...rest}>
      {children}
    </StyledNavLink>
  );
};

// Main sidebar container - changes to bottom bar on mobile
const SidebarContainer = styled.aside`
  background-color: ${props => props.theme.secondaryBackground};
  width: ${props => props.$collapsed ? 'calc(var(--sidebar-collapsed-width) + 2px)' : 'calc(var(--sidebar-expanded-width) + 2px)'};
  height: 100vh;
  border-right: 2px solid #000;
  transition: none; /* Remove transitions completely */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Always hide overflow */
  position: relative; /* Use relative for grid layout */
  z-index: 10;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 70px;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    border-right: none;
    border-top: 2px solid #000;
    flex-direction: row;
    justify-content: space-around;
    padding: 0;
    box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
  }
`;

// Mobile bottom navigation container
const MobileNav = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    align-items: center;
  }
`;

// Mobile bottom navigation item
const MobileNavItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text};
  text-decoration: none;
  padding: 8px;
  
  &.active {
    color: ${props => props.theme.primary};
  }
  
  svg {
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
  }
  
  span {
    font-size: 0.7rem;
    font-weight: 500;
  }
`;

// Mobile more menu button
const MobileMoreButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: ${props => props.$isOpen ? props.theme.primary : props.theme.text};
  padding: 8px;
  
  svg {
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
  }
  
  span {
    font-size: 0.7rem;
    font-weight: 500;
  }
`;

// Mobile more menu popup
const MobileMoreMenu = styled.div`
  position: fixed;
  bottom: ${props => props.$isOpen ? '70px' : '-100%'};
  left: 0;
  width: 100%;
  background-color: ${props => props.theme.cardBackground};
  border-top: 2px solid #000;
  border-radius: 16px 16px 0 0;
  transition: bottom 0.3s ease;
  z-index: 101;
  padding: 20px;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
  max-height: 70vh;
  overflow-y: auto;
`;

// Mobile project section in more menu
const MobileProjectsSection = styled.div`
  margin-bottom: 20px;
  
  h3 {
    font-size: 0.9rem;
    text-transform: uppercase;
    color: ${props => props.theme.secondaryText};
    margin-bottom: 12px;
    font-weight: bold;
  }
`;

// Mobile menu item in more menu
const MobileMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
  background-color: ${props => props.theme.cardBackground};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
  }
  
  svg {
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }
  
  span {
    font-weight: 500;
  }
`;

// Mobile user section in more menu
const MobileUserSection = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  margin-top: 20px;
  margin-bottom: 12px;
  background-color: ${props => props.theme.cardBackground};
  border: 2px solid #000;
  border-radius: 8px;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
  
  .avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
    border: 2px solid #000;
    box-shadow: 3px 3px 0 rgba(0, 0, 0, 1);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .user-info {
    .name {
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 2px;
    }
    
    .role {
      font-size: 0.8rem;
      color: ${props => props.theme.secondaryText};
    }
  }
  
  .theme-toggle {
    margin-left: auto;
  }
`;

// Mobile overlay for more menu
const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: ${props => props.$isVisible ? 'block' : 'none'};
`;

// Desktop logo section
const Logo = styled.div`
  padding: ${props => props.$collapsed ? '16px 0' : '20px'};
  display: flex;
  align-items: center;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  border-bottom: 2px solid #000;
  background-color: ${props => props.theme.cardBackground};
  height: 64px;
  box-sizing: border-box;
  overflow: hidden;
  position: sticky;
  top: 0;
  z-index: 2;
  
  h1 {
    margin: 0;
    font-size: ${props => props.$collapsed ? '0' : '1.5rem'};
    white-space: nowrap;
    overflow: hidden;
    max-width: ${props => props.$collapsed ? '0' : '180px'};
    opacity: ${props => props.$collapsed ? '0' : '1'};
    transition: all 0.3s ease, opacity 0.15s ease;
    color: ${props => props.theme.primary};
    font-weight: bold;
  }
  
  img {
    width: ${props => props.$collapsed ? '32px' : '28px'};
    height: ${props => props.$collapsed ? '32px' : '28px'};
    margin-right: ${props => props.$collapsed ? '0' : '10px'};
    transition: all 0.3s ease;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Desktop navigation section
const NavSection = styled.div`
  padding: ${props => props.$collapsed ? '16px 10px' : '16px'};
  margin: 0;
  
  h3 {
    font-size: ${props => props.$collapsed ? '0' : '1rem'};
    text-transform: uppercase;
    color: ${props => props.theme.secondaryText};
    margin-top: 0;
    margin-bottom: 16px;
    white-space: nowrap;
    overflow: hidden;
    opacity: ${props => props.$collapsed ? '0' : '1'};
    max-height: ${props => props.$collapsed ? '0' : 'auto'};
    transition: all 0.3s ease;
    font-weight: bold;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Desktop project list container
const ProjectList = styled.div`
  margin-top: 8px;
  overflow-y: auto;
  max-height: calc(100vh - 340px);
  padding: 10px 0px 0px 0px; /* Added top padding */
  width: ${props => props.$collapsed ? '110%' : '100%'};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: ${props => props.$collapsed ? '2px' : '10px'};
  padding-left: 0;
`;

// Project item (used in both desktop and mobile)
const ProjectItem = styled.div`
  padding: ${props => props.$collapsed ? '10px' : '10px'};
  margin-bottom: 12px;
  border-radius: 8px !important; /* Force border radius */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  transition: all 0.2s ease;
  background-color: ${props => props.$isSelected ? props.theme.primary : props.theme.cardBackground};
  color: ${props => props.$isSelected ? 'white' : props.theme.text};
  border: 2px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
  width: ${props => props.$collapsed ? '44px' : '100%'};
  min-height: 44px;
  overflow: visible; /* Allow box-shadow to be visible */
  margin: ${props => props.$collapsed ? '0 auto 12px' : '0 0 12px'};
  box-sizing: border-box;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
    background-color: ${props => props.$isSelected ? props.theme.primary : props.theme.hoverBackground};
  }

  .project-color {
    width: ${props => props.$collapsed ? '20px' : '12px'};
    height: ${props => props.$collapsed ? '20px' : '12px'};
    border-radius: 50%;
    margin: ${props => props.$collapsed ? '0' : '0 10px 0 0'};
    border: 1px solid rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .project-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: ${props => props.$collapsed ? '0' : 'inherit'};
    opacity: ${props => props.$collapsed ? '0' : '1'};
    max-width: ${props => props.$collapsed ? '0' : '160px'};
    transition: all 0.3s ease, opacity 0.15s ease;
    font-weight: 500;
    flex: 1;
    display: ${props => props.$collapsed ? 'none' : 'block'};
  }
`;

// Desktop footer section
const FooterSection = styled.div`
  border-top: 2px solid #000;
  padding: ${props => props.$collapsed ? '16px 0' : '16px'};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.cardBackground};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Theme toggle button
const ThemeToggle = styled.button`
  background: none;
  border: 2px solid #000;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text};
  padding: 8px;
  transition: all 0.2s ease;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 1);
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 rgba(0, 0, 0, 1);
  }
`;

// Desktop collapse button - moved to footer
const CollapseButton = styled.button`
  background: none;
  border: 2px solid #000;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text};
  padding: 8px;
  transition: all 0.2s ease;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 1);
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 rgba(0, 0, 0, 1);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

// Desktop user section - This was previously missing or misplaced
const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.$collapsed ? '16px 0' : '16px'};
  justify-content: center;
  border-top: 2px solid #000;
  background-color: ${props => props.theme.cardBackground};
  position: sticky;
  bottom: 0;
  z-index: 2;
  overflow: visible;
  
  .avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 0;
    margin-bottom: ${props => props.$collapsed ? '10px' : '10px'};
    border: 2px solid #000;
    box-shadow: 3px 3px 0 rgba(0, 0, 0, 1);
    flex-shrink: 0;
    display: block;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .user-info {
    white-space: nowrap;
    overflow: hidden;
    opacity: ${props => props.$collapsed ? 0 : 1};
    max-width: ${props => props.$collapsed ? '0' : '160px'};
    max-height: ${props => props.$collapsed ? '0' : 'auto'};
    transition: all 0.3s ease, opacity 0.15s ease;
    text-align: center;
    margin-bottom: ${props => props.$collapsed ? '0' : '12px'};
    
    .name {
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 2px;
    }
    
    .role {
      font-size: 0.8rem;
      color: ${props => props.theme.secondaryText};
    }
  }
  
  .theme-toggle {
    display: block; /* Always show theme toggle */
    margin-top: ${props => props.$collapsed ? '0' : '8px'};
    width: ${props => props.$collapsed ? '38px' : 'auto'};
    height: ${props => props.$collapsed ? '38px' : 'auto'};
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Scroll container for projects
const ScrollContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  /* Add some padding at the bottom to prevent content from being hidden behind user section */
  padding-bottom: 20px;
`;

function Sidebar({ 
  projects, 
  selectedProject, 
  setSelectedProject, 
  toggleTheme, 
  darkMode, 
  collapsed,
  setCollapsed,
  users
}) {
  const currentUser = users[0] || { name: 'User', role: 'Developer', avatar: '' }; 
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sidebarRef = useRef(null);
  
  // Define the projectColors array
  const projectColors = [
    '#4A6FFF', '#FF6B6B', '#FFD166', '#06D6A0', '#9C8DFF'
  ];
  
  // Update sidebar width directly when collapsed changes
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = collapsed ? 
        'calc(var(--sidebar-collapsed-width) + 2px)' : 
        'calc(var(--sidebar-expanded-width) + 2px)';
    }
    
    document.documentElement.style.setProperty(
      '--current-sidebar-width', 
      collapsed ? 'calc(var(--sidebar-collapsed-width) + 2px)' : 'calc(var(--sidebar-expanded-width) + 2px)'
    );
    
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 10);
  }, [collapsed]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      document.body.style.transition = 'none';
      document.body.offsetHeight; // Force reflow
      document.body.style.transition = '';
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close more menu when clicking outside
  const handleClickOutside = () => {
    setMoreMenuOpen(false);
  };
  
  // Toggle more menu open/closed
  const toggleMoreMenu = () => {
    setMoreMenuOpen(!moreMenuOpen);
  };
  
  // Update project selection with more robust handling
  const handleProjectSelect = (projectId) => {
    console.log("Sidebar selecting project:", projectId);
    const normalizedId = normalizeProjectId(projectId);
    setSelectedProject(normalizedId);
  };
  
  // Icon components
  const SunIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
    </svg>
  );
  
  const MoonIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
    </svg>
  );

  // Render mobile menu project items
  const renderMobileProjectItems = () => {
    return projects.map((project, index) => (
      <ProjectItem 
        key={project.id}
        $isSelected={project.id === selectedProject}
        onClick={() => {
          handleProjectSelect(project.id);
          setMoreMenuOpen(false);
        }}
      >
        <div 
          className="project-color" 
          style={{ 
            backgroundColor: projectColors[index % projectColors.length],
            borderRadius: '50%'
          }}
        ></div>
        <div className="project-name">{project.name}</div>
      </ProjectItem>
    ));
  };

  // Render desktop project items
  const renderDesktopProjectItems = () => {
    return projects.map((project, index) => (
      <ProjectItem 
        key={project.id}
        $isSelected={project.id === selectedProject}
        $collapsed={collapsed}
        onClick={() => handleProjectSelect(project.id)}
      >
        <div 
          className="project-color" 
          style={{ 
            backgroundColor: projectColors[index % projectColors.length],
            width: collapsed ? '20px' : '12px',
            height: collapsed ? '20px' : '12px',
            marginRight: collapsed ? '0' : '10px',
            borderRadius: '50%'
          }}
        ></div>
        <div className="project-name">{project.name}</div>
      </ProjectItem>
    ));
  };

  // Render empty projects message
  const renderEmptyProjectsMessage = () => (
    <div style={{
      padding: '12px',
      textAlign: 'center',
      color: '#999',
      fontStyle: 'italic',
      fontSize: '0.9rem'
    }}>
      No projects found
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <MobileOverlay $isVisible={moreMenuOpen} onClick={handleClickOutside} />
      
      {/* Mobile bottom bar */}
      {windowWidth <= 768 && (
        <>
          <SidebarContainer $collapsed={false}>
            <MobileNav>
              <MobileNavItem to="/" end>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                <span>Dashboard</span>
              </MobileNavItem>
              <MobileNavItem to="/board" end>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4h2v4zm0-6h-2V7h2v4z"/>
                </svg>
                <span>Board</span>
              </MobileNavItem>
              <MobileNavItem to="/calendar" end>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
                <span>Calendar</span>
              </MobileNavItem>
              <MobileMoreButton onClick={toggleMoreMenu} $isOpen={moreMenuOpen}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <span>More</span>
              </MobileMoreButton>
            </MobileNav>
          </SidebarContainer>
          
          {/* Mobile more menu */}
          <MobileMoreMenu $isOpen={moreMenuOpen}>
            <MobileProjectsSection>
              <h3>Projects</h3>
              {projects.length > 0 ? renderMobileProjectItems() : renderEmptyProjectsMessage()}
            </MobileProjectsSection>
            
            <NavLink to="/timeline" onClick={() => setMoreMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
              <MobileMenuItem>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                </svg>
                <span>Timeline</span>
              </MobileMenuItem>
            </NavLink>
            
            <MobileUserSection>
              <div className="avatar">
                <img src={currentUser.avatar} alt={currentUser.name} />
              </div>
              <div className="user-info">
                <div className="name">{currentUser.name}</div>
                <div className="role">{currentUser.role}</div>
              </div>
              <div className="theme-toggle">
                <ThemeToggle onClick={toggleTheme}>
                  {darkMode ? <SunIcon /> : <MoonIcon />}
                </ThemeToggle>
              </div>
            </MobileUserSection>
          </MobileMoreMenu>
        </>
      )}
      
      {/* Desktop sidebar */}
      {windowWidth > 768 && (
        <SidebarContainer 
          $collapsed={collapsed} 
          $transitioning={isTransitioning}
          role="navigation"
          ref={sidebarRef}
        >
          <Logo $collapsed={collapsed}>
            <img 
              src="/taskport.svg" 
              alt="TaskPort Logo" 
              style={{ 
                filter: `${darkMode ? '' : 'brightness(0.4)'}`,
                color: darkMode ? 'white' : 'black'
              }}
            />
            <h1>TaskPort</h1>
          </Logo>
          
          <ScrollContainer>
            <NavSection $collapsed={collapsed}>
              <h3>Navigation</h3>
              <NavItem to="/" $collapsed={collapsed} end>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                <span>Dashboard</span>
              </NavItem>
              <NavItem to="/board" $collapsed={collapsed} end>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4h2v4zm0-6h-2V7h2v4z"/>
                </svg>
                <span>Board</span>
              </NavItem>
              <NavItem to="/calendar" $collapsed={collapsed} end>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
                <span>Calendar</span>
              </NavItem>
              <NavItem to="/timeline" $collapsed={collapsed} end>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                </svg>
                <span>Timeline</span>
              </NavItem>
            </NavSection>
            
            <NavSection $collapsed={collapsed}>
              <h3>Projects</h3>
              <ProjectList $collapsed={collapsed}>
                {projects.length > 0 ? renderDesktopProjectItems() : renderEmptyProjectsMessage()}
              </ProjectList>
            </NavSection>
          </ScrollContainer>
          
          <UserSection $collapsed={collapsed}>
            <div className="avatar" style={{ display: 'block' }}>
              <img src={currentUser.avatar} alt={currentUser.name} />
            </div>
            <div className="user-info">
              <div className="name">{currentUser.name}</div>
              <div className="role">{currentUser.role}</div>
            </div>
            <div className="theme-toggle">
              <ThemeToggle onClick={toggleTheme} style={{
                width: collapsed ? '36px' : 'auto',
                height: collapsed ? '36px' : 'auto',
                padding: collapsed ? '8px' : '8px',
                marginTop: collapsed ? '10px' : '0'
              }}>
                {darkMode ? <SunIcon /> : <MoonIcon />}
              </ThemeToggle>
            </div>
          </UserSection>
          
          <FooterSection $collapsed={collapsed}>
            {!collapsed ? (
              <CollapseButton onClick={() => setCollapsed(true)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                </svg>
              </CollapseButton>
            ) : (
              <CollapseButton onClick={() => setCollapsed(false)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </CollapseButton>
            )}
          </FooterSection>
        </SidebarContainer>
      )}
    </>
  );
}

export default Sidebar;
