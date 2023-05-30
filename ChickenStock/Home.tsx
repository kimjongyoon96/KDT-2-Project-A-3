import React from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  Detail: undefined;
  Main: undefined;
};
type DetailPageNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Detail'
>;

const MainPage = () => {
  const navigation = useNavigation<DetailPageNavigationProp>();
  return (
    <Button
      title="메인 페이지 가기"
      onPress={() => navigation.navigate('Main')}
    />
  );
};

// const HomeScreen = () => {
//   const navigation = useNavigation();

//   const handlePress = () => {
//     navigation.navigate('MainScreen');
//   };

//   return (
//     <Button title="Go to MainScreen" onPress={handlePress} />
//   );
// };

export default MainPage;