import React from 'react';
import { TimerProvider } from './context/TimerContext';
import JLPTTimer from './components/JLPTTimer';

function App() {
  return (
    <TimerProvider>
      <JLPTTimer />
    </TimerProvider>
  );
}

export default App;
