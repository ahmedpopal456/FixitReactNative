import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  colors,
  Divider,
  H2, Icon, P, Spacer,
} from 'fixit-common-ui';
import { fixRequestActions, store } from 'fixit-common-data-store';
import StyledContentWrapper from '../../components/styledElements/styledContentWrapper';
import FixRequestHeader from '../../components/fixRequestHeader';
import StyledScrollView from '../../components/styledElements/styledScrollView';
import StepIndicator from '../../components/stepIndicator';
import StyledPageWrapper from '../../components/styledElements/styledPageWrapper';
import FormTextInput from '../../components/formTextInput';
import FormNextPageArrows from '../../components/formNextPageArrows';
import { FixRequestSectionsStepProps, FixRequestSectionsStepScreenState } from '../../models/screens/fixRequests/fixRequestSectionsStepModel';

export default class FixRequestSectionsStep extends
  React.Component<FixRequestSectionsStepProps> {
    unsubscribe: (() => void) | undefined;

    generateKey = (pre:string) : string => `${pre}_${new Date().getTime()}`

    state={
      fixSectionDetails: [{ name: '', value: '' }],
      fixSectionTitle: '',
      screenFields: [{ key: this.generateKey('field_'), name: '', value: '' }],
    }

    componentDidMount = () : void => {
      const navState = this.props.navigation.dangerouslyGetState();
      const currentRouteKey = navState.routes[navState.index].key;
      let routeKeyIsInState = false;
      let fixStepsDynamicRoutesList = store.getState()
        .fixRequest.fixStepsDynamicRoutes;
      for (let i = 0; i < fixStepsDynamicRoutesList.length; i += 1) {
        if (fixStepsDynamicRoutesList[i].key === currentRouteKey) {
          routeKeyIsInState = true;
        }
      }

      if (!routeKeyIsInState) {
        store.dispatch(
          fixRequestActions.addFixStepsDynamicRoute(currentRouteKey),
        );
      }

      this.unsubscribe = this.props.navigation.addListener(
        'focus',
        () => {
          this.forceUpdate();
          fixStepsDynamicRoutesList = store.getState()
            .fixRequest.fixStepsDynamicRoutes;
          fixStepsDynamicRoutesList.forEach((element, index) => {
            if (element.key === currentRouteKey) {
              store.dispatch(
                fixRequestActions.setCurrentFixStepsRouteIndex(
                  index,
                ),
              );
            }
          });
        },
      );
    }

    componentWillUnmount = () : void => {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    generateNextPageOptions = () : {label:string, onClick: () => void}[] => {
      const nextPageOptionsObj = [{
        label: 'Save Fixit Template & Continue',
        onClick: this.handleContinue,
      }];
      const currentRouteIndex = store.getState()
        .fixRequest.fixStepsCurrentRouteIndex;
      if (store.getState().fixRequest.fixStepsDynamicRoutes[currentRouteIndex + 1]) {
        return [
          ...nextPageOptionsObj,
          {
            label: 'Go to the next fix section',
            onClick: () => {
              this.props.navigation.navigate({
                name: 'FixRequestSectionsStep',
                key: store.getState()
                  .fixRequest.fixStepsDynamicRoutes[currentRouteIndex + 1].key,
              });
            },
          },
        ];
      } return [...nextPageOptionsObj, { label: 'Add New Section', onClick: this.handleAddSection }];
    }

    handleContinue = () : void => {
      this.props.navigation.navigate('FixRequestImagesLocationStep');
    }

    handleAddSection = () : void => {
      store.dispatch(fixRequestActions.setNumberOfSteps(
        store.getState().fixRequest.numberOfSteps + 1,
      ));
      this.props.navigation.push('FixRequestSectionsStep');
    }

    handleAddFields = () : void => {
      this.setState((prevState:FixRequestSectionsStepScreenState) => ({
        screenFields: [...prevState.screenFields, { key: this.generateKey('field_'), name: '', value: '' }],
        fixSectionDetails: [...prevState.fixSectionDetails, { name: '', value: '' }],
      }));
    }

    moveFields = (from:number, to:number) : void => {
      const currScreenFields = [...this.state.screenFields];
      currScreenFields.splice(to, 0, currScreenFields.splice(from, 1)[0]);
      const currSectionDetails = [...this.state.fixSectionDetails];
      currSectionDetails.splice(to, 0, currSectionDetails.splice(from, 1)[0]);
      this.setState(() => ({
        screenFields: currScreenFields,
        fixSectionDetails: currSectionDetails,
      }));

      const currentSectionIndex = store.getState().fixRequest.fixStepsCurrentRouteIndex;
      store.dispatch(
        fixRequestActions.setFixSectionDetails(currSectionDetails, currentSectionIndex),
      );
    }

    setFixSectionTitle = (text:string) : void => {
      this.setState({ fixSectionTitle: text });
      const index = store.getState().fixRequest.fixStepsCurrentRouteIndex;
      store.dispatch(fixRequestActions.setFixSectionTitle(text, index));
    }

    setFixSectionDetails = (updateType:string, inputText:string, index:number) : void => {
      const details = this.state.fixSectionDetails;
      const updatedScreenFields = this.state.screenFields;
      if (updateType === 'name') {
        details[index] = {
          name: inputText,
          value: details[index].value,
        };
        updatedScreenFields[index] = {
          key: updatedScreenFields[index].key,
          name: inputText,
          value: updatedScreenFields[index].value,
        };
      } else {
        details[index] = {
          name: details[index].name,
          value: inputText,
        };
        updatedScreenFields[index] = {
          key: updatedScreenFields[index].key,
          name: updatedScreenFields[index].name,
          value: inputText,
        };
      }
      this.setState({
        fixSectionDetails: details,
        screenFields: updatedScreenFields,
      });
      const currentSectionIndex = store.getState().fixRequest.fixStepsCurrentRouteIndex;
      store.dispatch(fixRequestActions.setFixSectionDetails(details, currentSectionIndex));
    }

    render() : JSX.Element {
      return (
        <>
          <FixRequestHeader
            showBackBtn={true}
            navigation={this.props.navigation}
            screenTitle="Create a Fixit Template and your Fixit Request"
            textHeight={60}/>
          <StyledPageWrapper>
            <StepIndicator
              numberSteps={store.getState().fixRequest.numberOfSteps}
              currentStep={3 + store.getState()
                .fixRequest.fixStepsCurrentRouteIndex} />
            <StyledScrollView>
              <StyledContentWrapper>
                <P>You can save your FixitTemplate and continue, or add more information.
                  You can then fill the fields with your requirements.</P>
                <Spacer height="20px" />
                <H2 style={{ fontWeight: 'bold' }}>Section Name</H2>
                <Spacer height="5px" />
                <FormTextInput
                  onChange={(text : string) => this.setFixSectionTitle(text)}
                  value={this.state.fixSectionTitle} />
                <Spacer height="20px" />
                <View style={{
                  flexDirection: 'row',
                  marginBottom: -20,
                }}>
                  <H2 style={{
                    fontWeight: 'bold',
                    flexGrow: 1,
                  }}>Fields</H2>
                  <TouchableOpacity style={{
                    flexGrow: 0,
                    marginTop: 5,
                  }}
                  onPress={this.handleAddFields}>
                    <Text style={{
                      color: colors.accent,
                      fontWeight: 'bold',
                      textDecorationLine: 'underline',
                    }}>Add</Text>
                  </TouchableOpacity>
                </View>
                <Divider />
                {this.state.screenFields.map((f:{
                  key:string,
                  name:string,
                  value:string
                }, index:number) => (
                  <View key={f.key}>
                    <View style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}>
                      <View>
                        {(index !== 0)
                          ? <TouchableOpacity style={{
                            flexGrow: 0,
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}
                          onPress={() => this.moveFields(index, index - 1)}>
                            <Icon library="FontAwesome5" name="arrow-up" />
                          </TouchableOpacity>
                          : <></>}
                        {(this.state.fixSectionDetails[index + 1])
                          ? <TouchableOpacity style={{
                            flexGrow: 0,
                            flexDirection: 'column',
                            justifyContent: 'center',
                          }}
                          onPress={() => this.moveFields(index, index + 1)}>
                            <Icon library="FontAwesome5" name="arrow-down" />
                          </TouchableOpacity>
                          : <></>}
                      </View>
                      <View style={{
                        flexGrow: 1,
                        marginLeft: 20,
                      }}>
                        <FormTextInput
                          title={'Field Title'}
                          value={f.name}
                          onChange={(text : string) => this.setFixSectionDetails('name', text, index)}/>
                        <Spacer height="20px" />
                        <FormTextInput
                          title={'Field Information'}
                          value={f.value}
                          onChange={(text : string) => this.setFixSectionDetails('value', text, index)}/>
                      </View>
                    </View>
                    {(this.state.fixSectionDetails[index + 1]) ? <Divider faded/> : <></>}
                  </View>
                ))}
              </StyledContentWrapper>
            </StyledScrollView>
          </StyledPageWrapper>
          <FormNextPageArrows secondaryClickOptions={this.generateNextPageOptions()} />
        </>
      );
    }
}
