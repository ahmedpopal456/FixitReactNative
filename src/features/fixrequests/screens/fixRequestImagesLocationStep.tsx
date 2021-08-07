import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  H2, H3, P, Spacer, Divider,
} from 'fixit-common-ui';
import { TouchableOpacity, View, Text } from 'react-native';
import {
  fixRequestActions, store, StoreState, useSelector,
} from 'fixit-common-data-store';

import { useNavigation } from '@react-navigation/native';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import StepIndicator from '../../../components/stepIndicator';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import GlobalStyles from '../../../common/styles/globalStyles';
import { FormTextInput, FormNextPageArrows } from '../../../components/forms/index';
import FixRequestStyles from '../styles/fixRequestStyles';
import FixRequestHeader from '../components/fixRequestHeader';
import constants from './constants';

const FixRequestImagesLocationStep: FunctionComponent = () : JSX.Element => {
  const navigation = useNavigation();
  const fixRequest = useSelector((storeState: StoreState) => storeState.fixRequest.fixRequestObj);
  const [address, setAddress] = useState<string>(fixRequest.location.address);
  const [city, setCity] = useState<string>(fixRequest.location.city);
  const [province, setProvince] = useState<string>(fixRequest.location.province);
  const [postalCode, setPostalCode] = useState<string>(fixRequest.location.postalCode);

  const handleNextStep = () : void => {
    store.dispatch(fixRequestActions.setFixRequestAddress({ address }));
    store.dispatch(fixRequestActions.setFixRequestCity({ city }));
    store.dispatch(fixRequestActions.setFixRequestProvince({ province }));
    store.dispatch(fixRequestActions.setFixRequestPostalCode({ postalCode }));
    navigation.navigate('FixRequestScheduleStep');
  };

  useEffect(() => {
    setAddress(fixRequest.location.address);
    setCity(fixRequest.location.city);
    setProvince(fixRequest.location.province);
    setPostalCode(fixRequest.location.postalCode);
  }, [fixRequest.location]);

  return (
    <>
      <FixRequestHeader
        showBackBtn={true}
        navigation={navigation}
        screenTitle="Create a Fixit Template and your Fixit Request"
        textHeight={60}/>
      <StyledPageWrapper>
        <StepIndicator
          numberSteps={constants.NUMBER_OF_STEPS}
          currentStep={4} />
        <StyledScrollView>
          <StyledContentWrapper>
            <P>This section is not saved inside a Fixit Template.
                The Information are required to complete your Fixit Request.</P>
            <Spacer height="20px" />
            <View style={GlobalStyles.flexRow}>
              <H2 style={FixRequestStyles.titleWithAction}>Images</H2>
              <TouchableOpacity style={FixRequestStyles.titleActionWrapper}>
                <Text style={FixRequestStyles.titleActionLabel}>Add</Text>
              </TouchableOpacity>
            </View>
            <Spacer height="40px" />
            <H2 style={{
              fontWeight: 'bold',
              marginBottom: -15,
            }}>Location</H2>
            <Divider />
            <H3 style={{ fontWeight: 'normal' }}>Address</H3>
            <Spacer height="5px" />
            <FormTextInput
              onChange={(text : string) => setAddress(text)}
              value={address} />
            <Spacer height="20px" />
            <H3 style={{ fontWeight: 'normal' }}>City</H3>
            <Spacer height="5px" />
            <FormTextInput
              onChange={(text : string) => setCity(text)}
              value={city} />
            <Spacer height="20px" />
            <View style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
              <View style={{
                flexGrow: 1,
                marginRight: 10,
              }}>
                <H3 style={{ fontWeight: 'normal' }}>Province</H3>
                <Spacer height="5px" />
                <FormTextInput
                  onChange={
                    (text : string) => setProvince(text)}
                  value={province} />
              </View>
              <View style={{
                flexGrow: 1,
                marginLeft: 10,
              }}>
                <H3 style={{ fontWeight: 'normal' }}>Postal code</H3>
                <Spacer height="5px" />
                <FormTextInput
                  onChange={(text : string) => setPostalCode(text)}
                  value={postalCode} />
              </View>
            </View>
            <Spacer height="20px" />
          </StyledContentWrapper>
        </StyledScrollView>
      </StyledPageWrapper>

      <FormNextPageArrows mainClick={handleNextStep} />
    </>
  );
};

export default FixRequestImagesLocationStep;
