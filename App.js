
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Image, Pressable, Platform } from "react-native";
import { Audio } from "expo-av";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

const STREAM_URL = Constants?.expoConfig?.extra?.streamUrl;

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState(null);
  const soundRef = useRef(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      playsInSilentModeIOS: true
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  const togglePlay = async () => {
    try {
      if (!soundRef.current) {
        setIsBuffering(true);
        const { sound } = await Audio.Sound.createAsync(
          { uri: STREAM_URL },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        setIsPlaying(true);
        setIsBuffering(false);
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
      } else {
        setIsBuffering(true);
        await soundRef.current.loadAsync({ uri: STREAM_URL }, { shouldPlay: true });
        setIsPlaying(true);
        setIsBuffering(false);
      }
    } catch (e) {
      setError(String(e));
      setIsBuffering(false);
      setIsPlaying(false);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if ("isBuffering" in status) setIsBuffering(status.isBuffering);
    if ("error" in status && status.error) setError(status.error);
  };

  const stop = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setIsPlaying(false);
      }
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Image source={require("./assets/icon-1024.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Radio MyBestseller</Text>
      <Text style={styles.subtitle}>Live</Text>

      <View style={styles.controls}>
        <Pressable style={[styles.button, isPlaying ? styles.pause : styles.play]} onPress={togglePlay}>
          <Text style={styles.buttonText}>{isPlaying ? "Pauză" : (isBuffering ? "Se încarcă..." : "Redă")}</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.stop]} onPress={stop}>
          <Text style={styles.buttonText}>Stop</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>Eroare: {error}</Text> : null}
      <Text style={styles.footer}>Rulează în background. {Platform.OS === "ios" ? "Activează volumul chiar și pe silent." : ""}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  logo: { width: 160, height: 160, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 16, opacity: 0.7, marginBottom: 24 },
  controls: { flexDirection: "row", gap: 12, marginTop: 8 },
  button: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 999, minWidth: 120, alignItems: "center" },
  play: { backgroundColor: "#e74c3c" },
  pause: { backgroundColor: "#f39c12" },
  stop: { backgroundColor: "#7f8c8d" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  error: { marginTop: 16, color: "#c0392b", textAlign: "center" },
  footer: { position: "absolute", bottom: 24, opacity: 0.6 }
});
