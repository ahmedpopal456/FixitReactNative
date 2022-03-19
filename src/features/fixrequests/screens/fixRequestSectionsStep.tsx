import React, { FunctionComponent, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { colors, Divider, H2, Icon, P, Spacer } from 'fixit-common-ui';
import {
  store,
  StoreState,
  FixTemplateSection,
  useSelector,
  FixTemplateSectionField,
  fixTemplateActions,
} from '../../../store';
import { useNavigation } from '@react-navigation/native';
import { FormTextInput, FormNextPageArrows } from '../../../components/forms/index';
import { StepIndicator } from '../../../components/index';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import { FixRequestHeader } from '../components';
import constants from './constants';
import NavigationEnum from '../../../common/enums/navigationEnum';

const FixRequestSectionsStep: FunctionComponent = (): JSX.Element => {
  const navigation = useNavigation();
  const fixTemplate = useSelector((storeState: StoreState) => storeState.fixTemplate);
  const [fixTemplateSections, setFixTemplateSections] = useState<Array<FixTemplateSection>>(fixTemplate.sections);

  useEffect(() => {
    setFixTemplateSections(fixTemplate.sections);
  }, [fixTemplate.sections]);

  const handleSaveAndContinue = (): void => {
    store.dispatch(
      fixTemplateActions.updateFixTemplate({
        sections: fixTemplateSections,
      }),
    );
    navigation.navigate(NavigationEnum.FIXREQUESTIMAGESLOCATIONSTEP);
  };

  const nextPageOptions = [
    {
      label: fixTemplate.id ? 'Update Fixit Template & Continue' : 'Save Fixit Template & Continue',
      onClick: handleSaveAndContinue,
    },
  ];

  const handleAddSection = (): void => {
    const updateFixTemplateSections = [...fixTemplateSections];
    updateFixTemplateSections.push({
      name: '',
      fields: [
        {
          name: '',
          value: '',
        },
      ],
    });
    setFixTemplateSections(updateFixTemplateSections);
  };

  const setSectionName = (text: string, index: number): void => {
    const tempFixTemplateSections = [...fixTemplateSections];
    tempFixTemplateSections[index] = {
      sectionId: tempFixTemplateSections[index].sectionId,
      name: text,
      fields: tempFixTemplateSections[index].fields,
    };
    setFixTemplateSections(tempFixTemplateSections);
  };

  const handleAddFields = (sectionIndex: number): void => {
    const tempFixTemplateSections = [...fixTemplateSections];
    const fields = [...tempFixTemplateSections[sectionIndex].fields];
    fields.push({ id: '', name: '', value: '' });
    tempFixTemplateSections[sectionIndex] = {
      sectionId: tempFixTemplateSections[sectionIndex].sectionId,
      name: tempFixTemplateSections[sectionIndex].name,
      fields,
    };

    setFixTemplateSections(tempFixTemplateSections);
  };

  const moveFields = (from: number, to: number, sectionIndex: number): void => {
    const tempFixTemplateSections = [...fixTemplateSections];
    const fields = [...tempFixTemplateSections[sectionIndex].fields];

    fields.splice(to, 0, fields.splice(from, 1)[0]);
    tempFixTemplateSections[sectionIndex] = {
      sectionId: tempFixTemplateSections[sectionIndex].sectionId,
      name: tempFixTemplateSections[sectionIndex].name,
      fields,
    };
    setFixTemplateSections(tempFixTemplateSections);
  };

  const setFieldName = (inputText: string, index: number, sectionIndex: number): void => {
    const tempFixTemplateSections = [...fixTemplateSections];
    const fields = [...tempFixTemplateSections[sectionIndex].fields];
    fields[index] = {
      id: fields[index].id,
      name: inputText,
      value: fields[index].value,
    };
    tempFixTemplateSections[sectionIndex] = {
      sectionId: tempFixTemplateSections[sectionIndex].sectionId,
      name: tempFixTemplateSections[sectionIndex].name,
      fields,
    };
    setFixTemplateSections(tempFixTemplateSections);
  };

  const setFieldValue = (inputText: string, index: number, sectionIndex: number): void => {
    const tempFixTemplateSections = [...fixTemplateSections];
    const fields = [...tempFixTemplateSections[sectionIndex].fields];
    fields[index] = {
      id: fields[index].id,
      name: fields[index].name,
      value: inputText,
    };
    tempFixTemplateSections[sectionIndex] = {
      sectionId: tempFixTemplateSections[sectionIndex].sectionId,
      name: tempFixTemplateSections[sectionIndex].name,
      fields,
    };
    setFixTemplateSections(tempFixTemplateSections);
  };

  return (
    <>
      <FixRequestHeader
        showBackBtn={true}
        navigation={navigation}
        screenTitle="Create a Fixit Template and your Fixit Request"
        textHeight={60}
      />
      <StyledPageWrapper>
        <StepIndicator numberSteps={constants.NUMBER_OF_STEPS} currentStep={3} />
        <ScrollView>
          <StyledContentWrapper>
            <P>
              You can save your FixitTemplate and continue, or add more information. You can then fill the fields with
              your requirements.
            </P>
            <TouchableOpacity onPress={() => handleAddSection()}>
              <Text
                style={{
                  color: colors.accent,
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                }}>
                Add Section
              </Text>
            </TouchableOpacity>
            {fixTemplateSections ? (
              fixTemplateSections.map((section, sectionIndex) => (
                <View key={`${section.name}_${sectionIndex}_k`}>
                  <Spacer height="20px" />
                  <H2 style={{ fontWeight: 'bold', flexGrow: 1 }}>Section Name</H2>
                  <Spacer height="5px" />
                  <FormTextInput
                    onChange={(text: string) => setSectionName(text, sectionIndex)}
                    value={section ? section.name : 'loading...'}
                    editable={true}
                  />
                  <Spacer height="20px" />
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: -20,
                    }}>
                    <H2 style={{ fontWeight: 'bold', flexGrow: 1 }}>Fields</H2>
                    <TouchableOpacity
                      key={`${section.name}_${sectionIndex}_k`}
                      style={{ flexGrow: 0, marginTop: 5 }}
                      onPress={() => handleAddFields(sectionIndex)}>
                      <Text
                        style={{
                          color: colors.accent,
                          fontWeight: 'bold',
                          textDecorationLine: 'underline',
                        }}>
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Divider />
                  {section ? (
                    section.fields.map((field: FixTemplateSectionField, fieldIndex: number) => (
                      <View key={`${sectionIndex}_${field.id}_${fieldIndex}_k`}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                          <View>
                            {fieldIndex !== 0 ? (
                              <TouchableOpacity
                                style={{
                                  flexGrow: 0,
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                }}
                                onPress={() => moveFields(fieldIndex, fieldIndex - 1, sectionIndex)}>
                                <Icon library="FontAwesome5" name="arrow-up" />
                              </TouchableOpacity>
                            ) : (
                              <></>
                            )}
                            {section.fields[fieldIndex + 1] ? (
                              <TouchableOpacity
                                style={{
                                  flexGrow: 0,
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                }}
                                onPress={() => moveFields(fieldIndex, fieldIndex + 1, sectionIndex)}>
                                <Icon library="FontAwesome5" name="arrow-down" />
                              </TouchableOpacity>
                            ) : (
                              <></>
                            )}
                          </View>
                          <View style={{ flexGrow: 1, marginLeft: 20 }}>
                            <FormTextInput
                              title={'Field Title'}
                              value={field.name}
                              onChange={(text: string) => setFieldName(text, fieldIndex, sectionIndex)}
                              editable={true}
                            />
                            <Spacer height="20px" />
                            <FormTextInput
                              title={'Field Information'}
                              value={field.value}
                              onChange={(text: string) => setFieldValue(text, fieldIndex, sectionIndex)}
                              editable={true}
                            />
                          </View>
                        </View>
                        {section.fields[fieldIndex + 1] ? <Divider faded /> : <></>}
                      </View>
                    ))
                  ) : (
                    <Text>loading...</Text>
                  )}
                </View>
              ))
            ) : (
              <></>
            )}
          </StyledContentWrapper>
        </ScrollView>
      </StyledPageWrapper>
      <FormNextPageArrows secondaryClickOptions={nextPageOptions} />
    </>
  );
};

export default FixRequestSectionsStep;
