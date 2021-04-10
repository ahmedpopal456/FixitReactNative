import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  colors,
  Divider,
  H2, Icon, P, Spacer,
} from 'fixit-common-ui';
import {
  connect,
  fixRequestActions,
  store,
  StoreState,
  rootContext,
  FixRequestService,
  FixTemplateObjectModel,
  persistentStore,
} from 'fixit-common-data-store';
import StyledContentWrapper from '../../components/styledElements/styledContentWrapper';
import FixRequestHeader from '../../components/fixRequestHeader';
import StyledScrollView from '../../components/styledElements/styledScrollView';
import StepIndicator from '../../components/stepIndicator';
import StyledPageWrapper from '../../components/styledElements/styledPageWrapper';
import FormTextInput from '../../components/formTextInput';
import FormNextPageArrows from '../../components/formNextPageArrows';
import { FixRequestSectionsStepProps } from '../../models/screens/fixRequests/fixRequestSectionsStepModel';

class FixRequestSectionsStep extends
  React.Component<FixRequestSectionsStepProps> {
    unsubscribe: (() => void) | undefined;

    generateKey = (pre:string) : string => `${pre}_${new Date().getTime()}`

    componentDidMount = () : void => {
      const navState = this.props.navigation.dangerouslyGetState();
      const currentRouteKey = navState.routes[navState.index].key;
      let routeKeyIsInState = false;
      for (let i = 0; i < this.props.fixStepsDynamicRoutes.length; i += 1) {
        if (this.props.fixStepsDynamicRoutes[i].key === currentRouteKey) {
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
          this.props.fixStepsDynamicRoutes.forEach((element, index) => {
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
        label: (this.props.fixTemplateId) ? 'Update Fixit Template & Continue' : 'Save Fixit Template & Continue',
        onClick: this.handleContinue,
      }];
      if (this.props.fixTemplateId
      && this.props.fixRequest.Details[0].Sections[this.props.fixStepsCurrentRouteIndex + 1]
      && !this.props.fixStepsDynamicRoutes[this.props.fixStepsCurrentRouteIndex + 1]) {
        return [
          ...nextPageOptionsObj,
          {
            label: 'Go to the next fix section',
            onClick: this.handleAddSection,
          },
        ];
      } if (this.props.fixStepsDynamicRoutes[this.props.fixStepsCurrentRouteIndex + 1]) {
        return [
          ...nextPageOptionsObj,
          {
            label: 'Go to the next fix section',
            onClick: () => {
              this.props.navigation.navigate({
                name: 'FixRequestSectionsStep',
                key: this.props.fixStepsDynamicRoutes[this.props.fixStepsCurrentRouteIndex + 1].key,
              });
            },
          },
        ];
      } return [...nextPageOptionsObj, { label: 'Add New Section', onClick: this.handleAddSection }];
    }

    handleContinue = () : void => {
      const serv = new FixRequestService(store);

      const tags : string[] = [];
      this.props.fixRequest.Tags.forEach((tag: { Id?: string, Name: string, }) : void => {
        tags.push(tag.Name);
      });

      const sections: {
          Name:string,
          Fields:{
              Name:string,
              Values:string[],
          }[]
      }[] = [];
      this.props.fixRequest.Details[0].Sections.forEach((section:{
        Name:string,
        Details:{
            Name:string,
            Value:string,
        }[] }) : void => {
        const fields : {
            Name:string,
            Values:string[],
          }[] = [];
        section.Details.forEach((field: {Name:string, Value:string}) : void => {
          fields.push({ Name: field.Name, Values: [field.Value] });
        });
        sections.push({ Name: section.Name, Fields: fields });
      });

      const fixTemplateObject : FixTemplateObjectModel = {
        Status: 'Private',
        Name: this.props.fixRequest.Details[0].Name,
        WorkTypeId: this.props.fixRequest.Details[0].Type,
        WorkCategoryId: this.props.fixRequest.Details[0].Category,
        FixUnitId: this.props.fixRequest.Details[0].Unit,
        Description: this.props.fixRequest.Details[0].Description,
        CreatedByUserId: persistentStore.getState().user.userId,
        UpdatedByUserId: persistentStore.getState().user.userId,
        Tags: tags,
        Sections: sections,
      };

      if (this.props.fixTemplateId) {
        serv.updateFixTemplate(fixTemplateObject, this.props.fixTemplateId);
      } else {
        serv.saveFixTemplate(fixTemplateObject);
      }
      this.props.navigation.navigate('FixRequestImagesLocationStep');
    }

    handleAddSection = () : void => {
      store.dispatch(fixRequestActions.setNumberOfSteps(
        this.props.numberOfSteps + 1,
      ));
      const newIndex = this.props.fixStepsCurrentRouteIndex + 1;
      store.dispatch(
        fixRequestActions.setCurrentFixStepsRouteIndex(newIndex),
      );
      if (this.props.fixRequest.Details[0].Sections[newIndex]) {
        store.dispatch(fixRequestActions.setFixSectionDetails(
          this.props.fixRequest.Details[0].Sections[newIndex].Details,
          newIndex,
        ));
      } else {
        store.dispatch(fixRequestActions.setFixSectionDetails(
          [{
            Name: '',
            Value: '',
          }],
          newIndex,
        ));
      }
      this.props.navigation.push('FixRequestSectionsStep');
    }

    handleAddFields = () : void => {
      const index = this.props.fixStepsCurrentRouteIndex;
      const details = [...this.props.fixRequest.Details[0].Sections[index].Details, { Name: '', Value: '' }];
      store.dispatch(
        fixRequestActions.setFixSectionDetails(details, index),
      );
    }

    moveFields = (from:number, to:number) : void => {
      const index = this.props.fixStepsCurrentRouteIndex;
      const currSectionDetails = [...this.props.fixRequest.Details[0].Sections[index].Details];
      currSectionDetails.splice(to, 0, currSectionDetails.splice(from, 1)[0]);
      store.dispatch(
        fixRequestActions.setFixSectionDetails(currSectionDetails, index),
      );
    }

    setFixSectionTitle = (
      text:string,
      index:number = this.props.fixStepsCurrentRouteIndex,
    ) : void => {
      store.dispatch(fixRequestActions.setFixSectionTitle(text, index));
    }

    setFixSectionDetails = (updateType:string, inputText:string, index:number) : void => {
      const sectionIndex = this.props.fixStepsCurrentRouteIndex;
      const details = [...this.props.fixRequest.Details[0].Sections[sectionIndex].Details];
      if (updateType === 'name') {
        details[index] = {
          Name: inputText,
          Value: details[index].Value,
        };
      } else {
        details[index] = {
          Name: details[index].Name,
          Value: inputText,
        };
      }
      store.dispatch(fixRequestActions.setFixSectionDetails(details, sectionIndex));
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
              numberSteps={this.props.numberOfSteps}
              currentStep={3 + this.props.fixStepsCurrentRouteIndex} />
            <StyledScrollView>
              <StyledContentWrapper>
                <P>You can save your FixitTemplate and continue, or add more information.
                  You can then fill the fields with your requirements.</P>
                <Spacer height="20px" />
                <H2 style={{ fontWeight: 'bold' }}>Section Name</H2>
                <Spacer height="5px" />
                <FormTextInput
                  onChange={(text : string) => this.setFixSectionTitle(text)}
                  value={
                    this.props.fixRequest.Details[0]
                      .Sections[this.props.fixStepsCurrentRouteIndex].Name
                  } />
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
                {this.props.fixRequest.Details[0]
                  .Sections[this.props.fixStepsCurrentRouteIndex]
                  .Details.map((f:{
                  Name:string,
                  Value:string
                }, index:number) => (
                    <View key={`${f.Name}_k`}>
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
                          {(this.props.fixRequest.Details[0]
                            .Sections[this.props.fixStepsCurrentRouteIndex]
                            .Details[index + 1])
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
                            value={f.Name}
                            onChange={(text : string) => this.setFixSectionDetails('name', text, index)}/>
                          <Spacer height="20px" />
                          <FormTextInput
                            title={'Field Information'}
                            value={f.Value}
                            onChange={(text : string) => this.setFixSectionDetails('value', text, index)}/>
                        </View>
                      </View>
                      {(this.props.fixRequest.Details[0]
                        .Sections[this.props.fixStepsCurrentRouteIndex]
                        .Details[index + 1]) ? <Divider faded/> : <></>}
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

function mapStateToProps(state : StoreState) {
  return {
    fixRequest: {
      ...state.fixRequest.fixRequestObj,
    },
    fixStepsCurrentRouteIndex: state.fixRequest.fixStepsCurrentRouteIndex,
    numberOfSteps: state.fixRequest.numberOfSteps,
    fixStepsDynamicRoutes: state.fixRequest.fixStepsDynamicRoutes,
    fixTemplateId: state.fixRequest.fixTemplateId,
  };
}

export default connect(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mapStateToProps, null, null, { context: rootContext },
)(FixRequestSectionsStep);
