import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { Button, Icon, Tag } from 'fixit-common-ui';
import { SafeAreaView } from 'react-native-safe-area-context';

class HomeScreen extends 
    React.Component<{navigation:any}> {
        state={
            titleFieldVisible: false,
            titleFieldTextVisible: true,
            tagSuggestionsVisible: false,
            suggestedTags: ['kitchen', 'bathroom', 'fireplace', 'TV room'],
            tagInputText: '',
            tags: [''],
          }
      
          handleNextStep = () : void => {
            this.props.navigation.navigate('FixRequestDescriptionStep');
          }
      
          showTitleField = () : void => {
            this.setState({ titleFieldVisible: true, titleFieldTextVisible: false });
          }
      
          setTagInputText = (text:string) : void => {
            this.setState({ tagInputText: text });
          }
      
          addTag = () : void => {
            const currentText = this.state.tagInputText;
            if (currentText && this.state.tags.indexOf(currentText) === -1) {
              this.setState((prevState:any) => ({
                tagInputText: '',
                tags: [...prevState.tags, currentText],
              }));
            }
          }
      
          removeTag = (tag : string) : void => {
            const tagArr = this.state.tags;
            const index = tagArr.indexOf(tag);
            if (index > -1) {
              tagArr.splice(index, 1);
            }
      
            this.setState({
              tags: tagArr,
            });
          }
      
          showTagSuggestions = () : void => {
            this.setState({ tagSuggestionsVisible: true });
          }
      
          hideTagSuggestions = () : void => {
            this.setState({ tagSuggestionsVisible: false });
          }
      
          addSuggestedTagToTagList = (tag : string) : void => {
            const suggestedTagArr = this.state.suggestedTags;
            const index = suggestedTagArr.indexOf(tag);
            if (index > -1) {
              suggestedTagArr.splice(index, 1);
            }
      
            this.setState({
              suggestedTags: suggestedTagArr,
            });
      
            this.setState((prevState:any) => ({
              suggestedTags: suggestedTagArr,
              tags: [...prevState.tags, tag],
            }));
          }
          render() : JSX.Element {
            return (
                <>
                    <View style={{paddingTop:200}}>
                        <View
                        style={styles.content}
                        >
                        <TextInput
                        style={{backgroundColor: 'white', borderRadius: 10, width: '80%', fontSize: 20, paddingHorizontal:20}}
                        value="What needs Fixing?"
                        />
                        <Text>Most Popular Fixes</Text>
                        <Tag >test</Tag>         
                        </View>
                    </View>
                </>
              );
          }
    }



const styles = StyleSheet.create({
    content: {
      alignItems: 'center',
    //   flex: 1,
      borderRadius: 25,
      backgroundColor: '#CDCDCD',
      height: 200, 
      paddingTop:30
    }
  });

export default HomeScreen;