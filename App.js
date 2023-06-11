import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
const STORAGE_KEY = "@toDos";
export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const work = useCallback(() => {
    setWorking(true);
  }, []);
  const travel = useCallback(() => {
    setWorking(false);
  }, []);
  const onChangeText = useCallback((payload) => {
    setText(payload);
  }, []);
  const saveTodos = useCallback(async (toSave) => {
    const s = JSON.stringify(toSave);
    await AsyncStorage.setItem(STORAGE_KEY, s);
  }, []);
  const loadToDos = useCallback(async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (s) {
      setToDos(JSON.parse(s));
    }
  }, []);
  const addToDo = useCallback(async () => {
    if (text === "") {
      return;
    }
    const newTodos = Object.assign(
      {},
      {
        [Date.now()]: { text, work: working },
      },
      toDos
    );
    saveTodos(newTodos);
    setToDos(newTodos);
    setText("");
  }, [text]);
  useEffect(() => {
    loadToDos();
  }, []);
  const deleteTodo = useCallback(
    (key) => {
      Alert.alert("Delete To Do", "Are you sure?", [
        { text: "Cancel" },
        {
          text: "I'm Sure",
          onPress: () => {
            const newTodos = { ...toDos };
            delete newTodos[key];
            saveTodos(newTodos);
            setToDos(newTodos);
          },
        },
      ]);
      return;
    },
    [toDos]
  );
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              ...(working && styles.btnTextActive),
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              ...(!working && styles.btnTextActive),
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onChangeText={onChangeText}
          onSubmitEditing={addToDo}
          autoCapitalize={"none"}
          returnKeyType="done"
          value={text}
          style={styles.input}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        />
      </View>
      <ScrollView>
        {toDos &&
          Object.keys(toDos).map((key) => {
            if (working === toDos[key].work) {
              return (
                <View style={styles.toDo} key={key}>
                  <Text style={styles.toDoText}>{toDos[key].text}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      deleteTodo(key);
                    }}
                  >
                    <Fontisto name="trash" size={18} color={theme.gray} />
                  </TouchableOpacity>
                </View>
              );
            }
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: 600,
    color: theme.gray,
  },
  btnTextActive: {
    color: theme.white,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 500,
  },
});
