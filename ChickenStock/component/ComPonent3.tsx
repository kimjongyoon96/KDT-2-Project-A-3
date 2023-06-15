import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

type Component2Props = {
  company_name: string;
  company_code: string;
};

const ComPonent3: React.FC<Component2Props> = ({ company_name, company_code }) => {
  console.log('com3')
  console.log(company_name, company_code)
  const [upAndDown, setCompany] = useState({
    시가: '',
    오늘최고가: '',
    오늘최저가: '',
    현재가: '',
    시가총액: '',
  });

  useEffect(() => {
    fetch('http://10.0.2.2:5000/companyupdown')
      .then(response => response.json())
      .then(data => {
        setCompany(data);
        console.log(data);
      })
      .catch(error => console.error(error));
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>시가: {upAndDown['시가']}</Text>
      <Text style={styles.text}>오늘최고가: {upAndDown['오늘최고가']}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.text}>오늘최저가: {upAndDown['오늘최저가']}</Text>
        <Text style={styles.text}>현재가: {upAndDown['현재가']}</Text>
        <Text style={styles.text}>시가총액: {upAndDown['시가총액']}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 50,
    backgroundColor: 'pink',
  },
  text: {
    fontSize: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ComPonent3;
