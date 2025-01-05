import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
}

const BookListScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookGenre, setBookGenre] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token ? `Bearer ${token}` : '';
    } catch (error) {
      console.error('Error getting token:', error);
      return '';
    }
  };

  const fetchBooks = async () => {
    const token = await getAuthToken();
    try {
      const response = await fetch('https://backendbooktrack-production.up.railway.app/api/books', {
        headers: {
          Authorization: token,
        },
      });
      const result = await response.json();
      if (result.data) {
        setBooks(result.data);
      } else {
        Alert.alert('Failed to fetch books');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error fetching books');
    }
  };

  const handleAddOrUpdateBook = async () => {
    if (!bookTitle || !bookAuthor || !bookGenre || !bookDescription) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    const token = await getAuthToken();
    const url = editingBook
      ? `https://backendbooktrack-production.up.railway.app/api/books/${editingBook._id}`
      : 'https://backendbooktrack-production.up.railway.app/api/books';

    try {
      const response = await fetch(url, {
        method: editingBook ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          title: bookTitle,
          author: bookAuthor,
          genre: bookGenre,
          description: bookDescription,
        }),
      });

      const newBook = await response.json();
      if (newBook && newBook.data && newBook.data._id) {
        if (editingBook) {
          setBooks((prevBooks) =>
            prevBooks.map((book) => (book._id === newBook.data._id ? newBook.data : book))
          );
        } else {
          setBooks((prevBooks) => [...prevBooks, newBook.data]);
        }
        resetForm();
        setModalVisible(false);
        Alert.alert(
          editingBook ? 'Updated' : 'Added',
          `Book ${editingBook ? 'updated' : 'added'} successfully!`
        );
      } else {
        Alert.alert('Failed to add or update book. Please try again.');
      }
    } catch (error) {
      console.error('Error adding/updating book:', error);
      Alert.alert('An error occurred while adding/updating the book.');
    }
  };

  const handleDeleteBook = async (_id: string) => {
    const token = await getAuthToken();
    try {
      await fetch(`https://backendbooktrack-production.up.railway.app/api/books/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== _id));
    } catch (error) {
      console.error(error);
      Alert.alert('An error occurred while deleting the book.');
    }
  };

  const resetForm = () => {
    setEditingBook(null);
    setBookTitle('');
    setBookAuthor('');
    setBookGenre('');
    setBookDescription('');
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setBookTitle(book.title);
    setBookAuthor(book.author);
    setBookGenre(book.genre);
    setBookDescription(book.description);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>{item.author}</Text>
            <Text style={styles.bookGenre}>{item.genre}</Text>
            <Text style={styles.bookDescription}>{item.description}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonEdit} onPress={() => handleEditBook(item)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonDelete} onPress={() => handleDeleteBook(item._id)}>
                <Text style={styles.buttonText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Judul Buku"
              placeholderTextColor="#8F8F8F"
              value={bookTitle}
              onChangeText={setBookTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Author"
              placeholderTextColor="#8F8F8F"
              value={bookAuthor}
              onChangeText={setBookAuthor}
            />
            <TextInput
              style={styles.input}
              placeholder="Genre"
              placeholderTextColor="#8F8F8F"
              value={bookGenre}
              onChangeText={setBookGenre}
            />
            <TextInput
              style={styles.input}
              placeholder="Deskripsi"
              placeholderTextColor="#8F8F8F"
              value={bookDescription}
              onChangeText={setBookDescription}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddOrUpdateBook}>
              <Text style={styles.buttonText}>{editingBook ? 'Perbarui Buku' : 'Tambah Buku'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2', 
  },
  addButton: {
    backgroundColor: '#007BFF', 
    width: 60,
    height: 60,
    marginTop: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  addButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF5733',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    fontSize: 16,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
  },
  button: {
    backgroundColor: '#28A745',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bookItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#555',
  },
  bookGenre: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  bookDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonEdit: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  buttonDelete: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F44336',
  },
});

export default BookListScreen;
