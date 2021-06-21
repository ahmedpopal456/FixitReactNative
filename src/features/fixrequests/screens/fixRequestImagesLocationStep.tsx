import React, { useState } from 'react';
import {
  H2, H3, P, Spacer, Divider,
} from 'fixit-common-ui';
import { TouchableOpacity, View, Text } from 'react-native';
import {
  connect, fixRequestActions, store, StoreState,
} from 'fixit-common-data-store';

import { StackNavigationProp } from '@react-navigation/stack';
import StyledContentWrapper from '../../../components/styledElements/styledContentWrapper';
import StyledScrollView from '../../../components/styledElements/styledScrollView';
import StepIndicator from '../../../components/stepIndicator';
import StyledPageWrapper from '../../../components/styledElements/styledPageWrapper';
import GlobalStyles from '../../../common/styles/globalStyles';
import { FormTextInput, FormNextPageArrows } from '../../../components/forms/index';
import { HomeStackNavigatorProps } from '../../../common/models/navigators/homeStackNavigatorModel';
import FixRequestStyles from '../styles/fixRequestStyles';
import FixRequestHeader from '../components/fixRequestHeader';

type FixRequestImagesLocationStepNavigationProps = StackNavigationProp<
  HomeStackNavigatorProps,
  'FixRequestImagesLocationStep'
>;

export type FixRequestImagesLocationStepProps = {
  navigation: FixRequestImagesLocationStepNavigationProps;
  fixAddress: string;
  fixCity: string;
  fixProvince: string;
  fixPostalCode: string;
  fixStepsDynamicRoutes: {
    key:string,
  }[],
  numberOfSteps: number,
};

class FixRequestImagesLocationStep extends
  React.Component<FixRequestImagesLocationStepProps> {
    handleNextStep = () : void => {
      this.props.navigation.navigate('FixRequestScheduleStep');
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
              currentStep={3 + this.props.fixStepsDynamicRoutes.length} />
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
                  onChange={
                    (text : string) => store.dispatch(fixRequestActions.setFixRequestAddress({ address: text }))
                  }
                  value={this.props.fixAddress} />
                <Spacer height="20px" />
                <H3 style={{ fontWeight: 'normal' }}>City</H3>
                <Spacer height="5px" />
                <FormTextInput
                  onChange={
                    (text : string) => store.dispatch(fixRequestActions.setFixRequestCity({ city: text }))
                  }
                  value={this.props.fixCity} />
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
                        (text : string) => store.dispatch(fixRequestActions.setFixRequestProvince({ province: text }))
                      }
                      value={this.props.fixProvince} />
                  </View>
                  <View style={{
                    flexGrow: 1,
                    marginLeft: 10,
                  }}>
                    <H3 style={{ fontWeight: 'normal' }}>Postal code</H3>
                    <Spacer height="5px" />
                    <FormTextInput
                      onChange={
                        (text : string) => store.dispatch(
                          fixRequestActions.setFixRequestPostalCode({ postalCode: text }),
                        )
                      }
                      value={this.props.fixPostalCode} />
                  </View>
                </View>
                <Spacer height="20px" />
              </StyledContentWrapper>
            </StyledScrollView>
          </StyledPageWrapper>

          <FormNextPageArrows mainClick={this.handleNextStep} />
        </>
      );
    }
}

function mapStateToProps(state : StoreState) {
  return {
    fixAddress: state.fixRequest.fixRequestObj.location.address,
    fixCity: state.fixRequest.fixRequestObj.location.city,
    fixProvince: state.fixRequest.fixRequestObj.location.province,
    fixPostalCode: state.fixRequest.fixRequestObj.location.postalCode,
    numberOfSteps: state.fixRequest.numberOfSteps,
    fixStepsDynamicRoutes: state.fixRequest.fixStepsDynamicRoutes,
  };
}

export default connect(mapStateToProps)(FixRequestImagesLocationStep);
