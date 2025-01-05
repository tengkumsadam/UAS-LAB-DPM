import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getAuthToken, removeAuthToken } from '../utils/auth';
import { fetchUserProfile } from '../services/api';
import { RootStackParamList, User } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false); 
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = await getAuthToken();
      if (token) {
        try {
          const profileData = await fetchUserProfile();
          setUser(profileData as User);
          setUsername(profileData.username);
          setEmail(profileData.email);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
      setLoading(false);
    };

    loadUserProfile();
  }, []);

  const handleLogout = async () => {
    await removeAuthToken();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (user) {
      setUser({ ...user, username, email });
    }
    setEditModalVisible(false);
  };

  const handleCancelLogout = () => {
    setConfirmLogoutVisible(false); 
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No user data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header and Settings Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setConfirmLogoutVisible(true)} 
        >
          <Ionicons name="log-out-outline" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View style={styles.profileCard}>
        <View style={styles.profileField}>
          <Text style={styles.profileLabel}>Username</Text>
          <Text style={styles.profileValue}>{user.username}</Text>
        </View>
        <View style={styles.profileField}>
          <Text style={styles.profileLabel}>Email</Text>
          <Text style={styles.profileValue}>{user.email}</Text>
        </View>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={handleEditProfile}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            {/* Input Fields */}
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor="#AAA"
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#AAA"
              keyboardType="email-address"
            />

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveProfile}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={confirmLogoutVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancelLogout}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apakah Kamu Yakin Ingin Keluar?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText}>Iya</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={handleCancelLogout}
              >
                <Text style={styles.modalButtonText}>Tidak</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  logoutButton: {
    backgroundColor: '#FF6347', 
    padding: 12,
    borderRadius: 50,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileField: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#777',
  },
  profileValue: {
    fontSize: 18,
    color: '#333',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#F1F1F1',
    padding: 12,
    borderRadius: 8,
    color: '#333',
    marginBottom: 20,
    borderColor: '#DDD',
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
  closeButton: {
    backgroundColor: '#888',
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default ProfileScreen;
