import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import FitScreen from './FitScreen';
import RestScreen from './RestScreen';
import { FitnessItems } from '../context/FitnessContext';

const WorkoutExecutionScreen = ({ exercises, onComplete }) => {
  const [showRest, setShowRest] = useState(false);
  const { setCompleted } = useContext(FitnessItems);

  const handleNext = () => {
    setShowRest(true);
  };

  const handleRestComplete = () => {
    setShowRest(false);
  };

  const handleWorkoutComplete = () => {
    onComplete?.();
  };

  if (showRest) {
    return <RestScreen onComplete={handleRestComplete} />;
  }

  return (
    <FitScreen
      exercises={exercises}
      onComplete={handleWorkoutComplete}
      onNext={handleNext}
    />
  );
};

export default WorkoutExecutionScreen;

