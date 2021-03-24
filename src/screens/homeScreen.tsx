import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Icon, Tag, Button } from "fixit-common-ui";
import SearchTextInput from "../components/SearchTextInput";
import Carousel from "../components/carousel";

class HomeScreen extends React.Component<{ navigation: any }> {
  state = {
    titleFieldVisible: false,
    titleFieldTextVisible: true,
    tagSuggestionsVisible: false,
    suggestedTags: ["kitchen", "bathroom", "fireplace", "TV room"],
    tagInputText: "",
    tags: [""],
  };

  handleNextStep = (): void => {
    this.props.navigation.navigate("FixRequestDescriptionStep");
  };

  showTitleField = (): void => {
    this.setState({ titleFieldVisible: true, titleFieldTextVisible: false });
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
        <SafeAreaView>
          <Carousel
            images={[
              "https://images.unsplash.com/photo-1559571509-1b5c9241070b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2767&q=80",
              "https://images.unsplash.com/photo-1531168556467-80aace0d0144?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
              "https://images.unsplash.com/photo-1541918602878-4e1ebfc7b739?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=668&q=80",
            ]}
          />
        </SafeAreaView>
        <View style={{ paddingTop: 20, paddingLeft: 10, paddingRight: 10 }}>
          <View style={styles.content}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ position: "absolute", zIndex: -1 }}>
                <SearchTextInput
                  onChange={(text: string) => this.setTagInputText(text)}
                  value={this.state.tagInputText}
                  placeholder="What needs Fixing?"
                  onFocus={() => this.showTagSuggestions()}
                  onSubmitEditing={this.addTag}
                />
              </View>
              <View style={{ paddingLeft: 260, marginVertical: -3, paddingBottom:10 }}>
                <Button
                  onPress={() => console.log("button pressed")}
                  color="primary"
                  width={50}
                  padding={0}
                  // shape='circle'
                >
                  <Icon
                    library="Ionicons"
                    name="hammer-outline"
                    color="accent"
                  />
                </Button>
              </View>
            </View>

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
      </>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    paddingLeft: 25,
    borderRadius: 25,
    backgroundColor: "#CDCDCD",
    height: 150,
    paddingTop: 25,
  },
});

export default HomeScreen;
