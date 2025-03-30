import { createGlobalStyle } from 'styled-components';

// Modern and clean light theme with a cohesive color palette
export const lightTheme = {
  primary: '#3366FF',
  text: '#333333',
  background: '#FFFFFF',
  cardBackground: '#F8F9FA',
  secondaryBackground: '#E9ECEF',
  secondaryText: '#6C757D',
  border: '#DEE2E6',
  hoverBackground: '#F1F3F5',
  highPriority: '#DC3545',
  mediumPriority: '#FFC107',
  lowPriority: '#28A745',
  scrollbarTrack: '#F1F3F5',
  scrollbarThumb: '#CED4DA'
};

// Rich and immersive dark theme with balanced contrast
export const darkTheme = {
  primary: '#4A6FFF',
  text: '#E9ECEF',
  background: '#212529',
  cardBackground: '#343A40',
  secondaryBackground: '#495057',
  secondaryText: '#ADB5BD',
  border: '#6C757D',
  hoverBackground: '#495057',
  highPriority: '#E55C6C',
  mediumPriority: '#FFDA6A',
  lowPriority: '#5CCC7A',
  scrollbarTrack: '#343A40',
  scrollbarThumb: '#6C757D'
};

export const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: all 0.3s ease;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.scrollbarTrack};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.scrollbarThumb};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.secondaryText};
  }
`;

export default lightTheme;