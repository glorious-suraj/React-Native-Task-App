import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'https://indovisionservices.in/info/dev/v15/hrms_api/v7/api/Testing/getData',
          new URLSearchParams({ key: '001', user_id: 'EMP001' }).toString(),
          {
            headers: {
              token: '1234567890',
              Cookie: 'ci_session=16455dd221af18aeb1f83ba8ed73c723b09ce53f',
            },
            timeout: 5000,
          }
        );
        setData(response.data.post || []);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Image source={{ uri: item.contained }} style={styles.image} />
      </View>
      <View style={styles.cardDetails}>
        <View style={styles.row}>
          <Image source={{ uri: item.profile }} style={styles.profileImage} />
          <Text style={styles.handle}>{item.handle}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </View>
  );

  const renderSection = ({ item: [tag, items], index }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{tag}</Text>
      <FlatList
        horizontal
        data={items}
        renderItem={renderCard}
        keyExtractor={(item, index) => `${item.handle}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      />
      {index < data.length - 1 && <View style={styles.separatorLine} />}
    </View>
  );

  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.tag_tax]) acc[item.tag_tax] = [];
    acc[item.tag_tax].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={Object.entries(groupedData)}
      renderItem={renderSection}
      keyExtractor={(item, index) => `${item[0]}-${index}`}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    padding: 15,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  horizontalScroll: {
    paddingHorizontal: 5,
  },
  cardContainer: {
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardDetails: {
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  handle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'lightgray',
  },
  title: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
  },
  separatorLine: {
    height: 1,
    backgroundColor: 'black',
    marginTop: 25,
  },
});

export default App;
