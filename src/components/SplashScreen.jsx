import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';

// Create keyframes for smooth column growth animation
const createColumnGrowthAnimation = (finalHeight) => keyframes`
  0% { height: 0%; }
  100% { height: ${finalHeight}%; }
`;

// Text fade-in animation
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// Add glitch animation for the underline
const glitchAnimation = keyframes`
  0% { transform: translateX(-5px); opacity: 0.7; }
  25% { transform: translateX(5px); opacity: 0.9; }
  50% { transform: translateX(-3px); opacity: 0.6; }
  75% { transform: translateX(3px); opacity: 0.8; }
  100% { transform: translateX(0); opacity: 1; }
`;

// Replace the alternating line animation with a faster one that moves multiple times
const alternatingLineAnimation = keyframes`
  0%, 15% { 
    width: 40%; 
    left: 0; 
    opacity: 0.9;
  }
  20%, 35% { 
    width: 40%; 
    left: 60%; 
    opacity: 0.9;
  }
  40%, 55% { 
    width: 40%; 
    left: 0; 
    opacity: 0.9;
  }
  60%, 75% { 
    width: 40%; 
    left: 60%; 
    opacity: 0.9;
  }
  80%, 95% { 
    width: 40%; 
    left: 0; 
    opacity: 0.9;
  }
  16%, 19%, 36%, 39%, 56%, 59%, 76%, 79%, 96%, 100% { 
    opacity: 0.3;
  }
`;

// Container for the entire splash screen
const SplashContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF; /* Default to white background */
  z-index: 1000;
  padding: 20px;
`;

// Modern graph container
const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 240px;
  width: 280px;
  margin-bottom: 30px;
  position: relative;
  
  @media (max-width: 480px) {
    width: 220px;
    height: 200px;
  }
`;

// Columns container
const ColumnsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 200px;
  gap: 10px;
  position: relative;
  
  @media (max-width: 480px) {
    height: 150px;
  }
`;

// Individual graph column
const Column = styled.div`
  width: 40px;
  border-radius: 8px;
  background: #3366FF; /* Hard-coded primary color */
  box-shadow: 0 4px 15px rgba(51, 102, 255, 0.2);
  position: relative;
  overflow: hidden;
  height: 0%;
  
  /* Apply animation based on the index */
  ${props => {
    return css`
      animation: ${props.$animation} 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: ${props.$delay || '0s'};
    `;
  }}
  
  @media (max-width: 480px) {
    width: 30px;
  }
`;

// Logo container with aesthetic font style
const Logo = styled.div`
  font-size: 3.2rem;
  font-weight: 700;
  color: #3366FF; /* Hard-coded primary color */
  margin-top: 30px;
  letter-spacing: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  text-shadow: 0 4px 8px rgba(51, 102, 255, 0.25);
  position: relative;
  
  &::after {
    content: attr(data-quote);
    display: block;
    font-size: 0.9rem;
    font-weight: 400;
    letter-spacing: 2px;
    color: #6C757D;
    margin-top: 8px;
    text-transform: none;
    font-style: italic;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
    
    &::after {
      font-size: 0.8rem;
      letter-spacing: 1px;
    }
  }
`;

// Highlight the "Port" part with a different style
const LogoSpan = styled.span`
  display: inline-block;
  position: relative;
  
  .task {
    color: #3366FF;
  }
  
  .port {
    color: #3366FF;
    font-weight: 800;
    position: relative;
  }
  
  &::after {
    content: "";
    position: absolute;
    bottom: 5px;
    width: 40%;
    height: 4px;
    background-color: #3366FF;
    border-radius: 2px;
    animation: ${alternatingLineAnimation} 2s infinite;
    box-shadow: 0 0 8px rgba(51, 102, 255, 0.6);
  }
`;

const SplashScreen = ({ onFinished }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [quote, setQuote] = useState("");
  
  // Array of more casual and funny quotes
  const quotes = [
    "Procrastinating? Same here, but cooler.",
    "Like a to-do list but without the existential dread",
    "Your tasks think you're ghosting them",
    "Where productivity meets 'just one more episode'",
    "The responsible choice after spending 3 hours on Instagram Reels",
    "Task management for people who hate task management",
    "Finally, a reason to close those 47 browser tabs",
    "For people who write 'make to-do list' on their to-do list",
    "Because sticky notes on your monitor aren't cutting it anymore",
    "It's like a virtual assistant, minus the judgy attitude"
  ];
  
  useEffect(() => {
    // Pick a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);
  
  // Column heights (progressively increasing from left to right)
  const columnHeights = [30, 45, 60, 85];
  
  // Generate animations for each column
  const columnAnimations = columnHeights.map(height => 
    createColumnGrowthAnimation(height)
  );
  
  useEffect(() => {    
    // Set timeout for splash screen dismissal
    const timer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(() => {
        if (onFinished) onFinished();
      }, 500);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [onFinished]);
  
  return (
    <SplashContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: showSplash ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <GraphContainer>
        <ColumnsContainer>
          {/* Create columns with smooth growth animation */}
          {columnAnimations.map((animation, index) => (
            <Column 
              key={index}
              index={index}
              $animation={animation}
              $delay={`${index * 0.2}s`} 
            />
          ))}
        </ColumnsContainer>
      </GraphContainer>
      
      <Logo data-quote={quote}>
        <LogoSpan>
          <span className="task">Task</span>
          <span className="port">Port</span>
        </LogoSpan>
      </Logo>
    </SplashContainer>
  );
};

export default SplashScreen;