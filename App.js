import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { theme } from "./colors";

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
  const addToDo = useCallback(() => {
    if (text === "") {
      return;
    }
    setText("");
    const newTodos = Object.assign(
      {},
      {
        [Date.now()]: { text, work: working },
      },
      toDos
    );
    setToDos(newTodos);
  }, [text]);
  useEffect(() => {
    console.log("toDos", toDos);
  }, [toDos]);
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
                <View style={styles.toDo}>
                  <Text style={styles.toDoText} key={key}>
                    {toDos[key].text}
                  </Text>
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
    marginVertical: 10,
    fontSize: 18,
  },
  toDo: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    borderRadius: 15,
  },
  toDoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
  },
});
