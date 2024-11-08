// App.tsx

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Button, ListItem, Text } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import 'react-native-get-random-values'; // Required for UUID
import { v4 as uuidv4 } from 'uuid';

interface Counter {
  id: string;
  title: string;
  note: string;
  count: number;
}

const App = () => {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    loadCounters();
  }, []);

  useEffect(() => {
    saveCounters();
  }, [counters]);

  const loadCounters = async () => {
    try {
      const countersData = await AsyncStorage.getItem('counters');
      if (countersData) {
        setCounters(JSON.parse(countersData));
      }
    } catch (error) {
      console.error('Failed to load counters:', error);
    }
  };

  const saveCounters = async () => {
    try {
      await AsyncStorage.setItem('counters', JSON.stringify(counters));
    } catch (error) {
      console.error('Failed to save counters:', error);
    }
  };

  const addCounter = () => {
    if (title.trim() && note.trim()) {
      const newCounter: Counter = {
        id: uuidv4(),
        title: title.trim(),
        note: note.trim(),
        count: 0,
      };
      setCounters([...counters, newCounter]);
      setTitle('');
      setNote('');
    } else {
      Alert.alert('Validation', 'Please enter both title and note.');
    }
  };

  const incrementCounter = (id: string) => {
    setCounters(
      counters.map(counter =>
        counter.id === id
          ? { ...counter, count: counter.count + 1 }
          : counter
      )
    );
  };

  const deleteCounter = (id: string) => {
    setCounters(counters.filter(counter => counter.id !== id));
  };

  const renderItem = (data: { item: Counter }) => (
    <ListItem
      bottomDivider
      onPress={() => incrementCounter(data.item.id)}
      containerStyle={styles.listItem}
    >
      <ListItem.Content>
        <ListItem.Title style={styles.counterTitle}>
          {data.item.title}
        </ListItem.Title>
        <ListItem.Subtitle style={styles.counterNote}>
          {data.item.note}
        </ListItem.Subtitle>
      </ListItem.Content>
      <View style={styles.counterContainer}>
        <Text style={styles.counterCount}>{data.item.count}</Text>
      </View>
    </ListItem>
  );

  const renderHiddenItem = (data: { item: Counter }) => (
    <View style={styles.hiddenItem}>
      <Button
        title="Delete"
        onPress={() => deleteCounter(data.item.id)}
        buttonStyle={styles.deleteButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text h3>Affirmation Counters</Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Enter Title"
          value={title}
          onChangeText={text => setTitle(text)}
          autoCapitalize="sentences"
        />
        <Input
          placeholder="Enter Note"
          value={note}
          onChangeText={text => setNote(text)}
          multiline
          autoCapitalize="sentences"
        />
        <Button
          title="Add Counter"
          onPress={addCounter}
          buttonStyle={styles.addButton}
        />
      </View>
      <SwipeListView
        data={counters}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        disableRightSwipe
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { alignItems: 'center', marginVertical: 10 },
  inputContainer: { paddingHorizontal: 10 },
  addButton: { backgroundColor: '#007AFF', marginHorizontal: 10 },
  list: { marginTop: 10 },
  listItem: {
    backgroundColor: '#E9F7FE',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  counterTitle: { fontWeight: 'bold', fontSize: 18 },
  counterNote: { color: 'gray', fontSize: 16 },
  counterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  counterCount: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  hiddenItem: {
    alignItems: 'flex-end',
    backgroundColor: '#E9F7FE',
    flex: 1,
    justifyContent: 'center',
    paddingRight: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 75,
    height: '100%',
    borderRadius: 0,
  },
});

export default App;
