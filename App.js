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
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
const STORAGE_KEY = "@toDos";
const STORAGE_KEY2 = "@working";
export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const work = useCallback(async () => {
    setWorking(true);
    saveCurrent(true);
  }, []);
  const travel = useCallback(async () => {
    setWorking(false);
    saveCurrent(false);
  }, []);
  const onChangeText = useCallback((payload) => {
    setText(payload);
  }, []);
  const saveTodos = useCallback(async (toSave) => {
    const s = JSON.stringify(toSave);
    await AsyncStorage.setItem(STORAGE_KEY, s);
  }, []);
  const saveCurrent = useCallback(async (working) => {
    const s = JSON.stringify(working);
    await AsyncStorage.setItem(STORAGE_KEY2, s);
  }, []);
  const loadStorage = useCallback(async () => {
    const s1 = await AsyncStorage.getItem(STORAGE_KEY);
    const s2 = await AsyncStorage.getItem(STORAGE_KEY2);
    if (s1) {
      setToDos(JSON.parse(s1));
    }
    if (s2) {
      setWorking(JSON.parse(s2));
    }
  }, []);
  const addToDo = useCallback(async () => {
    if (text === "") {
      return;
    }
    const newTodos = Object.assign(
      {},
      {
        [Date.now()]: { text, work: working, completed: false },
      },
      toDos
    );
    saveTodos(newTodos);
    setToDos(newTodos);
    setText("");
  }, [text]);
  useEffect(() => {
    loadStorage();
  }, []);

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
                <Item
                  item={toDos[key]}
                  key={key}
                  keyNum={key}
                  toDos={toDos}
                  saveTodos={saveTodos}
                  setToDos={setToDos}
                />
              );
            }
          })}
      </ScrollView>
    </View>
  );
}
const Item = ({ item, keyNum: key, toDos, saveTodos, setToDos }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [changeTxt, setChangeText] = useState("");
  const btnEdit = useCallback(() => {
    if (isEdit) {
      Alert.alert("Change Todo?", "Are you sure?", [
        { text: "Cancel" },
        {
          text: "I'm sure",
          onPress: () => {
            const newTodos = { ...toDos };
            newTodos[key].text = changeTxt;
            saveTodos(newTodos);
            setToDos(newTodos);
            setIsEdit((prev) => !prev);
          },
        },
      ]);
    } else {
      setIsEdit((prev) => !prev);
    }
  }, [isEdit, changeTxt]);
  const completeTodo = useCallback(
    (key) => {
      Alert.alert(
        item.completed ? "Uncomplete To Do" : "Complete To Do",
        "Are you sure?",
        [
          { text: "Cancel" },
          {
            text: "I'm Sure",
            onPress: () => {
              const newTodos = { ...toDos };
              newTodos[key].completed = !newTodos[key].completed;
              saveTodos(newTodos);
              setToDos(newTodos);
            },
          },
        ]
      );
    },
    [toDos]
  );
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
    },
    [toDos]
  );
  const onChangeText = useCallback((e) => {
    setChangeText(e);
  }, []);
  useEffect(() => {
    setChangeText(item.text);
  }, [isEdit]);
  return (
    <View style={styles.toDo} key={key}>
      <View style={styles.todoCont}>
        {isEdit ? (
          <TextInput
            placeholder="Write And Save"
            placeholderTextColor={"#fff"}
            style={styles.itemInput}
            value={changeTxt}
            onChangeText={onChangeText}
          />
        ) : (
          <Text style={styles.toDoText}>{item.text}</Text>
        )}
      </View>
      <View style={styles.todoBtn}>
        <TouchableOpacity onPress={btnEdit}>
          <FontAwesome name="edit" size={18} color={theme.gray} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            completeTodo(key);
          }}
        >
          <FontAwesome
            name="check"
            size={18}
            color={item.completed ? theme.green : theme.gray}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            deleteTodo(key);
          }}
        >
          <FontAwesome name="trash" size={18} color={theme.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
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
  todoCont: {
    flexGrow: 1,
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
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 500,
  },
  todoBtn: {
    flexDirection: "row",
    gap: 10,
  },
  itemInput: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 3,
    fontSize: 16,
  },
});
