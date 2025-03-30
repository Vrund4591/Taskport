import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  background: '#f8f9fa',
  secondaryBackground: '#ffffff',
  text: '#333333',
  secondaryText: '#666666',
  primary: '#4A6FFF',
  highPriority: '#FF6B6B',
  mediumPriority: '#FFD166',
  lowPriority: '#06D6A0',
  border: '#e0e0e0',
  shadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  hoverBackground: '#f1f3f9',
  cardBackground: '#ffffff',
  buttonText: '#ffffff'
};

export const darkTheme = {
  background: '#1a1a1a',
  secondaryBackground: '#2d2d2d',
  text: '#e0e0e0',
  secondaryText: '#b0b0b0',
  primary: '#5D7FFF',
  highPriority: '#FF7B7B',
  mediumPriority: '#FFE176',
  lowPriority: '#16E6B0',
  border: '#444444',
  shadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  hoverBackground: '#333333',
  cardBackground: '#2d2d2d',
  buttonText: '#ffffff'
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
    background: ${props => props.theme.background};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.secondaryText};
  }
`;
