import React, { useState, useContext } from 'react';
import { Image, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import Icon from '../components/ui/Icon';
import { FitnessItems } from '../context/FitnessContext';

const FitScreen = ({ exercises, onComplete, onNext }) => {
  const [index, setIndex] = useState(0);
  const exercise = exercises;
  const current = exercise[index];
  const { completed, setCompleted, calories, setCalories, minutes, setMinutes, workout, setWorkout } = useContext(FitnessItems);

  const handleDone = () => {
    // Mark exercise as completed
    setCompleted([...completed, current?.name]);
    setWorkout(workout + 1);
    setMinutes(minutes + 2.5);
    setCalories(calories + 6.3);

    // Check if it's the last exercise
    if (index + 1 >= exercise.length) {
      // Workout complete
      setTimeout(() => {
        onComplete?.();
      }, 500);
    } else {
      // Move to next exercise (will navigate to rest screen)
      setTimeout(() => {
        setIndex(index + 1);
        onNext?.();
      }, 500);
    }
  };

  const handleSkip = () => {
    if (index + 1 >= exercise.length) {
      onComplete?.();
    } else {
      setTimeout(() => {
        setIndex(index + 1);
        onNext?.();
      }, 200);
    }
  };

  const handlePrevious = () => {
    if (index > 0) {
      setTimeout(() => {
        setIndex(index - 1);
        onNext?.(); // This will navigate to rest screen
      }, 200);
    }
  };

  if (!current) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <Image 
        style={{ width: "100%", height: 400 }} 
        source={{ uri: current?.image }} 
        resizeMode="cover"
      />

      <Text className="text-white text-center text-3xl font-bold mt-8">
        {current?.name}
      </Text>

      <Text className="text-teal-400 text-center text-5xl font-bold mt-4">
        x{current?.sets}
      </Text>

      {/* Exercise counter */}
      <Text className="text-slate-400 text-center text-sm mt-4">
        {index + 1} / {exercise.length}
      </Text>

      {/* Done Button */}
      {index + 1 >= exercise.length ? (
        <TouchableOpacity 
          onPress={handleDone} 
          className="bg-teal-500 mx-auto mt-12 rounded-3xl px-10 py-4 w-5/6"
        >
          <View className="flex-row items-center justify-center gap-2">
            <Icon name="CheckCircle" size={24} color="white" />
            <Text className="text-white font-bold text-xl">DONE</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={handleDone} 
          className="bg-teal-500 mx-auto mt-12 rounded-3xl px-10 py-4 w-5/6"
        >
          <View className="flex-row items-center justify-center gap-2">
            <Icon name="CheckCircle" size={24} color="white" />
            <Text className="text-white font-bold text-xl">DONE</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Previous and Skip Buttons */}
      <View className="flex-row items-center justify-center gap-4 mt-6 px-5">
        <TouchableOpacity 
          disabled={index === 0} 
          onPress={handlePrevious} 
          className={`rounded-3xl px-6 py-3 ${index === 0 ? 'opacity-50' : ''}`}
        >
          <View className="flex-row items-center gap-2">
            <Icon name="ChevronLeft" size={22} color={index === 0 ? "#64748B" : "#94A3B8"} />
            <Text className={`font-bold text-lg ${index === 0 ? 'text-slate-500' : 'text-slate-300'}`}>
              PREV
            </Text>
          </View>
        </TouchableOpacity>

        {index + 1 >= exercise.length ? (
          <TouchableOpacity 
            onPress={onComplete}
            className="rounded-3xl px-6 py-3"
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-slate-300 font-bold text-lg">SKIP</Text>
              <Icon name="ChevronRight" size={22} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={handleSkip}
            className="rounded-3xl px-6 py-3"
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-slate-300 font-bold text-lg">SKIP</Text>
              <Icon name="ChevronRight" size={22} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FitScreen;

