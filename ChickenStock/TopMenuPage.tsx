import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';

import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {io, Socket} from 'socket.io-client';

type RootStackParamList = {
  ChoicePageOne: undefined;
  ChoicePageTwo: undefined;
  ChoicePageThree: undefined;
  ChoicePageFour: undefined;
  MainPage: undefined;
  Another: undefined;
  SignUpPage: undefined;
  LoginPage: undefined;
  MyPage: undefined;
};

type ChoicePageOneNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChoicePageTwo'
>;
type ChoicePageOneRouteProp = RouteProp<RootStackParamList, 'ChoicePageTwo'>;

interface Message {
  content: string;
  sender: string;
}

const TopMenuPage = () => {
  const navigation = useNavigation<ChoicePageOneNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPress, setSearchPress] = useState(false);
  const [searchRes, setSearchRes] = useState(null)
  console.log("press0101: ", searchPress)

  const openModal = () => {
    setModalVisible(true);
    console.log('change1', modalVisible);
    setSocket(io('http://10.0.2.2:5000'));
  };

  const closeModal = () => {
    setModalVisible(false);
    console.log('change2', modalVisible);
    if (socket) {
      socket.disconnect(); // Close socket connection when modal is closed
      setSocket(null);
    }
  };

  const handleOverlayPress = () => {
    closeModal();
    // 모달 이외의 영역을 터치했을 때 수행할 동작을 추가할 수 있습니다.
  };

  const goToChoicePage = () => {
    navigation.navigate('MyPage');
  };

  const handleSend = () => {
    if (socket) {
      console.log('Sending message:', message);
      socket.emit('message', message);
      const userMessage: Message = {
        content: message,
        sender: 'user',
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
    }
    setMessage('');
  };

  useEffect(() => {
    if (socket) {
      socket.on('response', data => {
        console.log(data);
        let responseData = {
          content: data['content'],
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, responseData]);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
    }
    return () => {
      if (socket) {
        socket.off('response'); // 이벤트 핸들러 해제
      }
    };
  }, [socket]);

  // 검색창 관련
  useEffect(() => {
    console.log('test search', searchTerm)
    // 검색 버튼이 눌렸을 경우 동작 할 코드
    if (searchPress) {
      console.log('searchPress가 true')
      search_stock();
      setSearchPress(false)
    }
    // 1. Textinput에 적힌 기업 이름을 서버에 보냄
    // 2. 서버는 들어온 요청 데이터를 보고 API와 통신하여 해당 기업을 찾아서 응답
    // 3. 응답 받은 데이터를 이용해 View 태그를 추가로 만들어냄
  }, [searchPress])

  const closeSearch = () => {
    setSearchVisible(false);
  }

  const openSearch = () => {
    setSearchVisible(true);
  }

  const handleSearchOverlayPress = () => {
    closeSearch();
    setSearchRes(null)
  }

  const handleSearch = () => {
    console.log('search : ', searchTerm);
    setSearchPress(true)
  }

  const search_stock = async() => {
    console.log('search_stock 함수 실행 됨');
    const data = searchTerm;
    console.log('data', data)
    try {
      const search_req = await fetch('http://10.0.2.2:5000/search_stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const search_res = await search_req.json();
      console.log('검색 결과 응답: ', search_res);
      setSearchRes(search_res);
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <View>
      <View style={styles.icon_box}>
        <TouchableOpacity onPress={openSearch}>
          <Image
            source={require('./resource/Icon_search.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToChoicePage}>
          <Image
            source={require('./resource/Icon_cart.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={openModal}>
          <Image
            source={require('./resource/Icon_AI_chat_bot.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View>
      <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={closeModal}>
          <TouchableWithoutFeedback onPress={handleOverlayPress}>
            <View style={styles.modalBackdrop}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                  <Text style={styles.chatTitle}>
                    주식 용어에 대해서 물어보세요!
                  </Text>
                  <View style={styles.chatContainer}>
                    <ScrollView
                      contentContainerStyle={styles.chatContent}
                      showsVerticalScrollIndicator={false}
                      ref={scrollViewRef}>
                      {messages.map((msg, index) => {
                        const key = `${msg.content}-${msg.sender}`;
                        return (
                          <View
                            style={[
                              styles.chatBox,
                              msg.sender === 'user'
                                ? styles.userMessage
                                : styles.botMessage,
                            ]}
                            key={key}>
                            <Text style={styles.chatText}>{msg.content}</Text>
                          </View>
                        );
                      })}
                    </ScrollView>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="메시지를 입력하세요"
                        value={message}
                        onChangeText={setMessage}
                      />
                      <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSend}>
                        <Text style={styles.sendButtonText}>Send</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      {/* 검색 모달 창 */}
      <View>
        <Modal
        visible={searchVisible}
        transparent={true}
        onRequestClose={closeSearch}>
          <TouchableWithoutFeedback onPress={handleSearchOverlayPress}>
            <View style={styles.searchModalBackdrop}>
              <TouchableWithoutFeedback>
                <View style={styles.searchModalContent}>
                  <TouchableOpacity
                    onPress={closeSearch}
                    style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style = {styles.searchInput}
                      onChangeText={(text) => setSearchTerm(text)}
                      placeholder = '종목 명을 입력하세요'
                    />
                    <TouchableOpacity
                      style={styles.searchButton}
                      onPress={handleSearch}>
                      <Text>검색</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    {/* 검색 결과 출력 */}
                    {searchRes && (
                      <Text>{searchRes}</Text>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon_box: {
    width: '100%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#E8F6EF',
    width: '80%',
    height: '80%',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: '15%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchModalContent: {
    backgroundColor: '#E8F6EF',
    width: '80%',
    height: '80%',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  closeButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4C4C6D',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    alignItems: 'flex-end',
    marginBottom: 10,
    flexGrow: 1,
    paddingBottom: 8,
  },
  chatBox: {
    minWidth: 50,
    marginTop: 10,
    padding: 10,
    borderColor: '#4C4C6D',
    borderWidth: 2,
    borderRadius: 5,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatText: {
    fontSize: 15,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  searchInput: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    backgroundColor: '#ffffff'
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B9C85',
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userMessage: {
    backgroundColor: '#1B9C85',
  },
  botMessage: {
    backgroundColor: '#FFE194',
  },
});

export default TopMenuPage;
