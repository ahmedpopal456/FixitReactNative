import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Card, Title } from "react-native-paper";
import { Icon, Tag, Button } from "fixit-common-ui";
import axios from "axios";
import SearchTextInput from "../components/SearchTextInput";
import Carousel from "../components/carousel";
import { ScrollView } from "react-native-gesture-handler";

class HomeScreen extends React.Component<{ navigation: any }> {
  componentDidMount() {
    let suggestedTags = [""];
    axios
      .get("https://fixit-dev-fms-api.azurewebsites.net/api/tags/3")
      .then((res) => {
        var i;
        for (i = 0; i < res.data.length; i++) {
          suggestedTags.push(res.data[i].name);
        }
        if (i > -1) {
          suggestedTags.splice(0, 1);
        }
        this.setState({ suggestedTags });
      });
  }

  state = {
    titleFieldVisible: false,
    titleFieldTextVisible: true,
    tagSuggestionsVisible: false,
    suggestedTags: [""],
    tagInputText: "",
    tags: [""],
  };

  setTagInputText = (text: string): void => {
    this.setState({ tagInputText: text });
  };

  addTag = (): void => {
    const currentText = this.state.tagInputText;
    if (currentText && this.state.tags.indexOf(currentText) === -1) {
      this.setState((prevState: any) => ({
        tagInputText: "",
        tags: [...prevState.tags, currentText],
      }));
    }
  };

  removeTag = (tag: string): void => {
    const tagArr = this.state.tags;
    const index = tagArr.indexOf(tag);
    if (index > -1) {
      tagArr.splice(index, 1);
    }

    this.setState({
      tags: tagArr,
    });
  };

  showTagSuggestions = (): void => {
    this.setState({ tagSuggestionsVisible: true });
  };

  hideTagSuggestions = (): void => {
    this.setState({ tagSuggestionsVisible: false });
  };

  addSuggestedTagToTagList = (tag: string): void => {
    const suggestedTagArr = this.state.suggestedTags;
    const index = suggestedTagArr.indexOf(tag);
    if (index > -1) {
      suggestedTagArr.splice(index, 1);
    }

    this.setState({
      suggestedTags: suggestedTagArr,
    });

    this.setState((prevState: any) => ({
      suggestedTags: suggestedTagArr,
      tags: [...prevState.tags, tag],
    }));
  };
  render(): JSX.Element {
    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ height: "50%", backgroundColor: "#FFD14A" }}>
            <SafeAreaView>
              <Carousel
                images={[
                  "https://i.imgur.com/jfV0e1r.png?1",
                  "https://i.imgur.com/hnNt4Vl.png",
                ]}
              />
            </SafeAreaView>
            <View style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
              <View style={styles.content}>
                <Text>Most Popular Fixes</Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {this.state.suggestedTags.map((tag: any) =>
                    tag ? (
                      <View
                        key={tag}
                        style={{
                          flexGrow: 0,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => this.addSuggestedTagToTagList(tag)}
                          style={{
                            flexGrow: 0,
                            marginLeft: 5,
                            marginRight: -15,
                          }}
                        >
                          <Tag backgroundColor={"grey"} textColor={"light"}>
                            {tag}
                          </Tag>
                        </TouchableOpacity>
                      </View>
                    ) : null
                  )}
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{ position: "absolute", zIndex: -1, paddingTop: 10 }}
                  >
                    <SearchTextInput
                      onChange={(text: string) => this.setTagInputText(text)}
                      value={this.state.tagInputText}
                      placeholder="What needs Fixing?"
                      onFocus={() => this.showTagSuggestions()}
                      onSubmitEditing={this.addTag}
                    />
                  </View>
                  <View
                    style={{
                      paddingLeft: 280,
                      marginVertical: 13,
                      paddingBottom: 10,
                    }}
                  >
                    <Button
                      onPress={() => console.log("BUTTON TEMPLATE")}
                      color="primary"
                      width={50}
                      padding={0}
                    >
                      <Icon
                        library="Ionicons"
                        name="hammer-outline"
                        color="accent"
                      />
                    </Button>
                  </View>
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {this.state.tags.map((tag: any) =>
                    tag ? (
                      <View
                        key={tag}
                        style={{
                          flexGrow: 0,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: 10,
                          marginTop: 2,
                          marginLeft: 2,
                        }}
                      >
                        <Tag backgroundColor={"accent"} textColor={"dark"}>
                          {tag}
                        </Tag>
                        <TouchableOpacity
                          style={{ flexGrow: 0, marginLeft: -5 }}
                          onPress={() => this.removeTag(tag)}
                        >
                          <Icon
                            library="FontAwesome5"
                            name="times-circle"
                            color={"dark"}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null
                  )}
                </View>
              </View>
              <Text
                style={{
                  fontSize: 18,
                  textAlign: "center",
                  paddingTop: 10,
                  paddingBottom: 10,
                  fontWeight: "bold",
                }}
              >
                Explore
              </Text>
              <View style={{ flexDirection: "row" }}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <Card style={styles.cards}>
                    <Card.Content>
                      <Title style={{ textAlign: "center" }}>
                        Aspernatur aut
                      </Title>
                    </Card.Content>
                    <Card.Cover
                      style={{ height: 100, borderRadius: 10 }}
                      source={{
                        uri:
                          "https://images.unsplash.com/photo-1599619585752-c3edb42a414c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
                      }}
                    />
                    <View style={{ paddingLeft: 65 }}>
                      <Button
                        onPress={() => console.log("CARD2")}
                        width={100}
                        padding={0}
                        color= 'accent'
                      >
                        See More
                      </Button>
                    </View>
                  </Card>

                  <Card style={styles.cards}>
                    <Card.Content>
                      <Title style={{ textAlign: "center" }}>
                        Aspernatur aut
                      </Title>
                    </Card.Content>
                    <Card.Cover
                      style={{ height: 100, borderRadius: 10 }}
                      source={{
                        uri:
                          "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1652&q=80",
                      }}
                    />
                    <View style={{ paddingLeft: 70 }}>
                      <Button
                        onPress={() => console.log("CARD2")}
                        width={100}
                        padding={0}
                        color= 'accent'
                      >
                        See More
                      </Button>
                    </View>
                  </Card>
                </ScrollView>
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    paddingLeft: 25,
    borderRadius: 25,
    backgroundColor: "#CDCDCD",
    paddingTop: 20,
    paddingBottom: 20,
  },
  cards: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 25,
    width: 250,
    marginHorizontal: 7.5
  },
});

export default HomeScreen;
