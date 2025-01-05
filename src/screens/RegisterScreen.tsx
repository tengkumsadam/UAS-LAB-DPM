import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Portal, Dialog, Paragraph, Button as PaperButton } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { register } from "../services/api";
import { RootStackParamList } from "../types";

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register(username, password, email);
      setDialogMessage("Pendaftaran berhasil! Silakan masuk.");
      setVisible(true);
    } catch (error: any) {
      setDialogMessage("Pendaftaran gagal. Silakan coba lagi.");
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogDismiss = () => {
    setVisible(false);
    if (dialogMessage.includes("berhasil")) {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://source.unsplash.com/800x800/?abstract,technology",
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>DAFTAR SEKARANG</Text>
        <Text style={styles.subtitle}>Buat akun Anda dan mulai eksplorasi</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Nama Pengguna"
          placeholderTextColor="#CCCCCC"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#CCCCCC"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Kata Sandi"
          placeholderTextColor="#CCCCCC"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "MEMPROSES..." : "DAFTAR"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>
            Sudah punya akun?{" "}
            <Text style={styles.loginHighlight}>Masuk di sini</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Portal>
        <Dialog visible={visible} onDismiss={handleDialogDismiss}>
          <Dialog.Title style={styles.dialogTitle}>
            {dialogMessage.includes("berhasil") ? "Sukses" : "Gagal"}
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogContent}>{dialogMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton
              onPress={handleDialogDismiss}
              labelStyle={styles.dialogButton}
            >
              OK
            </PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D", 
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F0A500", 
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
    marginTop: 10,
  },
  formContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: "#1A1A1A", 
    color: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333333", 
  },
  button: {
    backgroundColor: "#F0A500", 
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#A67C00", 
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  loginHighlight: {
    color: "#F0A500", 
    fontWeight: "bold",
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F0A500", 
  },
  dialogContent: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  dialogButton: {
    color: "#F0A500",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
