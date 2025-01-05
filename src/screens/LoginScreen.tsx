import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Portal, Dialog, Paragraph, Button as PaperButton } from "react-native-paper";
import Input from "../components/Input";
import Button from "../components/Button";
import { login } from "../services/api";
import { setAuthToken } from "../utils/auth";
import { AuthResponse, ApiError } from "../types";

type RootStackParamList = {
  MainTabs: undefined;
  Register: undefined;
};

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setDialogMessage("Harap isi semua kolom!");
      setVisible(true);
      return;
    }

    setLoading(true);
    try {
      const response = (await login(username, password)) as AuthResponse;
      await setAuthToken(response.data.token);
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (error: any) {
      const apiError = error as ApiError;
      const errorMessage = apiError.data?.message || "Terjadi kesalahan!";
      const errors = apiError.data?.errors;
      const passwordError = errors?.password;
      const usernameError = errors?.username;
      setDialogMessage(
        passwordError
          ? `${errorMessage}: ${passwordError}`
          : usernameError
          ? `${errorMessage}: ${usernameError}`
          : errorMessage
      );
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://source.unsplash.com/1080x1920/?technology,neon,abstract",
      }}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>PELACAK BUKU</Text>
        </View>
        <Text style={styles.title}>Selamat Datang</Text>
        <Text style={styles.subtitle}>Masuk untuk melanjutkan</Text>
        <Input
          placeholder="Nama Pengguna"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#eeeeee"
          style={styles.input}
        />
        <Input
          placeholder="Kata Sandi"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#eeeeee"
          style={styles.input}
        />
        <Button
          title={loading ? "Sedang Masuk..." : "MASUK"}
          onPress={handleLogin}
          disabled={loading}
          style={styles.button}
        />
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerText}>
            Belum punya akun?{" "}
            <Text style={styles.registerHighlight}>Daftar di sini</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Kesalahan</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{dialogMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton onPress={() => setVisible(false)}>OK</PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 50, 0.8)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 50,
    elevation: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e88e5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "300",
    color: "#cccccc",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#ffffff",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  button: {
    width: "100%",
    backgroundColor: "#1e88e5",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  registerLink: {
    marginTop: 24,
  },
  registerText: {
    fontSize: 15,
    color: "#cccccc",
    textAlign: "center",
  },
  registerHighlight: {
    color: "#1e88e5",
    fontWeight: "bold",
  },
});

export default LoginScreen;
