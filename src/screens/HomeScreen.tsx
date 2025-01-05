import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Selamat Datang di Pelacak Buku</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.subtitleText}>
          Nikmati perjalanan Anda melalui dunia buku yang penuh cerita dan pengetahuan.
        </Text>
        <Text style={styles.subtitleText}>
          Temukan buku favorit Anda dan lacak kemajuan bacaan Anda. Semoga Anda menikmati setiap halaman!
        </Text>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          "Buku adalah teman terbaik dalam perjalanan hidup." - Tengku Muhammad Sadam
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E90FF',
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff', 
    textAlign: 'center',
    fontFamily: 'Roboto', 
  },
  contentContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: 18,
    color: '#E0E0E0', 
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
    fontFamily: 'Roboto', 
  },
  footerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#ffffff', 
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: 'Roboto', 
  },
});

export default HomeScreen;
