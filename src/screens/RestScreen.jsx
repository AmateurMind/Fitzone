import React, { useEffect, useState } from 'react';
import { Image, Text, SafeAreaView } from 'react-native';
import Icon from '../components/ui/Icon';

const RestScreen = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop",
        }}
        style={{ width: "100%", height: 420 }}
        resizeMode="cover"
        className="rounded-b-3xl"
      />

      <Text className="text-white text-center text-3xl font-black mt-12">
        TAKE A BREAK!
      </Text>

      <View className="items-center mt-12">
        <View className="w-32 h-32 rounded-full border-4 border-teal-500 items-center justify-center bg-slate-800/50">
          <Icon name="Clock" size={40} color="#14B8A6" />
          <Text className="text-teal-400 text-5xl font-black mt-2">{timeLeft}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RestScreen;

